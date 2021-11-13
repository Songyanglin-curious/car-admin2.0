<template>
  <div>
      <div>
          <el-row>
            <el-col :span="21">
              <el-form :inline="true" :model="form" class="demo-form-inline">
              <el-form-item label="区域">
                <el-select v-model="form.area" placeholder="请选择省市区">
                  <el-option label="区域一" value="shanghai"></el-option>
                  </el-select>
                </el-form-item>
              <el-form-item label="类型">
                  <el-select v-model="form.type" placeholder="停车场" class="width-120">
                  <el-option v-for="item in parking_type" :key="item.value" :label="item.value" :value="item.value"></el-option>
                  </el-select>
              </el-form-item>
              <el-form-item label="禁启用">
                  <el-select v-model="form.status" placeholder="请选择" class="width-120">
                    <el-option v-for="item in parking_status" :key="item.value" :label="item.value" :value="item.value"></el-option>
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
                  <el-button type="primary">搜索</el-button>
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
            <el-table-column prop="date" label="停车场名称" ></el-table-column>
            <el-table-column prop="name" label="类型" ></el-table-column>
            <el-table-column prop="address" label="区域"></el-table-column>
            <el-table-column prop="address" label="可停放车辆"></el-table-column>
            <el-table-column prop="address" label="禁启用" width="70px">
              <template scope="scope">
                <el-switch v-model="scope.row.value" active-color="#13ce66" inactive-color="#ff4949">
              </el-switch>
              </template>
            </el-table-column>
            <el-table-column prop="address" label="查看位置" width="100px">
              <template>
                <el-button type="success" size="mini">查看地图</el-button>
              </template>
            </el-table-column>
            <el-table-column prop="address" label="操作" width="150px">
              <template>
                <el-button type="primary" size="small">编辑</el-button>
                <el-button type="danger" size="small">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
      </div>
  </div>
</template>

<script>
export default {
  props: {

  },
  components: {

  },
  data() {
    return {
      // 筛选
      form: {
          area: "",
          type: "",
          status: ""
      },
      // 搜索关键字
      search_key: '',
      // 输入关键字
      key_word: '',
      // 表格数据
      tableData: [{
          date: '2016-05-03',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }, {
          date: '2016-05-02',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }, {
          date: '2016-05-04',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }, {
          date: '2016-05-01',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }, {
          date: '2016-05-08',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }, {
          date: '2016-05-06',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }, {
          date: '2016-05-07',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }],
        value: true,
      // 禁启用
      parking_status: this.$store.state.config.parking_status,
      // 停车场类型
      parking_type: this.$store.state.config.parking_type,
    };
  },
  computed: {

  },
  watch: {

  },
  created() {

  },
  mounted() {

  },
  methods: {
    onSubmit() {
        console.log('submit!');
      }
  },
};
</script>

<style scoped lang="scss">

</style>
