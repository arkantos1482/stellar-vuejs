import Vue from "vue";
import collect from "collect.js";
import Decimal from "decimal.js-light";

const state = Vue.observable({ list: [], list2: [] });

export default () => state.list;

export const asList = () => state.list2;

export async function refresh(axios, user_id) {
  let balances = (await axios.$get(`/profiles/${user_id}/balances`)).balances;
  state.list2 = collect(balances)
    .reject((i) => i.asset_type === "native")
    .map((item) => {
      return {
        symbol: item.asset_code,
        balance: new Decimal(item.balance),
        selling_liabilities: new Decimal(item.selling_liabilities),
        actual_balance: new Decimal(item.balance).minus(
          item.selling_liabilities
        ),
      };
    }).toArray();

  state.list =
    collect(balances)
      .map((item) => {
        return {
          [item.asset_code]: {
            symbol: item.asset_code,
            balance: new Decimal(item.balance),
            selling_liabilities: new Decimal(item.selling_liabilities),
            actual_balance: new Decimal(item.balance).minus(
              item.selling_liabilities
            ),
          },
        };
      })
      .reduce((_acc, item) => ({ ..._acc, ...item })) ?? [];
}
