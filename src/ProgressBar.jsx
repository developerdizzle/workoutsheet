import cc from "classcat";
import { createEffect } from "solid-js";

const getSetProgress = (progress, week, day, exercise, set, setIndex) => {
  const progressKey = () => `w${week}d${day}e${exercise}s${setIndex}`;

  const setProgress = () => progress?.[progressKey()];

  if (setProgress()) {
    if (set.steps) {
      return setProgress() === true ? set.steps.length + 1 : setProgress();
    }

    return 1;
  }

  return 0;
};

const getExerciseProgress = (progress, week, day, exercise, sets) => {
  const totalSetProgress = sets.reduce((prev, curr, i) => {
    const setProgress = getSetProgress(progress, week, day, exercise, curr, i);

    return setProgress + prev;
  }, 0);

  return totalSetProgress;
};

const getTotalSetCount = (sets) => {
  return sets.reduce((prev, curr) => {
    const currSetcount = curr.steps ? curr.steps.length + 1 : 1;
    return prev + currSetcount;
  }, 0);
};

const ProgressBar = (props) => {
  createEffect(() => {
    console.log(props.progress);
  });

  // const exerciseProgress = getExerciseProgress(
  //   props.progress,
  //   props.week,
  //   props.day,
  //   props.exercise,
  //   props.sets
  // );

  // const totalSetCount = getTotalSetCount(props.sets);

  // const percentage = () => (100 * exerciseProgress) / totalSetCount;
  // const classes = cc({
  //   progress: true,
  //   "progress-info": percentage() < 100,
  //   "progress-success": percentage() === 100,
  // });

  // createEffect(() => {
  //   console.log(exerciseProgress);
  // });

  // return <progress class={classes} value={percentage()} max="100" />;
  return <span>{JSON.stringify(props.progress).slice(0, 5)}</span>;
};

export { ProgressBar };
