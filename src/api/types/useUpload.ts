import { ref } from 'vue'
import { ElMessage, UploadFile } from 'element-plus'
import {uploadSiteImage} from "@/api/upload";

export default function useUpload() {
    //图片上传组件ref属性
    const uploadRef = ref()
    //图片预览地址
    const dialogImageUrl = ref('')
    //是否点击预览
    const dialogVisible = ref(false)
    const disabled = ref(false)
    //上传的文件
    const fileList = ref<UploadFile[]>([])
    //上传图片的地址
    const imgurl = ref('');
    //删除图片
    const handleRemove = (file: UploadFile) => {
        console.log(file)
        console.log(fileList.value)
        fileList.value = fileList.value.filter(item => item.name != file.name)
    }
    //点击预览图片
    const handlePictureCardPreview = (file: UploadFile) => {
        dialogImageUrl.value = imgurl.value;
        dialogVisible.value = true
    }
    const chosenFile = ref<File | null>(null); // 这里新增一行
    //图片上传
    const uploadFile = async (file: any) => {
        const typeArr = ["image/png", "image/gif", "image/jpeg", "image/jpg"];
        const isImg = typeArr.indexOf(file.raw.type) !== -1;
        const isMore3M = file.size / 1024 / 1024 < 30;
        if (!isImg) {
            ElMessage.warning("只能上传图片类型!");
            uploadRef.value?.clearFiles()
            return;
        }
        if (!isMore3M) {
            ElMessage.warning("只能上传图片类型!");
            uploadRef.value?.clearFiles()
            return;
        }
        chosenFile.value = file.raw; // 这里仅保存文件，而不进行上传
        const formData = new FormData();
        formData.append("file", file.raw);
        // let res = await uploadSiteImage(formData);
        // if (res && res.code == 200 && res.data) {
        //     console.log(res.data)
        //     imgurl.value = process.env.BASE_API + res.data;
        //     ElMessage.success("图片上传成功!");
        // }
        const uploadResponse = await uploadSiteImage(formData);
        ElMessage.success('图片上传成功!');
        imgurl.value = uploadResponse;
    }
    return {
        dialogImageUrl,
        dialogVisible,
        disabled,
        handleRemove,
        handlePictureCardPreview,
        fileList,
        uploadFile,
        uploadRef,
        imgurl,
        chosenFile
    }
}