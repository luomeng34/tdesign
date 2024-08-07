<template>
  <div class="list-common-table">
    <t-form :data="survey" :rules="rules" ref="survey" @submit="onSurveySubmit">
      <t-form-item label="标题" name="intentionTitle">
        <t-input v-model="survey.intentionTitle" :disabled="disableSur" placeholder="请输入名称"></t-input>
      </t-form-item>
      <t-form-item label="副标题" name="intentionSubtitle">
        <t-input v-model="survey.intentionSubtitle" :disabled="disableSur" placeholder="请输入名称"></t-input>
      </t-form-item>
      <t-form-item style="margin-left: 100px">
        <t-space size="10px">
          <t-button v-if="!disableSur" theme="primary" type="submit">提交</t-button>
        </t-space>
      </t-form-item>
    </t-form>
    <t-button style="margin-left: 100px" v-if="disableSur" theme="primary" @click="edit">编辑</t-button>
    <t-form
      ref="form"
      :data="searchForm"
      :label-width="80"
      colon
      @reset="onReset"
      :style="{ marginBottom: '24px',marginTop: '24px' }"
    >
      <t-row>
        <t-col :span="4">
          <t-row :gutter="[16, 24]">
            <t-col :flex="1">
              <t-form-item label="标题" name="itemQuestion">
                <t-input
                  v-model="searchForm.itemQuestion"
                  class="form-item-content"
                  type="search"
                  placeholder="请输入标题"
                  :style="{ minWidth: '134px' }"
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
        <t-button theme="primary" @click="openDialog"> 新增</t-button>
      </t-col>
    </t-row>

    <div class="table-container">
      <t-table
        :data="tableList"
        :columns="columns"
        :rowKey="rowKey"
        :hover="hover"
        height="calc(100vh - 320px)"
        :pagination="paginationInfo"
        @page-change="rehandlePageChange"
        @change="rehandleChange"
        :loading="dataLoading"
        :headerAffixedTop="true"
        :headerAffixProps="{ offsetTop, container: getContainer }"
      >
        <template #itemStatusStr="slotProps">
          <div>
            {{slotProps.row.itemStatusStr}}
          </div>
        </template>
        <template #op="slotProps">
          <a class="t-button-link" v-if="slotProps.row.itemStatus == 1" @click="handleClickStatus(slotProps,2)">下架</a>
          <a class="t-button-link" v-else @click="handleClickStatus(slotProps,1)">上架</a>
          <a class="t-button-link" v-if="slotProps.row.itemStatus == 2" @click="rehandleClickOp(slotProps)">编辑</a>
          <a class="t-button-link" @click="rehandleClickLook(slotProps)">查看</a>
          <a class="t-button-link" v-if="slotProps.row.itemStatus == 2" @click="handleClickDelete(slotProps)">删除</a>
        </template>
      </t-table>
      <t-dialog
        header="确认删除当前所选问题？"
        :visible.sync="confirmVisible"
        @confirm="onConfirmDelete"
        :onCancel="onCancel"
      >
      </t-dialog>
      <!--  上下架    -->
      <t-dialog
        :header="statusHeader"
        :visible.sync="statusVisible"
        @confirm="onConfirmStatus"
        :onCancel="onCancel"
      >
      </t-dialog>
      <!--  新增用户    -->
      <t-dialog placement="center" :header="dialogTitle" :visible="visibleCenter" :onClose="close" :footer="false">
        <t-form :data="formData" :rules="rules" ref="formData" @submit="onSubmit">
          <t-form-item label="序号" name="itemNum">
            <t-input-number decimalPlaces="0" v-model="formData.itemNum" placeholder="请输入名称"></t-input-number>
          </t-form-item>
          <t-form-item label="问题" name="itemQuestion">
            <t-input v-model="formData.itemQuestion" placeholder="请输入问题"></t-input>
          </t-form-item>
          <t-form-item style="margin-left: 100px">
            <t-space size="10px">
              <t-button theme="primary" type="submit">提交</t-button>
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
import UploadFile from "@/components/uploadFile/index.vue";
import {
  delQuestionnaireItem, getIntentionInfo, getQuestionnaireItemList, saveIntentionTitle,
saveQuestionnaireItem,
  updateQuestionnaireItemStatus,
} from "@/api/operation";

