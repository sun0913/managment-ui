<template>
  <div v-if="dialogData.isShow">
      <el-dialog :model-value="true" destroy-on-close :title="dialogData.title" @close="closeDialog" width="1500px">
        <el-table :data="[siteInfo]" style="width: 100%" border>
          <el-table-column prop="name" label="名称" align="center"></el-table-column>
          <el-table-column prop="siteSn" label="气象站编号" width="180px" align="center"></el-table-column>
          <el-table-column prop="installer" label="安装人员" align="center"></el-table-column>
          <el-table-column prop="location" label="安装地点" align="center"></el-table-column>
          <el-table-column prop="code" label="类型" align="center"></el-table-column>
          <el-table-column prop="type" label="所属公司" align="center"></el-table-column>
          <el-table-column prop="installationDate" label="安装日期" align="center"></el-table-column>
          <el-table-column prop="remark" label="备注" align="center"></el-table-column>
          <el-table-column prop="image" label="图片" align="center">
            <template #default="{ row }">
              <img :src="row.image" alt="Image" style="width: 50px; height: 50px;">
            </template>
          </el-table-column>
          <!-- 嵌套的子表格来展示设备信息 -->
          <el-table-column type="expand" label="设备详情" width="90px" align="center">
            <template #default="props">
              <el-table :data="props.row.stationSiteInfoList  as Array<{deviceName: string, deviceSn: string}>" style="width: 100%">
                <el-table-column prop="deviceName" label="名称"></el-table-column>
                <el-table-column prop="deviceSn" label="序列号/数量"></el-table-column>
              </el-table>
            </template>
          </el-table-column>
        </el-table>
      </el-dialog>
  </div>
</template>

<script lang="ts" setup>
// 表单
import {FormInstance} from "element-plus";
import {onMounted} from 'vue';
import {getSiteInfo} from "@/api/site";

const formRef = ref<FormInstance>()
onMounted(() => {
});

const emits = defineEmits<{
  (event: 'refresh'): void
}>()

const siteInfo = ref({});

const getDetails = (id: number | string) => {
  getSiteInfo(id).then(res => {
    siteInfo.value = res;
  })
}
// 弹框数据
const dialogData = reactive({
  isShow: false,
  title: "",
  id: null,
})
const isEditing = ref(false); // 是否处于编辑状态

// 打开弹框
const openDetails = async (row: any) => {
  dialogData.isShow = true;
  dialogData.title = '详情';
  if (row?.id) {
    dialogData.id = row.id;
    // dialogData.title = '编辑';
    getDetails(row.id);
    // 设置 fileList 和 imgurl

  }
}
// 关闭弹框
const closeDialog = () => {
  dialogData.isShow = false;
  dialogData.id = null;
}



defineExpose({
  openDetails,
});
</script>

<style scoped>

/* 确保图片可以根据容器大小自动缩放 */
.el-upload-list__item-preview {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain; /* 保持宽高比 */
}
</style>
