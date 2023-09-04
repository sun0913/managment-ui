<template>
  <div v-if="dialogData.isShow">
    <el-dialog :model-value="true" destroy-on-close :title="dialogData.title" @close="closeDialog" width="1200px">
      <el-table :data="stockInfo" border style="width: 100%">
        <el-table-column prop="name" label="名称"></el-table-column>
        <el-table-column prop="sensorSn" label="编号"></el-table-column>
        <el-table-column prop="type" label="所属公司"></el-table-column>
        <el-table-column prop="supplier" label="供应商"></el-table-column>
        <el-table-column prop="purchaseTime" label="采购日期"></el-table-column>
        <el-table-column prop="price" label="采购单价" align="center"/>
        <el-table-column prop="detected" label="是否新购" align="center">
          <template #default="scope">
            <el-tag v-if="scope.row.purchased===true" type="success" disable-transitions>是</el-tag>
            <el-tag v-else type="danger" disable-transitions>否</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="detected" label="是否检测" align="center">
          <template #default="scope">
            <el-tag v-if="scope.row.detected===true" type="success" disable-transitions>是</el-tag>
            <el-tag v-else type="danger" disable-transitions>否</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="repaired" label="是否维修" align="center">
          <template #default="scope">
            <el-tag v-if="scope.row.repaired===true" type="success" disable-transitions>是</el-tag>
            <el-tag v-else type="danger" disable-transitions>否</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="是否可用" align="center">
          <template #default="scope">
            <el-tag v-if="scope.row.status===true" type="success" disable-transitions>是</el-tag>
            <el-tag v-else type="danger" disable-transitions>否</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>

const stockInfo = ref<any[]>([]);

// 弹框数据
const dialogData = reactive({
  isShow: false,
  title: "详情",
  id: null,
})


// 打开弹框
const openDialog = async (row: any) => {
  dialogData.isShow = true;
  if (row?.id) {
    dialogData.id = row.id;
  }
}
// 关闭弹框
const closeDialog = () => {
  dialogData.isShow = false;
}

const updateData = (newData: Array<any>) => {
  stockInfo.value = newData;
}

defineExpose({
  openDialog,
  updateData, // 暴露这个方法
});

</script>

<style scoped>

</style>
