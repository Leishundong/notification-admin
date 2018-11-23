<template>
  <div class="app-container">


    <form-container :model="param" class="_search">
      <field-input class="searchInput" label="搜索关键字" :wrapforlike="true" v-model="param.namelike"></field-input>
      <el-button type="primary" style="margin-left: 15px">查询</el-button>
      <el-button type="primary" @click="dialogShow('add')">增加角色</el-button>
    </form-container>


    <el-table :data="list" class="_list"
              v-loading.body="$apollo.queries.list.loading" element-loading-text="Loading"
              fit highlight-current-row
    >
      <bos-table-column lable="编号" field="number" width="180"></bos-table-column>
      <bos-table-column lable="角色名" field="name"></bos-table-column>
      <bos-table-column lable="创建时间" field="createtime" width="200"
                        :filter="(row)=>formatTime(row.createtime)"
      ></bos-table-column>
      <bos-table-column lable="状态" field="disabled"
                        :filter="(row)=>adminStatus(row.disabled)"
      ></bos-table-column>
      <el-table-column label="操作" align="center" width="200">
        <template slot-scope="scope">
          <el-button type="text" size="mini" @click="dialogShow('edit',scope.row)">修改</el-button>
          <el-button type="text" size="mini" @click="deleteOne(scope.row)" class="_remote-tip">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <bos-paginator :pageInfo="paginator" @bosCurrentPageChanged="changePage"/>
    <field-dialog :title="title" ref="dialog" @confirm="dialogConfirm">
      <form-container ref="role" :model="role">
        <field-input v-model="role.name" label="角色名" width="10"
                     :rules="r(true).all(R.require)" prop="name"></field-input>
        <span v-text="'选择权限'" style="margin-left: 50px"></span>
        <div style="height: 20px"></div>
        <div v-for="(item,index) in role.privilegeItems" :key="index">
          <input style="margin-left: 50px" type="checkbox" v-model="item.chosen"></input>{{item.privilege.name}}
          <field-input v-model="item.constraintRule" width="6"></field-input>
        </div>
      </form-container>
    </field-dialog>


  </div>
</template>

<script>


  import {filterAttr} from 'common/js'
  import {rules} from 'common/js/validate';
  import roleApi from 'graph/role.graphql';
  import {formRulesMixin} from '../../field/common/mixinComponent'
  export default {
    mixins: [formRulesMixin],
    data() {
      return {
        param: {
          namelike: '%%'
        },
        jurisdictionList: [],
        role: {},
        dialogType:''
      }
    },

    apollo: {
      list() {//loadingKey
        //created的时候会执行一次，context代表的是vm对象，调试时可以查阅代码：vue-apollo.esm.js:  options = options.call(context)
        return this.getEntityListWithPagintor(roleApi.RoleList);
      }
    },
    computed: {
        isDialogAdd() {
          return this.dialogType === 'add' ? true : false;
        },
        title(){
          return this.dialogType === 'add' ? '添加角色' : '修改角色';
        }
      },


    created() {
      this.gqlQuery(roleApi.PrivilegeList, {paginator: {page: 1, size: 50}}, function (data) {
         data.forEach((item)=>{
          this.jurisdictionList.push({
            id:'',
            chosen:false,
            constraintRule:'',
            privilege:item
          })
        });
      }, true);
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
        let defuleRule = JSON.parse(JSON.stringify(this.jurisdictionList));
        console.log(defuleRule);
        if(type=='add'){
          this.role={}
        }else{
          defuleRule.forEach((item)=>{
            JSON.parse(JSON.stringify(row)).privilegeItems.forEach((check)=>{
              if(item.privilege.name==check.privilege.name){
                item.chosen = true;
                item.id = check.id;
                item.constraintRule = check.constraintRule
              }
            })
          });
          this.role = JSON.parse(JSON.stringify(row));
        }
        this.role.privilegeItems = defuleRule;
        this.dialogType = type;
        this.$refs.dialog.show();
      },
      dialogConfirm() {
        let roles = {};
        let privilege=[];
        this.role.privilegeItems.forEach((item)=>{
          if(item.chosen){
            privilege.push({
              constraintRule: item.constraintRule,
              privilege: {id: item.privilege.id,}
            })
          }
        });
        roles.name = this.role.name;
        roles.id = this.role.id;
        roles.privilegeItems = privilege;
        this.gqlMutate(this.dialogType='add'?roleApi.roleAdd:roleApi.updateRole, {role: roles}, () => {
          this.callback(`${this.title}成功`);
          this.$refs.dialog.hide();
        })
      },

      removeTypename(obj) {
        if (!(obj instanceof Object)) {
          return;
        }
        if (obj["__typename"]) {
          delete obj["__typename"];
        }
        var arr = Object.keys(obj);
        for (var i = 0; i < arr.length; i++) {
          this.removeTypename(obj[arr[i]]);
        }
      },

      deleteOne(row) {
        let item = JSON.parse(JSON.stringify(row));
        item.disabled = true;
        this.gqlMutate(api.editAdminist, {
          administ: filterAttr(item)
        }, () => {
          this.callback('删除成功')
        })
      }
    }
  }
</script>

