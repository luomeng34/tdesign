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
              <t-form-item label="资讯名称" name="reviewName">
                <t-input
                  v-model="searchForm.reviewName"
                  class="form-item-content"
                  type="search"
                  placeholder="请输入资讯名称"
                  :style="{ minWidth: '134px' }"
                />
              </t-form-item>
            </t-col>
            <t-col :flex="1">
              <t-form-item label="状态" name="reviewStatus">
                <t-select
                  v-model="searchForm.reviewStatus"
                  class="form-item-content`"
                  :options="statusOptions"
                  placeholder="请选择状态"
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
        :hover="hover"
        height="calc(100vh - 320px)"
        :pagination="paginationInfo"
        @page-change="rehandlePageChange"
        @change="rehandleChange"
        :loading="dataLoading"
        :headerAffixedTop="true"
        :headerAffixProps="{ offsetTop, container: getContainer }"
      >

        <template #reviewCoverUrl="slotProps">
          <div>
            <t-image :src="slotProps.row.reviewCoverUrl" :style="{ width: '200px', height: '120px' }" ></t-image>
          </div>
        </template>
        <template #op="slotProps">
          <a class="t-button-link" v-if="slotProps.row.reviewStatus == 1" @click="handleClickStatus(slotProps,2)">下架</a>
          <a class="t-button-link" v-else @click="handleClickStatus(slotProps,1)">上架</a>
          <a class="t-button-link"  v-if="slotProps.row.reviewStatus == 2" @click="rehandleClickOp(slotProps)">编辑</a>
          <a class="t-button-link" @click="rehandleClickLook(slotProps)">查看</a>
          <a class="t-button-link"  v-if="slotProps.row.reviewStatus == 2" @click="handleClickDelete(slotProps)">删除</a>
        </template>
      </t-table>
      <t-dialog
        header="确认删除当前所选信息？"
        :body="confirmBody"
        :visible.sync="confirmVisible"
        @confirm="onConfirmDelete"
        :onCancel="onCancel"
      >
      </t-dialog>

      <t-dialog
        :header="statusHeader"
        :visible.sync="statusVisible"
        @confirm="onConfirmStatus"
        :onCancel="onCancel"
      >
      </t-dialog>
      <!--  新增用户    -->
      <t-dialog placement="center" width="50%" :header="dialogTitle" :visible="visibleCenter" :onClose="close" :footer="false">
        <t-form :data="formData" :rules="rules" ref="formData" @submit="onSubmit">
          <t-form-item label="名称" name="reviewName">
            <t-input v-model="formData.reviewName" placeholder="请输入名称"></t-input>
          </t-form-item>
          <t-form-item label="封面图" name="reviewCoverUrl">
            <upload-file  @uploadChange="uploadChange" :value="formData.reviewCoverUrl"></upload-file>
          </t-form-item>
          <t-form-item label="标题" name="reviewTitle">
            <t-input v-model="formData.reviewTitle" placeholder="请输入名称"></t-input>
          </t-form-item>
          <t-form-item label="地址" name="reviewAddr">
            <t-input v-model="formData.reviewAddr" placeholder="请输入名称"></t-input>
          </t-form-item>
          <t-form-item label="时间" name="reviewTime">
            <t-date-picker v-model="formData.reviewTime" allow-input clearable  format="YYYY-MM-DD" />
          </t-form-item>
          <t-form-item label="参会人数" name="reviewUserNum">
            <t-input v-model="formData.reviewUserNum" placeholder="请输入名称"></t-input>
          </t-form-item>
          <t-form-item label="宣传图" name="reviewBillboardUrl">
            <upload-file @uploadChange="uploadChange2" :value="formData.reviewBillboardUrl"></upload-file>
          </t-form-item>
          <t-form-item label="宣传视频" name="reviewBillboardVideo">
            <upload-file accept="video/*" themeType="file" :limit="limitS"  @uploadChange="uploadChangeVideo" :value="formData.reviewBillboardVideo"></upload-file>
          </t-form-item>
          <t-form-item label="大会总结" name="reviewSummary">
            <t-textarea
              v-model="formData.reviewSummary"
              placeholder="请输入简介"
              name="description"
              :autosize="{ minRows: 3, maxRows: 5 }"
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
      <t-dialog placement="center" width="50%" header="查看" :visible="visibleLook" :onClose="close" :footer="false">
        <t-form :data="formData" @submit="close">
          <t-form-item label="名称" name="reviewName">
            {{formData.reviewName}}
          </t-form-item>
          <t-form-item label="封面图片" name="reviewCoverUrl">
            <upload-file :disabled="true" :value="formData.reviewCoverUrl"></upload-file>
          </t-form-item>
          <t-form-item label="标题" name="reviewTitle">
            {{formData.reviewTitle}}
          </t-form-item>
          <t-form-item label="地址" name="reviewAddr">
            {{formData.reviewAddr}}
          </t-form-item>
          <t-form-item label="时间" name="reviewTime">
            {{formData.reviewTime}}
          </t-form-item>
          <t-form-item label="参会人数" name="reviewUserNum">
            {{formData.reviewUserNum}}人
          </t-form-item>
          <t-form-item label="宣传图" name="reviewBillboardUrl">
            <upload-file :disabled="true" :value="formData.reviewBillboardUrl"></upload-file>
          </t-form-item>
          <t-form-item label="宣传视频" name="reviewBillboardVideo">
            <video :src="formData.reviewBillboardVideo" controls autoplay style="height: 200px"> </video>

          </t-form-item>
          <t-form-item label="大会总结" name="reviewSummary">
            {{formData.reviewSummary}}
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
import {
  delReview, getReviewInfo,
  getReviewList,
  saveReview,
  updateReviewStatus
} from "@/api/operation";
import UploadFile from "@/components/uploadFile/index.vue";

