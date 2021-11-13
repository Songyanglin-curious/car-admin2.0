<template>
  <div>
      <el-form ref="parkingForm" :model="form_data"  :rules="form_rules" label-width="100px">
        <el-form-item label="停车场名称" prop="parkingName">
          <el-input v-model="form_data.parkingName" placeholder="请输入停车场名称"></el-input>
        </el-form-item>
        <el-form-item label="区域" prop="area">
          <!-- 省市区选择 -->
          <CityArea ref='cityArea' :cityAreaValue.sync="form_data.area" :mapLocation="true" @callback="callbackComponent"></CityArea>
        </el-form-item>
        <el-form-item label="详细地址" prop="address">
          <el-input v-model="form_data.address" placeholder="请选输入详细地址"></el-input>
        </el-form-item>
        <el-form-item label="类型" prop="type">
           <el-radio-group v-model.number="form_data.type">
              <el-radio v-for="item in type" :key="item.id" :label="item.value">{{item.label}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="可停放车辆" prop="carsNumber">
          <el-input type="number" v-model.number="form_data.carsNumber" placeholder="请输入数字"></el-input>
        </el-form-item>
        <el-form-item label="禁启用" prop="status">
          <el-radio-group v-model="form_data.status">
            <el-radio v-for="item in status" :key="item.id" :label="item.value">{{item.label}}</el-radio>

          </el-radio-group>
        </el-form-item>
        <el-form-item label="位置">
          <div class="map">
            <Amap ref="amap" @callback="callbackComponent" ></Amap>
          </div>
        </el-form-item>
        <el-form-item label="经纬度" prop="lnglat">
          <el-input :disabled="true"  v-model="form_data.lnglat" placeholder="点击地图后显示位置坐标！"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit()" :loading="button_loading" size="small">新增</el-button>
        </el-form-item>
      </el-form>
  </div>
</template>

<script>
// 引入地图视图
import Amap from "../amap";
import CityArea from "@c/common/cityArea";
import {ParkingAdd} from "@/api/parking"
export default {
  
  props: {

  },
  components: {
    Amap,CityArea
  },
  data() {
    return {
      form_data: {
        parkingName: '', //停车场名称
        area: '',        //省市区
        address: '',    //详细地址
        type: '',        //停车场类型（1：室内；2：室外）
        carsNumber: '',  //最多可停放数量
        status: '',  //禁启用（false：禁用；true：启用）
        lnglat: '',     //经纬度
      },
      // 提交按钮状态
      button_loading: false,
      type: this.$store.state.config.radio_disabled,
      status: this.$store.state.config.parking_type,
      form_rules:{
        parkingName:[
          {required:true,message: '请输入停车场名称', trigger: 'blur' }
        ],
        area:[
          {required:true,message: '请选择省市区', trigger: 'blur' }
        ],
        address:[
          {required:true,message: '请输入停车场详细地址', trigger: 'blur' }
        ],
        type:[
          {required:true,message: '请选择停车场是露天的还是室内的', trigger: 'blur' }
        ],
        carsNumber:[
          {required:true,message: '请输入该停车场能停放的数量', trigger: 'blur' }
        ],
        status:[
          {required:true,message: '请选择该停车场是否启用', trigger: 'blur' }
        ],
        lnglat:[
          {required:true,message: '请点击地图选择停车场在地图上的位置', trigger: 'blur' }
        ],
      },
    };
  },
  methods: {
    // 调用回调函数
    callbackComponent(params){
      if(params.function){this[params.function](params.data)}
    },
    //获取经纬度坐标
    getLnglat(data){
      this.form_data.lnglat = data.lnglat.value
    },
    // 设置地图中心点
    setMapCenter(data){
      this.$refs.amap.setMapCenter(data.address)
    },
    // 提交按钮
    onSubmit() {
      // 更改按钮为加载状态
      this.button_loading = true
      this.$refs.parkingForm.validate((valid) => {
        if (valid) {
          this.addParking()
        } else {
          console.log('error submit!!');
          return false;
        }
      })
    },
    // 重置
    reset(formName){
      // 重置表单到默认状态
       this.$refs[formName].resetFields();
      // 清除点状覆盖物
      this.$refs.amap.clearMapMarker();
      // 清除省市县组件的数据
      this.$refs.cityArea.clearData();
    },
    // 新增停车场api
    addParking(){
      ParkingAdd(this.form_data).then(response => {
        this.$message({
            type: "success",
            message: response.message
        })
        this.button_loading = false;
        this.reset('parkingForm')
        
      }).catch(error => {
          console.log(error)
          this.button_loading = false;
      })
    }
  },
};
</script>

<style scoped lang="scss">
  .map{
    width: 100%;
    height: 300px;
    border: 1px solid #ccc;
  }
</style>
