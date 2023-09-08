import {http} from '@/utils/http'
import {AddSiteType, GetSiteParamsType} from "@/api/types/siteType";

enum Api {
    updateSite = '/station/updateSite',
    getSiteList = '/station/getSiteList',
    getSiteInfo = '/station/getSiteInfo/',
    deleteSite = '/station/deleteSite/',
    addSite = '/station/addSite',
    uploadSiteImage = '/station/uploadSiteImage',
}

/** SIM卡*/
// SIM卡分页列表
export function getSiteList(data:GetSiteParamsType) {
    return http.post<any>(Api.getSiteList, data)
}
// 添加SIM卡
export function addSite(data: AddSiteType | AddSiteType[]) {
    return http.post<any>(Api.addSite,data)
}
// SIM卡详情
export function getSiteInfo(id:string|number) {
    return http.post<any>(Api.getSiteInfo+id)
}
// 修改SIM卡
export function updateSite(data:any) {
    return http.post<any>(Api.updateSite,data)
}
// 删除SIM卡
export function deleteSite(id:string|number) {
    return http.post<any>(Api.deleteSite+id)
}

export function uploadSiteImage(formData: FormData) {
    return http.post<any>(Api.uploadSiteImage, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
}
