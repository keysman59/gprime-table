<template>
  <div class="dt-table">
    <data-table-inset
      :insetHeaders="insetHeaders"
      @searchLayer="searchLayer"
    ></data-table-inset>
    <data-table-header
      :sorting="sorting"
      @onSortField="onSortField"
      ref="header"
    />
    <data-table-filters
      :filters="filters"
      @filter="onFilter"
      ref="filters"
      v-if="filterable"
    />
    <div class="dt-table__wrp">
      <div class="dt-table__nav-btns">
        <!-- <div class="dt-table__nav-btn">Скачать</div> -->
        <!-- <div class="dt-table__nav-btn" @click="showAll()">Показать все</div> -->
        <div class="dt-table__nav-btn" @click="$emit('showCelected')" :class="{ disabled : isDisabled }">Показать выбранные</div>
      </div>
      <div class="dt-table__topnav">
        <button class="btn btn-default btn-icon" @click="print">
          <i class="icon_printer" title="Печать карточки"></i>
        </button>
        <button class="btn btn-default btn-icon" @click="exportToXLSX">
          <i class="icon_file_excel" title="Экспорт в xlsx"></i>
        </button>
        <button class="btn btn-default btn-icon" @click="getCoord">
          <i class="icon_location" title="Экспорт координат"></i>
        </button>
        <button class="btn btn-default btn-icon" @click="openCoordModal">
          <i class="icon_square_down" title="Координаты объекта (json)"></i>
        </button>
        <button
          class="btn btn-primary button dt-table__desc-btn"
          :class="{ disabled : isDisabled }"
          @click="showMore"
        >
          Подробнее
        </button>
        <div v-if="tooltipShow" class="dt-table__tooltip">Выберите одну строку для выгрузки данных</div>
      </div>

      <!-- <div class="dt-table__clear-filter" @click="clearFilters">Очистить фильтры</div> -->
    </div>
    <data-table-body
      :items='items'
      :columns="columns"
      @onClickRow="onClickRow"
      @onCheckRow="onCheckRow"
      @upSelectedItems="getSelectedItems"
    />
    <data-table-footer
      :size="size"
      :from="from"
      :to="to"
      :count="count"
      :page="page"
      :pageSize="size"
      @change="onPage"
    />
    <coordinate-transform-modal
      :geometry="findSelectItem ? findSelectItem.geometry : null"
      :featureSrid="findSelectItem ? findSelectItem.crs : null"
      ref="coordinateModal"
    />
    <search-entity-description
      :selectedRow="selectedRow"
      ref="searchDescription"
    />
    <div @click="collapse()" :class="{ rotateIcon: isMapSearchTableCollapse }" class="dt-table__collapse">
      <i class="icon_cross-collapse btn btn-link-collapse"></i>
    </div>
    <div @click="$store.commit('MAP_CLOSE_SEARCH_TERRITORY_TABLE')" class="dt-table__close">
      <i class="icon_cross-close btn btn-link-close"></i>
    </div>
  </div>
</template>

<script>
import DataTableInset from './DataTableInset'
import DataTableHeader from './DataTableHeader'
import DataTableFilters from './DataTableFilters'
import DataTableBody from './DataTableBody'
import DataTableFooter from './DataTableFooter'
import descriptionHelper from '^/components/map/descriptionHelper'
import getFlatCoordinates from '^/helpers/getFlatCoordinates.js'
import CoordinateTransformModal from '^/components/map/CoordinateTransformModal'
import SearchEntityDescription from '../Modals/SearchEntityDescription'
import { mapState } from 'vuex'

