<template>
  <div class="amap-wrap">
    <!-- class为容器设置宽高不起作用，可能是权重的问题 -->
      <el-amap vid="amapContainer" :zoom="zoom" :events="events" class="amap-demo"></el-amap>
  </div>
</template>

<script>
import {AMapManager, lazyAMapApiLoaderInstance } from 'vue-amap';
import {getLngLat} from './common';
import {addressSetMapCenter} from './location';
import {ampaSetMarker,amapClearMarker} from './marker';
export default {
  name: "Map",
  props:{
    // 用于控制是否为地图添加点击设置坐标点覆盖物，并且返回经纬度，默认是开启的
    click_get_lnglat:{
      type: Boolean,
      default: true,
    }
  },
  data() {
    // const self = this;
    return {
      // 地图
      lnglat: null,
      map: null,
      zoom: 14,
      events: {},
    };
  },

  mounted() {
    // const _this = this;
    //  加载高德地图的api
    lazyAMapApiLoaderInstance.load().then(() => {
      // 创建地图
      this.createMap()
      // 点击设置覆盖物
      if(this.click_get_lnglat){this.clickSetMapMarker()}
    })
  },
  methods: {
    // 创建地图
    createMap(){
      this.map = new AMap.Map("amapContainer", {
        center: new AMap.LngLat(117.117148, 39.062564),
        zoom: this.zoom//初始化地图层级
      });
    },
    // 销毁地图
    destroyMap(){
        this.map && this.map.destroy();
    },
    // 点击设置覆盖物
    clickSetMapMarker(){
            this.map.on('click', (e) =>{
        const lnglat = getLngLat(e);
        // 更新经纬度
        this.lnglat = lnglat;
        // 设置覆盖物
        this.setMapMarker();
        /**
         * 需要在父组件调用该方法，但是父组件调用时this指向父组件，而实际需要这个this指向该组件
         * 两种解决方法：
         * 1、使用_this 一个中间变量将该组件的this存下来调用
         * 2、使用箭头函数，箭头函数的this指向该函数的父级就是ampa组件
         */
        // _this.$emit('lnglat',lnglat)
        // this.$emit('lnglat',lnglat)
        this.$emit('callback',{
          function: 'getLnglat',
          data: {
            lnglat:lnglat
          }
        })
      });
    },
    // 设置地图中心点
    setMapCenter(value){
      addressSetMapCenter(value,this.map)
    },
    // 设置点覆盖物
    setMapMarker(lnglat){
      ampaSetMarker(lnglat || this.lnglat,this.map)
    },
    // 清除点覆盖物
    clearMapMarker(){
      amapClearMarker(this.map)
    }
  }
};
</script>

<style lang="scss" scoped>
.amap-wrap {
  width: 100%;
  height: 100%;
}
</style>