<template>
  <section>
    <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
      <el-form :inline="true" :model="filters">
        <el-form-item>
          <el-input v-model="filters.name" placeholder="姓名"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" v-on:click="getUsers">查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleAdd">新增</el-button>
        </el-form-item>
      </el-form>
      <el-table :data='users' highlight-current-row style="width: 100%;">
        <!--<el-table-column type="selection" width="55">-->
        <!--</el-table-column>-->
        <el-table-column type="index" width="60">
        </el-table-column>
        <el-table-column prop="name" label="项目名称" width="180" >
        </el-table-column>
        <el-table-column prop="des" label="描述" width="200" >
        </el-table-column>
        <el-table-column prop="id" label="创建者" width="180" >
        </el-table-column>
        <el-table-column prop="ctime" label="创建时间" width="180" sortable>
        </el-table-column>
        <el-table-column prop="isopen" label="是否公开" width="120" :formatter="formaType" sortable>
        </el-table-column>
        <el-table-column label="操作" width="200">
          <template scope="scope">
            <el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
            <el-button type="danger" size="small" @click="handleDel(scope.$index, scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-row>
        <el-col :span="24"><div style="float: right">
          <el-pagination
            background
            layout="prev, pager, next"
            :total="1000" @current-change="handleCurrentChange" @size-change="handleSizeChange">
          </el-pagination>
        </div></el-col>
      </el-row>

    </el-col>

    <!--编辑页面-->
    <el-dialog title="编辑" :visible.sync="editFormVisible" >
      <el-form :model="editForm" label-width="80px" :rules="editFormRules" ref="editForm">
        <el-form-item label="项目名称:" prop="name">
          <el-input v-model="editForm.name" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="创建者:">
          <el-input v-model="editForm.id" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="项目描述" prop="prodes">
          <el-input type="textarea"
                    :rows="4"
                    placeholder="请输入项目描述" v-model="editForm.des"  auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="类型">
          <template>
            <el-radio-group v-model="editForm.isopen">
              <el-radio v-model="radio" label="0">公开</el-radio>
              <el-radio v-model="radio" label="1">私有</el-radio>
            </el-radio-group>
          </template>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="editFormVisible = false">取消</el-button>
        <el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
      </div>
    </el-dialog>

    <!--新增界面-->
    <el-dialog title="项目新增"  :visible.sync="addFormVisible" :close-on-click-modal="false">
      <el-form :model="addForm" label-width="80px" :rules="addFormRules" ref="addForm">
        <el-form-item label="项目名称" prop="proname">
          <el-input v-model="addForm.proname" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="项目描述" prop="prodes">
          <el-input type="textarea"
                    :rows="4"
                    placeholder="请输入项目描述" v-model="addForm.prodes"  auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="类型">
          <template>
            <el-radio-group v-model="addForm.type">
            <el-radio v-model="radio" label="0">公开</el-radio>
            <el-radio v-model="radio" label="1">私有</el-radio>
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

  import {getAllAcountInfo} from '../../api/accountcfg'
  import {mapGetters} from 'vuex'
  export default {
    data(){
      return {
        inject:["reload"],
        input10: '',
        radio:'1',
        listLoading: true,
        editLoading:false,
        editFormVisible:false,
        users: [],
        checkList:[],
        checkRoust:[],
        filters:{
          name:''
        },
        editForm:{
          nick:'',
          userid:'',
          position:'',
          phone:''
        },
        editFormRules: {
          nick: [
            { required: true, message: '请输入姓名', trigger: 'blur' }
          ],
          position: [
            { required: true, message: '请输入职务', trigger: 'blur' }
          ],
          phone: [
            { required: true, message: '请输入联系方式', trigger: 'blur' }
          ]
        },
        addFormVisible: false,//新增界面是否显示
        addLoading: false,
        addFormRules: {
          name: [
            { required: true, message: '请输入姓名', trigger: 'blur' }
          ]
        },
        //新增界面数据
        addForm: {
          proname: '',
          prodes: '',
          type:''
        }
      }
    },
    created() {
      this.fetchData("1")
    },
    computed:{
      ...mapGetters([
        'SET_USERLIST'
      ])

    },
    methods:{
      //性别显示转换
      formaType(row, column, cellValue, index) {

        return row.isopen == 0 ? '是':'否';
      },
      closeAddFrom(){
          this.$refs['addForm'].resetFields();
          this.addFormVisible = false
      },
      fetchData(index){
         var _self = this
        this.listLoading = true
        this.$store.dispatch('GetAllProject',index).then(()=>{
          _self.listLoading=false
          console.log(_self.$store.getters.proList)
            _self.users  = _self.$store.getters.proList
        }).catch(()=>{
          _self.listLoading
        })
      },
      handleEdit: function (index, row) {
        this.editFormVisible = true;
        this.editForm = Object.assign({}, row);
      },
      editSubmit(){
        var _self = this
        this.$refs.editForm.validate((valid) => {
          if (valid) {
            this.$confirm('确认提交吗？', '提示', {}).then(() => {
              //alert(JSON.stringify(_self.jsonDatas))
              _self.$store.dispatch('UpdateAccound', _self.editForm).then(() => {
                _self.$refs['editForm'].resetFields();
                _self.editFormVisible = false;
                _self.fetchData("1")
              }).catch(() => {
                _self.editFormVisible = false;
              })
            })
          }
        })
      },
      handleDel(index, row) {
        var _self = this
        this.$confirm('确认提交吗？', '提示', {}).then(() => {
          //alert(JSON.stringify(_self.jsonDatas))
          let para = { name: row.name };
          _self.$store.dispatch('DelPro',para).then(() => {

            // this.dialogVisible = false;
            _self.fetchData("1")

          }).catch(() => {

          })
        })
      },
      getUsers(){
      },
      handleAdd(){
        this.addFormVisible = true;
//        var  _self = this
//        this.$store.dispatch('GetAllRole').then(() => {
//          _self.checkRoust = this.$store.getters.roleList
//
//        }).catch((error) => {
//          console.log(error)
//        })


      },
      addSubmit(){
        var _self = this
        this.$refs.addForm.validate((valid) => {
          if (valid) {
            this.$confirm('确认提交吗？', '提示', {}).then(() => {
              //alert(JSON.stringify(_self.jsonDatas))
              _self.$store.dispatch('AddProject', _self.addForm).then(() => {
                _self.$refs['addForm'].resetFields();
                _self.addFormVisible = false;
                //_self.reload()
                _self.fetchData("1")

              }).catch(() => {
                _self.addFormVisible = false;
              })
            })
          }
        })
      },
      checkinlist(){
        console.log(this.checkList)
      },
      handleCurrentChange(val){
        this.fetchData(val)
        //alert("eeeee"+val)
      },
      handleSizeChange(val){
        alert("sss"+val)
      }
    },
    components:{

    },

  }
</script>

<style>
  .toolbar{
    margin-left: 10px;
    margin-top: 10px;
    margin-right: 200px;
  }
</style>
