import { http } from '@tauri-apps/api';
import { Response } from '@tauri-apps/api/http';
import { HouseInfo, PowerUsed, ResVO, PageVO } from '../types/types';

const token = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwYXNzd29yZCI6IjJjYzI3Mjc4MjYwNmNjNWJhODMxODlhODBmY2ZjNDYyIiwiYWN0aXZpdGkiOmZhbHNlLCJzY29wZSI6WyJhcHAiXSwiaWQiOjYwNTg4MSwibGFuZGxvcmRJZCI6NjA1ODgxLCJleHAiOjE3MjIwODA2MTAsImp0aSI6ImUxOTQ5NzIzLTcwMTUtNDA0ZC1hZTRmLWIxNGQ4MWIwNmZhZiIsImNsaWVudF9pZCI6IkFQUCJ9.IMXQlRGVrx6cEaAw8vUb9pSP0VobzS2PRZMtgZCakLo'

export const queryHouseInfo = (): Promise<Response<ResVO<PageVO<HouseInfo>>>> => {
    return http.fetch(`https://api.zhihuifangdong.net/core/app/rentExt/rentHouseInfoHb?current=1&size=1`, {
        method: 'GET',
        headers: {
            'xweb_xhr': '1',
            'Authorization': token,
            'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
        }
    })
}

/**
 * 查询某天的用电详情
 * @param date: 如 2023-02-03 
 * @returns: 用电详情
 */
export const queryOneDayData = (date: string): Promise<Response<ResVO<PowerUsed>>> => {
    return http.fetch(`https://api.zhihuifangdong.net/netty/web/meter/analyzeIndex?time=${date}&id=1106640`, {
        method: 'GET',
        headers: {
            'xweb_xhr': '1',
            'Authorization': token,
            'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
        }
    })
}


/**
 * 日期范围查询的用电详情
 * @param date: 如 2023-02-03 
 * @returns: 用电详情
 */
export const queryDateRangeData = (startDate: string, endDate: string): Promise<Response<ResVO<PowerUsed>>> => {
    return http.fetch(`https://api.zhihuifangdong.net/netty/app/meter/analyze?start=${startDate}&end=${endDate}&id=1106640`, {
        method: 'GET',
        headers: {
            'xweb_xhr': '1',
            'Authorization': token,
            'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
        }
    })
}