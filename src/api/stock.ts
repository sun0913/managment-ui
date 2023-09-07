import {http} from '@/utils/http'
import {GetStockListParamsType, StockInfoListQueryForm} from "@/api/types/stockTypes";

enum Api {
    getStockList = '/station/getStockList',
    getStockInfo = '/station/getStockInfo/',
    getStockInfoList = '/station/getStockInfoList/',
}

/** 库存*/
// 库存分页列表
export function getStockList(data:GetStockListParamsType) {
    return http.post<any>(Api.getStockList, data)
}
// 库存详情
export function getStockInfo(id:string|number) {
    return http.post<any>(Api.getStockInfo+id)
}
export function getStockInfoList(data:StockInfoListQueryForm) {
    return http.post<any>(Api.getStockInfoList, data)
}

