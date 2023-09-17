import { ONE_DAY_UNIX, PCS_V2_START } from 'config/constants/info'
import { getUnixTime } from 'date-fns'
import { gql } from 'graphql-request'
import { isEmpty } from 'lodash'
import { DividendChartEntry, DividendTransaction } from 'state/info/types'
import { dividendClient } from 'utils/graphql'

const GLOBAL_DIVIDEND_TRANSACTIONS = gql`
  query {
    transactions(first: 50, orderBy: timestamp, orderDirection: desc) {
      id
      timestamp
      amount
    }
  }
`

export const fetchTopDividendTransactions = async (): Promise<DividendTransaction[] | undefined> => {
  try {
    const data = await dividendClient.request<{ transactions: DividendTransaction[] }>(GLOBAL_DIVIDEND_TRANSACTIONS)

    if (!data) {
      return undefined
    }
    return data.transactions
  } catch {
    return undefined
  }
}

const GLOBAL_DIVIDEND_CHART_DATA = gql`
  query dividendCharts($startTime: Int!, $skip: Int!) {
    dividendDayDatas(first: 1000, skip: $skip, where: { date_gt: $startTime }, orderBy: date, orderDirection: asc) {
      date
      dailyDistributed
    }
  }
`

export const fetchDividendChartData = async (): Promise<DividendChartEntry[] | undefined> => {
  try {
    let skip = 0
    let allFound = false
    const formattedDayDatas: { [date: number]: DividendChartEntry } = {}

    while (!allFound) {
      // eslint-disable-next-line no-await-in-loop
      const data = await dividendClient.request<{
        dividendDayDatas: DividendChartEntry[]
      }>(GLOBAL_DIVIDEND_CHART_DATA, { startTime: PCS_V2_START, skip })

      skip += 1000

      if (!data?.dividendDayDatas) {
        return undefined
      }
      allFound = (data.dividendDayDatas?.length || 0) < 1000

      if (data) {
        data.dividendDayDatas.forEach((dayData) => {
          const dayOrdinal = parseInt((dayData?.date / ONE_DAY_UNIX).toFixed(0))
          dayData.dailyDistributed = Number(dayData?.dailyDistributed)
          formattedDayDatas[dayOrdinal] = dayData
        })
      }
    }
    if (isEmpty(formattedDayDatas)) {
      return undefined
    }

    const availableDays = Object.keys(formattedDayDatas).map((dayOrdinal) => parseInt(dayOrdinal, 10))

    const firstAvailableDayData = formattedDayDatas[availableDays[0]]
    // fill in empty days ( there will be no day datas if no trades made that day )
    let timestamp = firstAvailableDayData?.date ?? PCS_V2_START

    const endTimestamp = getUnixTime(new Date())
    while (timestamp < endTimestamp - ONE_DAY_UNIX) {
      timestamp += ONE_DAY_UNIX
      const dayOrdinal = parseInt((timestamp / ONE_DAY_UNIX).toFixed(0), 10)
      if (!Object.keys(formattedDayDatas).includes(dayOrdinal.toString())) {
        formattedDayDatas[dayOrdinal] = {
          date: timestamp,
          dailyDistributed: 0,
        }
      }
    }

    return Object.values(formattedDayDatas)
  } catch (ex) {
    console.error(ex)
    return undefined
  }
}
