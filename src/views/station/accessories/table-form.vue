<template>
  <div v-if="dialogData.isShow">
    <el-dialog :model-value="true" destroy-on-close :title="dialogData.title" @close="closeDialog">
      <el-form ref="formRef" :rules="rules" :model="form" label-width="120px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="名称" prop="name">
              <el-select v-model="form.name" placeholder="请选择配件名称">
                <el-option
                    v-for="item in dataTypes.accessoriesName"
                    :key="item.id"
                    :label="item.name"
                    :value="item.name">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="采购数量" prop="purchaseQuantity">
              <el-input v-model="form.purchaseQuantity" placeholder="请输入采购数量"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="价格" prop="price">
              <el-input v-model="form.price" placeholder="请输入采购价格"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="用量" prop="usageAmount">
              <el-input v-model="form.usageAmount" placeholder="请输入单个站用量"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="所属公司" prop="name">
              <el-select v-model="form.type" placeholder="请选择所属公司">
                <el-option
                    v-for="item in dataTypes.accessoriesTypes"
                    :key="item.id"
                    :label="item.name"
                    :value="item.name">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="采购日期" prop="purchaseTime">
              <el-date-picker v-model="form.purchaseTime" type="date" placeholder="请选择采购日期"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col>
            <el-form-item label="备注" prop="price">
              <el-input v-model="form.remark" placeholder="请输入备注信息"/>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="submit">确定</el-button>
          <el-button @click="closeDialog">取消</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
// 表单
import {ElMessage, FormInstance, FormRules} from "element-plus";
import {getSysDicByCode} from "@/api/dic";
import {onMounted} from 'vue';
import {AddSimType} from "@/api/types/simTypes";
import {addSim, getSimInfo, updateSim} from "@/api/sim";
import {AddAccessoriesType} from "@/api/types/accessoriesTypes";
import {addAccessories, getAccessoriesInfo, updateAccessories} from "@/api/accessories";

const formRef = ref<FormInstance>()

// 为 dataTypes 添加一个明确的类型定义
interface DataType {
  accessoriesTypes: any[];
  accessoriesName: any[];
}

const dataTypes: DataType = ref({
  accessoriesTypes: [],
  accessoriesName: []
}).value;

// 为 loadDataTypes 函数的参数添加类型
const loadDataTypes = async (type: keyof DataType, code: string) => {
  // 使用你的实际接口
  dataTypes[type] = await getSysDicByCode(code);
};

onMounted(() => {
  loadDataTypes('accessoriesTypes', 'company');
  loadDataTypes('accessoriesName', 'accessories');
});

const emits = defineEmits<{
  (event: 'refresh'): void
}>()

const getDefaultFormValues = (): AddAccessoriesType => ({})
let form = ref<AddAccessoriesType>((getDefaultFormValues()));
// 效验规则
const rules = reactive<FormRules>({
  name: [
    {required: true, message: '请输入配件名称', trigger: 'blur'},
  ],
  purchaseQuantity: [
    {required: true, message: '请输入采购数量', trigger: 'blur'},
  ],
  usageAmount: [
    {required: true, message: '请输入单个站用量', trigger: 'blur'},
  ],
})

const getDetails = (id: number | string) => {
  getAccessoriesInfo(id).then(res => {
    form.value = Object.assign({}, form.value, res);

  })
}
// 弹框数据
const dialogData = reactive({
  isShow: false,
  title: "新增",
  id: null,
})
const isEditing = ref(false); // 是否处于编辑状态

// 打开弹框
const openDialog = async (row: any) => {
  dialogData.isShow = true;
  isEditing.value = !!row?.id;  // 设置编辑状态
  dialogData.title = isEditing.value ? '编辑' : '新增';
  if (row?.id) {
    dialogData.id = row.id;
    // dialogData.title = '编辑';
    getDetails(row.id);
  }
}
// 关闭弹框
const closeDialog = () => {
  dialogData.isShow = false;
  dialogData.id = null;
  form.value = {};

}
// 提交
const submit = async () => {

  if (!formRef.value) return;
  await formRef.value.validate((valid) => {
    if (valid) {
      if (form.value.id) {
        updateAccessories(form.value).then(() => {
          ElMessage.success('操作成功');
          closeDialog();
          emits('refresh');
        })
      } else {
        addAccessories(form.value).then(() => {
          ElMessage.success('操作成功');
          closeDialog();
          emits('refresh');
        })
      }
    }
  })
}
defineExpose({
  openDialog,
});
</script>

<style scoped>

</style>
