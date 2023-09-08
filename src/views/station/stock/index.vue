<template>
  <el-card shadow="never" class="card-box">
    <!--    查询-->
    <el-form :model="queryForm" label-width="110px">
      <el-row :gutter="20">
        <el-col :span="6">
          <el-form-item label="名称">
            <el-input v-model="queryForm.name" :suffix-icon="Search as string" clearable placeholder="请输入名称"/>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="分类">
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
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <!--    表格-->
    <el-table :data="tableData.data" border style="width: 100%" row-key="id">
      <el-table-column prop="codeName" label="设备类型" align="center"/>
      <el-table-column prop="name" label="名称" align="center"/>
      <el-table-column prop="purchaseQuantity" label="采购数量" align="center"/>
      <el-table-column prop="recycleQuantity" label="回收数量" align="center"/>
      <el-table-column prop="stockQuantity" label="库存数量" align="center"/>
      <el-table-column prop="type" label="公司" align="center"/>
      <el-table-column prop="createTime" label="创建时间" align="center"/>
      <el-table-column prop="updateTime" label="更新时间" align="center"/>
<!--      <el-table-column prop="remark" label="备注" align="center"/>-->
      <el-table-column label="操作" fixed="right" align="center">
        <template #default="{row}">
            <el-button link type="primary" @click="openDialog(row)">
              详情
            </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--    分页-->
    <CustomPagination v-model:currentPage="pageData.pageIndex" v-model:pageSize="pageData.pageSize"
                      :total="pageData.total" @changePage="changePage"/>
    <component :is="currentFormComponent" ref="tableDialogRef"></component>
  </el-card>
</template>
<script lang="ts" setup>
import {getSysDicByCode} from "@/api/dic";
import {onMounted} from "vue";
import {StockInfoListQueryForm, StockListQueryForm} from "@/api/types/stockTypes";
import {getStockList, getStockInfoList} from "@/api/stock";
import SensorTableForm  from "@/views/station/stock/sensor-table-form.vue";
import SimTableForm  from "@/views/station/stock/sim-table-form.vue";
import AccessoriesTableForm from "@/views/station/stock/accessories-table-form.vue";
import {Search} from "@element-plus/icons-vue";

const defaultQueryForm = (): StockListQueryForm => ({
  name: null,
  type: null,
})
/** 查询*/
let queryForm = ref<StockListQueryForm>({
  name: null,
  type: null,
})

let infoQueryForm = ref<StockInfoListQueryForm>({
  name: null,
  code: null,
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
  getStockList({...pageData, ...queryForm.value}).then(res => {
    let sortedData = res.list || [];
    sortedData.sort((a: {id: number, codeName: string, name: string}, b: {id: number, codeName: string, name: string}) => {
      if (a.codeName < b.codeName) {
        return -1;
      } else if (a.codeName > b.codeName) {
        return 1;
      } else {
        if (a.name < b.name) {
          return -1;
        } else if (a.name > b.name) {
          return 1;
        } else {
          return a.id - b.id;
        }
      }
    });
    tableData.data = res.list || [];
    pageData.total = res.total;
  })
}

/** 添加，编辑*/
const tableDialogRef = ref()
const currentFormComponent = ref(null); // 用于存放当前要显示的组件

interface StockInfoData {
  stationSensorVoList?: any[];
  stationSimVoList?: any[];
  stationAccessoriesVoList?: any[];
}


const getComponentAndListByCode = (code: string, data: StockInfoData) => {
  console.log("Debug: data received", data);  // 调试信息
  let component = null;
  let list = null;

  if (data) {
    switch (code) {
      case 'sensor':
        component = SensorTableForm;
        list = data.stationSensorVoList;
        break;
      case 'simCard':
        component = SimTableForm;
        list = data.stationSimVoList;
        break;
      case 'accessories':
        component = AccessoriesTableForm;
        list = data.stationAccessoriesVoList;
        break;
      default:
        component = null;
        list = null;
    }
  } else {
    console.error("Data is undefined");
  }

  return { component, list };
};



// 打开弹框
const openDialog = async (row: any = {}) => {
  // 设置infoQueryForm的值
  infoQueryForm.value.name = row.name;
  infoQueryForm.value.code = row.code;
  infoQueryForm.value.type = row.type;

  const stockInfoData = await getStockInfoList({ ...infoQueryForm.value }); // 使用实际的API函数获取数据
  console.log("Debug: stockInfoData received", stockInfoData);

  const { component, list } = getComponentAndListByCode(row.code, stockInfoData);

  currentFormComponent.value = component;
  console.log("currentFormComponent: ", currentFormComponent.value)
  if (currentFormComponent.value) {
    await nextTick();  // 等待 DOM 更新
    if (tableDialogRef.value && typeof tableDialogRef.value.openDialog === 'function') {
      await tableDialogRef.value.openDialog(row);
      if (list) {
        tableDialogRef.value.updateData(list);
      }
    }

  }
}
getTableList();
</script>
<style></style>
