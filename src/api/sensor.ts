import {http} from '@/utils/http'
import {AddSensorType, GetSensorListParamsType} from "@/api/types/sensorTypes";

enum Api {
    updateStationSensor = '/station/updateStationSensor',
    getStationSensorList = '/station/getStationSensorList',
    getStationSensor = '/station/getStationSensor/',
    deleteStationSensor = '/station/deleteStationSensor/',
    addStationSensor = '/station/addStationSensor',
}

/** 传感器*/
// 传感器分页列表
export function getStationSensorList(data:GetSensorListParamsType) {
    return http.post<any>(Api.getStationSensorList, data)
}
// 添加传感器
export function addStationSensor(data:AddSensorType[]) {
    return http.post<any>(Api.addStationSensor,data)
}
// 传感器详情
export function getStationSensor(id:string|number) {
    return http.post<any>(Api.getStationSensor+id)
}
// 修改传感器
export function updateStationSensor(data:any) {
    return http.post<any>(Api.updateStationSensor,data)
}
// 删除传感器
export function deleteStationSensor(id:string|number) {
    return http.post<any>(Api.deleteStationSensor+id)
}














