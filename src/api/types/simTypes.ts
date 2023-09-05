import {ListParams} from "@/api/types/index";

export interface GetSimListParamsType extends ListParams{
}

// 明确 queryForm 的类型
export interface SimListQueryForm{
    operator: string | null;
    iccid: string | null;
    type: string | null;
    purchaseTime: string | null;
    renewalTime: number | null;
}

export interface AddSimType {
    id?: number | null;
    name: string | null;
    iccid?: string | null;
    imei?: string | null;
    operator?: string | null;
    siteId?: string | null;
    supplier?: string | null;
    type?: string | null;
    purchaseTime?: string;
    price?: number | null;
    specification?: number | null;
    renewalTime?: string | null;
    remark?: string | null;
    status: number | null;
    purchased: number | null;
    used: number | null;
    activated: number | null;
}
