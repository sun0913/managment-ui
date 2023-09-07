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
            <el-form-item label="上传图片" prop="image">
              <el-upload
                  list-type="picture-card"
                  action="上传接口地址"
                  :file-list="fileList"
                  :on-success="handleUploadSuccess"
                  :on-remove="handleRemove"
                  :before-upload="beforeUpload"
              >
                <el-icon><Plus /></el-icon>
              </el-upload>
              <el-dialog v-model="dialogVisible">
                <img w-full :src="dialogImageUrl" alt="Preview Image" />
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
import {Plus} from "@element-plus/icons-vue";

const formRef = ref<FormInstance>()

// 为 dataTypes 添加一个明确的类型定义
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

}
// 提交
const submit = async () => {

  if (!formRef.value) return;
  await formRef.value.validate((valid) => {
    if (valid) {
      if (form.value.id) {
        updateSite(form.value).then(() => {
          ElMessage.success('操作成功');
          closeDialog();
          emits('refresh');
        })
      } else {
        addSite(form.value).then(() => {
          ElMessage.success('操作成功');
          closeDialog();
          emits('refresh');
        })
      }
    }
  })
}
const fileList = ref([]);  // 已上传文件列表

const handleUploadSuccess = (response: any, file: any, fileList: any) => {
  // 上传成功的逻辑
  ElMessage.success("上传成功");
};

const handleRemove = (file: any, fileList: any) => {
  // 删除文件的逻辑
};

const dialogImageUrl = ref('')
const dialogVisible = ref(false)
const disabled = ref(false)
const handlePictureCardPreview = (file: UploadFile) => {
  dialogImageUrl.value = file.url!
  dialogVisible.value = true
}

const beforeUpload = (file: any) => {
  // 上传前的逻辑，例如检查文件大小、格式等
};

defineExpose({
  openDialog,
});
</script>

<style scoped>

</style>
