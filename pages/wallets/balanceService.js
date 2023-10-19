import Decimal from "decimal.js-light"

// const state = Vue.observable({ list: [] })
const state = {
  list: {
    BTC: {
      symbol: "BTC",
      total_balance: 1,
      locked_balance: 0.2,
      actual_balance: 0.8
    },
    TRX: {
      symbol: "TRX",
      total_balance: 1000,
      locked_balance: 300,
      actual_balance: 700
    },
    LTC: {
      symbol: "LTC",
      total_balance: 100,
      locked_balance: 0,
      actual_balance: 100
    }
  }

}
export default function () {
  return state.list
}

export const asList = () => state.list.toArray()

export async function refresh(axios, user_id) { }
// export async function refresh(axios, user_id) {
//   let balances = await axios.$get(`/profiles/${user_id}/balances`)

//   state.list =
//     collect(balances.data)
//       .map(item => {
//         return {
//           [item.asset]: {
//             symbol: item.asset,
//             total_balance: new Decimal(item.balance),
//             locked_balance: new Decimal(item.locked_balance),
//             actual_balance: new Decimal(item.balance).minus(item.locked_balance)
//           }
//         }
//       })
//       .reduce((_acc, item) => ({ ..._acc, ...item })) ?? []
// }
