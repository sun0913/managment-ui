import {ListParams} from "@/api/types/index";

export interface GetAccessoriesParamsType extends ListParams{
}

// 明确 queryForm 的类型
export interface AccessoriesListQueryForm{
    name: string | null;
    type: string | null;
    purchaseTime: string | null;
}

export interface AddAccessoriesType {
    id?: number | null;
    name?: string | null;
    purchaseQuantity?: number | null;
    purchaseTime?: string;
    price?: number | null;
    type?: string | null;
    usageAmount?: number | null;
    remark?: string | null;
}
