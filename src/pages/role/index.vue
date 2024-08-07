<template>
  <div class="list-common-table">
    <t-form
      ref="form"
      :data="searchForm"
      :label-width="80"
      colon
      @reset="onReset"
      :style="{ marginBottom: '24px' }"
    >
      <t-row>
        <t-col :span="4">
          <t-row :gutter="[16, 24]">
            <t-col :flex="1">
              <t-form-item label="账号" name="userName">
                <t-input
                  v-model="searchForm.userName"
                  class="form-item-content"
                  type="search"
                  placeholder="请输入账号名称"
                  :style="{ minWidth: '134px' }"
                />
              </t-form-item>
            </t-col>
            <t-col :flex="1">
              <t-form-item label="权限" name="userType">
                <t-select
                  v-model="searchForm.userType"
                  class="form-item-content`"
                  :options="statusOptions"
                  placeholder="请选择权限"
                />
              </t-form-item>
            </t-col>
          </t-row>
        </t-col>
        <t-col :span="8" class="operation-container">
          <t-button theme="primary" @click="getList" :style="{ marginLeft: '8px' }"> 查询 </t-button>
          <t-button type="reset" variant="base" theme="default"> 重置 </t-button>
        </t-col>
      </t-row>
    </t-form>
    <t-row>
      <t-col :span="4">
        <t-button theme="primary" @click="openDialog"> 新增 </t-button>
      </t-col>
    </t-row>
    <div class="table-container">
      <t-table
        :data="tableList"
        :columns="columns"
        :rowKey="rowKey"
        :verticalAlign="verticalAlign"
        :hover="hover"
        height="calc(100vh - 320px)"
        :pagination="pagination"
        @page-change="rehandlePageChange"
        @change="rehandleChange"
        :loading="dataLoading"
        :headerAffixedTop="true"
        :headerAffixProps="{ offsetTop, container: getContainer }"
      >
        <template #userType="slotProps">
          <div>
            {{slotProps.row.userType==1?'超级管理员':slotProps.row.userType==2?'管理员':'运营人员'}}
          </div>
        </template>
        <template #op="slotProps">
          <div v-if="slotProps.row.userType!=1">
            <a class="t-button-link" @click="rehandleClickOp(slotProps)">权限变更</a>
            <a class="t-button-link" @click="rehandleClickLook(slotProps)">查看</a>
            <a class="t-button-link" @click="handleClickDelete(slotProps)">删除</a>
          </div>
        </template>
      </t-table>
      <t-dialog
        header="确认删除当前所选用户？"
        :body="confirmBody"
        :visible.sync="confirmVisible"
        @confirm="onConfirmDelete"
        :onCancel="onCancel"
      >
      </t-dialog>
      <!--  新增用户    -->
      <t-dialog placement="center" :header="dialogTitle" :visible="visibleCenter" :onClose="close" :footer="false">
        <t-form :data="formData" :rules="rules" ref="formData" @submit="onSubmit">
          <t-form-item label="用户名" help="请输入手机号" name="userName">
            <t-input v-model="formData.userName" :disabled="formDisabled" placeholder="请输入用户名"></t-input>
          </t-form-item>
          <t-form-item label="密码" name="userPass">
            <t-input type="password" v-model="formData.userPass" :disabled="formDisabled" placeholder="请输入密码"></t-input>
          </t-form-item>
          <t-form-item label="权限" name="userType">
            <t-select
              v-model="formData.userType"
              class="form-item-content`"
              :options="statusOptions"
              placeholder="请选择权限"
            />
          </t-form-item>
          <t-form-item style="margin-left: 100px">
            <t-space size="10px">
              <t-button theme="primary" type="submit">提交</t-button>
            </t-space>
          </t-form-item>
        </t-form>
      </t-dialog>
      <!--  查看用户    -->
      <t-dialog placement="center" header="查看" :visible="visibleLook" :onClose="close" :footer="false">
        <t-form :data="formData" @submit="close">
          <t-form-item label="用户名" name="userName">
            {{formData.userName}}
          </t-form-item>
          <t-form-item label="密码" name="userPass">
            {{formData.userPass}}
          </t-form-item>
          <t-form-item label="权限" name="userType">
           {{formData.userType==2?'管理员':'运营人员'}}
          </t-form-item>
          <t-form-item style="margin-left: 100px">
            <t-space size="10px">
              <t-button theme="primary" type="submit">关闭</t-button>
            </t-space>
          </t-form-item>
        </t-form>
      </t-dialog>
    </div>
  </div>
