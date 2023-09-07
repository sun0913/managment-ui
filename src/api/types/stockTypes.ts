import {ListParams} from "@/api/types/index";

export interface GetStockListParamsType extends ListParams{
}

// 明确 queryForm 的类型
export interface StockListQueryForm{
    name: string | null;
    type: string | null;
}

export interface StockInfoListQueryForm{
    name: string | null;
    code: string | null;
    type: string | null;
}