<template>
  <div class="app-container">
    <form-container :model="param" class="_search">
      <field-input class="searchInput" label="搜索关键字" :wrapforlike="true" v-model="param.namelike"></field-input>
      <el-button type="primary" style="margin-left: 15px">查询</el-button>
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
          <el-button type="text" size="mini" v-if="read(scope.row)" @click="dialogShow(scope.row)">阅读</el-button>
        </template>
      </el-table-column>
    </el-table>
    <bos-paginator :pageInfo="paginator" @bosCurrentPageChanged="changePage"/>
  </div>
</template>

<script>


  import {filterAttr} from 'common/js'
  import {rules} from 'common/js/validate';
  import api from 'graph/msg.graphql';
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
        return this.getEntityListWithPagintor(api.messageList1);
      }
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

      dialogShow(row) {
        console.log(row);
        this.gqlMutate(api.userReaded, {
          messageId: row.id,
          userId: JSON.parse(localStorage.getItem('information')).id
        }, function (data) {
          this.callback('已经阅读');
        })
      },
      read(row) {
        let a;
        row.receivers.some((value) => {
          if (value.user.id === JSON.parse(localStorage.getItem('information')).id) {
            a = !(value.readed);
            return true
          }
        });
        return a
      }
    }
  }
</script>

