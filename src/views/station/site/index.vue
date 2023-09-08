<template>
  <el-card shadow="never" class="card-box">
    <!--    查询-->
    <el-form :model="queryForm" label-width="110px">
      <el-row :gutter="20">
        <el-col :span="6">
          <el-form-item label="气象站">
            <el-input v-model="queryForm.name" :suffix-icon="Search as string" clearable placeholder="请输入气象站名称"/>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="序列号">
            <el-input v-model="queryForm.siteSn" :suffix-icon="Search as string" clearable placeholder="请输入气象站序列号"/>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="所属公司">
            <el-select v-model="queryForm.type" clearable placeholder="请选择气象站所属公司">
              <el-option
                  v-for="item in dataTypes.siteTypes"
                  :key="item.id"
                  :label="item.name"
                  :value="item.name">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="安装日期范围">
            <el-date-picker
                v-model="queryForm.installationDate"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="6">
          <el-form-item label="气象站类型">
            <el-input v-model="queryForm.code" :suffix-icon="Search as string" clearable placeholder="请输入气象站类型"/>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="安装地点">
            <el-input v-model="queryForm.location" :suffix-icon="Search as string" clearable placeholder="请输入安装地点"/>
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
      <el-table-column prop="siteSn" label="序列号" align="center"/>
      <el-table-column prop="code" label="类型" align="center"/>
      <el-table-column prop="type" label="所属公司" align="center"/>
      <el-table-column prop="location" label="安装地点" align="center"/>
      <el-table-column prop="installationDate" label="安装时间" align="center"/>
      <el-table-column prop="installer" label="安装人员" align="center"/>
      <el-table-column prop="maintained" label="是否维护" align="center">
        <template #default="scope">
          <el-tag v-if="scope.row.maintained===true" type="success" disable-transitions>是</el-tag>
          <el-tag v-else type="danger" disable-transitions>否</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="status" label="状态" align="center">
        <template #default="scope">
          <el-tag v-if="scope.row.status===true" type="success" disable-transitions>启用</el-tag>
          <el-tag v-else type="danger" disable-transitions>禁用</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="image" label="图片" align="center"/>
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
import {deleteSite, getSiteList} from "@/api/site";
import {SiteListQueryForm} from "@/api/types/siteType";
import {Search} from "@element-plus/icons-vue";

const defaultQueryForm = (): SiteListQueryForm => ({
  siteSn: null,
  name: null,
  type:  null,
  code: null,
  location: null,
  installationDate: null,
  status: 1,
})
/** 查询*/
let queryForm = ref<SiteListQueryForm>({
  siteSn: null,
  name: null,
  type:  null,
  code: null,
  location: null,
  installationDate: null,
  status: 1,
})
interface DataType {
  siteTypes: any[]; // 你可以替换为你的实际类型
}

const dataTypes: DataType = ref({
  siteTypes: [],
}).value;

// 为 loadDataTypes 函数的参数添加类型
const loadDataTypes = async (type: keyof DataType, code: string) => {
  // 使用你的实际接口
  dataTypes[type] = await getSysDicByCode(code);
};

onMounted(() => {
  loadDataTypes('siteTypes', 'company');
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
  getSiteList({...pageData, ...queryForm.value}).then(res => {
    let sortedData = res.list || [];
    sortedData.sort((a: {id: number, name: string}, b: {id: number, name: string}) => {
      if (a.name < b.name) {
        return -1;
      } else if (a.name > b.name) {
        return 1;
      } else {
        return a.id - b.id;
      }
    });
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
        deleteSite(row.id).then(() => {
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
