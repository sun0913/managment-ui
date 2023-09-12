<template>
  <div v-if="dialogData.isShow">
    <el-dialog :model-value="true" destroy-on-close :title="dialogData.title" @close="closeDialog">
      <el-form ref="formRef" :rules="rules" :model="form" label-width="120px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="名称" prop="name">
              <el-input v-model="form.name" placeholder="请输入气象站名称"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="气象站编号" prop="siteSn">
              <el-input v-model="form.siteSn" placeholder="请输入气象站编号"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="安装人员" prop="installer">
              <el-input v-model="form.installer" placeholder="请输入安装人员"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="安装地点" prop="location">
              <el-input v-model="form.location" placeholder="请输入安装地点"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="类型" prop="code">
              <el-input v-model="form.code" placeholder="请输入气象站类型"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="排序" prop="sort">
              <el-input v-model="form.sort" placeholder="请输入排序号码"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="所属公司" prop="type">
              <el-select v-model="form.type" placeholder="请选择所属公司">
                <el-option
                    v-for="item in dataTypes.siteTypes"
                    :key="item.id"
                    :label="item.name"
                    :value="item.name">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="安装日期" prop="purchaseTime">
              <el-date-picker v-model="form.installationDate" type="date" placeholder="请选择安装日期"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col>
            <el-form-item label="备注" prop="remark">
              <el-input v-model="form.remark" placeholder="请输入备注信息"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col>
            <!-- 添加传感器/设备 -->
            <el-form-item label="传感器/编号" prop="sensorName">
              <div>
                <el-checkbox-group v-model="form.sensorName">
                  <FormItemWithDynamicInput
                      v-for="item in dataTypes.sensorName"
                      :key="item.id"
                      :item="item"
                      :selectedNames="form.sensorName"
                      :inputMapping="inputSnMapping"
                  ></FormItemWithDynamicInput>
                </el-checkbox-group>
              </div>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col>
            <!-- 添加传感器/设备 -->
            <el-form-item label="配件/数量" prop="accessoriesName">
              <div>
                <el-checkbox-group v-model="form.accessoriesName">
                  <FormItemWithDynamicInput
                      v-for="item in dataTypes.accessoriesName"
                      :key="item.id"
                      :item="item"
                      :selectedNames="form.accessoriesName"
                      :inputMapping="inputSnMapping"
                  ></FormItemWithDynamicInput>
                </el-checkbox-group>
              </div>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col>
            <el-form-item label="SIM卡/ICCID" prop="simCardInfo">
              <div>
                <el-checkbox-group v-model="form.simCardInfo">
                  <FormItemWithDynamicInput
                      v-for="item in dataTypes.simCardInfo"
                      :key="item.id"
                      :item="item"
                      :selectedNames="form.simCardInfo"
                      :inputMapping="inputSnMapping"
                  ></FormItemWithDynamicInput>
                </el-checkbox-group>
              </div>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col>
            <el-form-item label="上传图片" prop="image">
              <el-upload
                  ref="uploadRef"
                  action="#"
                  :on-change="uploadFile"
                  :auto-upload="false"
                  :limit="1"
                  :file-list="fileList"
                  list-type="picture-card"
              >
                <el-icon>
                  <Plus/>
                </el-icon>
                <template #file="{ file }">
                  <div>
                    <img
                        class="el-upload-list__item-thumbnail"
                        :src="getUrl(file)"
                        alt=""
                    />
                    <span class="el-upload-list__item-actions">
                                        <span
                                            class="el-upload-list__item-preview"
                                            @click="handlePictureCardPreview(<UploadFile>file)"
                                        >
                                          <el-icon><zoom-in/></el-icon>
                                        </span>
                                        <span
                                            v-if="!disabled"
                                            class="el-upload-list__item-delete"
                                            @click="handleRemove(<UploadFile>file)"
                                        >
                                          <el-icon><Delete/></el-icon>
                                        </span>
                      </span>
                  </div>
                </template>
              </el-upload>
              <el-dialog v-model="dialogVisible">
                <img :src="dialogImageUrl" alt="Preview Image" style="width: 100%;"/>
              </el-dialog>
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
import {ElMessage, FormInstance, FormRules, UploadFile} from "element-plus";
import {getSysDicByCode} from "@/api/dic";
import {onMounted} from 'vue';
import {addSite, getSiteInfo, updateSite} from "@/api/site";
import {AddSiteType} from "@/api/types/siteType";
import {Delete, Plus, ZoomIn} from "@element-plus/icons-vue";
import FormItemWithDynamicInput from './FormItemWithDynamicInput.vue';
import useUpload from "@/api/types/useUpload";


const formRef = ref<FormInstance>()

// 为 dataTypes 添加一个明确的类型定义
interface DataType {
  siteTypes: any[]; // 你可以替换为你的实际类型
  sensorName: any[],
  accessoriesName: any[]
  simCardInfo: any[]
}

const dataTypes: DataType = ref({
  siteTypes: [],
  sensorName: [],
  accessoriesName: [],
  simCardInfo: []
}).value;

// 为 loadDataTypes 函数的参数添加类型
const loadDataTypes = async (type: keyof DataType, code: string) => {
  dataTypes[type] = await getSysDicByCode(code);
};

