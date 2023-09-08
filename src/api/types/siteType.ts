import {ListParams} from "@/api/types/index";

export interface GetSiteParamsType extends ListParams{
}

// 明确 queryForm 的类型
export interface SiteListQueryForm{
    siteSn: string | null;
    name: string | null;
    type: string | null;
    code: string | null;
    location: string | null;
    installationDate: string | null;
    status: number;
}

export interface AddSiteType {
    id?: number
    siteSn?: string | null;
    name?: string | null;
    type?: string | null;
    code?: string | null;
    location?: string | null;
    installationDate?: string | null;
    installer?: string | null;
    sort?: number;
    image?: string | null;
    maintained: number
    status: number
    sensorName?: string[]
    accessoriesName?: string[]
    simCardInfo?: string[]
    // sensorList?: string[]
}