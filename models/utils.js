export function toIndexedList(list) {
    return list.map((item, index) => ({...item, index: index + 1}))
}