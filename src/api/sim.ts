import {http} from '@/utils/http'
import {AddSimType, GetSimListParamsType} from "@/api/types/simTypes";

enum Api {
    updateSim = '/station/updateSim',
    getSimList = '/station/getSimList',
    getSimInfo = '/station/getSimInfo/',
    deleteSim = '/station/deleteSim/',
    addSim = '/station/addSim',
}

/** SIM卡*/
// SIM卡分页列表
export function getSimList(data:GetSimListParamsType) {
    return http.post<any>(Api.getSimList, data)
}
// 添加SIM卡
export function addSim(data: AddSimType | AddSimType[]) {
    return http.post<any>(Api.addSim,data)
}
// SIM卡详情
export function getSimInfo(id:string|number) {
    return http.post<any>(Api.getSimInfo+id)
}
// 修改SIM卡
export function updateSim(data:any) {
    return http.post<any>(Api.updateSim,data)
}
// 删除SIM卡
export function deleteSim(id:string|number) {
    return http.post<any>(Api.deleteSim+id)
}














