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
        <!-- 添加传感器/设备 -->
            <el-form-item label="添加传感器/设备" prop="sensorName">
              <div class="sensor-container">
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
            <el-form-item label="添加配件" prop="accessoriesName">
              <div class="sensor-container">
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
            <el-form-item label="添加SIM卡" prop="simCardInfo">
              <div class="sensor-container">
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
                  list-type="picture-card"
                  :http-request="handleFileChange"
                  :file-list="fileList"
                  :on-success="handleUploadSuccess"
                  :on-remove="handleRemove"
                  :before-upload="beforeUpload"
              >
                <el-icon><Plus /></el-icon>
                <template #file="{file}">
                  <div class="el-upload-list__item-thumbnail">
                    <img :src="getUrl(file)" alt="Uploaded File Preview" class="el-upload-list__item-preview" @click="handlePictureCardPreview(file)" />
                  </div>
                </template>
              </el-upload>
              <el-dialog v-model="dialogVisible">
                <img :src="dialogImageUrl" alt="Preview Image" style="width: 100%;" />
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
import {addSite, getSiteInfo, updateSite, uploadSiteImage} from "@/api/site";
import {AddSiteType} from "@/api/types/siteType";
import {Plus} from "@element-plus/icons-vue";
import FormItemWithDynamicInput from './FormItemWithDynamicInput.vue';


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
  // 使用你的实际接口
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

// 提交
const submit = async () => {
  if (!formRef.value) return;
  await formRef.value.validate((valid) => {
    if (valid) {
      let sensorSnMapping: string[] = [];
      let accessoriesSnMapping: string[] = [];
      let simCardSnMapping: string[] = [];

      if (Array.isArray(form.value.sensorName)) {
        form.value.sensorName.forEach((name) => {
          sensorSnMapping = sensorSnMapping.concat(inputSnMapping.value[name] || []);
        });
      }

      if (Array.isArray(form.value.accessoriesName)) {
        form.value.accessoriesName.forEach((name) => {
          accessoriesSnMapping = accessoriesSnMapping.concat(inputSnMapping.value[name] || []);
        });
      }

      if (Array.isArray(form.value.simCardInfo)) {
        form.value.simCardInfo.forEach((name) => {
          simCardSnMapping = simCardSnMapping.concat(inputSnMapping.value[name] || []);
        });
      }

      const submitData = {
        ...form.value,
        sensorSnMapping,
        accessoriesSnMapping,
        simCardSnMapping
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
  });
}
// 已上传的文件列表
const fileList = ref<UploadFile[]>([]);
const dialogImageUrl = ref('');  // 用于存储要预览的图片的 URL
const dialogVisible = ref(false);  // 控制预览对话框的显示/隐藏

const getUrl = (file: any) => {
  return (file as UploadFile).url || '';
};

// 图片预览
const handlePictureCardPreview = (file: any) => {
  dialogImageUrl.value = file.url!;
  dialogVisible.value = true;
};
// 上传成功
const handleUploadSuccess = (response: any, file: any, fileList: any[]) => {
  ElMessage.success("上传成功");

};
// 在文件选择或拖拽时触发
const handleFileChange = (file: File) => {
  // 创建 FormData 对象
  const formData = new FormData();
  formData.append("file", file);

  // 下面的代码是用于本地预览的
  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = async (e) => {  // 注意这里添加了 async
    const newFile: UploadFile = {
      name: file.name,
      status: 'uploading',
      url: e.target?.result as string,
      uid: parseInt(Math.random().toString(36).substring(2), 36),
    };
    fileList.value.push(newFile);
    await uploadAndPreview(newFile, formData);  // 调用下面定义的 async 函数
  };
};

const uploadAndPreview = async (newFile: UploadFile, formData: FormData) => {
  try {
    // 使用导入的 uploadSiteImage 函数进行文件上传
    const response = await uploadSiteImage(formData);

    if (response.status === 200) {
      newFile.status = 'success';
      handleUploadSuccess(response, newFile, fileList.value);
    } else {
      newFile.status = 'fail';
      ElMessage.error('上传失败');
    }
  } catch (error) {
    newFile.status = 'fail';
    ElMessage.error(`上传出错：${error}`);
  }
  dialogImageUrl.value = newFile.url!;  // 更新预览图
};




// 删除文件
const handleRemove = (file: any, fileList: any[]) => {
  ElMessage.success("文件已删除");
};

// 上传前检查
const beforeUpload = (file: File) => {
  const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
  if (!isJpgOrPng) {
    ElMessage.error('仅支持 JPG/PNG 文件!');
    return false;
  }
  const isLt2M = file.size / 1024 / 1024 < 20;
  if (!isLt2M) {
    ElMessage.error('图片大小不能超过 2MB!');
    return false;
  }
  return true;
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
  flex-direction: row;  /* 横向排列 */
}
/* 确保图片可以根据容器大小自动缩放 */
.el-upload-list__item-preview {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;  /* 保持宽高比 */
}
</style>
