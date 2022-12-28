<template>
  <div class="dt-header">
    <div ref="scroll">
      <table class="table dataTable">
        <colgroup>
          <col width="70px"/>
          <col
            v-for="(sort, index) of sorting" :key="index"
            :style="{ width: sort.calculatedWidth }"
          />
        </colgroup>
        <thead>
          <tr>
            <th class="dt-header__td-checkbox">
              <!-- <input type="checkbox" class="custom-checkbox" id="dt-header-custom-checkbox" v-model="selectedItem"> -->
              <label for="ckbox"></label>
            </th>
            <template v-for="(sort, index) of sorting">
              <th :key="index" @click="onSortField(sort)">
                <span>
                  <div class="text-container">
                  {{ sort.column.title }}
                  </div>
                </span>
              </th>
            </template>
          </tr>
        </thead>
      </table>
    </div>
  </div>
</template>
<script>

export default {
  data () {
    return {
      selectedItem: false
    }
  },
  props: {
    sorting: Array
  },
  methods: {
    onSortField (sortField) {
      this.$emit('onSortField', sortField.column.field)
    }
  }
}
</script>

<style scoped>
.dt-header {
  /* Ширина скроллбара */
  padding-right: 17px;
  overflow: hidden;
  border-bottom: 0px solid #ddd;
  border-top: 1px solid #ddd;
  min-height: 22px;
  flex: 0 0 auto;
}

.dataTable thead {

}

.dt-header__td-checkbox {
  text-align: center;
  width: 100px !important;
}

.dt-header > div {
  overflow: hidden;
}
.dt-header table {
  table-layout: fixed;
}
.dt-header th {
  word-break: break-word;
  height: 1em;
}
.dt-header th span {
  height: 100%;
  display: block;
  /* overflow: hidden; */
  padding-left: 2px;
}
.dt-header th span .text-container {
  display: flex;
  line-height: 1;
  flex-direction: column;
  justify-content: center;
  height: 100%;
}
.dt-header .table > thead > tr > th {
  border-bottom: none;
  border-top: none;
}
.panel-heading + .dt-table .dt-header .table > thead > tr > th {
  border-bottom: none;
  border-top: none;
}
.modal-body > .dt-table .dt-header .table > thead > tr > th {
  border-bottom: none;
  border-top: none;
}
.panel-heading + .dt-table .dt-header {
  border-top: none;
}
/* TODO Перенести класс dataTable */
</style>
