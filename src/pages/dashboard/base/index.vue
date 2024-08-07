<template>
  <div style="width: 100%">
<!--    <t-back-top
      container=".tdesign-starter-layout"
      :visible-height="0"
      style="position: absolute"
      :offset="['24px', '80px']"
    >
      <t-icon name="backtop" size="20px" />
    </t-back-top>
    &lt;!&ndash; 顶部 card  &ndash;&gt;
    <top-panel class="row-container" />
    &lt;!&ndash; 中部图表  &ndash;&gt;
    <middle-chart class="row-container" />
    &lt;!&ndash; 列表排名 &ndash;&gt;
    <rank-list class="row-container" />
    &lt;!&ndash; 出入库概览 &ndash;&gt;
    <output-overview class="row-container" />-->
    <t-image style="width: 100%;" :src="imgUrl"/>
  </div>
</template>
<script>
import TopPanel from './components/TopPanel.vue';
import MiddleChart from './components/MiddleChart.vue';
import RankList from './components/RankList.vue';
import OutputOverview from './components/OutputOverview.vue';

export default {
  name: 'DashboardBase',
  components: {
    TopPanel,
    MiddleChart,
    RankList,
    OutputOverview,
  },
  data(){
    return{
      imgUrl: "http://192.168.0.142:9000/ydhy/home.jpg",
    }
  }
};
</script>
<style scoped lang="less">
.row-container {
  margin-bottom: 16px;
}
/deep/ .t-card__body {
  padding-top: 0;
}
</style>
