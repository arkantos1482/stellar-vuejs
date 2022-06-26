import Decimal from "decimal.js-light";

// export const toSeparated = (val) => val.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",")
export const toSeparated = (val) => {
    let parts = val.toString().split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return parts.join(".");
}

export const remSeparated = (val) => val.toString().replaceAll(',', '')

export const safeDecimal = (val) => {
    try {
        return new Decimal(val)
    } catch (e) {
        return new Decimal(0)
    }
}

export const decimalRegex = (dp) => {
    let pattern
    if (dp > 0) {
        pattern = '^$|^(\\d+\\.?(\\d{1,' + dp + '})?)$'
    } else {
        pattern = '^$|^(\\d+)$'
    }

    let regex = new RegExp(pattern)
    return regex
}
