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
              <t-form-item label="资讯名称" name="newsTitle">
                <t-input
                  v-model="searchForm.newsTitle"
                  class="form-item-content"
                  type="search"
                  placeholder="请输入资讯名称"
                  :style="{ minWidth: '134px' }"
                />
              </t-form-item>
            </t-col>
            <t-col :flex="1">
              <t-form-item label="状态" name="newsStatus">
                <t-select
                  v-model="searchForm.newsStatus"
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
        :verticalAlign="verticalAlign"
        :hover="hover"
        height="calc(100vh - 320px)"
        :pagination="paginationInfo"
        @page-change="rehandlePageChange"
        @change="rehandleChange"
        :loading="dataLoading"
        :headerAffixedTop="true"
        :headerAffixProps="{ offsetTop, container: getContainer }"
      >
        <template #op="slotProps">
          <a class="t-button-link" v-if="slotProps.row.newsStatus == 1" @click="handleClickStatus(slotProps,2)">下架</a>
          <a class="t-button-link" v-else @click="handleClickStatus(slotProps,1)">上架</a>
          <a class="t-button-link"  v-if="slotProps.row.newsStatus == 2" @click="rehandleClickOp(slotProps)">编辑</a>
          <a class="t-button-link" @click="rehandleClickLook(slotProps)">查看</a>
          <a class="t-button-link"  v-if="slotProps.row.newsStatus == 2" @click="handleClickDelete(slotProps)">删除</a>
        </template>
      </t-table>
      <t-dialog
        header="确认删除当前所选资讯？"
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
          <t-form-item label="标题" name="newsTitle">
            <t-input v-model="formData.newsTitle" placeholder="请输入名称"></t-input>
          </t-form-item>
          <t-form-item label="副标题" name="newsSubTitle">
            <t-input v-model="formData.newsSubTitle" placeholder="请输入名称"></t-input>
          </t-form-item>
          <t-form-item label="首页图片" name="newsUrls">
            <upload-file :max="2" :multiply="true" @uploadChange="uploadChange" :value="formData.newsUrls"></upload-file>
          </t-form-item>
          <t-form-item label="简介" name="newsIntroduce">
            <t-textarea
              v-model="formData.newsIntroduce"
              placeholder="请输入简介"
              name="description"
              :autosize="{ minRows: 3, maxRows: 5 }"
            />
          </t-form-item>
          <t-form-item label="内容" name="newsContext">
            <editor :min-height="200" @on-change="editorChange" :value="formData.newsContext"></editor>
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
          <t-form-item label="标题" name="newsTitle">
            {{formData.newsTitle}}
          </t-form-item>
          <t-form-item label="副标题" name="newsSubTitle">
            {{formData.newsSubTitle}}
          </t-form-item>
          <t-form-item label="首页图片" name="newsUrls">
            <upload-file :disabled="true" :value="formData.newsUrls"></upload-file>
          </t-form-item>
          <t-form-item label="简介" name="newsIntroduce">
            {{formData.newsIntroduce}}
          </t-form-item>
          <t-form-item label="内容" name="newsContext">
            <editor :min-height="200" @on-change="editorChange" :value="formData.newsContext"></editor>
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
import {delNews, getNewsList, saveNews, updateNewsStatus} from "@/api/operation";
import UploadFile from "@/components/uploadFile/index.vue";
import {forEach} from "lodash";

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
      searchForm: {
        newsTitle: '',
        newsStatus: undefined,
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
          colKey: 'newsTitle',
        },
        {
          title: '简介',
          width: 200,
          ellipsis: true,
          colKey: 'newsIntroduce',
        },
        {
          title: '创建时间',
          width: 200,
          ellipsis: true,
          colKey: 'newsTime',
        },
        {title: '状态', colKey: 'newsStatusStr', width: 200, cell: {col: 'status'}},
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
        newsUrls: [], // 名
        newsTitle: "", // 角色
        newsSubTitle: "", // 角色
        newsContext: "", // 角色
        newsIntroduce:"" // 密码
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
        newsSubTitle: [
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
      getNewsList({
        pages: that.paginationInfo.defaultCurrent,
        pageSize: that.paginationInfo.defaultPageSize,
        newsTitle: that.searchForm.newsTitle,
        newsStatus: that.searchForm.newsStatus,
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
    // 图片变化
    uploadChange(file){
      console.log(file)
      this.formData.newsUrls = file
    },
    // 富文本
    editorChange(html, text, quill){
      this.newsContext = html.html
    },
    onSubmit({ validateResult, firstError }) {
      const that = this
      if (validateResult === true) {
        this.formData.newsContext = this.newsContext.toString()
        const urls = []
        this.formData.newsUrls.forEach((item, index) => {
          urls.push(item.url)
        })
        saveNews({
          newsUrls: JSON.stringify(urls), // 名
          newsTitle: this.formData.newsTitle, // 角色
          newsSubTitle: this.formData.newsSubTitle, // 角色
          newsContext: this.formData.newsContext, // 角色
          newsIntroduce:this.formData.newsIntroduce, // 密码
          newsCode:this.formData.newsCode?this.formData.newsCode:null // 密码
        }).then(res => {
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
      this.formData.newsTitle = row.newsTitle;
      this.formData.newsSubTitle = row.newsSubTitle;
      this.formData.newsContext = row.newsContext;
      this.formData.newsIntroduce =row.newsIntroduce;
      this.formData.newsCode =row.newsCode;
      row.newsUrls.forEach((item, index) => {
        this.formData.newsUrls.push({
          url:item
        })
      })

      this.visibleCenter = true
    },
    rehandleClickLook({text, row}) {
      console.log(text, row);
      this.formData.newsTitle = row.newsTitle;
      this.formData.newsSubTitle = row.newsSubTitle;
      this.formData.newsContext = row.newsContext;
      this.formData.newsIntroduce =row.newsIntroduce;
      this.formData.newsCode =row.newsCode;
      row.newsUrls.forEach((item, index) => {
        this.formData.newsUrls.push({
          url:item
        })
      })

      this.visibleLook = true
    },
    // 上下架弹窗
    handleClickStatus(row,status) {
      console.log(row)
      this.statusHeader = '确定' + (status == 1? '上架':'下架') +'所选资讯吗'
      this.deleteIdx = row.row.newsCode;
      this.status = status
      this.statusVisible = true;
    },
    // 上下架确认
    onConfirmStatus() {
      // 真实业务请发起请求
      const that = this
      updateNewsStatus({
        newsCode: that.deleteIdx,
        newsStatus: that.status,
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
      this.deleteIdx = row.row.newsCode;
      this.confirmVisible = true;
    },
    onConfirmDelete() {
      // 真实业务请发起请求delNews
      delNews({
        newsCode: this.deleteIdx,
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
