export interface ResVO<T> {
    message: string,
    success: boolean,
    data: T
}

export interface PowerUsedDetail {
    date: string;
    start: string;
    end: string;
    total: string;
    expense: string;
}

export interface PowerUsed {
    supportPv: boolean;
    ifPvcost: boolean;
    on: boolean;
    remarks: string;
    sn: string;
    houseName: string;
    dateList: string[];
    usedList: string[];
    powerUsedDetails: PowerUsedDetail[];
    hasShare: boolean;
    ifShare: boolean;
    totalUsed: string;
    totalAmount: string;
    type: string;
}

export interface MeterAddForm {
    ifPvCost: boolean;
    supportPv: boolean;
    remarks: string;
    sn: string;
    residualElectricity: string;
    meterId: number;
    important: boolean;
    unitPrice: number;
    meterPay: boolean;
    on: boolean;
    ifConfirm: boolean;
    userId: number;
    bleNo: string;
    meterAmount: string;
    meterMode: string;
}

export interface HouseInfo {
    address: string;
    houseId: number;
    meterAddForms: MeterAddForm[];
    surplusDay: number;
    occupancyType: string;
}

export interface PageVO<T> {
    total: number;
    size: number;
    pages: number;
    current: number;
    records: T[];
}