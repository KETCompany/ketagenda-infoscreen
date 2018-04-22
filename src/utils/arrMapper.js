const arrToObj = arr =>
  arr.reduce((acc, curr) => {
    acc[curr] = false;
    return acc;
  }, {});

export default arrToObj;
