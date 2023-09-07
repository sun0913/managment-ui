<template>
  <div v-if="dialogData.isShow">
    <el-dialog :model-value="true" destroy-on-close :title="dialogData.title" @close="closeDialog">
      <el-form ref="formRef" :rules="rules" :model="form" label-width="120px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="运营商" prop="operator">
              <el-select v-model="form.operator" placeholder="请选择运营商名称">
                <el-option
                    v-for="item in dataTypes.operatorTypes"
                    :key="item.id"
                    :label="item.name"
                    :value="item.name">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="套餐规格" prop="specification">
              <el-input v-model="form.specification" placeholder="请输入套餐规格"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="ICCID编号" style="margin-bottom: 10px;">
              <div style="display: flex; flex-direction: column; align-items: flex-start;">
                <div v-for="(sn, index) in iccidList" :key="index" style="display: flex; align-items: center; margin-bottom: 10px;">
                  <el-input v-model="iccidList[index]" placeholder="请输入ICCID" style="flex: 1;"></el-input>
                  <el-button @click="removeCode(index)" v-if="index !== 0" style="margin-left: 10px;">删除</el-button>
                  <el-button type="primary" @click="addCode" v-if="index === 0 && !isEditing" style="margin-left: 10px;">添加更多编号</el-button>
                </div>
              </div>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="IMEI编号" style="margin-bottom: 10px;">
              <div style="display: flex; flex-direction: column; align-items: flex-start;">
                <div v-for="(sn, index) in imeiList" :key="index" style="display: flex; align-items: center; margin-bottom: 10px;">
                  <el-input v-model="imeiList[index]" placeholder="请输入IMEI" style="flex: 1;"></el-input>
                  <el-button @click="removeCode(index)" v-if="index !== 0" style="margin-left: 10px;">删除</el-button>
                  <el-button type="primary" @click="addCode" v-if="index === 0 && !isEditing" style="margin-left: 10px;">添加更多编号</el-button>
                </div>
              </div>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="供应商" prop="supplier">
              <el-input v-model="form.supplier" placeholder="请输入供应商名称"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="价格" prop="price">
              <el-input v-model="form.price" placeholder="请输入采购价格"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="SIM卡分类" prop="type">
              <el-select v-model="form.type" placeholder="请选择SIM卡所属公司">
                <el-option
                    v-for="item in dataTypes.simTypes"
                    :key="item.id"
                    :label="item.name"
                    :value="item.name">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="所属气象站" prop="siteId">
              <el-input v-model="form.siteId" placeholder="请输入所属气象站ID"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="采购日期" prop="purchaseTime">
              <el-date-picker v-model="form.purchaseTime" type="date" placeholder="请选择采购日期"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="续费日期" prop="purchaseTime">
              <el-date-picker v-model="form.renewalTime" type="date" placeholder="请选择续费日期"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="激活" prop="activated">
              <el-radio-group v-model="form.activated">
                <el-radio :label="true" border>是</el-radio>
                <el-radio :label="false" border>否</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="状态" prop="status">
              <el-radio-group v-model="form.status">
                <el-radio :label="true" border>启用</el-radio>
                <el-radio :label="false" border>禁用</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="是否新采购" prop="purchased">
              <el-radio-group v-model="form.purchased">
                <el-radio :label="true" border>是</el-radio>
                <el-radio :label="false" border>否</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12">
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

const formRef = ref<FormInstance>()

let iccidList = ref<string[]>(['']); // 存储多个ICCID编号
let imeiList = ref<string[]>(['']); // 存储多个ICCID编号

const addCode = () => {
  iccidList.value.push('');
  imeiList.value.push('');
}

const removeCode = (index: number) => {
  iccidList.value.splice(index, 1);
  imeiList.value.splice(index, 1);
}


// 为 dataTypes 添加一个明确的类型定义
interface DataType {
  simTypes: any[]; // 你可以替换为你的实际类型
  operatorTypes: any[]; // 你可以替换为你的实际类型
}

const dataTypes: DataType = ref({
  simTypes: [],
  operatorTypes: []
}).value;

// 为 loadDataTypes 函数的参数添加类型
const loadDataTypes = async (type: keyof DataType, code: string) => {
  // 使用你的实际接口
  dataTypes[type] = await getSysDicByCode(code);
};

onMounted(() => {
  loadDataTypes('simTypes', 'company');
  loadDataTypes('operatorTypes', 'simCard');
});

const emits = defineEmits<{
  (event: 'refresh'): void
}>()

const getDefaultFormValues = (): AddSimType => ({
  name: 'SIM卡',
  activated: 0,
  status: 1,
  purchased: 1,
  used: 0,
})
let form = ref<AddSimType>((getDefaultFormValues()));
// 效验规则
const rules = reactive<FormRules>({
  operator: [
    {required: true, message: '请输入运营商名称', trigger: 'blur'},
  ],
  specification: [
    {required: true, message: '请输入套餐规格', trigger: 'blur'},
  ],
  iccid: [
    {required: true, message: '请输入ICCID', trigger: 'blur'},
  ],
  imei: [
    {required: true, message: '请输入IMEI', trigger: 'blur'},
  ],
  type: [
    {required: true, message: '请输入传感器所属公司', trigger: 'blur'},
  ],
  purchaseTime: [
    {required: true, message: '请选择采购日期', trigger: 'blur'},
  ],
  activated: [
    {required: true, trigger: 'blur'},
  ],

  status: [
    {required: true, trigger: 'blur'},
  ],
})

// 从数组中删除一个编号

const getDetails = (id: number | string) => {
  getSimInfo(id).then(res => {
    form.value = Object.assign({}, form.value, res);
    iccidList.value = [res.iccid];  // 填充编号列表
    imeiList.value = [res.imei];  // 填充编号列表
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
  form.value = { name: 'SIM卡',activated: 0,status: 1, purchased: 1, used: 0 };
  iccidList.value = [''];
  imeiList.value = [''];
}
// 提交
const submit = async () => {
  const emptyIccid = iccidList.value.some( iccid => !iccid);
  const emptyImei = imeiList.value.some( imei => !imei);
  if (emptyIccid){
    ElMessage.error('ICCID是必填项！')
    return;
  }
  if (emptyImei){
    ElMessage.error('IMEI是必填项！')
    return;
  }
  if (!formRef.value) return;
  await formRef.value.validate((valid) => {
    if (valid) {
      // 创建一个数组，包含多个iccid和imei
      const simDTOs = [];
      for (let i = 0; i < Math.max(iccidList.value.length, imeiList.value.length); i++) {
        simDTOs.push({
          ...form.value,
          iccid: iccidList.value[i] || null, // 如果没有对应的iccid，设置为null
          imei: imeiList.value[i] || null  // 如果没有对应的imei，设置为null
        });
      }
      if (form.value.id) {
        updateSim(form.value).then(() => {
          ElMessage.success('操作成功');
          closeDialog();
          emits('refresh');
        })
      } else {
        addSim(simDTOs).then(() => {
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
