import { IncrementalCheckbox } from "./IncrementalCheckbox";

// createMemo?
const roundingInterval = (unitOfMeasure) => {
  switch (unitOfMeasure) {
    case "lb":
      return 5;
    case "kg":
      return 2.5;
  }

  return 1;
};

const roundWeight = (weight, unitOfMeasure) => {
  const interval = roundingInterval(unitOfMeasure);

  return Math.ceil(weight / interval) * interval;
};

const Set = (props) => {
  const weight = () => props.percentage * props.trainingMax;

  return (
    <tr>
      <td>{props.percentage * 100}%</td>
      <td>
        {roundWeight(weight(), props.unitOfMeasure).toString()}{" "}
        {props.unitOfMeasure}
      </td>
      <td>{props.reps}</td>
      <td>
        <IncrementalCheckbox
          value={props.progress}
          steps={props.steps}
          onchange={(e) => props.onChange(e.target.value)}
        />
      </td>
    </tr>
  );
};

export { Set };
