<template lang="html">
<div style="width: 100%;height: 100%;position: absolute;background-color: #0000cc">

 <div class="dashboard">
    <div class="flex-container column">
        <div class="item one" @click="clickChart('1')" style="transform: translate(-35%,-33.5%) scale(0.4,0.33)">
          <multipleColumn></multipleColumn>
        </div>
        <div class="item two" @click="clickChart('2')" style="transform: translate(6%,-33.5%) scale(0.4,0.33)">
          <!--<column></column>-->
        </div>
        <div class="item three" @click="clickChart('3')" style="transform: translate(47%,-33.5%) scale(0.4,0.33)">
          <!--<v-line></v-line>-->
        </div>
        <div class="item four active" @click="clickChart('4')" style="transform: translate(-10%,25%) scale(1.8,0.8)">
          <!--<point></point>-->
        </div>
    </div>
  </div>
</div>

</template>

<script>
  import column from '../../components/Maps/column.vue'
  import line from '../../components/Maps/line.vue'
  import multipleColumn from '../../components/Maps/multipleColumn.vue'
  import point from '../../components/Maps/point.vue'

export default {
  data() {
    return {
      items: []
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    _resize() {
      this.$root.charts.forEach((myChart) => {
        myChart.resize()
      })
    },
    init() {
      this.items = document.querySelectorAll('.flex-container .item')
      for (let i = 0; i < this.items.length; i++) {
        this.items[i].dataset.order = i + 1;

      }
    },
    clickChart(clickIndex) {
      let activeItem = document.querySelector('.flex-container .active')
      let activeIndex = activeItem.dataset.order
      let clickItem = this.items[clickIndex - 1]
      if (activeIndex === clickIndex) {
        return
      }
      activeItem.classList.remove('active')
      clickItem.classList.add('active')
      this._setStyle(clickItem, activeItem)
    },
    _setStyle(el1, el2) {
      let transform1 = el1.style.transform
      let transform2 = el2.style.transform
      el1.style.transform = transform2
      el2.style.transform = transform1
    }
  },
  components: {
    column,
    multipleColumn,
    point,
    'v-line': line
  }
}

</script>

<style scoped>
  .item{
    padding: 0px;
    margin: 0px;
    width: 68%;
    height: 100%;
    position: absolute;
    transform :scale(0.4,0.33);
    text-align: center;
    transition:all 0.8s;
    background :rgba(32, 32, 35, 0.5)}
  .dashboard{
    position: relative;
    width :100%;
    height :100%;
    margin:0px;
    padding:0px;
    padding-top :5%;
   // background: url('../../assets/bg.jpg');
    background-color: #00a2ae;
    /*background-size :100% 100%*/
  }

  .flex-container.column{
    position :relative;
    height: 90%;
    width: 90%;
    overflow: hidden;
    margin:  10px 50px auto;
    box-sizing: content-box;
  }

  .active{
    height :100%;
    width: 69%;
    margin-left: 10px;
    line-height: 300px;
  }

</style>
