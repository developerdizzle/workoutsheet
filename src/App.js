import './App.css';

import cc from 'classcat';

import { createSignal, createEffect } from "solid-js";

import wendlerBeginners from './workouts/wendler/beginners.json';

const createLocalStorageSignal = (defaultValue, key) => {
  const localStorageValue = JSON.parse(localStorage.getItem(key));

  const [get, set] = createSignal(localStorageValue || defaultValue);

  const newSet = value => {
    localStorage.setItem(key, JSON.stringify(value));

    set(value);
  };

  return [get, newSet];
};

const getRoundingInterval = unitOfMeasure => {
  switch (unitOfMeasure) {
    case 'lb':
      return 5;
    case 'kg':
      return 5;
  }

  return 1;
}

function App() {
  const [selectedWeek, setSelectedWeek] = createLocalStorageSignal(0, 'selectedWeek');

  const [squat1rm, setSquat1rm] = createLocalStorageSignal(0, 'squat1rm');
  const [benchPress1rm, setBenchPress1rm] = createLocalStorageSignal(0, 'benchPress1rm');
  const [deadlift1rm, setDeadlift1rm] = createLocalStorageSignal(0, 'deadlift1rm');
  const [overheadPress1rm, setOverheadPress1rm] = createLocalStorageSignal(0, 'overheadPress1rm');

  const [unitOfMeasure, setUnitOfMeasure] = createLocalStorageSignal('lb', 'unitOfMeasure');

  // createMemo?
  const roundingInterval = () => {
    switch (unitOfMeasure()) {
      case 'lb':
        return 5;
      case 'kg':
        return 5;
    }

    return 1;
  };

  // createMemo?
  const getTrainingMaxForExercise = name => {
    switch (name) {
      case 'Squats':
        return squat1rm() * 0.9;
      case 'Bench Presses':
        return benchPress1rm() * 0.9;
      case 'Deadlifts':
        return deadlift1rm() * 0.9;
      case 'Overhead Presses':
        return overheadPress1rm() * 0.9;
      default:
        return 0;
    }
  };

  // createMemo?
  const roundWeight = weight => {
    const interval = roundingInterval();

    return Math.ceil(weight / interval) * interval;
  };

  return (
    <>
      <header>
        <h1>Jim Wendler's 5/3/1 for beginners</h1>
      </header>
      <section class="stats">
        <span class="stat">
          <label>Unit of Measure</label>
          &nbsp;
          <select value={unitOfMeasure()} oninput={e => setUnitOfMeasure(e.target.value)}>
            <option value="kg">kg</option>
            <option value="lb">lb</option>
          </select>
        </span>
        <span class="stat">
          <label>Squat 1RM</label>
          &nbsp;
          <input type="number" value={squat1rm()} oninput={e => setSquat1rm(e.target.value)} />
          &nbsp;
          {unitOfMeasure()}
        </span>
        <span class="stat">
          <label>Bench Press 1RM</label>
          &nbsp;
          <input type="number" value={benchPress1rm()} oninput={e => setBenchPress1rm(e.target.value)} />
          &nbsp;
          {unitOfMeasure()}
        </span>
        <span class="stat">
          <label>Deadlift 1RM</label>
          &nbsp;
          <input type="number" value={deadlift1rm()} oninput={e => setDeadlift1rm(e.target.value)} />
          &nbsp;
          {unitOfMeasure()}
        </span>
        <span class="stat">
          <label>Overhead Press 1RM</label>
          &nbsp;
          <input type="number" value={overheadPress1rm()} oninput={e => setOverheadPress1rm(e.target.value)} />
          &nbsp;
          {unitOfMeasure()}
        </span>
      </section>
      <section class="weeks">
        <For each={wendlerBeginners.weeks}>
          {(week, i) => {
            const classes = () => {
              return cc({
                'week': true,
                'week--selected': i() === selectedWeek(),
              });
            };

            return (
              <button class={classes()} onclick={() => setSelectedWeek(i())}>{week.name}</button>
            );
          }}
        </For>
      </section>
      <section class="days">
        <For each={wendlerBeginners.days}>
          {day => {
            return (
              <section class="day">
                <h3>{day.name}</h3>
                <For each={day.exercises}>
                  {exercise => {
                    return (
                      <section class="exercise">
                        <h4>{exercise.name}</h4>
                        <table class="sets mdl-data-table">
                          <thead>
                            <tr>
                              <th>% of TM</th>
                              <th>Weight</th>
                              <th>Reps</th>
                            </tr>
                          </thead>
                          <tbody>
                            <For each={wendlerBeginners.weeks[selectedWeek()].sets}>
                              {set => {
                                const weight = () => {
                                  const trainingMax = getTrainingMaxForExercise(exercise.name);
                                  const weight = set.percentage * trainingMax;

                                  return roundWeight(weight).toString() + ' ' + unitOfMeasure().toString();
                                };

                                const percentage = set.percentage * 100;

                                const classes = cc({
                                  'set': true,
                                  [`set--${set.type}`]: true,
                                });

                                return (
                                  <tr class={classes} title={set.tooltip}>
                                    <td>{percentage}%</td>
                                    <td>{weight()}</td>
                                    <td>{set.reps}</td>
                                  </tr>
                                );
                              }}
                            </For>
                          </tbody>
                        </table>
                      </section>
                    );
                  }}
                </For>
                <h4>Assistance Work</h4>
                <table class="sets mdl-data-table">
                  <thead>
                    <tr>
                      <th>Type</th>
                      <th>Exercise</th>
                      <th>Reps</th>
                    </tr>
                  </thead>
                  <tbody>
                    <For each={wendlerBeginners.assistance}>
                      {assistance => {
                        const [selectedAssistance, setSelectedAssistance] = createLocalStorageSignal('', `${day.name}${assistance.name}`);

                        return (
                          <tr>
                            <td>{assistance.name}</td>
                            <td>
                              <select value={selectedAssistance()} oninput={e => setSelectedAssistance(e.target.value)}>
                                <For each={assistance.exercises}>
                                  {exercise => (<option value={exercise}>{exercise}</option>)}
                                </For>
                              </select>
                            </td>
                            <td>50-100</td>
                          </tr>
                        );
                      }}
                    </For>
                  </tbody>
                </table>
              </section>
            );
          }}
        </For>
      </section>
    </>
  );
}

export default App;
