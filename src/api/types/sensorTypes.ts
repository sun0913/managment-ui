import {ListParams} from "@/api/types/index";

export interface GetSensorListParamsType extends ListParams{
}

// 明确 queryForm 的类型
export interface SensorListQueryForm{
    name: string | null;
    sensorSn: string | null;
    type: string | null;
    status?: number | null;
}

export interface AddSensorType {
    id?: number
    name?: string;
    sensorSn?: string;
    type?: string;
    siteId?: string | null;
    supplier?: string;
    purchaseTime?: string;
    price?: number;
    purchased: number | null;
    detected: number | null;
    repaired: number | null;
    status: number;
}
