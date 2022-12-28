<template>
  <div class="dt-body">
    <table class="table dataTable" v-if="items.length !== 0 && !noData">
      <colgroup>
        <col
          v-for="(column, index) of columns"
          :key="index"
          :style="{ 'width': column.calculatedWidth }">
      </colgroup>
      <tbody>
        <template v-for="(item, i) of items">
          <tr
            :key="i"
            @click.stop="onClickRow(item, $event)"
          >
            <td class="dt-body__td-checkbox">
              <input @click.stop="onCheckRow(item, $event)" type="checkbox" class="custom-checkbox" :id="item.attributes[0].value" :value="item" v-model="selectedItems">
              <label :for="item.attributes[0].value"></label>
            </td>
            <td
              v-for="(column, columnIndex) of columns"
              :key="columnIndex"
            >
              <span>{{ getValue(item.attributes, column) }}</span>
            </td>
          </tr>
        </template>
        </tbody>
    </table>
    <div class="no-data-tooltip-container" v-else>
      <div class="no-data-tooltip">Нет данных</div>
    </div>
  </div>
</template>

<script>

export default {
  props: {
    value: Object,
    columns: Array,
    items: Array,
    noData: Boolean
  },
  data () {
    return {
      selectedItems: []
    }
  },
  watch: {
    selectedItems () {
      this.upSelectedItems()
    }
  },
  methods: {
    upSelectedItems () {
      this.$emit('upSelectedItems', this.selectedItems)
    },
    getValue (item, column) {
      let columnValue
      item.forEach(el => {
        if (el.name === column.field) {
          columnValue = el.value
        }
      })
      return columnValue
    },
    onClickRow (row, event) {
      console.log(event.target)
      console.log(row)
      this.$emit('onClickRow', row)
    },
    onCheckRow (row, event) {
      if (event.target.type === 'checkbox') {
        this.$emit('onCheckRow', row)
      }
    }
  }
}
</script>

<style>

.dt-body__td-checkbox {
  width: 100px;
}

.custom-checkbox {
  position: absolute;
  z-index: -1;
  opacity: 0;
  cursor: pointer;
}
.custom-checkbox+label {
  display: inline-flex;
  align-items: center;
  user-select: none;
  padding: 8px;
}
.custom-checkbox+label::before {
  content: '';
  display: inline-block;
  width: 1.3em;
  height: 1.3em;
  flex-shrink: 0;
  flex-grow: 0;
  border: 1px solid #adb5bd;
  border-radius: 0.25em;
  margin-right: 0.25em;
  background-repeat: no-repeat;
  background-position: center center;
  background-size: 50% 50%;
}

.custom-checkbox:checked+label::before {
  border-color: #0766A6;
  background-color: #0766A6;
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 8 8'%3e%3cpath fill='%23fff' d='M6.564.75l-3.59 3.612-1.538-1.55L0 4.26 2.974 7.25 8 2.193z'/%3e%3c/svg%3e");
}

/* стили для активного состояния чекбокса (при нажатии на него) */
.custom-checkbox:not(:disabled):active+label::before {
  background-color: #b3d7ff;
  border-color: #b3d7ff;
}

/* стили для чекбокса, находящегося в состоянии disabled */
.custom-checkbox:disabled+label::before {
  background-color: #e9ecef;
}


</style>

<style scoped>

.has-warning {
  border: 1px solid red;
}
.borders {
  border: 0.5px solid #bbb;
  border-collapse: collapse;
}
.dt-body {
  flex: 1 1 0;
  -ms-flex-preferred-size: 0px;
  -ms-flex-negative: 0;
  overflow: auto;
  height: 450px;
  border-bottom: 1px solid #bbb;
  flex-basis: 450px;
}
.dt-body table {
  table-layout: fixed;
  border-top: none;
  border-collapse: collapse;
}
.dt-body table.no-rows-table {
  height: 100%;
}
.dt-body.no-rows-table {
  overflow-y: hidden;
  display: flex;
  flex-direction: column;
}
.dt-body div.no-data-tooltip-container {
  flex: 1;
  width: 100%;
  display: flex;
  justify-content:center;
  align-content:center;
  flex-direction:column;
}
.dt-body .no-data-cell-placeholder {
  padding-bottom: 0px;
  padding-top: 1px;
}
.dt-body div.no-data-tooltip {
  text-align: center;
  margin: 10px;
  font-size: 15px;
  font-weight: bold;
}
.dt-header + .dt-body table {
  border-top: 1px solid #ddd;
}
.dt-body tbody > tr.selected {
  background-color: #e3f2fd;
  color: #104d92;
}
.dt-body tr span {
  max-height: 4.8em;
  overflow: hidden;
  display: block;
}

.dt-body tr a {
  max-height: 4.8em;
  overflow: hidden;
  display: block;
}

.data-table-lookup-input .form-control {
  padding: 3px 10px !important;
  height: 30px !important
}
.data-table-lookup-input .select2-selection.select2-selection--single {
  height: 30px;
  padding-top: 4px
}
td {
  word-break: break-word;
  text-align: center;
}
.aggregation-row-column {
  border-top: 1.4px solid #000000;
  vertical-align: bottom;
}
.aggregation {
  border: 2.4px solid #000000;
  vertical-align: bottom;
}
.data-table-links-cell > a {
  display: block
}

.dt-body table.no-rows-table {
  height: 100%;
}
.dt-body.no-rows-table {
  overflow-y: hidden;
  display: flex;
  flex-direction: column;
}
.dt-body div.no-data-tooltip-container {
  flex: 1;
  width: 100%;
  display: flex;
  justify-content:center;
  align-content:center;
  flex-direction:column;
  height: 100%;
}
.dt-body div.no-data-tooltip {
  text-align: center;
  margin: 10px;
  font-size: 15px;
  font-weight: bold;
}

</style>
