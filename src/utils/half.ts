export const half = <T>(arr: T[]): [T[],T[]] => {
    return arr.length ? [arr.slice(0, Math.floor(arr.length / 2)), arr.slice(Math.floor(arr.length / 2))] : [[],[]]
}