export default {
  name: 'banner',
  components: {
    Trend,
    UploadFile
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
        bannerName: '',
        bannerStatus: undefined,
      },
      formData: {
        itemNum: '', // 名
        itemQuestion:"" // 密码
      },
      rules: {
        itemNum: [
          {
            required: true,
            message: '请输入序号',
            type: 'error',
            trigger: 'blur',
          },
        ],
        itemQuestion: [
          { required: true, message: '请输入问题', type: 'error' },
        ],
      },
      statusOptions:[
        {
          label: '上架',
          value: '1',
        },
        {
          label: '下架',
          value: '2',
        }
      ],
      tableList: [],
      visibleCenter: false,
      dialogTitle: '',
      dataLoading: false,
      value: 'first',
      columns: [
        {
          title: '序号',
          fixed: 'left',
          width: 200,
          align: 'left',
          ellipsis: true,
          colKey: 'itemNum',
        },

        {
          title: '问题',
          width: 200,
          ellipsis: true,
          colKey: 'itemQuestion',
        },
        {title: '状态', colKey: 'itemStatusStr', width: 200, cell: {col: 'status'}},
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
      bordered: true,
      hover: true,
      rowClassName: (rowKey) => `${rowKey}-class`,
      // 与pagination对齐
      paginationInfo: {
        defaultPageSize: 10,
        // total: 0,
        defaultCurrent: 1,
      },
      confirmVisible: false,
      deleteIdx: -1,
      survey:{
        intentionTitle:"",
        intentionSubtitle:''
      },
      disableSur:true,
      statusHeader:"",
      statusVisible: false,
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
    this.init()
  },
  methods: {
    init(){
      getIntentionInfo({}).then(res=>{
        this.survey = res.data
        // this.getList(res.data.questionnaireCode)
      })
    },
    getList(code){
      this.dataLoading = true;
      const that = this
      getQuestionnaireItemList({
        pages: that.paginationInfo.defaultCurrent,
        pageSize: that.paginationInfo.defaultPageSize,
        questionnaireCode: this.survey.questionnaireCode,
        itemQuestion: this.searchForm.itemQuestion,
      }).then(res => {
        const list = res.resultBody;
        that.tableList = list;
        that.paginationInfo.total = parseInt(res.totalRows)
      }).catch((e) => {
        console.log(e);
      }).finally(() => {
        this.dataLoading = false;
      });
    },
    onReset(){
      this.paginationInfo.defaultCurrent = 1
      this.getList()
    },
    close(){
      this.$refs.formData.reset();
      this.visibleCenter = false
    },
    openDialog() {
      this.dialogTitle = "新增"
      this.$refs.formData.reset();
      this.visibleCenter = true
    },
    onSubmit({ validateResult, firstError }) {
      const that = this
      if (validateResult === true) {
        saveQuestionnaireItem({
          questionnaireCode:this.survey.questionnaireCode,
          itemQuestion:this.formData.itemQuestion,
          itemNum: this.formData.itemNum,
          itemCode:this.formData.itemCode?this.formData.itemCode:null,
        }).then(res => {
          if(res.status){
            that.$refs.formData.reset();
            that.visibleCenter = false
            that.getList()
            this.$message.success('保存成功');
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
    edit(){
      this.disableSur = false
    },
    onSurveySubmit({ validateResult, firstError }) {
      const that = this
      if (validateResult === true) {
        saveIntentionTitle(this.survey).then(res => {
          if(res.status){
            that.$refs.survey.reset();
            this.init()
            this.disableSur = true
            this.$message.success('保存成功');
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
    },
    rehandleChange(changeParams, triggerAndData) {
      console.log('统一Change', changeParams, triggerAndData);
    },
    rehandleClickOp({text, row}) {
      this.formData.itemCode = row.itemCode;
      this.formData.itemNum = row.itemNum;
      this.formData.itemQuestion = row.itemQuestion;
      this.dialogTitle = "编辑"
      this.visibleCenter = true;
    },
    // 删除弹窗
    handleClickDelete(row) {
      console.log(row)
      this.deleteIdx = row.row.itemCode;
      this.confirmVisible = true;
    },
    // 删除确认
    onConfirmDelete() {
      // 真实业务请发起请求
      const that = this
      delQuestionnaireItem({
        itemCode: that.deleteIdx,
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
    // 上下架弹窗
    handleClickStatus(row,status) {
      console.log(row)
      this.statusHeader = '确定' + (status == 1? '上架':'下架') +'所选信息吗'
      this.deleteIdx = row.row.itemCode;
      this.status = status
      this.statusVisible = true;
    },
    // 上下架确认
    onConfirmStatus() {
      // 真实业务请发起请求
      const that = this
      updateQuestionnaireItemStatus({
        itemCode: that.deleteIdx,
        itemStatus: that.status,
      }).then(res => {
        if(res.status){
          this.statusVisible = false;
          this.$message.success('操作成功');
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
