<template>
  <div class="dt-header__input-wrp"> 
    <input
      type="text"
      class="form-control"
      v-model="value"
      @keyup.enter="onFilter"
    >
    <span @click="onFilter" class="input-group-btn filter-group dt-header__span">
        <button data-v-95c5804e="" type="button" class="btn btn-default dropdown-toggle icon_filter_off"></button>
    </span>
  </div>
</template>

<script>

export default {
  name: 'dtTextFilter',
  props: {
    filter: Object,
    isLastIndex: Boolean
  },
  data () {
    return {
      value: this.filter.value || null
    }
  },
  watch: {
    filter: {
      deep: true,
      handler: function (newFilter) {
        this.value = newFilter.value
        this.operator = newFilter.operator
      }
    }
  },
  methods: {
    onFilter () {
      this.filter.value = this.value
      let field = this.filter.column.field
      this.$emit('filter', { field: field, value: this.value })
    }
  }
}
</script>

<style scoped>

.dt-header__input-wrp {
  position: relative;
}

.dt-header__span {
  position: absolute;
  right: 36px;
  bottom: 0px;
}   

</style>
