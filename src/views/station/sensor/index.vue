<template>
  <el-card shadow="never" class="card-box">
    <!--    查询-->
    <el-form :model="queryForm" label-width="110px">
      <el-row :gutter="20">
        <el-col :span="6">
          <el-form-item label="传感器名称">
            <el-input v-model="queryForm.name" clearable placeholder="请输入传感器名称"/>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="传感器编号">
            <el-input v-model="queryForm.sensorSn" clearable placeholder="请输入传感器编号"/>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="传感器分类">
            <el-select v-model="queryForm.type" clearable placeholder="请选择传感器所属公司">
              <el-option
                  v-for="item in sensorTypes"
                  :key="item.id"
                  :label="item.name"
                  :value="item.name">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label-width="0">
            <el-button type="primary" @click="onSearch">
              <el-icon>
                <ele-search/>
              </el-icon>
              <span class="search-btn__left">查询</span>
            </el-button>
            <el-button @click="onReset">
              <el-icon>
                <ele-refresh/>
              </el-icon>
              <span class="search-btn__left">重置</span>
            </el-button>
            <el-button type="primary" @click="openDialog">
              <el-icon class="mr5">
                <ele-circle-plus/>
              </el-icon>
              新 增
            </el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <!--    表格-->
    <el-table :data="tableData.data" border style="width: 100%" row-key="id">
      <el-table-column prop="name" label="传感器名称" align="center"/>
      <el-table-column prop="sensorSn" label="传感器编号" align="center"/>
      <el-table-column prop="type" label="传感器分类" align="center"/>
      <el-table-column prop="siteId" label="所属气象站" align="center"/>
      <el-table-column prop="supplier" label="供应商" align="center"/>
      <el-table-column prop="price" label="采购单价" align="center"/>
      <el-table-column prop="purchaseTime" label="新增日期" align="center"/>
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
      <el-table-column prop="status" label="是否正常" align="center">
        <template #default="scope">
          <el-tag v-if="scope.row.status===true" type="success" disable-transitions>正常</el-tag>
          <el-tag v-else type="danger" disable-transitions>故障</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="activated" label="是否使用" align="center">
        <template #default="scope">
          <el-tag v-if="scope.row.used" type="success" disable-transitions>已用</el-tag>
          <el-tag v-else type="danger" disable-transitions>未用</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" fixed="right" align="center">
        <template #default="{row}">

            <el-button link type="primary" @click="openDialog(row)">
              修改
            </el-button>
            <el-button @click="delTable(row)" link type="danger">
              删除
            </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--    分页-->
    <CustomPagination v-model:currentPage="pageData.pageIndex" v-model:pageSize="pageData.pageSize"
                      :total="pageData.total" @changePage="changePage"/>

    <!--    添加，编辑弹框-->
    <TableForm ref="tableDialogRef" @refresh="getTableList"/>
  </el-card>
</template>
<script lang="ts" setup>
import {ElMessage, ElMessageBox} from "element-plus";
import TableForm from './table-form.vue'
import {deleteStationSensor, getStationSensorList} from "@/api/sensor";
import {SensorListQueryForm} from "@/api/types/sensorTypes";
import {getSysDicByCode} from "@/api/dic";
import {onMounted} from "vue";

const defaultQueryForm = (): SensorListQueryForm => ({
  name: null,
  sensorSn: null,
  type: null,
})
/** 查询*/
let queryForm = ref<SensorListQueryForm>({
  name: null,
  sensorSn: null,
  type: null,
})
const sensorTypes = ref([]);
const loadSensorTypes = async () => {
  // 使用你的实际接口
  sensorTypes.value = await getSysDicByCode("company");
};

onMounted(() => {
  loadSensorTypes();
});
// 查询
const onSearch = () => {
  pageData.pageIndex = 1;
  getTableList();
}
// 重置
const onReset = () => {
  queryForm.value = defaultQueryForm();
  pageData.pageIndex = 1;
  getTableList();
}

/** 分页*/
// 分页数据
const pageData = reactive({
  pageIndex: 1,
  pageSize: 10,
  total: 0
})
// 翻页
const changePage = (page: number) => {
  pageData.pageIndex = page;
  getTableList();
}

/** 表格*/
// 表格数据
const tableData = reactive({
  data: [],
})
// 获取表格列表
const getTableList = () => {
  getStationSensorList({...pageData, ...queryForm.value}).then(res => {
    tableData.data = res.list || [];
    pageData.total = res.total;
  })
}
// 删除
const delTable = (row: any) => {
  ElMessageBox.confirm(
      '是否确认删除本条数据？',
      '提示',
      {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning',
      })
      .then(() => {
        deleteStationSensor(row.id).then(() => {
          ElMessage.success('删除成功');
          getTableList();
        })
      }).catch(() => {
  })
}

/** 添加，编辑*/
const tableDialogRef = ref()
// 打开弹框
const openDialog = async (row: any = {}) => {
  await tableDialogRef.value.openDialog(row);
}
getTableList();
</script>
<style></style>
