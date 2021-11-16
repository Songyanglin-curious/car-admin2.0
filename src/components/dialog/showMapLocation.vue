<template>
  <el-dialog :title="this.data.parkingName" :visible.sync="dialogVisible" width="800px" @close="close" @opened="opened">
    <div style="height: 500px">
      <Amap ref="amap" :click_get_lnglat="false"></Amap>
    </div>
    <el-button @click="test()"></el-button>
  </el-dialog>
</template>

<script>
import Amap from "@/views/amap"
export default {
  name: 'showMapLocation',
  props: {
    flagVisible: {
      type: Boolean,
      default: false
    },
    data: {
      type: Object,
      default: ()=>{}
    }
  },
  components: {Amap},
  data() {
    return {
      dialogVisible: false
    };
  },
  methods: {
    opened(){
      this.$refs.amap.createMap()
      this.$nextTick(() => {
        const split_lnglat = this.data.lnglat.split(',');
        const lnglat = {
          lng: split_lnglat[0],
          lat: split_lnglat[1],
        };
        if(lnglat){this.$refs.amap.setMapMarker(lnglat)};
      });
    },
    close(){
      // 回调修改map_show
      this.$emit('update:flagVisible',false)
      this.$refs.amap.destroyMap()
    },
    test(){
      console.log(this.data)
    }
  },
  watch: {
    flagVisible: {
      handler(newValue, oldValue) {
        this.dialogVisible = newValue;
      }
    }
  }
};
/**
 * 目的：打开关闭弹窗 显示地图 在停车场坐标处打上坐标 地图中心定位到停车场坐标处
 * 实现思路：
 * 1、打开关闭弹窗  打开时传入信号true弹窗打开，关闭时将父组件修改为false
 * 2、显示地图： 引入地图组件
 * 3、停车场坐标处打点：传入该停车场经纬度，调用地图组件的打点函数
 * 4、地图中心定位到停车场坐标处: 添加覆盖物的同时添加map.setFitView()函数
 */
</script>

<style scoped lang="scss">
</style>
