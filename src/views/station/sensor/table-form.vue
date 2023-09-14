<template>
  <div v-if="dialogData.isShow">
    <el-dialog :model-value="true" destroy-on-close :title="dialogData.title" @close="closeDialog">
      <el-form ref="formRef" :rules="rules" :model="form" label-width="120px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="名称" prop="name">
              <el-select v-model="form.name" placeholder="请选择传感器名称">
                <el-option
                    v-for="item in dataTypes.sensorName"
                    :key="item.id"
                    :label="item.name"
                    :value="item.name">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row >
          <el-col :span="12">
            <el-form-item label="编号" style="margin-bottom: 10px;">
              <div style="display: flex; flex-direction: column; align-items: flex-start;">
                <div v-for="(sn, index) in sensorSnList" :key="index" style="display: flex; align-items: center; margin-bottom: 10px;">
                  <el-input v-model="sensorSnList[index]" placeholder="请输入编号" style="flex: 1;"></el-input>
                  <el-button @click="removeSensorSn(index)" v-if="index !== 0" style="margin-left: 10px;">删除</el-button>
                  <el-button type="primary" @click="addSensorSn" v-if="index === 0 && !isEditing" style="margin-left: 10px;">添加更多编号</el-button>
                </div>
              </div>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="分类" prop="type">
<!--              <el-input v-model="form.type" placeholder="请输入传感器所属公司"/>-->
              <el-select v-model="form.type" placeholder="请选择所属公司">
                <el-option
                    v-for="item in dataTypes.sensorTypes"
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
            <el-form-item label="供应商" prop="supplier">
              <el-input v-model="form.supplier" placeholder="请输入供应商"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="单价" prop="price">
              <el-input v-model="form.price" placeholder="请输入单价"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="新增日期" prop="purchaseTime">
              <el-date-picker v-model="form.purchaseTime" type="date" placeholder="请选择新增日期"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="是否新购" prop="purchased">
              <el-radio-group v-model="form.purchased">
                <el-radio :label="true" border>新购</el-radio>
                <el-radio :label="false" border>回收</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="是否检测" prop="detected">
              <el-radio-group v-model="form.detected">
                <el-radio :label="true" border>已检</el-radio>
                <el-radio :label="false" border>未检</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="是否维修" prop="repaired">
              <el-radio-group v-model="form.repaired">
                <el-radio :label="true" border>维修</el-radio>
                <el-radio :label="false" border>未修</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="是否可用" prop="status">
              <el-radio-group v-model="form.status">
                <el-radio :label="true" border>正常</el-radio>
                <el-radio :label="false" border>故障</el-radio>
              </el-radio-group>
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
import {addStationSensor, getStationSensor, updateStationSensor} from "@/api/sensor";
import {getSysDicByCode} from "@/api/dic";
import {AddSensorType} from "@/api/types/sensorTypes";
import {onMounted} from 'vue';

const formRef = ref<FormInstance>()

interface DataTypes {
  sensorName: any[],
  sensorTypes: any[]
}

const dataTypes: DataTypes = ref({
  sensorName: [],
  sensorTypes: []
}).value
const loadDataTypes = async (type: keyof DataTypes, code: string) => {
   // 使用你的实际接口
  dataTypes[type] = await getSysDicByCode(code);
};

onMounted(() => {
  loadDataTypes('sensorName', 'sensor');
  loadDataTypes('sensorTypes', 'company');
});

let sensorSnList = ref<string[]>(['']); // 存储多个传感器编号

const emits = defineEmits<{
  (event: 'refresh'): void
}>()

const getDefaultFormValues = (): AddSensorType => ({
  purchased: 1,
  detected: 1,
  repaired: 0,
  status: 1,
  used: 0,
})
let form = ref<AddSensorType>((getDefaultFormValues()));
// 效验规则
const rules = reactive<FormRules>({
  name: [
    {required: true, message: '请输入名称', trigger: 'blur'},
  ],
  type: [
    {required: true, message: '请输入所属公司', trigger: 'blur'},
  ],
  purchaseTime: [
    {required: true, message: '请选择新增日期', trigger: 'blur'},
  ],
  purchased: [
    {required: true, trigger: 'blur'},
  ],
  detected: [
    {required: true, trigger: 'blur'},
  ],
  status: [
    {required: true, trigger: 'blur'},
  ],
  repaired: [
    {required: true, trigger: 'blur'},
  ],
})

const addSensorSn = () => {
  sensorSnList.value.push('');
}
// 从数组中删除一个编号
const removeSensorSn = (index : number) => {
  sensorSnList.value.splice(index, 1);
};

const getDetails = (id: number | string) => {
  getStationSensor(id).then(res => {
    form.value = Object.assign({}, form.value, res);
    sensorSnList.value = [res.sensorSn];  // 填充传感器编号列表
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
  form.value = {status: 1, repaired: 0, detected: 1, purchased: 1, used: 0};
  sensorSnList.value = [''];  // 重置多个编号的数组
}
// 提交
const submit = async () => {
  // 首先检查 sensorSnList
  const emptySensorSn = sensorSnList.value.some(sn => !sn);
  if (emptySensorSn) {
    ElMessage.error('编号是必填项');
    return;
  }
  if (!formRef.value) return;
  await formRef.value.validate((valid) => {
    if (valid) {
      // 创建一个包含多个StationSensorAddDTO对象的数组
      const sensorDTOs = sensorSnList.value.map(sensorSn => {
        return {
          ...form.value,
          sensorSn
        };
      });
      if (form.value.id) {
        updateStationSensor(form.value).then(() => {
          ElMessage.success('操作成功');
          closeDialog();
          emits('refresh');
        })
      } else {
        addStationSensor(sensorDTOs).then(() => {
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
