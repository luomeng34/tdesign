<template>
  <div>
    <t-upload
      v-model="fileList"
      :action="actions"
      :tips="tip"
      :size-limit="limit"
      :before-upload="beforeUpload"
      theme='image'
      :showImageFileName="showImageFileName"
      @fail="handleFail"
      :headers="headers"
      :multiple="multiply"
      @success="onSuccess"
      @remove="onRemove"
      :imageViewerProps="imageViewerProps"
      accept="image/*"
    >
<!--      <t-button class="form-submit-upload-btn" variant="outline"> 上传合同文件 </t-button>-->
    </t-upload>
  </div>
</template>
<script lang="ts">
import Vue from 'vue';
import { getToken } from "@/utils/auth";
export default Vue.extend({
  name: 'upload',
  props: {
    files: {
      type: Array,
      default: [],
    },
    value: [String, Object, Array],
    limit: {
      type: Object,
      default:{
        size: 5,
        unit: 'MB'
      },
    },
    multiply:{
      type: Boolean,
      default: false,
    }
  },
  watch: {
    value: {
      handler(val) {
        if (val) {
          // 首先将值转为数组
          const list = val;
          console.log(list)
          this.fileList = list
          return list
        } else {
          this.fileList = [];
          return [];
        }
      },
      deep: true,
      immediate: true
    }
  },
  data(){
    return {
      baseUrl: "http://192.168.0.200:8888/",
      actions: "http://192.168.0.200:8888/api/upload/oss/uploadFile",
      headers: {
        token: getToken()
      },
      tip:"",
      uploadList: [],
      showImageFileName: false,
      fileList: this.files,
      imageViewerProps: {
        closeOnEscKeydown: false,
      },
      number:0,
    }
  },
  methods:{
    handleFail({ file }) {
      this.$message.error(`文件 ${file.name} 上传失败`);
    },
    beforeUpload(file) {
      // this.fileList = file.response.url
      if (file.size > 10 * 1024 * 1024) {
        this.$message.warning('上传的图片不能大于10M');
        return false;
      }
      this.number++;
      return true;

    },
    onSuccess(res){
      console.log('success',res);
      if (res.response.code === 200) {
        this.uploadList.push({ name: res.file.name, url: res.response.data });
        this.uploadedSuccessfully();
      } else {
        this.number--;
        this.uploadedSuccessfully();
      }
    },
    // 删除图片
    onRemove(file) {
      const findex = this.fileList.map(f => f.name).indexOf(file.name);
      if (findex > -1) {
        this.fileList.splice(findex, 1);
        this.$emit("uploadChange", this.fileList);
      }
    },
    // 上传结束处理
    uploadedSuccessfully() {
      if (this.number > 0 && this.uploadList.length === this.number) {
        this.fileList = this.uploadList;
        this.uploadList = [];
        this.number = 0;
        this.$emit("uploadChange", this.fileList);
      }
    },
    // 用于格式化接口响应值，error 会被用于上传失败的提示文字；url 表示文件/图片地址
    formatResponse(res) {
      return { ...res, error: '上传失败，请重试', url: res.url };
    },
  }
});
</script>
<style lang="less" scoped>
@import url('@/style/index.less');

.thumbnail {
  &-container {
    display: inline-block;
  }

  &-circle {
    border-radius: var(--td-radius-circle);
  }

  &-layout {
    width: 88px;
    height: 48px;
  }
}
</style>