onMounted(() => {
  loadDataTypes('siteTypes', 'company');
  loadDataTypes('sensorName', 'sensor');
  loadDataTypes('accessoriesName', 'accessories');
  loadDataTypes('simCardInfo', 'simCard');
});

const emits = defineEmits<{
  (event: 'refresh'): void
}>()

const getDefaultFormValues = (): AddSiteType => ({
  maintained: 0,
  status: 1
})
let form = ref<AddSiteType>((getDefaultFormValues()));
// 效验规则
const rules = reactive<FormRules>({
  name: [
    {required: true, message: '请输入气象站名称', trigger: 'blur'},
  ],
  siteSn: [
    {required: true, message: '请输入气象站编号', trigger: 'blur'},
  ],
  location: [
    {required: true, message: '请输入安装地点', trigger: 'blur'},
  ],
  installer: [
    {required: true, message: '请输入安装人员', trigger: 'blur'},
  ],
  installationDate: [
    {required: true, message: '请输入安装时间', trigger: 'blur'},
  ],
})

const getDetails = (id: number | string) => {
  getSiteInfo(id).then(res => {
    form.value = Object.assign({}, form.value, res);
    fileList.value = [{
      name: 'image.jpg',
      url: form.value.image as string,
      uid: Number(Date.now().toString()),
      status: 'success',
    }];
    imgurl.value = form.value.image as string;
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
    // 设置 fileList 和 imgurl

  }
}
// 关闭弹框
const closeDialog = () => {
  dialogData.isShow = false;
  dialogData.id = null;
  form.value = {maintained: 0, status: 1};
  inputSnMapping.value = {};  // 清空 sensorSnMapping
}

// 初始化一个空对象
const inputSnMapping = ref<{ [key: string]: string[] }>({});

// 当传感器名称、配件名称或SIM卡信息被选中时，初始化对应的序列号数组
watch(() => [...(form.value.sensorName || []), ...(form.value.accessoriesName || []), ...(form.value.simCardInfo || [])], (newNames) => {
  if (newNames) {
    newNames.forEach((name: string) => {
      if (!inputSnMapping.value[name]) {
        inputSnMapping.value[name] = [''];
      }
    });
  }
});

//图片上传
const {
  uploadRef,
  dialogImageUrl,
  dialogVisible,
  disabled,
  handleRemove,
  handlePictureCardPreview,
  fileList,
  uploadFile,
  imgurl
} = useUpload();

const getUrl = (file: any) => {
  return (file as UploadFile).url || '';
};

// 提交
const submit = async () => {
  console.log("submit function called"); // 添加这一行来检查函数是否被调用
  if (!formRef.value) return;
  let isValid = false;
  await formRef.value.validate((valid) => {
    isValid = valid;
  });
  if (isValid) {
    // 异步代码
    // 初始化为空对象
    let sensorSnMapping: { [key: string]: string[] } = {};
    let accessoriesNoMapping: { [key: string]: number[] } = {};
    let simCardSnMapping: { [key: string]: string[] } = {};

    if (Array.isArray(form.value.sensorName)) {
      form.value.sensorName.forEach((name) => {
        sensorSnMapping[name] = inputSnMapping.value[name] || [];
      });
    }
    console.log("sensorSnMapping:", sensorSnMapping);

    if (Array.isArray(form.value.accessoriesName)) {
      form.value.accessoriesName.forEach((name) => {
        accessoriesNoMapping[name] = (inputSnMapping.value[name] || []).map(Number);
      });
    }
    console.log("accessoriesNoMapping:", accessoriesNoMapping);

    if (Array.isArray(form.value.simCardInfo)) {
      form.value.simCardInfo.forEach((name) => {
        simCardSnMapping[name] = inputSnMapping.value[name] || [];
      });
    }
    console.log("simCardSnMapping:", simCardSnMapping);
    // 创建一个新的对象来存储转换后的数据
    const transformedInputSnMapping: { [key: string]: string | string[] } = {};

    // 对于每一个 name，如果有多个 sn，则存储为一个数组
    for (const [name, sns] of Object.entries(inputSnMapping.value)) {
      transformedInputSnMapping[name] = sns.length > 1 ? sns : sns[0];
    }

    // 创建一个 FormData 对象用于图片上传
    const formData = new FormData();

    fileList.value.forEach((file: UploadFile) => {
      formData.append("file", file.raw as File);  // 假设 file.raw 是原始的 File 对象
    });

    const submitData = {
      ...form.value,
      image: imgurl.value,  // 添加返回的文件ID
      sensorSnMapping: sensorSnMapping,
      accessoriesNoMapping: accessoriesNoMapping,
      simCardSnMapping: simCardSnMapping,
    };

    if (form.value.id) {
      updateSite(submitData).then(() => {
        ElMessage.success('操作成功');
        closeDialog();
        emits('refresh');
      });
    } else {
      addSite(submitData).then(() => {
        ElMessage.success('操作成功');
        closeDialog();
        emits('refresh');
      });
    }
  }
};

defineExpose({
  openDialog,
  inputSnMapping,  // 添加这行
});
</script>

<style scoped>
.el-checkbox-group {
  display: flex;
  flex-wrap: wrap;
  flex-direction: row; /* 横向排列 */
}

/* 确保图片可以根据容器大小自动缩放 */
.el-upload-list__item-preview {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain; /* 保持宽高比 */
}
</style>
