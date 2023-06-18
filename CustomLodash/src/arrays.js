const s = require('../service_functions/arrayServiceFunctions');

function chunk(arr, num = 1) {
    num = Math.ceil(num);
    const length = arr === undefined ? 0 : arr.length;
    if (!length || num < 1) {
      return [];
    }
    let index = 0;
    let resIndex = 0;
    const finalArr = new Array(Math.ceil(length / num));
  
    while (index < length) {
        finalArr[resIndex++] = s.slice(arr, index, (index += num));
    }
    return finalArr;
  }

function compact(arr) {
    let resIndex = 0;
    const finalArr = [];

    if (arr === undefined) {
        return finalArr;
    }

    for (const val of arr) {
        if (val) {
            finalArr[resIndex++] = val;
        }
    }
    return finalArr;
}

function drop(arr, n = 1) {
    const length = arr === undefined ? 0 : arr.length;
    return length ? s.slice(arr, n < 0 ? 0 : Math.ceil(n), length) : [];
}

function dropWhile(arr, func) {
    const length = arr === undefined ? 0 : arr.length;
    let finalArr = [];
    for (let i = 0; i < length; i++) {
        if (!func(arr[i])) {
            finalArr = s.push(finalArr, arr[i]);
        }
    }
    return finalArr;
}

function take(arr, n = 1) {
    if (arr === undefined || arr.length === 0) {
        return [];
      }
    
    let finalArr = [];
    for (let i = 0; i < n; i++) {
        finalArr.push(arr[i]);
    }
    return finalArr;
}

function filter(array, predicate) {
    let index = -1;
    let resultIndex = 0;
    const length = array == null ? 0 : array.length;
    const finalArr = [];
  
    while (++index < length) {
      const value = array[index]
      if (predicate(value, index, array)) {
        finalArr[resultIndex++] = value;
      }
    }
    return finalArr;
}

function includes(arr, val) {
    for (let i = 0; i < arr.length; i++) {
        if (arr[i] === val) return true;
    }

    return false;
}

function map(arr, func) {
    let index = -1;
    const length = arr == null ? 0 : arr.length;
    let finalArr = [];
  
    while (++index < length) {
        finalArr[index] = func(arr[index], index, arr);
    }
    return finalArr;
  }

module.exports = {
    chunk,
    compact,
    drop,
    dropWhile,
    take,
    filter,
    includes,
    map,
};