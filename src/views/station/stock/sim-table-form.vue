<template>
  <div v-if="dialogData.isShow">
    <el-dialog :model-value="true" destroy-on-close :title="dialogData.title" @close="closeDialog" width="1500px">
      <el-table :data="stockInfo" border style="width: 100%" row-key="id">
        <el-table-column prop="operator" label="运营商" align="center"/>
        <el-table-column prop="iccid" label="ICCID" width="200px" align="center"/>
        <el-table-column prop="imei" label="IMEI" width="200px" align="center"/>
        <el-table-column prop="specification" label="套餐规格" align="center"/>
        <el-table-column prop="purchaseTime" label="采购日期" align="center"/>
        <el-table-column prop="renewalTime" label="续费日期" align="center"/>
        <el-table-column prop="type" label="所属公司" align="center"/>
        <el-table-column prop="siteId" label="气象站ID" align="center"/>
        <el-table-column prop="status" label="是否正常" align="center">
          <template #default="scope">
            <el-tag v-if="scope.row.status" type="success" disable-transitions>正常</el-tag>
            <el-tag v-else type="danger" disable-transitions>故障</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="activated" label="是否激活" align="center">
          <template #default="scope">
            <el-tag v-if="scope.row.activated" type="success" disable-transitions>是</el-tag>
            <el-tag v-else type="danger" disable-transitions>否</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="activated" label="是否使用" align="center">
          <template #default="scope">
            <el-tag v-if="scope.row.used" type="success" disable-transitions>已用</el-tag>
            <el-tag v-else type="danger" disable-transitions>未用</el-tag>
          </template>
        </el-table-column>
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
