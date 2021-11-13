# 基于elementUI省市区层级选择器组件

## 使用方法

```
依赖
1、elementui
2、获取数据的api接口位于
import{GetCity} from ".src/api/common"
//引入组件
import CityArea from "@c/common/cityArea"
//注册组件
components: {
    CityArea
  },
 //使用组件
 <CityArea :cityAreaValue.sync="form_data.area"></CityArea>
 /*
 form_data.area 是组件返回给父组件的数据，就是自己选择的数据的数据
 组件是单向数据流，父组件向子组件传值，但是子组件不能修改父组件的值 			.sync可以修改父组件的值，但只能是简单数据类型
 */
```

传入参数： 无

传出参数：

```
form_data.area（自己定义接受数据的）
```

| 参数名         | 类型   | 备注                     |
| -------------- | ------ | ------------------------ |
| form_data.area | String | 绑定到你自己定义的数据里 |

## 封装思路

```
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
    }
  },
  components: {},
  data() {
    return {
      city_area_value: '',
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
          // console.log(node.level)
          // 省市区接口
          GetCity(requesrData).then(response => {
            let data = response.data.data
            // 对返回数据进行处理
            let dataType = jsonType[level].type.toUpperCase();
            console.log(dataType)
            data.forEach(el => {
                el.value = el[`${dataType}_CODE`];
                el.label = el[`${dataType}_NAME`];
                if(level ===2){el.leaf = level => 2;}
              });
            resolve(data)
          })
        }
      }
    };
  },
  methods: {
    handleChange(value) {
      this.$emit('update:cityAreaValue',value.join())
      // console.log(value.join());
    }
  },
};
</script>

<style scoped lang="scss">

</style>
```

### 1、数据获取

level表示层级的，进入页面是第0级即level=0， 是node节点是你点击的数数包含请求的数据和一些其他信息如level

通过props 配置 采用动态加载，页面加载进来会自动执行一次lazyLoad(level=0)函数，将请求接口放在lazyLoad中会自动请求一次数据，得到第一层（level)的数据,点击level=1的节点（就是数据渲染出来的选项）再执行一次lazyLoad函数请求数据。

关键点在于根据level 配置不同的请求数据，理不清楚就先用  if  实现功能，再简化，核心思路是 现将都有的属性抽出来

```
requesrData.type = jsonType[level].type		//type是每个都有的属性，先将它抽出
```

```
//code属性第一个没有，所以先判断，判定不是第一个再将值赋给请求参数
if(jsonType[level].code){ requesrData[`${jsonType[level].code}_code`] = node.value}
```

## 2、请求的数据处理

默认 value 是值 ，label 是渲染的文本，返回的数据格式不对需要重新 遍历一次赋值

处理后的数据resolve(data) 返回给 cascader_options 让它渲染