export default {
  props: {
    propColumns: Array,
    insetHeaders: Array,
    propItems: {
      type: Array,
      required: true
    },
    selectedRow: Object,
    // count: Number,
    filterable: Boolean,
    objColumns: Object,
    objItems: Object
  },
  mixins: [descriptionHelper],
  components: {
    DataTableInset,
    CoordinateTransformModal,
    DataTableHeader,
    DataTableFilters,
    DataTableBody,
    DataTableFooter,
    SearchEntityDescription
  },
  data () {
    return {
      items: [],
      columns: [],
      sorting: [],
      filters: [],
      myFilters: [],
      arrSelected: [],
      collapseNum: 0,
      findSelectItem: null,
      selectedResult: null,
      isDisabled: true,
      page: 1,
      size: 10,
      from: 1,
      to: 10,
      tooltipShow: false,
      oldItems: [], // using when multiple layers for SearchTerritoryDialog
      oldColumns: [], // using when multiple layers for SearchTerritoryDialog
      dataColumns: [],
      count: 0
    }
  },
  watch: {
    myFilters () {
      this.isFilterItems()
    },
    propItems () {
      this.isFilterItems()
    },
    columns () {
      this.setupColumns()
    }
  },
  computed: {
    ...mapState({
      isMapSearchTableCollapse: state => state.isMapSearchTableCollapse
    }),
    calculatedColumns () {
      if (!this.columns || !this.columns.length) {
        return []
      }
      return this.columns.map(x => ({
        calculatedWidth: this.calculateColumnWidth(x),
        textAlign: this.getColumnTextAlign(x),
        ...x
      }))
    }
  },
  mounted () {
    console.log('typeof this.propItems', typeof this.propItems)
    console.log('propItems', this.propItems)
    console.log('propColumns', this.columns)
    console.log('objItems', this.objItems)
    console.log('objColumns', this.objColumns)
    this.items = [...this.propItems]
    this.columns = [...this.propColumns]
    this.count = this.items.length
    console.log('insetHeaders', this.insetHeaders)
    // if (typeof this.propItems === 'object') {
    //   this.oldItems = [...this.propItems]
    //   this.items = [...this.oldItems[`${this.insetHeaders[0].id}`]] // first layer always has 0 index
    //   this.oldColumns = [...this.columns] // prop
    //   this.dataColumns = [...this.oldColumns[`${this.insetHeaders[0].id}`]] // first layer always has 0 index
    // }
    this.isFilterItems()
  },
  methods: {
    showMore () {
      if (this.arrSelected.length !== 1) {
        this.isShowTooltip()
      } else {
        this.$emit('upDescrInfo')
        this.$refs.searchDescription.openModal()
      }
    },
    collapse () {
      if (this.collapseNum) {
        this.$store.commit('MAP_UNCOLLAPSE_SEARCH_TABLE')
        this.collapseNum = 0
      } else {
        this.$store.commit('MAP_COLLAPSE_SEARCH_TABLE')
        this.collapseNum = 1
      }
    },
    showAll () {
      console.log('showAll')
      console.log('arrSelected')
      console.log(this.arrSelected)
      console.log('items')
      console.log(this.items)
      this.arrSelected = [...this.items]
      console.log('arrSelected after copy:')
      console.log(this.arrSelected)
    },
    isFilterItems () {
      let newArr = [...this.propItems]
      if (this.myFilters.length) {
        let index
        let sortText
        let filterItems = newArr.filter(item => {
          let flag = false
          for (let i = 0; i < this.myFilters.length; i++) {
            sortText = this.myFilters[i].field
            index = newArr[i].attributes.findIndex(x => x.name === sortText)
            if ((item.attributes[index].value.indexOf(this.myFilters[i].value) + 1)) {
              flag = true
            } else {
              flag = false
              return false
            }
          }
          this.resetPage()
          return flag
        })
        newArr = [...filterItems]
        if (newArr.length < 10) {
          this.from = 1
          // this.to = newArr.length
        }
      }
      this.$emit('upCount', newArr.length)
      this.items = newArr.slice(this.from - 1, this.to)
    },
    // clearFilters () {
    //   this.myFilters = []
    //   this.items = this.propItems
    // },
    getSelectedItems (arrSelected) {
      this.isDisabled = !arrSelected.length
      this.arrSelected = arrSelected
      this.findSelectItem = this.items.find(el => el.layerId === arrSelected[0].layerId)
    },
    print () {
      window.print()
    },
    isShowTooltip () {
      this.tooltipShow = true
      setTimeout(() => {
        this.tooltipShow = false
      }, 4000)
    },
    async exportToXLSX () {
      if (this.arrSelected.length !== 1) {
        this.isShowTooltip()
      } else {
        const attributes = this.findSelectItem.attributes.map(el => {
          return { 'поле': el.name, 'значение': el.value }
        })
        const data = { attributes: attributes, name: 'Выгрузка объекта' }
        this.coreApi.download.downloadFileAxios(`/api/xlsx/objects/export`, { data })
      }
    },
    getCoord () {
      if (this.arrSelected.length !== 1) {
        this.isShowTooltip()
      } else {
        getFlatCoordinates(this.findSelectItem)
      }
    },
    openCoordModal () {
      this.$refs.setComponent
      this.$refs.coordinateModal.openModal()
    },
    onSortField (val) {
      this.$emit('onSortField', val)
    },
    onClickRow (val) {
      this.selectedResult = val
      this.$emit('onClickRow', val)
    },
    onCheckRow (val) {
      this.selectedResult = val
      this.$emit('onCheckRow', val)
    },
    searchLayer (layer) {
      console.log('layer', layer)
      this.items = [...this.objItems[`${layer.id}`]]
      this.columns = [...this.objColumns[`${layer.id}`]]
      this.count = this.items.length
      this.$emit('searchLayer', layer)
    },
    onFilter (filter) {
      if (this.myFilters.length) {
        let field = filter.field
        let index = this.myFilters.findIndex(el => el.field === field)
        if (index + 1) {
          this.myFilters[index].value = filter.value
          this.isFilterItems()
        } else {
          this.myFilters.push(filter)
        }
      } else {
        this.myFilters.push(filter)
      }
    },
    onPage ({ page, size }) {
      this.page = page
      this.size = size
      if (this.count === 0) {
        return
      }
      this.from = (this.page - 1) * this.size + 1

      if (this.from + this.size - 1 > this.count) {
        this.to = this.count
      } else {
        this.to = this.from + this.size - 1
      }
      this.isFilterItems()
    },
    resetPage () {
      this.page = 1
    },
    calculateColumnWidth (column) {
      if (column.width) {
        return column.width
      }
      if (column.displayAs) {
        switch (column.displayAs) {
          case 'date':
          case 'input':
            return this.getColumnWidthFromStringLength(column.title, 100, 150) + 'px'
          case 'datetime':
            return this.getColumnWidthFromStringLength(column.title, 100, 170) + 'px'
          case 'number':
            return this.getColumnWidthFromStringLength(column.title, 170, 180) + 'px'
        }
      }
      return this.getColumnWidthFromStringLength(column.title) + 'px'
    },
    getColumnTextAlign (column) {
      if (column.displayAs) {
        switch (column.displayAs) {
          case 'date':
          case 'input':
          case 'datetime':
            return 'center'
          case 'number':
            return 'right'
        }
      }
      return 'center'
    },
    getColumnWidthFromStringLength (str, minWidth = 150, maxWidth = 200) {
      const widthMultiplier = 10
      const widthAddingNumber = 20
      let width = str.length * widthMultiplier + widthAddingNumber

      if (width < minWidth) {
        width = minWidth
      }
      if (width > maxWidth) {
        width = maxWidth
      }
      return width
    },
    setupColumns () {
      this.sorting = this.columns.map(x => ({
        column: x,
        calculatedWidth: this.calculateColumnWidth(x)
      }))
      this.filters = this.columns.map(x => ({
        column: x,
        calculatedWidth: this.calculateColumnWidth(x),
        value: x.filter ? x.filter.value : null
      }))
    }
  }
}
</script>

