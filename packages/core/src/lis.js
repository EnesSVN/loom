export const lis = (arr) => {
  if (arr.length === 0) return [];
  const db = Array(arr.length).fill(1);
  const prev = Array(arr.length).fill(-1);

  for (let i = 1; i < arr.length; i++) {
    for (let j = 0; j < i; j++) {
      if (arr[i] > arr[j] && db[i] < db[j] + 1) {
        db[i] = db[j] + 1;
        prev[i] = j;
      }
    }
  }
  let maxIndex = 0;
  for (let i = 1; i < db.length; i++) {
    if (db[i] > db[maxIndex]) {
      maxIndex = i;
    }
  }
  const lis = [];
  while (maxIndex !== -1) {
    lis.push(maxIndex);
    maxIndex = prev[maxIndex];
  }
  return lis.reverse();
};
