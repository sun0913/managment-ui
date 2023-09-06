import {http} from '@/utils/http'
import {AddAccessoriesType, GetAccessoriesParamsType} from "@/api/types/accessoriesTypes";

enum Api {
    updateAccessories = '/station/updateAccessories',
    getAccessoriesList = '/station/getAccessoriesList',
    getAccessoriesInfo = '/station/getAccessoriesInfo/',
    deleteAccessories = '/station/deleteAccessories/',
    addAccessories = '/station/addAccessories',
}

/** SIM卡*/
// SIM卡分页列表
export function getAccessoriesList(data:GetAccessoriesParamsType) {
    return http.post<any>(Api.getAccessoriesList, data)
}
// 添加SIM卡
export function addAccessories(data: AddAccessoriesType | AddAccessoriesType[]) {
    return http.post<any>(Api.addAccessories,data)
}
// SIM卡详情
export function getAccessoriesInfo(id:string|number) {
    return http.post<any>(Api.getAccessoriesInfo+id)
}
// 修改SIM卡
export function updateAccessories(data:any) {
    return http.post<any>(Api.updateAccessories,data)
}
// 删除SIM卡
export function deleteAccessories(id:string|number) {
    return http.post<any>(Api.deleteAccessories+id)
}














