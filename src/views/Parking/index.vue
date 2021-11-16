<template>
  <div>
    <el-row>
      <el-col :span="21">
        <el-form :inline="true" :model="form_parking" class="demo-form-inline">
        <el-form-item label="区域">
          <CityArea :cityAreaValue.sync="form_parking.area"></CityArea>
        </el-form-item>
        <el-form-item label="类型">
          <el-select v-model="form_parking.type" placeholder="停车场" class="width-120">
            <el-option v-for="item in parking_type" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="禁启用">
            <el-select v-model="form_parking.status" placeholder="请选择" class="width-120">
              <el-option v-for="item in parking_status" :key="item.label" :label="item.label" :value="item.value"></el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="关键字">
            <el-select v-model="search_key" placeholder="请选择" class="width-120">
              <el-option label="停车场名称" value="parkingName"></el-option>
              <el-option label="详细区域" value="address"></el-option>
            </el-select>
        </el-form-item>

        <el-form-item >
          <el-input v-model="key_word"  placeholder="请输入关键字按Enter搜索"></el-input>
        </el-form-item>
        <el-form-item>
            <el-button type="primary" @click="getParkingList()">搜索</el-button>
        </el-form-item>
      </el-form>
      </el-col>
      <el-col :span="3">
        <div>
          <router-link to="/parkingAdd">
            <el-button type="success">新增停车场</el-button>
          </router-link>
        </div>
      </el-col>
    </el-row>
    <!-- 表格数据 -->
    <el-table :data="tableData"  border style="width: 100%">
      <el-table-column type="selection"></el-table-column>
      <el-table-column prop="parkingName" label="停车场名称" ></el-table-column>
      <el-table-column prop="type" label="类型" >
        <template slot-scope="scoped">
                    <span>{{ getType(scoped.row.type) }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="address" label="区域"></el-table-column>
      <el-table-column prop="carsNumber" label="可停放车辆"></el-table-column>
      <el-table-column prop="status" label="禁启用" width="70px">
        <template scope="scope">
          <el-switch v-model="scope.row.status" active-color="#13ce66" inactive-color="#ff4949">
        </el-switch>
        </template>
      </el-table-column>
      <el-table-column prop="address" label="查看位置" width="100px">
        <template scope="scoped">
          <el-button type="success" size="mini" @click="showMap(scoped.row)">查看地图</el-button>
        </template>
      </el-table-column>
      <el-table-column prop="address" label="操作" width="150px">
        <template scope="scoped">
          <el-button type="primary" size="small" @click="editParking(scoped.row)">编辑</el-button>
          <el-button type="danger" size="small" @click="deleteParking(scoped.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-row class="padding-top-30">
      <el-col :span="4">&nbsp;</el-col>
      <el-col :span="20">
        <el-pagination
         class="pull-right"
        background
        layout="prev, pager, next"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :total="total">
        </el-pagination>
      </el-col>
    </el-row>
    <showMapLocation :flagVisible.sync="map_show" :data="parking_data"></showMapLocation>
  </div>
</template>

<script>
import CityArea from "@c/common/cityArea";
import {ParkingList,ParkingDelete} from "@/api/parking";
import showMapLocation from "@c/dialog/showMapLocation";
export default {
  components: {CityArea,showMapLocation},
  data() {
    return {
      // 筛选
      form_parking: {
          area: "",
          type: "",
          status: "",
      },
       // 禁启用
      parking_status: this.$store.state.config.radio_disabled,
      // 停车场类型
      parking_type: this.$store.state.config.parking_type,
      // 搜索关键字
      search_key: '',
      // 输入关键字
      key_word: '',
      // 表格数据
      tableData: [],
      // 当前页码
      currentPage: 1,
      // 页码
      pageNumber: 1,
      // 每页数据个数
      pageSize: 10,
      // 总数据条数
      total: 0,
      // 地图弹窗显示
      map_show: false,
      // 地图弹窗组件传入信息
      parking_data: {},
    };
  },



  methods: {
    // 获取表格数据api
    getParkingList(){
      let requestData = {
        pageNumber: this.pageNumber,
        pageSize: this.pageSize,
      }
      const filterData = JSON.parse(JSON.stringify(this.form_parking));
      // 搜索功能禁启用筛选有bug
      for(let key in filterData) {
          if(filterData[key] !== '') {
            requestData[key] = filterData[key];
          }
      }
      // 关键字
      if(this.key_word && this.search_key) { requestData[this.search_key] = this.key_word; }
      ParkingList(requestData).then(response => {
        let data = response.data;
        if(data){this.tableData = data.data;}
        if(data.total){this.total = data.total;}
      }).catch(error => {
        console.log('请求列表数据失败')
      })
    },
    // 地图弹窗显示
    showMap(data){
      this.map_show = true;
      this.parking_data = data;
    },
    // 编辑功能
    editParking(params){
      this.$router.push({name:'ParkingAdd',params: params})
    },
    // 删除
    deleteParking(id){
      ParkingDelete({id: id}).then(resposne => {
        this.$message({
            type: "success",
            message: resposne.message
        })
        this.getParkingList()
      })
    },
    /** 返回类型文本 */
    getType(value){
        const data = this.parking_type.filter(item => item.value == value);
        if(data && data.length > 0) {
            return data[0].label
        }
    },
    onSubmit() {
        console.log('submit!');
    },
    // 页码相关更改，触发
    handleSizeChange(val) {
      this.pageSize = val;
      this.getParkingList()
    },
    handleCurrentChange(val) {
      this.pageNumber = val;
      this.getParkingList()
    }
  },
  computed: {

  },
  watch: {

  },
  created() {
    
  },
  beforeMount() {
    this.getParkingList()
  },

};
/**
 * 目的： 编辑功能
 * 功能：
 * 1、点击后打开新的详细页面，并将数据显示出来
 * 2、能够修改数据，并且验证数据格式
 * 3、提交编辑的能容
 * 思路：
 * 1、点击后打开新的详细页面，并将数据显示出来：借助添加页面，将数据渲染到添加页面，但是要能够让添加
 *    页面增加和编辑功能相区分，这里借助id在编辑处将该行数据传入，如果有id就是编辑，没有就添加
 * 2、能够修改数据，并且验证数据格式： 借助id判断出是编辑后，将传入的数据，赋给表单，渲染到页面
 * 3、提交编辑的内容：判断添加还是编辑调用相应的接口
 */

/**
 * 目标： 删除功能
 * 功能： 删除这一条数据
 * 思路:  调用删除接口，传入这一行的删除条件
 */

// 目的： 将渲染的类型改为文字
// 思路： 
</script>

<style scoped lang="scss">

</style>
