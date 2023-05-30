import Vue from "vue"
import collect from "collect.js"
import Decimal from "decimal.js-light"

const state = Vue.observable({ list: [] })

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
