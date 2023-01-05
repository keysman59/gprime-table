<template>
  <div class="searchTableDialog" :class="{ collapseSeachTable: isMapSearchTableCollapse }" v-if="isMapSearchTableVisible">
    <data-table
      class="flex-1"
      :propItems="sortItems"
      :columns="columns"
      :insetHeaders="insetHeaders"
      :selectedRow="selectedRow"
      :noData="noData"
      @onSortField="setSortingValue"
      @onClickRow="onClickRow"
      @onCheckRow="onCheckRow"
      @searchLayer="searchLayer"
      @upCount="upCount"
      @showCelected="showCelected"
      @upDescrInfo="onClickRow"
      :count="count"
      filterable
      ref="table-search">
    </data-table>

  </div>
</template>

<script>
import { list, localResult } from './data/localData'
// import { mapState } from 'vuex'
import DataTable from './Tables/DataTable'
import { getAdminLayerSetting } from './layerSettings.js'
// import { zoomAndHighlightObjectsOnMap, clearHighlightedObjectsOnMap } from '^/components/map/map'

export default {
  name: 'search-table-dialog',
  data () {
    return {
      items: [],
      sortItems: [],
      affectedLayersIds: [],
      selectedItem: null,
      selectedItems: [],
      insetHeaders: [
        {
          "name": "Зоны действия документов",
          "id": "2bd50162-47f0-45b6-9546-7c4edb4e0d16"
        }, {
          "name": "Зоны действия документов инженерных изысканий ГИСОГД",
          "id": "ec337233-236c-48ad-b125-c7f442199376"
        }
      ],
      count: null,
      params: {
        page: 1,
        size: 10,
        filters: [],
        sorting: []
      },
      list: [],
      columns: [],
      columnsResults: '',
      allowColumns: [],
      aliasesColumns: [],
      sortField: '',
      lastSortField: '',
      result: null,
      countSearchLayers: null,
      searchId: null,
      selectedRow: {},
      noData: false,
      loacalData: list,
      results: [],
      resultsLayers: [],
      isMapSearchTableVisible: true,
      isMapSearchTableCollapse: false,
    }
  },
  created () {
    // this.getItems()
    this.getItems()
    console.log('перед sortingBy')
    this.sortingBy()
  },
  props: {
    layers: Array
  },
  methods: {
    showCelected () {
      // const minimumMapAutoScale = 5000
      console.log('selectedItems', this.selectedItems)
      console.log('map', this.map)
      // zoomAndHighlightObjectsOnMap(this.selectedItems, this.map, 17, minimumMapAutoScale)
    },
    onClickRow (row) {
      console.log('onClickRow')
      console.log('row')
      console.log(row)
      let index = this.results.findIndex(el => el.objectIdValue === row.attributes[0].value)
      console.log('получение index')
      console.log(index)
      console.log('this.selectedRow')
      console.log(this.selectedRow)
      this.selectedRow = this.results[index]
    },
    onCheckRow (row) {
      // clearHighlightedObjectsOnMap()
      console.log('onCheckRow')
      console.log('row')
      console.log(row)
      console.log('this.results')
      console.log(this.results)
      let index = this.results.findIndex(el => el.objectIdValue === row.attributes[0].value)
      this.selectedItems.push(this.results[index])
    },
    upCount (count) {
      this.count = count
    },
    getItems () {
      console.log('получить итемы')
      this.results = localResult
      this.items = [...localResult]
      this.resultsLayers = [...localResult]
      this.getLayerSettings()
      console.log('перед getInsetLayersIds')
      this.getInsetLayersIds()
      this.getFilterItems()
    },
    getFilterItems () {
      console.log('getFilterItems start')
      let obj = {}
      let result = []
      let resultManyObjects = []
      if (this.countSearchLayers === 1) {
        console.log('countSearchLayers == 1')
        console.log('this.resultsLayers')
        console.log(this.resultsLayers)
        result = this.resultsLayers.filter(el => el.layerId === this.affectedLayersIds[0])
        obj.layerId = result[0].layerId
        obj.items = result
        this.items = obj.items
      }
      if (this.countSearchLayers > 1) {
        console.log('countSearchLayers > 1')
        for (let i = 0; i < this.countSearchLayers; i++) {
          result = this.resultsLayers.filter(el => el.layerId === this.affectedLayersIds[i])
          obj.layerId = result[0].layerId
          obj.items = result
          resultManyObjects.push(obj)
          obj = {}
        }
        if (this.searchId) {
          resultManyObjects.forEach(el => {
            if (el.layerId === this.searchId) {
              this.items = el.items
            }
          })
        } else {
          this.items = resultManyObjects[0].items
        }
      }
      this.sortingBy()
    },
    getInsetLayersIds () {
      console.log('getInsetLayersIds start')
      let arr = []
      console.log('this.items')
      console.log(this.items)
      console.log('this.items.length')
      console.log(this.items.length)
      if (this.items.length) {
        let nonRepeatLayers = this.items.map(e => e.layerId)
        console.log('nonRepeatLayers')
        console.log(nonRepeatLayers)
        arr.push(nonRepeatLayers[0])
        nonRepeatLayers.forEach(item => {
          if (!(arr.indexOf(item) + 1)) {
            arr.push(item)
          }
        })
        console.log('arr')
        console.log(arr)
        this.countSearchLayers = arr.length
        this.affectedLayersIds = arr
        this.getInsetLayersObjs(arr)
      }
    },
    getInsetLayersObjs (arr) {
      console.log('arr:')
      console.log(arr)
      if (arr.length) {
        console.log('this.layers')
        console.log(this.layers)
        let layers = [...this.layers]
        layers.shift()
        console.log('this.layers after shift')
        console.log(this.layers)
        let miniObj = {}
        let trueLayers = []
        arr.forEach(layer => {
          for (let i = 0; i < layers.length; i++) {
            if (layer === layers[i].layer.id) {
              miniObj.name = layers[i].layer.name
              miniObj.id = layers[i].layer.id
              trueLayers.push(miniObj)
            }
            miniObj = {}
          }
        })
        console.log('trueLayers')
        console.log(trueLayers)
        this.insetHeaders = trueLayers
      }
    },
    searchLayer (layer) {
      this.searchId = layer.id
      this.getFilterItems()
    },
    sortingBy () {
      console.log('sortingBy')
      let sortItems = [...this.items]
      let index = sortItems[0].attributes.findIndex(x => x.name === this.sortField)
      if (this.sortField) {
        this.sortItems = sortItems.sort((a, b) => {
          if (a.attributes[index].value < b.attributes[index].value) {
            return -1
          }
          if (a.attributes[index].value > b.attributes[index].value) {
            return 1
          } return 0
        })
      } else {
        this.sortItems = this.items
      }
      this.count = this.sortItems.length
      this.lastSortField = this.sortField
    },
    sortingOut () {
      let sortItems = [...this.items]
      let index = sortItems[0].attributes.findIndex(x => x.name === this.sortField)
      if (this.sortField) {
        this.sortItems = sortItems.sort((a, b) => {
          if (b.attributes[index].value < a.attributes[index].value) {
            return -1
          }
          if (b.attributes[index].value > a.attributes[index].value) {
            return 1
          } return 0
        })
        this.count = this.sortItems.length
        this.lastSortField = ''
      }
    },
    setSortingValue (column) {
      this.sortField = column
      if (this.lastSortField === column) {
        this.sortingOut()
      } else {
        this.sortingBy()
      }
    },
    onChange (params) {
      this.params = params
    },
    onSelectItem (item) {
      this.selectedItem = item
    },
    getLayerSettings () {
      console.log('getLayerSetting')
      const settingsLayer = getAdminLayerSetting()
      console.log('разрешенные колонки')
      console.log('settingsLayer')
      console.log(settingsLayer)
      console.log(settingsLayer.layerSetting.settings.allowedAttributes)
      console.log('алиасы')
      console.log(settingsLayer.layerSetting.settings.aliases)
      // let allowColumns = settingsLayer.allowedAttributes

      let allowColumns = settingsLayer.layerSetting.settings.allowedAttributes
      if (!allowColumns.length) {
        this.noData = true
        return
      }
      let aliasesColumns = settingsLayer.layerSetting.settings.aliases
      let keys = Object.keys(aliasesColumns)
      let arrColumns = []
      allowColumns.forEach(e => {
        for (let i = 0; i < keys.length; i++) {
          let obj = {}
          if (e === keys[i]) {
            obj.title = aliasesColumns[keys[i]]
            obj.field = keys[i]
            arrColumns.push(obj)
            obj = {}
          }
        }
      })

      let localColumns = [{
          "title": "Вид документа",
          "field": "document_type"
      }, {
          "title": "Тип документа",
          "field": "document_relevancy"
      }, {
          "title": "Служба ИСОГД",
          "field": "isogd_service"
      }, {
          "title": "Территория",
          "field": "territory"
      }]

      // this.columns = arrColumns
      this.columns = localColumns
    }
  },
  computed: {
    itemsRightTable () {
      return this.results
    },
    // ...mapState({
    //   results: state => state.searchResults,
    //   resultsLayers: state => state.searchLayersResults,
    //   isMapSearchTableVisible: state => state.isMapSearchTableVisible,
    //   isMapSearchTableCollapse: state => state.isMapSearchTableCollapse
    // }),
    // layersOnMap () {
    //   let layers = [...this.layers]
    //   layers.shift()
    //   return layers
    // }
  },
  watch: {
    selectedResult (newValue) {
      if (!newValue) {
        // clearHighlightedObjectsOnMap()
        return
      }
    },
    sortItems () {
      this.selectedResult = null
    },
    sortField () {
      this.sortingBy()
    }
  },
  components: {
    DataTable
  }
}
</script>

<style scoped>

.collapseSeachTable {
  height: 36px !important;
  overflow: hidden !important;
}

.searchTableDialog {
  position: absolute;
  bottom: 0;
  width: 80%;
  max-width: 1040px;
  right: 0;
  margin-right: 200px;
  background: white;
  height: 85%;
  max-height: 678px;
  z-index: 999;
}

/* @media (min-height: 700px) {
  div.modal-dialog.modal-lg .modal-body > .dt-table {
    min-height: 500px;
    height: 500px;
  }
} */
  @media (min-width: 320px) and (max-width: 1300px) {  
    .searchTableDialog {
      position: absolute;
      bottom: 0;
      width: 80%;
      max-width: 1040px;
      right: 0;
      /* margin-right: 25.1%; */
      margin-right: 100px;
      background: white;
      height: 85%;
      max-height: 678px;
      z-index: 999;
  }
}


</style>
