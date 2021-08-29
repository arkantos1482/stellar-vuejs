export default function jsApi($axios) {
    return {
        onReady: async (callback) => {
            let res = await $axios.$get('/market/udf/config')
            // setTimeout(() => callback(res))
            callback(res)
        },
        // searchSymbols: (userInput, exchange, symbolType, onResultReadyCallback) => {
        //     $axios.$get('/market/udf/symbols')
        //     console.log('[searchSymbols]: Method call');
        // },
        resolveSymbol: async (symbolName, onSymbolResolvedCallback, onResolveErrorCallback) => {
            let res = await $axios.$get('/market/udf/symbols', {
                params: {symbol: symbolName}
            })
            onSymbolResolvedCallback(res)
        },
        getBars: async (symbolInfo, resolution, rangeStartDate, rangeEndDate, onResult, onError, firstDataRequest) => {
            try {
                let res = await $axios.$get('/market/udf/history', {
                    params: {
                        symbol: symbolInfo.name,
                        from: rangeStartDate,
                        to: rangeEndDate,
                        resolution: resolution,
                    }
                })
                if (res.noData) {
                    onResult([], {noData: true});
                } else {
                    onResult(res, {noData: false});
                }
            } catch (e) {
                onError(e)
            }
        },
        subscribeBars: (symbolInfo, resolution, onRealtimeCallback, subscribeUID, onResetCacheNeededCallback) => {
            console.log('[subscribeBars]: Method call with subscribeUID:', subscribeUID);
        },
        unsubscribeBars: (subscriberUID) => {
            console.log('[unsubscribeBars]: Method call with subscriberUID:', subscriberUID);
        },
    }
}