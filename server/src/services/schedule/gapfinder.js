/**
 * Find gaps in an unsorted Array of intervals
 * @param {Array<[from,to]>} arr 
 */
class Gapfinder {

    /**
     * Find gaps in an array of intervals
     * @param {Array<[from,to]>} arr 
     * @returns a new array with the gaps (if any)
     */
    findgaps(arr) {
        const norm=this.dedup(arr)
        
    }

    /**
     * remove duplicate intervals and merge overlapping intervals in an array
     * @param {Array<[from,to]>} arr
     * @returns a new deduplicated array or undefined if the input was not an Array
     */
    dedup(arr) {
        if (!Array.isArray(arr)) {
            return undefined
        }
        if (arr.length == 0) {
            return []
        }
        const ordered = arr.sort((a, b) => {
            if (a[0] == b[0]) {
                return a[1] - b[1]
            } else {
                return a[0] - b[0]
            }
        })
        const deduped = []
        let prev = ordered.shift()
        deduped.push(prev)
        while (ordered.length) {
            let act = ordered.shift()
            if (this.overlaps(prev, act)) {
                prev[0] = Math.min(prev[0], act[0])
                prev[1] = Math.max(prev[1], act[1])
            } else {
                deduped.push(act)
                prev = act
            }
        }
        return deduped
    }

    /**
     * check if two intervals overlap
     * @param {[from,to]} a 
     * @param {[from,to]} b 
     */
    overlaps(a, b) {
        if (a[0] > b[0] && a[0] < b[1]) {
            return true
        }
        if (a[1] > b[0] && a[1] < b[1]) {
            return true
        }
        if (a[0] > b[0] && a[1] < b[1]) {
            return true
        }
        if (a[0] < b[0] && a[1] > b[0]) {
            return true
        }
        return false
    }
}
module.exports = Gapfinder