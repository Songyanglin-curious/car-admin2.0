<template>
  <div>
    <el-cascader
      v-model="city_area_value"
      :options="cascader_options"
      :props="cascader_props"
      @change="handleChange">
    </el-cascader>
  </div>
</template>

<script>
import{GetCity} from "@/api/common"
export default {
  props: {
    cityAreaValue: {
      type: String,
      default: '',
    },
    mapLocation: {
			type: Boolean,
			default: false
		},
  },
  components: {},
  data() {
    const _this = this
    return {
      city_area_value: '',
      // 储存选中的地址中文信息
      address: [],
      addressData: {},
      // 省市区级联菜单数据
      cascader_options: [],
      // 动态加载 省市区级联菜单数据
      cascader_props: {
        lazy: true,//开启动态加载
        lazyLoad (node, resolve) {
          // level 是级联菜单的层级，页面一旦加载就会自动调用该函数，为0级
          let level = node.level;
          // 请求数据
          const  requesrData = {}
          const jsonType = {
						0: { type: "province" },
						1: { type: "city", code: "province" },
						2: { type: "area", code: "city" }
					}
          // 设置输入参数
          if(jsonType[level].code){ requesrData[`${jsonType[level].code}_code`] = node.value}
          requesrData.type = jsonType[level].type
          // 省市区接口
          GetCity(requesrData).then(response => {
            let data = response.data.data
            // 对返回数据进行处理
            let dataType = jsonType[level].type.toUpperCase();
            data.forEach(el => {
              el.value = el[`${dataType}_CODE`];
              el.label = el[`${dataType}_NAME`];
              if(level ===2){el.leaf = level => 2;}
            });
            // 获取省市区信息
            _this.addressData[jsonType[level].type] = data
            // 处理和地租组件联动的信息
            resolve(data)
          })
          if(level !== 0){
              _this.getAddress(node)
            }
        }
      }
    };
  },
  methods: {
    handleChange(value) {
      this.$emit('update:cityAreaValue',value.join())
      // 获得最后一项的区的数据
      let lastCode = value[value.length-1]
      //县
      let area = this.addressData.area.filter(item => item.value === lastCode)[0]
      this.address[2] = area.label
      this.getAddress()
    },
    //获取中文地址
    getAddress(node){
      if(node){
        let index = node.level-1
        this.address[index] = node.label
      }
      // 根据传入参数判断是否需要返回中文地址
      if(this.mapLocation){
        this.$emit('callback',{
          function:'setMapCenter',
          data: {
            address:this.address.join('')
        }
      })
      }
    },
    // 清除数据
    clearData(){
      this.city_area_value = ''
    }
  },
};
// 在不是vue内定的函数this指向有所不同
/**
 * 目的：在省市区选择后自动在地图定位到指定的位置
 * 思路：
 * 1、省市区组件暴露出去选中的中文地址
 * 2、地图组件amap接受该信息，用高德地图提供的方式解析出经纬度
 * 3、将解析出的经纬度设置为新的地图中心点坐标
 */
</script>

<style scoped lang="scss">

</style>
