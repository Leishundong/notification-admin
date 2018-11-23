<template>
  <div class="app-container">


    <form-container :model="param" class="_search">
      <field-input class="searchInput" label="搜索关键字" :wrapforlike="true" v-model="param.namelike"></field-input>
      <el-button type="primary" style="margin-left: 15px">查询</el-button>
      <el-button type="primary" @click="dialogShow1('add')">增加消息</el-button>
    </form-container>


    <el-table :data="list" class="_list"
              v-loading.body="$apollo.queries.list.loading" element-loading-text="Loading"
              fit highlight-current-row
    >
      <bos-table-column lable="编号" field="number" width="180"></bos-table-column>
      <bos-table-column lable="标题" field="title"></bos-table-column>
      <bos-table-column lable="发送人" field="sendUser.nickname"></bos-table-column>
      <bos-table-column lable="内容" field="content"></bos-table-column>
      <bos-table-column lable="创建时间" field="createtime" width="200"
                        :filter="(row)=>formatTime(row.createtime)"
      ></bos-table-column>
      <bos-table-column lable="状态" field="disabled"
                        :filter="(row)=>adminStatus(row.disabled)"
      ></bos-table-column>
      <el-table-column label="操作" align="center" width="200">
        <template slot-scope="scope">
          <el-button type="text" size="mini" @click="dialogShow(scope.row)">查看</el-button>
          <el-button type="text" size="mini" @click="deleteOne(scope.row)" class="_remote-tip">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <bos-paginator :pageInfo="paginator" @bosCurrentPageChanged="changePage"/>

    <field-dialog title="查看收件人" ref="dialog" @confirm="dialogConfirm">
      <el-table :data="receivers" class="_list">
        <bos-table-column lable="编号" field="user.id"></bos-table-column>
        <bos-table-column lable="姓名" field="user.nickname"></bos-table-column>
        <bos-table-column lable="手机" field="user.phone"></bos-table-column>
        <bos-table-column lable="读否" field="readed"
                          :filter="(row)=>read(row.readed)"
        ></bos-table-column>
      </el-table>
    </field-dialog>

    <field-dialog title="添加信息" ref="dialog1" @confirm="dialogConfirm1">
      <form-container ref="msg" :model="msg">
        <field-input v-model="msg.title" label="标题" width="10"
                     :rules="r(true).all(R.require)" prop="title"></field-input>
        <field-input v-model="msg.content" label="内容" width="10"
                     :rules="r(true).all(R.require)" prop="content"></field-input>
        <el-form-item label=通讯录 label-width="120px">
          <el-checkbox-group v-model="qaq">
            <el-checkbox v-for="(item) in userList" :label="item.id" :key="item.id">{{item.nickname}}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </form-container>
    </field-dialog>


  </div>
</template>

<script>


  import {filterAttr} from 'common/js'
  import {rules} from 'common/js/validate';
  import api from 'graph/msg.graphql';
  import api1 from 'graph/user.graphql';
  import {historyPageMixin} from 'common/js/mixin';
  import {formRulesMixin, extendRules} from '../../field/common/mixinComponent';

  export default {
    components: {},
    mixins: [formRulesMixin],
    data() {
      return {
        param: {
          namelike: '%%',
          sendUser: JSON.parse(localStorage.getItem('information')).id
        },
        receivers: [],
        msg: {},
        userList: [],
        qaq: [],
      }
    },

    apollo: {
      list() {//loadingKey
        //created的时候会执行一次，context代表的是vm对象，调试时可以查阅代码：vue-apollo.esm.js:  options = options.call(context)
        return this.getEntityListWithPagintor(api.messageList);
      }
    },
    created() {
      this.gqlQuery(api1.userListNoQuery, {paginator: {page: 1, size: 50}}, function (data) {
        console.log(data);
        data.forEach((value, index) => {
          if (value.id === JSON.parse(localStorage.getItem('information')).id) {
            data.splice(index, 1);
          }
        });
        this.userList = data;

      }, true);
    },
    computed: {
      isDialogAdd() {
        return this.dialogType === 'add' ? true : false;
      },
    },


    methods: {
      formatTime(time) {
        if (time == null) return;
        return new Date(parseInt(time)).toLocaleString().replace(/:\d{1,2}$/, ' ');
      },

      adminStatus(disabled) {
        return disabled ? '删除' : "正常";
      },
      read(disabled) {
        return disabled === true ? '已读' : '未读'
      },
      dialogShow(row) {
        this.receivers = row.receivers;
        this.$refs.dialog.show();
      },
      dialogShow1(row) {
        this.$refs.dialog1.show();
      },
      dialogConfirm() {
        this.$refs.dialog.hide();
      },
      dialogConfirm1() {
        this.msg['receivers'] = [];
        this.msg['sendUser'] = {id: JSON.parse(localStorage.getItem('information')).id};
        this.qaq.forEach((value) => {
          this.msg.receivers.push({user: {id: value}})
        });
        this.$refs.msg.gqlValidate(api.sendMessage, {message: this.msg}, () => {
          this.callback(`发送成功`);
          this.$refs.dialog.hide();
        });
      },
      deleteOne(row) {
      }
    }
  }
</script>

