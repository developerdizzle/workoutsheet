function roundingInterval(unitOfMeasure) {
  switch (unitOfMeasure) {
    case "lb":
      return 5;
    case "kg":
      return 2.5;
  }

  return 1;
};

function roundWeight(weight, unitOfMeasure) {
  const interval = roundingInterval(unitOfMeasure);

  return Math.ceil(weight / interval) * interval;
}

export { roundWeight };