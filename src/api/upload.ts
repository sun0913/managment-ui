import {http} from "@/utils/http";
enum Api {
    uploadSiteImage = '/station/uploadSiteImage',
}
export function uploadSiteImage(formData: FormData) {
    return http.post<any>(Api.uploadSiteImage, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
}