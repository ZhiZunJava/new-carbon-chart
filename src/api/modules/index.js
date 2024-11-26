
import { Get } from "../api"

/** 
 * 能耗总览
 */
export const getProductPowerReportYear = () => {
    return Get('/carbonReport/productPowerReport/year');
}

/** 
 * 能耗占比
 */
export const getEmissionChartPercent = () => {
    return Get('/carbonReport/emissionChart/percent');
}

/**
 * 库存预警
 */
export const getMaterialInventory = () => {
    return Get('/material/materialInventory/list')
}

/**
 * 销售统计
 */
export const getSaleState = () => {
    return Get('/carbonReport/saleStat')
}

/**
 * 生产统计
 */
export const getProductPowerReport = () => {
    return Get('/carbonReport/productPowerReport/list')
}

/**
 * 销售计划完成率
 */
export const getSalePlanAchieveRate = () => {
    return Get('/carbonReport/salePlan/achieveRate')
}

/**
 * 销售排名
 */
export const getSaleCustomerRanking = () => {
    return Get('/carbonReport/saleCustomer/ranking')
}

/**
 * 碳排放 - 今日
 */
export const getProductPowerReportDay = () => {
    return Get('/carbonReport/productPowerReport/day')
}

/**
 * 碳排放 - 本月
 */
export const getProductPowerReportMonth = () => {
    return Get('/carbonReport/productPowerReport/month')
}

/**
 * 碳排放 - 本年 view first get
 */

/** 
 * 碳排放排行榜
 */

export const getEquipmentPowerReportList = () => {
    return Get('/carbonReport/equipmentPowerReport/list')
}

/**
 * 销售总览 年，月，日
 */
export const getSaleOverall = () => {
    return Get('/carbonReport/saleOverall')
}