<style scoped>
.rotateIcon {
  transform: rotate(180deg);
}

.dt-table__clear-filter {
  display: flex;
  align-items: center;
  margin-left: 22px;
  text-decoration: underline;
  cursor: pointer;
}

.dt-table {
  display: flex;
  flex-direction: column;
}

.dt-table__collapse {
  position: absolute;
  top: 0px;
  right: 39px;
  background-color: #0766A6;
}

.dt-table__close {
  position: absolute;
  top: 0px;
  right: 0px;
  background-color: #0766A6;
}

.icon_cross-collapse:before {
  content: "\f143";
}

.icon_cross-close:before {
  content: "\f181";
}

.btn-link-collapse {
  padding: 6px 6px;
  padding-bottom: 5px;
  font-size: 23px;
  line-height: 1;
  border-radius: 3px;
  color: white;
}

.btn-link-close {
  color: white;
}

.dt-table.has-err {
  border: 1px solid #D84315;
  border-radius: 3px;
}
div.modal-dialog .modal-body > .dt-table {
  min-height: 500px;
  height: 500px;
}
div.modal-dialog.modal-lg .modal-body > .dt-table {
  min-height: 460px;
  height: 460px;
}

.dt-table__nav-btn {
  min-width: 88px;
  min-height: 34px;
  margin: 6px 8px;
  padding: 0 16px;
  display: inline-block;
  position: relative;
  overflow: hidden;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  cursor: pointer;
  background: none;
  border: 0;
  border-radius: 2px;
  transition: all .4s cubic-bezier(.25,.8,.25,1);
  color: currentColor;
  font-family: sans-serif;
  font-size: 14px;
  font-style: inherit;
  font-variant: inherit;
  font-weight: 500;
  letter-spacing: inherit;
  line-height: 34px;
  text-align: center;
  text-transform: uppercase;
  text-decoration: none;
  vertical-align: top;
  white-space: nowrap;
  /* box-shadow: 0 1px 5px rgb(0 0 0 / 20%), 0 2px 2px rgb(0 0 0 / 14%), 0 3px 1px -2px rgb(0 0 0 / 12%); */
  box-shadow: 0 1px 3px rgb(0 0 0 / 40%), 0 1px 1px rgb(0 0 0 / 14%);
}

.dt-table__desc-btn {
  border: 1px solid #ddd;
}

.dt-table__nav-btn:active {
  color: #fff;
  /* background-color: rgba(0, 0, 0, .87); */
  background-color: rgba(7, 102, 166, .87);
}

.dt-table__wrp {
  display: flex;
}

.dt-table__nav-btns {
  display: flex;
  margin-bottom: 24px;
}

.dt-table__topnav {
  padding-top: 6px;
  padding-left: 12px;
  position: relative;
}

.dt-table__tooltip {
  background-color: #0766A6;
  color: white;
  width: 170px;
  border-radius: 3px;
  padding: 3px 12px;
  position: absolute;
  text-align: center;
  bottom: -26px;
  left: 0px;
  transition: all .3s ease;
}

.disabled {
  opacity: 0.6;
  pointer-events: none;
  background: #ddd;
}

@media (min-height: 700px) {
  div.modal-dialog.modal-lg .modal-body > .dt-table {
    min-height: 500px;
    height: 500px;
  }
}
@media (min-height: 800px) {
  div.modal-dialog.modal-lg .modal-body > .dt-table {
    min-height: 600px;
    height: 600px;
  }
}
@media (min-height: 900px) {
  div.modal-dialog.modal-lg .modal-body > .dt-table {
    min-height: 700px;
    height: 700px;
  }
}
</style>
