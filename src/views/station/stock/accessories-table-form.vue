<template>
  <div v-if="dialogData.isShow">
    <el-dialog :model-value="true" destroy-on-close :title="dialogData.title" @close="closeDialog" width="1200px">
      <el-table :data="stockInfo" border style="width: 100%" row-key="id">
        <el-table-column prop="name" label="名称" align="center"/>
        <el-table-column prop="purchaseQuantity" label="采购数量" align="center"/>
        <el-table-column prop="purchaseTime" label="采购日期" align="center"/>
        <el-table-column prop="type" label="所属公司" align="center"/>
        <el-table-column prop="usageAmount" label="单个站用量" align="center"/>
        <el-table-column prop="remark" label="备注" align="center"/>
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