export default {
  name: 'list-table',
  components: {
    UploadFile,
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
      limitS:{
        size: 800,
        unit: 'MB'
      },
      searchForm: {
        reviewName: '',
        reviewStatus: undefined,
      },
      statusOptions:[
        {
          label: '下架',
          value: '2',
        },
        {
          label: '上架',
          value: '1',
        }
      ],
      tableList: [],
      dataLoading: false,
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
          title: '名称',
          width: 200,
          ellipsis: true,
          colKey: 'reviewName',
        },
        {
          title: '封面图',
          width: 200,
          ellipsis: true,
          colKey: 'reviewCoverUrl',
        },
        {title: '状态', colKey: 'reviewStatusStr', width: 200, cell: {col: 'status'}},
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
      visibleCenter: false,
      visibleLook: false,
      dialogTitle: '',
      formData: {
        reviewAddr: '', // 回顾地址
        reviewBillboardUrl: [], // 宣传图
        reviewBillboardVideo: [], // 宣传视频
        reviewName: "", // 回顾名称
        reviewSummary: "", // 大会总结
        reviewTime: "", // 回顾时间
        reviewTitle: "", // 回顾标题
        reviewUserNum: "", // 参会人员
        reviewCoverUrl:[] // 回顾封面图
      },
      rules: {
        newsTitle: [
          {
            required: true,
            message: '请输入名称',
            type: 'error',
            trigger: 'blur',
          },
        ],
        // newsUrls: [
        //   { required: true, message: '请上传图片', type: 'error',trigger: 'change'},
        // ],
        newsIntroduce: [
          { required: true, message: '请上传图片', type: 'error',trigger: 'change' },
        ],
      },
      statusHeader:'',
      statusVisible:false
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
      getReviewList({
        pages: that.paginationInfo.defaultCurrent,
        pageSize: that.paginationInfo.defaultPageSize,
        reviewName: that.searchForm.reviewName,
        reviewStatus: that.searchForm.reviewStatus,
      }).then(res => {
        const list = res.resultBody;
        this.tableList = list;
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
    getContainer() {
      return document.querySelector('.tdesign-starter-layout');
    },
    openDialog(){
      this.dialogTitle = "新增资讯"
      this.$refs.formData.reset();
      this.visibleCenter = true
    },
    close(){
      this.$refs.formData.reset();
      this.visibleCenter = false
      this.visibleLook = false
    },
    // 名称
    uploadChange(file){
      this.formData.reviewCoverUrl = file
    },
    // 封面图
    uploadChange2(file){
      this.formData.reviewBillboardUrl = file
    },
    // 宣传视频
    uploadChangeVideo(file){
      this.formData.reviewBillboardVideo = file
    },
    onSubmit({ validateResult, firstError }) {
      const that = this
      if (validateResult === true) {
        const form = JSON.parse(JSON.stringify(this.formData)) ;
        console.log(this.formData.reviewBillboardVideo)
        form.reviewCode = form.reviewCode?form.reviewCode:null // 密码
        form.reviewBillboardUrl = this.formData.reviewBillboardUrl?this.formData.reviewBillboardUrl[0].url:''
        form.reviewCoverUrl = this.formData.reviewCoverUrl[0]?this.formData.reviewCoverUrl[0].url:''
        form.reviewBillboardVideo = this.formData.reviewBillboardVideo[0]?this.formData.reviewBillboardVideo[0].url:''
        saveReview(form).then(res => {
          if(res.status){
            that.$refs.formData.reset();
            that.visibleCenter = false
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
    rehandlePageChange(curr, pageInfo) {
      console.log('分页变化', curr, pageInfo);
      this.paginationInfo.defaultCurrent = curr.current
      this.getList()
    },
    rehandleChange(changeParams, triggerAndData) {
      console.log('统一Change', changeParams, triggerAndData);
    },
    rehandleClickOp({text, row}) {
      console.log(text, row);
      this.getReviewInfo(row.reviewCode,1)
      this.visibleCenter = true
    },
    rehandleClickLook({text, row}) {
      console.log(text, row);
      this.getReviewInfo(row.reviewCode)

      this.visibleLook = true
    },
    getReviewInfo(code,type){
      getReviewInfo({
        reviewCode: code,
      }).then(res => {
        if(res.status){
          this.formData = res.data
          this.formData.reviewCoverUrl = [{url: res.data.reviewCoverUrl}]
          this.formData.reviewBillboardUrl = [{url: res.data.reviewBillboardUrl}]
          if(type == 1){
            this.formData.reviewBillboardVideo = [{name:'video',url: res.data.reviewBillboardVideo}]
          }
        }
      }).catch((e) => {
        console.log(e);
      })
    },
    // 上下架弹窗
    handleClickStatus(row,status) {
      console.log(row)
      this.statusHeader = '确定' + (status == 1? '上架':'下架') +'所选信息吗'
      this.deleteIdx = row.row.reviewCode;
      this.status = status
      this.statusVisible = true;
    },
    // 上下架确认
    onConfirmStatus() {
      // 真实业务请发起请求
      const that = this
      updateReviewStatus({
        reviewCode: that.deleteIdx,
        reviewStatus: that.status,
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
    handleClickDelete(row) {
      this.deleteIdx = row.row.reviewCode;
      this.confirmVisible = true;
    },
    onConfirmDelete() {
      // 真实业务请发起请求delNews
      delReview({
        reviewCode: this.deleteIdx,
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

  .t-table__content {
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
