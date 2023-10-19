import collect from "collect.js"
import Decimal from "decimal.js-light"

// const state = Vue.observable({ list: [] })
const state = {
  list: [{
    BTC: {
      symbol: "BTC",
      total_balance: new Decimal(1),
      locked_balance: new Decimal(0.2),
      actual_balance: new Decimal(1).minus(0.2)
    },
    TRX: {
      symbol: "TRX",
      total_balance: new Decimal(100000),
      locked_balance: new Decimal(200),
      actual_balance: new Decimal(100000).minus(2)
    },
    LTC: {
      symbol: "LTC",
      total_balance: new Decimal(100),
      locked_balance: new Decimal(2),
      actual_balance: new Decimal(100).minus(2)
    }
  }
  ]
}
export default () => state.list

export const asList = () => state.list.toArray()

export async function refresh(axios, user_id) {
  let balances = await axios.$get(`/profiles/${user_id}/balances`)

  state.list =
    collect(balances.data)
      .map(item => {
        return {
          [item.asset]: {
            symbol: item.asset,
            total_balance: new Decimal(item.balance),
            locked_balance: new Decimal(item.locked_balance),
            actual_balance: new Decimal(item.balance).minus(item.locked_balance)
          }
        }
      })
      .reduce((_acc, item) => ({ ..._acc, ...item })) ?? []
}
