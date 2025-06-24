export const sort = (arr, key, order) => {
  if (arr.length <= 1) {
    return arr;
  } else {
    const pivot = Math.floor(arr.length / 2);
    const left = [];
    const right = [];
    arr.forEach((item, index) => {
      if (order === 0) {
        if (index !== pivot) {
          if (item[key] <= arr[pivot][key]) {
            left.push(item);
          }
          if (item[key] > arr[pivot][key]) {
            right.push(item);
          }
        }
      } else {
        if (index !== pivot) {
          if (item[key] >= arr[pivot][key]) {
            left.push(item);
          }
          if (item[key] < arr[pivot][key]) {
            right.push(item);
          }
        }
      }
    });
    return [...sort(left, key, order), arr[pivot], ...sort(right, key, order)];
  }
};
