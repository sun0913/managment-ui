import {http} from '@/utils/http'

enum Api {
    getAllSysDicTreeList = '/sysDic/getAllSysDicTreeList',
    getSysDicTreeList = '/sysDic/getSysDicTreeList',
    addSysDic = '/sysDic/addSysDic',
    getSysDic = '/sysDic/getSysDic/',
    updateSysDic = '/sysDic/updateSysDic',
    deleteSysDic = '/sysDic/deleteSysDic/',
}

/** 部门*/
// 获取所有的部门树形列表
export function getAllSysDicTreeList(data:any) {
    return http.post<any>(Api.getAllSysDicTreeList, data)
}
// 获取启用的部门树形列表
export function getSysDicTreeList(data:any) {
    return http.post<any>(Api.getSysDicTreeList, data)
}
// 添加部门
export function addSysDic(data:any) {
    return http.post<any>(Api.addSysDic,data)
}
// 部门详情
export function getSysDic(id:string|number) {
    return http.post<any>(Api.getSysDic+id)
}
// 修改部门
export function updateSysDic(data:any) {
    return http.post<any>(Api.updateSysDic,data)
}
// 删除部门
export function deleteSysDic(id:string|number) {
    return http.post<any>(Api.deleteSysDic+id)
}














