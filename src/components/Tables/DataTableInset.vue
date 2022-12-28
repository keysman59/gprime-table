<template>
  <div class="dt-inset">
    <div v-for="layer in insetHeaders" :key="layer.id" class="dt-inset__bookmark">
      <div :class="{ active: isActiveLayer === layer.id }" class="dt-inset__div" @click="searchLayer(layer)">
        {{ layer.name }}
        <div v-if="isActiveLayer === layer.id" class="dt-inset__decor-active-line"></div>
      </div>
    </div>
  </div>
</template>
<script>

export default {
  data () {
    return {
      isActiveLayer: '',
      testInsetData: [
        {
          name: 'Зоны действия документов',
          id: '2bd50162-47f0-45b6-9546-7c4edb4e0d16'
        }, {
          name: 'Зоны действия документов инженерных изысканий ГИСОГД без привязки',
          id: 'a161551f-d4e5-4906-a708-402246944a34'
        }]
    }
  },
  created () {
    this.isActiveLayer = this.insetHeaders[0].id
  },
  props: {
    insetHeaders: Array
  },
  methods: {
    searchLayer (layer) {
      this.isActiveLayer = layer.id
      this.$emit('searchLayer', layer)
    }
  }
}
</script>

<style scoped>

.active {
  font-weight: 500;
}

.dt-inset {
  display: flex;
  height: 36px;
  background-color: #0766A6;
  padding-right: 80px;
  overflow-x: auto;
  overflow-y: hidden;
  scrollbar-width: thin;
  scrollbar-color: #aaa;
  width: calc(100% - 76px);
}

.dt-inset__bookmark {
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  margin-left: 12px;
  margin-right: 12px;
  flex: 0 0 auto;
}

.dt-inset::-webkit-scrollbar {
  height: 4px;
  border-radius: 20px;
}

.dt-inset::-webkit-scrollbar-track {
  background: #fff;
}

.dt-inset::-webkit-scrollbar-thumb {
	background-color: #39C;
	border-radius: 20px;
	border: 0px solid #dfdfdf;
}

.dt-inset__decor-active-line {
  position: absolute;
  height: 1px;
  background: rgba(255, 255, 255, .8);
  width: 100%;
  bottom: 6px;
  left: 0px;
}

.dt-inset__div {
  font-size: 14px;
  color: white;
  display: flex;
  cursor: pointer;
}

</style>
