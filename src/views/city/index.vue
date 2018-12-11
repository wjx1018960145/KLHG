<template>
  <!--全国主要城市地理位置维护-->
  <section>
    <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
      <el-form :inline="true" :model="filters">
        <el-form-item>
          <el-button type="primary" @click="handleAdd">新增</el-button>
        </el-form-item>
      </el-form>
      <el-container style="height: 500px; border: 1px solid #eee">
      <el-aside width="200px" style="background-color: rgb(238, 241, 246)">
        <el-tree :data="data" :props="defaultProps" @node-click="handleNodeClick"></el-tree>
      </el-aside>
        <el-container>
          <el-header style="text-align: right; font-size: 12px">
            <el-dropdown>
              <i class="el-icon-setting" style="margin-right: 15px"></i>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item>查看</el-dropdown-item>
                <el-dropdown-item>新增</el-dropdown-item>
                <el-dropdown-item>删除</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
            <span>王小虎</span>
          </el-header>
          <el-main >
            <el-table :data="list" v-loading.body="listLoading" element-loading-text="Loading" border fit highlight-current-row>
              <el-table-column align="center" label='ID' width="95">
                <template slot-scope="scope">
                  {{scope.row.cityid}}
        </template>
              </el-table-column>
              <el-table-column label="城市名称">
                <template slot-scope="scope">
                  {{scope.row.cityname}}
        </template>
              </el-table-column>
              <el-table-column label="经度" width="110" align="center">
                <template slot-scope="scope">
                  <span>{{scope.row.longitude}}</span>
                </template>
              </el-table-column>
              <el-table-column label="维度" width="110" align="center">
                <template slot-scope="scope">
                  {{scope.row.dimension}}
        </template>
              </el-table-column>
              <el-table-column class-name="status-col" label="状态" width="110" align="center">
                <template slot-scope="scope">
                  <el-switch
                    v-model="value2"
                    active-color="#13ce66"
                    inactive-color="#ff4949">
                  </el-switch>
                </template>
              </el-table-column>
              <el-table-column align="center" prop="created_at" label="操作" width="200">
                <template slot-scope="scope">
                  <el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                  <el-button type="danger" size="small" @click="handleDel(scope.$index, scope.row)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-main>
        </el-container>
      </el-container>


    </el-col>
    <!--新增界面-->
    <el-dialog title="城市新增"  :visible.sync="addFormVisible" :close-on-click-modal="false">
      <el-form :model="addForm" label-width="80px" :rules="addFormRules" ref="addForm">
        <el-form-item label="城市ID" prop="id">
          <el-input placeholder="id" v-model="addForm.id"  auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="城市名称" prop="cityname">
          <el-input v-model="addForm.cityname" auto-complete="off"></el-input>
        </el-form-item>

        <el-form-item label="经度" prop="longitude">
          <el-input placeholder="经度" v-model="addForm.longitude"  auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="维度" prop="dimension">
          <el-input placeholder="维度" v-model="addForm.dimension"  auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="类型">
          <template>
            <el-radio-group v-model="addForm.type">
              <el-radio v-model="radio" label="1">公开</el-radio>
              <el-radio v-model="radio" label="2">私有</el-radio>
            </el-radio-group>
          </template>
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeAddFrom">取消</el-button>
        <el-button type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>
      </div>
    </el-dialog>
  </section>
</template>
<script>
  import { getRollList } from '../../api/roll'
  import Request from '../../api/http.js';
  import {getToken}from '../../utils/auth'
  export default {
    data() {
      return {
        list: null,
        listLoading: false,
        addFormVisible:false,
        value1: true,
        value2: true,
        filters:{
          name:''
        },
        //新增界面数据
        addForm: {
          cityname: '',
          id: '',
          type:'',
          longitude:'',
          dimension:''
        },
        data: [{
          label: '一级 1',
          children: [{
            label: '二级 1-1',
            children: [{
              label: '三级 1-1-1'
            }]
          }]
        }, {
          label: '一级 2',
          children: [{
            label: '二级 2-1',
            children: [{
              label: '三级 2-1-1'
            }]
          }, {
            label: '二级 2-2',
            children: [{
              label: '三级 2-2-1'
            }]
          }]
        }, {
          label: '一级 3',
          children: [{
            label: '二级 3-1',
            children: [{
              label: '三级 3-1-1'
            }]
          }, {
            label: '二级 3-2',
            children: [{
              label: '三级 3-2-1'
            }]
          }]
        }],
        addFormRules: {
          cityname: [
            { required: true, message: '请输入城市名称', trigger: 'blur' }
          ],
          id: [
            { required: true, message: '请输入城市名称', trigger: 'blur' }
          ],
          longitude: [
            { required: true, message: '请输入城市经度', trigger: 'blur' }
          ],
          dimension: [
            { required: true, message: '请输入城市维度', trigger: 'blur' }
          ]
        },
      }
    },
    filters: {
      statusFilter(status) {
        const statusMap = {
          published: 'success',
          draft: 'gray',
          deleted: 'danger'
        }
        return statusMap[status]
      }
    },
    created() {
      this.fetchData()
    },
    methods: {
      closeAddFrom(){
        this.$refs['addForm'].resetFields();
        this.addFormVisible = false
      },
      handleAdd(){
        this.addFormVisible = true;
      },
      addSubmit(){
        var _self = this
        this.$refs.addForm.validate((valid) => {
          if (valid) {
            this.$confirm('确认提交吗？', '提示', {}).then(() => {
              //alert(JSON.stringify(_self.jsonDatas))
              var  params = 'token='+getToken()+'&id='+_self.addForm.id+'&cityname='+_self.addForm.cityname+'&dimension='+_self.addForm.dimension+'&longitude='+_self.addForm.longitude
           Request.requestAddCity(params).then((res)=>{
            var  data = res.data
             if (data.code === "000000"){
               this.$refs['addForm'].resetFields();
               this.addFormVisible =false;
               _self.$message({
                   message: data.msg,
                   type: 'success'
                 }
               );
             }else {
               this.$refs['addForm'].resetFields();
               this.addFormVisible =false;
               this.$message('添加失败');
             }
           }).catch((error)=>{
             this.$refs['addForm'].resetFields();
             this.addFormVisible =false;
             this.$message(error);
           })
            })
          }
        })
      },
      fetchData() {
        var  _self = this;
        this.listLoading = true
        Request.requestAllCity().then((res)=>{
          var  data = res.data
          if (data.code === 20000){
            _self.list = data.body
            _self.listLoading = false
          }
        }).catch((error)=>{
          _self.listLoading = false
        })
      }
    }
  }
</script>

<style>
  .el-header {
    background-color: #B3C0D1;
    color: #333;
    line-height: 60px;
  }
  .toolbar{
    margin-left: 10px;
    margin-top: 10px;
    margin-right: 200px;
  }
  .el-aside {
    color: #333;
  }
</style>
