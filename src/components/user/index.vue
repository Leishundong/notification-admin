<template>
  <div class="app-container">


    <form-container :model="param" class="_search">
      <field-input class="searchInput" label="搜索关键字" :wrapforlike="true" v-model="param.namelike"></field-input>
      <el-button type="primary" style="margin-left: 15px">查询</el-button>
      <el-button type="primary" @click="dialogShow('add')">增加用户</el-button>
    </form-container>


    <el-table :data="list" class="_list"
              v-loading.body="$apollo.queries.list.loading" element-loading-text="Loading"
              fit highlight-current-row
    >
      <bos-table-column lable="编号" field="number" width="180"></bos-table-column>
      <bos-table-column lable="姓名" field="nickname"></bos-table-column>
      <bos-table-column lable="电话" field="phone"></bos-table-column>
      <bos-table-column lable="创建时间" field="createtime" width="200"
                        :filter="(row)=>formatTime(row.createtime)"
      ></bos-table-column>
      <bos-table-column lable="状态" field="disabled"
                        :filter="(row)=>adminStatus(row.disabled)"
      ></bos-table-column>
      <el-table-column label="操作" align="center" width="200">
        <template slot-scope="scope">
          <el-button type="text" size="mini" @click="dialogShow('modify',scope.row)">修改</el-button>
          <el-button type="text" size="mini" @click="deleteOne(scope.row)" class="_remote-tip">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <bos-paginator :pageInfo="paginator" @bosCurrentPageChanged="changePage"/>
    <field-dialog :title="title" ref="dialog" @confirm="dialogConfirm">
      <form-container ref="user" :model="user">
        <field-input v-model="user.nickname" label="姓名" width="10"
                     :rules="r(true).all(R.require)" prop="nickname"></field-input>
        <field-input v-model="user.phone" label="电话" width="10"
                     :rules="r(true).all(R.require)" prop="phone"></field-input>
        <field-input v-model="user.password" label="密码" width="10"
                     :rules="r(true).all(R.require)" prop="password"></field-input>
        <span v-text="'选择角色'" style="margin-left: 50px"></span>
        <div style="height: 20px"></div>
        <div v-for="(item,index) in user.roleItems" :key="index">
          <input style="margin-left: 50px" type="checkbox" v-model="item.chosen"></input>{{item.role.name}}
        </div>
      </form-container>
    </field-dialog>


  </div>
</template>

<script>


  import {filterAttr} from 'common/js'
  import {rules} from 'common/js/validate';
  import userApi from 'graph/user.graphql';
  /*import {historyPageMixin} from 'common/js/mixin';*/
  import {formRulesMixin} from '../../field/common/mixinComponent';


  export default {
    components: {},
    mixins: [formRulesMixin],
    data() {
      return {
        param: {
          namelike:'%%'
        },
        user: {},
        roleList:[],
        dialogType:''
      }
    },

    apollo: {
      list() {//loadingKey
        //created的时候会执行一次，context代表的是vm对象，调试时可以查阅代码：vue-apollo.esm.js:  options = options.call(context)
        return this.getEntityListWithPagintor(userApi.userList);
      }
    },
    computed: {
      isDialogAdd() {
        return this.dialogType === 'add' ? true : false;
      },
      title() {
        return this.dialogType === 'add' ? '添加用户' : '修改用户';
      }
    },
    created(){
      this.getRoleList()
    },

    methods: {
      formatTime(time) {
        if (time == null) return;
        return new Date(parseInt(time)).toLocaleString().replace(/:\d{1,2}$/, ' ');
      },
      adminStatus(disabled) {
        return disabled ? '删除' : "正常";
      },
      dialogShow(type, row) {
        let defultData = JSON.parse(JSON.stringify(this.roleList));
       if(type == 'add'){
          this.user = {}
        }else {
          this.user = JSON.parse(JSON.stringify(row));
          defultData.forEach((item)=>{
             this.user.roleItems.forEach((check)=>{
               if(item.role.id==check.role.id){
                 item.chosen = true;
               }
             })
           })
        }
        this.user.roleItems = defultData;
        this.dialogType = type;
        this.$refs.dialog.show();
      },
      getRoleList(){
        this.gqlQuery(userApi.getRoleList,'', (data)=>{
          data.forEach((item)=>{
            this.roleList.push({
              chosen:false,
              role:item
            })
          })
        },true)
      },
      dialogConfirm() {
        let user = this.handleUserData(this.user);
        this.gqlMutate(this.dialogType==='add'?userApi.userRegister:userApi.userUpdate,{user:user},function (data) {
          if(data){
            this.callback(`${this.title}成功`)
          }
        });
        this.$refs.dialog.hide();
      },
      handleUserData(userData){
        let user = {roleItems:[]};
        userData.roleItems.forEach((item)=>{
          if(item.chosen){
            user.roleItems.push({
              role:{
                id:item.role.id
              }
            })
          }
        });
        if(this.dialogType != 'add'){
          user.id = userData.id;
        }
        user.nickname = userData.nickname;
        user.phone = userData.phone;
        user.password = userData.password;
        return user;
      },
      deleteOne(row) {
      }
    }
  }
</script>