</template>
<script>
import {prefix} from '@/config/global';
import Trend from '@/components/trend/index.vue';

import {
  CONTRACT_STATUS,
  CONTRACT_STATUS_OPTIONS,
  CONTRACT_TYPES,
  CONTRACT_TYPE_OPTIONS,
  CONTRACT_PAYMENT_TYPES,
} from '@/constants';
import {addUser, getUserList, delUser, updateUser, selectUserPass} from "@/api/operation";
const TOTAL = 0
export default {
  name: 'list-role',
  components: {
    Trend,
  },
  data() {
    return {
      CONTRACT_STATUS,
      CONTRACT_STATUS_OPTIONS,
      CONTRACT_TYPES,
      CONTRACT_TYPE_OPTIONS,
      CONTRACT_PAYMENT_TYPES,
      prefix,
      searchForm: {
        userName: '',
        userType: undefined,
      },
      formData: {
        userName: '', // 用户名
        userType: undefined, // 角色
        userPass:"" // 密码
      },
      rules: {
        userName: [
          {
            required: true,
            message: '姓名必填',
            type: 'error',
            trigger: 'blur',
          },
          // trigger 默认为 'change'
          {required: true, message: '请输入账号', type: 'error'},
          {whitespace: true, message: '账号不能为空'},
          /*{
            len: 10,
            message: '10个字以内',
            type: 'warning',
            trigger: 'blur',
          },*/
        ],
        userPass: [
          { required: true, message: '请输入密码', type: 'error' },
          // { len: 8, message: '请输入 8 位密码', type: 'warning' },
          // { pattern: /[A-Z]+/, message: '密码必须包含大写字母', type: 'warning' },
        ],
        userType: [
          { required: true, message: '请选择用户角色', type: 'error' },
        ],
      },
      statusOptions:[
        {
          label: '管理员',
          value: 2,
        },
        {
          label: '运营人员',
          value: 3,
        }
      ],
      tableList: [],
      visibleCenter: false,
      visibleLook: false,
      dataLoading: false,
      formDisabled:false,
      value: 'first',
      columns: [
        {
          title: '序号',
          fixed: 'left',
          width: 200,
          align: 'left',
          ellipsis: true,
          colKey: 'serial-number',
        },

        {
          title: '账号',
          width: 200,
          ellipsis: true,
          colKey: 'userName',
        },
        {
          title: '密码',
          width: 200,
          ellipsis: true,
          colKey: 'userPass',
        },
        {title: '权限', colKey: 'userType', width: 200, cell: {col: 'status'}},
        {
          align: 'left',
          fixed: 'right',
          width: 200,
          colKey: 'op',
          title: '操作',
        },
      ],
      rowKey: 'index',
      tableLayout: 'auto',
      verticalAlign: 'top',
      dialogTitle: '',
      bordered: true,
      hover: true,
      rowClassName: (rowKey) => `${rowKey}-class`,
      // 与pagination对齐
      pagination: {
        defaultPageSize: 10,
        // total: TOTAL,
        defaultCurrent: 1,
      },
      confirmVisible: false,
      deleteIdx: -1,
    };
  },
  computed: {
    confirmBody() {
      if (this.deleteIdx > -1) {
        const {name} = this.data?.[this.deleteIdx];
        return `删除后，${name}的所有合同信息将被清空，且无法恢复`;
      }
      return '';
    },
    offsetTop() {
      return this.$store.state.setting.isUseTabsRouter ? 48 : 0;
    },
  },
  mounted() {
    this.getList()

  },
  methods: {
    getList(){
      this.dataLoading = true;
      const that = this
      getUserList({
        pages: that.pagination.defaultCurrent,
        pageSize: that.pagination.defaultPageSize,
        userName: that.searchForm.userName,
        userType: that.searchForm.userType,
      }).then(res => {
        const list = res.resultBody;
        that.pagination.total = parseInt(res.totalRows)
        that.tableList = list;
      }).catch((e) => {
        console.log(e);
      }).finally(() => {
        this.dataLoading = false;
      });
    },
    onReset(){
      this.pagination.defaultCurrent = 1
      this.getList()
    },
    openDialog(){
      this.dialogTitle = "新增用户"
      this.formData.userCode = null
      this.$refs.formData.reset();
      this.formDisabled = false
      this.visibleCenter = true
    },
    close(){
      this.$refs.formData.reset();
      this.visibleCenter = false
      this.visibleLook = false
    },
    onSubmit({ validateResult, firstError }) {
      const that = this
      if (validateResult === true) {
        let request = addUser
        if(this.formData.userCode){
          request = updateUser
        }else{
          request = addUser
        }
        request(this.formData).then(res => {
          if(res.status){
            that.$refs.formData.reset();
            that.visibleCenter = false
            this.$refs.formData.reset();
            that.getList()
            this.$message.success(res.msg);
          }
        }).catch((e) => {
          console.log(e);
        }).finally(() => {
          this.dataLoading = false;
        });
      } else {
        console.log('Errors: ', validateResult);
        this.$message.warning(firstError);
      }
    },
    getContainer() {
      return document.querySelector('.tdesign-starter-layout');
    },
    rehandlePageChange(curr, pageInfo) {
      console.log('分页变化', curr, pageInfo);
      this.pagination.defaultCurrent = curr.current
      this.getList()
    },
    rehandleChange(changeParams, triggerAndData) {
      console.log('统一Change', changeParams, triggerAndData);
    },
    // 权限变更
    rehandleClickOp({text, row}) {
      console.log(text, row);
      this.formData = JSON.parse(JSON.stringify(row))
      this.dialogTitle = '权限变更'
      this.formDisabled = true
      this.visibleCenter = true
    },
    // 查看
    rehandleClickLook({text, row}) {
      console.log(text, row);

      selectUserPass({
        userCode: row.userCode,
      }).then(res => {
        if(res.status){
          this.formData = JSON.parse(JSON.stringify(row))
          this.formData.userPass = res.msg
          this.visibleLook = true
        }
      }).catch((e) => {
        console.log(e);
      }).finally(() => {

      });
    },
    handleClickDelete(row) {
      console.log(row)
      this.deleteIdx = row.row.userCode;
      this.confirmVisible = true;
    },
    onConfirmDelete() {
      // 真实业务请发起请求
      const that = this
      delUser({
        userCode: that.deleteIdx,
      }).then(res => {
        if(res.status){
          this.confirmVisible = false;
          this.$message.success('删除成功');
          this.getList()
        }

      }).catch((e) => {
        console.log(e);
      }).finally(() => {

      });
      this.resetIdx();
    },
    onCancel() {
      this.resetIdx();
    },
    resetIdx() {
      this.deleteIdx = -1;
    },
  },
};
</script>

<style lang="less" scoped>
@import '@/style/variables.less';

.list-common-table {
  background-color: var(--td-bg-color-container);
  padding: 30px 32px;
  border-radius: var(--td-radius-default);

  .t-table__content{
    height: calc(100% - 300px);
  }
}

.form-item-content {
  width: 100%;
}

.operation-container {
  display: flex;
  justify-content: flex-end;
  align-items: center;
}

.payment-col {
  display: flex;

  .trend-container {
    display: flex;
    align-items: center;
    margin-left: 8px;
  }
}

.t-button + .t-button {
  margin-left: var(--td-comp-margin-s);
}
</style>
