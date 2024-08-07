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
              <t-form-item label="名称" name="bannerName">
                <t-input
                  v-model="searchForm.bannerName"
                  class="form-item-content"
                  type="search"
                  placeholder="请输入名称"
                  :style="{ minWidth: '134px' }"
                />
              </t-form-item>
            </t-col>
            <t-col :flex="1">
              <t-form-item label="状态" name="bannerStatus">
                <t-select
                  v-model="searchForm.bannerStatus"
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
        <template #bannerUrl="slotProps">
          <div>
            <t-image :src="slotProps.row.bannerUrl" :style="{ width: '200px', height: '120px' }" ></t-image>
          </div>
        </template>
        <template #bannerStatusSt="slotProps">
          <div>
            {{slotProps.row.bannerStatusStr}}
          </div>
        </template>
        <template #op="slotProps">
          <a class="t-button-link" v-if="slotProps.row.bannerStatus == 1" @click="handleClickStatus(slotProps,2)">下架</a>
          <a class="t-button-link" v-else @click="handleClickStatus(slotProps,1)">上架</a>
          <a class="t-button-link" v-if="slotProps.row.bannerStatus == 2" @click="rehandleClickOp(slotProps)">编辑</a>
          <a class="t-button-link" @click="rehandleClickLook(slotProps)">查看</a>
          <a class="t-button-link" v-if="slotProps.row.bannerStatus == 2" @click="handleClickDelete(slotProps)">删除</a>
        </template>
      </t-table>
      <t-dialog
        header="确认删除当前所选banner？"
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
          <t-form-item label="名称" name="bannerName">
            <t-input v-model="formData.bannerName" placeholder="请输入名称"></t-input>
          </t-form-item>
          <t-form-item label="banner" name="bannerUrl">
            <upload-file :value="formData.bannerUrl" @uploadChange="uploadChange"></upload-file>
          </t-form-item>
          <t-form-item label="宣传页" name="jumpUrl">
            <upload-file :value="formData.jumpUrl" @uploadChange="uploadChange2"></upload-file>
          </t-form-item>
          <t-form-item style="margin-left: 100px">
            <t-space size="10px">
              <t-button theme="primary" type="submit">提交</t-button>
            </t-space>
          </t-form-item>
        </t-form>
      </t-dialog>
      <!--  查看    -->
      <t-dialog placement="center" header="查看" :visible="visibleLook" :onClose="close" :footer="false">
        <t-form :data="formData" @submit="close">
          <t-form-item label="名称" name="bannerName">
            {{formData.bannerName}}
          </t-form-item>
          <t-form-item label="banner" name="bannerUrl">
            <upload-file :value="formData.bannerUrl" :disabled="true"></upload-file>
          </t-form-item>
          <t-form-item label="宣传页" name="jumpUrl">
            <upload-file :value="formData.jumpUrl" :disabled="true"></upload-file>
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
import {addOrUpdateBanner, delBanner, getBannerList, updateBannerStatus} from "@/api/banner";
import UploadFile from "@/components/uploadFile/index.vue";

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
        bannerName: '', // 名
        bannerUrl: [], // banner
        jumpUrl:[], // 宣传页
        bannerCode:null
      },
      rules: {
        bannerName: [
          {
            required: true,
            message: '请输入名称',
            type: 'error',
            trigger: 'blur',
          },
        ],
        bannerUrl: [
          { required: true, message: '请上传图片', type: 'error',trigger: 'change'},
        ],
        jumpUrl: [
          { required: true, message: '请上传图片', type: 'error',trigger: 'change' },
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
      visibleLook: false,
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
          colKey: 'bannerName',
        },
        {
          title: '图片',
          width: 200,
          ellipsis: true,
          colKey: 'bannerUrl',
        },
        {title: '状态', colKey: 'bannerStatusSt', width: 200, cell: {col: 'status'}},
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
      dialogTitle: '',
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
      statusVisible: false,
      deleteIdx: -1,
      statusHeader:""
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
      getBannerList({
        pages: that.paginationInfo.defaultCurrent,
        pageSize: that.paginationInfo.defaultPageSize,
        bannerName: that.searchForm.bannerName,
        bannerStatus: that.searchForm.bannerStatus,
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
    openDialog(){
      this.dialogTitle = "新增用户"
      this.$refs.formData.reset();
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
        addOrUpdateBanner({
          bannerName:this.formData.bannerName,
          bannerUrl:this.formData.bannerUrl[0].url,
          jumpUrl:this.formData.jumpUrl[0].url,
          bannerCode:this.formData.bannerCode?this.formData.bannerCode:null
        }).then(res => {
          if(res.status){
            that.$refs.formData.reset();
            that.visibleCenter = false
            that.getList()
            this.$message.success('提交成功');
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
    // 图片变化
    uploadChange(file){
      console.log('banner',file)
      this.formData.bannerUrl = file
    },
    // 图片变化
    uploadChange2(file){
      console.log('banner',file)
      this.formData.jumpUrl = file
    },
    getContainer() {
      return document.querySelector('.tdesign-starter-layout');
    },
    rehandlePageChange(curr, pageInfo) {
      console.log('分页变化', curr, pageInfo);
      this.paginationInfo.defaultCurrent = curr.current
      this.getList()
    },
    rehandleChange(changeParams, triggerAndData) {
      console.log('统一Change', changeParams, triggerAndData);
    },
    // 编辑
    rehandleClickOp({text, row}) {
      this.formData.bannerName = row.bannerName;
      this.formData.bannerCode = row.bannerCode;
      this.formData.jumpUrl = [{name:'jump',url:row.jumpUrl}];
      this.formData.bannerUrl =  [{name:'banner',url:row.bannerUrl}];
      this.visibleCenter = true
    },
    // 查看
    rehandleClickLook({text, row}) {
      this.formData.bannerName = row.bannerName;
      this.formData.bannerCode = row.bannerCode;
      this.formData.jumpUrl = [{name:'jump',url:row.jumpUrl}];
      this.formData.bannerUrl =  [{name:'banner',url:row.bannerUrl}];
      this.visibleLook = true
    },
    // 删除弹窗
    handleClickDelete(row) {
      console.log(row)
      this.deleteIdx = row.row.bannerCode;
      this.confirmVisible = true;
    },
    // 删除确认
    onConfirmDelete() {
      // 真实业务请发起请求
      const that = this
      delBanner({
        bannerCode: that.deleteIdx,
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
      this.statusHeader = '确定' + (status == 1? '上架':'下架') +'所选banner吗'
      this.deleteIdx = row.row.bannerCode;
      this.status = status
      this.statusVisible = true;
    },
    // 上下架确认
    onConfirmStatus() {
      // 真实业务请发起请求
      const that = this
      updateBannerStatus({
        bannerCode: that.deleteIdx,
        bannerStatus: that.status,
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
