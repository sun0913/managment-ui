<template>
  <el-card shadow="never" class="card-box">
    <!--    查询-->
    <el-form :model="queryForm" label-width="110px">
      <el-row :gutter="20">
        <el-col :span="6">
          <el-form-item label="名称">
            <el-input v-model="queryForm.name" clearable placeholder="请输入配件名称"/>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="所属公司">
            <el-select v-model="queryForm.type" clearable placeholder="请选择配件所属公司">
              <el-option
                  v-for="item in dataTypes.accessoriesTypes"
                  :key="item.id"
                  :label="item.name"
                  :value="item.name">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="采购日期范围">
            <el-date-picker
                v-model="queryForm.purchaseTime"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
            />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label-width="30">
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
      <el-table-column prop="name" label="名称" align="center"/>
      <el-table-column prop="purchaseQuantity" label="采购数量" align="center"/>
      <el-table-column prop="purchaseTime" label="采购日期" align="center"/>
      <el-table-column prop="type" label="所属公司" align="center"/>
      <el-table-column prop="usageAmount" label="单个站用量" align="center"/>
      <el-table-column prop="remark" label="备注" align="center"/>
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
import {getSysDicByCode} from "@/api/dic";
import {onMounted} from "vue";
import {getSimList, deleteSim} from "@/api/sim";
import {AccessoriesListQueryForm} from "@/api/types/accessoriesTypes";
import {deleteAccessories, getAccessoriesList} from "@/api/accessories";

const defaultQueryForm = (): AccessoriesListQueryForm => ({
  name: null,
  type: null,
  purchaseTime: null,
})
/** 查询*/
let queryForm = ref<AccessoriesListQueryForm>({
  name: null,
  type: null,
  purchaseTime: null,
})
interface DataType {
  accessoriesTypes: any[]; // 你可以替换为你的实际类型
}

const dataTypes: DataType = ref({
  accessoriesTypes: [],
}).value;

// 为 loadDataTypes 函数的参数添加类型
const loadDataTypes = async (type: keyof DataType, code: string) => {
  // 使用你的实际接口
  dataTypes[type] = await getSysDicByCode(code);
};

onMounted(() => {
  loadDataTypes('accessoriesTypes', 'company');
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
  getAccessoriesList({...pageData, ...queryForm.value}).then(res => {
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
        deleteAccessories(row.id).then(() => {
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
