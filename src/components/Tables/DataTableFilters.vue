<template>
  <div class="dt-filters">
    <div ref="scroll">
      <table class="table">
        <colgroup>
          <col width="70px"/>
          <col
            v-for="(filter, index) of filters"
            :key="index"
            :style="{ width: filter.calculatedWidth }"
          >
        </colgroup>
        <thead>
          <tr>
            <td class="dt-header__td-checkbox">
              <label for="kbox"></label>
            </td>
            <td v-for="(filter, index) of filters" :key="index">
              <data-table-text-filter
                :filter="filter"
                @filter="onFilter"
                :isLastIndex="index === lastFilterIndex"
              />
            </td>
          </tr>
        </thead>
      </table>
    </div>
  </div>
</template>

<script>
import DataTableTextFilter from './DataTableTextFilter'

export default {
  props: {
    filters: Array
  },
  components: {
    DataTableTextFilter
  },
  computed: {
    lastFilterIndex () {
      return this.filters.length - 1
    }
  },
  methods: {
    onFilter (val) {
      this.$emit('filter', val)
    },
    scrollLeft (offset) {
      this.$refs.scroll.scrollLeft = offset
    },
    isInt (value) {
      var er = /^-?[0-9]+$/

      return er.test(value)
    }
  }
}
</script>

<style scoped>
.dt-header__td-checkbox {
  text-align: center;
  width: 100px !important;
}

.filter-group {
  border: 1px solid transparent;
  border-left: none;
  z-index: 0;
} 

.dt-filters {
  /* Ширина скроллбара */
  padding-right: 17px;
  overflow: hidden;
  border-bottom: 1px solid #ddd;
  min-height: 40px;
}
.dt-filters > div {
  overflow: hidden;
}
.dt-filters table {
  table-layout: fixed;
  border-top: 0px;
}
.dt-filters table > thead > tr > td {
  border-top: none;
  /* border-bottom: 1px solid #bbb; */
  padding-top: 1px;
}
.dt-filters table > thead > tr > td.lookup-cell{
  padding-top: 0px;
}
</style>
