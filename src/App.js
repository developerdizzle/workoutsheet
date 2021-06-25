import './App.css';

import cc from 'classcat';

import { createSignal, createEffect } from "solid-js";

import wendlerBeginners from './workouts/wendler/beginners.json';

const createLocalStorageSignal = (defaultValue, key) => {
  const localStorageValue = JSON.parse(localStorage.getItem(key));

  const [get, set] = createSignal(localStorageValue || defaultValue);

  localStorage.on

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

  const notUnitOfMeasure = () => {
    switch (unitOfMeasure()) {
      case 'lb':
        return 'kg';
      case 'kg':
        return 'lb';
      default:
        return 'kg';
    }
  }

  const removeAllCompleted = () => {
    wendlerBeginners.weeks.forEach((week, w) => {
      wendlerBeginners.days.forEach((day, d) => {
        week.sets.forEach((set, s) => {
          day.exercises.forEach((exercise, e) => {
            const key = `${w}-${d}-${e}-${s}-c`;

            // console.log(key);

            localStorage.removeItem(key);
          });

          const key = `${w}-${d}-a-${s}-c`;

          // console.log(key);

          localStorage.removeItem(key);
        });
      });
    });
  };

  return (
    <div class="mdl-layout">
      <header class="mdl-layout__header mdl-layout--fixed-header">
        <div class="mdl-layout__header-row">
          <span class="mdl-layout-title">Jim Wendler's 5/3/1 for beginners</span>
          <div class="mdl-layout-spacer"></div>
          <span class="unit-of-measure">
            <button class="mdl-button mdl-button--raised mdl-button--accent" onclick={e => setUnitOfMeasure(notUnitOfMeasure())}>
              {unitOfMeasure()}
            </button>
          </span>
        </div>
      </header>
      <section>
      <ul class="stats">
          <li class="title">
            <strong>1-rep maxes:</strong>
          </li>
          <li class="stat">
            Squat
            &nbsp;
            <input type="number" value={squat1rm()} oninput={e => setSquat1rm(e.target.value)} />
            &nbsp;
            {unitOfMeasure()}
          </li>
          <li class="stat">
            Bench Press
            &nbsp;
            <input type="number" value={benchPress1rm()} oninput={e => setBenchPress1rm(e.target.value)} />
            &nbsp;
            {unitOfMeasure()}
          </li>
          <li class="stat">
            Deadlift
            &nbsp;
            <input type="number" value={deadlift1rm()} oninput={e => setDeadlift1rm(e.target.value)} />
            &nbsp;
            {unitOfMeasure()}
          </li>
          <li class="stat">
            Overhead Press
            &nbsp;
            <input type="number" value={overheadPress1rm()} oninput={e => setOverheadPress1rm(e.target.value)} />
            &nbsp;
            {unitOfMeasure()}
          </li>
        </ul>

        {/* <table class="mdl-data-table">
          <thead>
            <tr>
              <th class="mdl-data-table__cell--non-numeric">Stat</th>
              <th>1-rep max</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td class="mdl-data-table__cell--non-numeric">Squat</td>
              <td>
                <input type="number" value={squat1rm()} oninput={e => setSquat1rm(e.target.value)} />
                &nbsp;
                {unitOfMeasure()}
              </td>
            </tr>
            <tr>
              <td class="mdl-data-table__cell--non-numeric">Bench Press</td>
              <td>
                <input type="number" value={benchPress1rm()} oninput={e => setBenchPress1rm(e.target.value)} />
                &nbsp;
                {unitOfMeasure()}
              </td>
            </tr>
            <tr>
              <td class="mdl-data-table__cell--non-numeric">Deadlift</td>
              <td>
                <input type="number" value={deadlift1rm()} oninput={e => setDeadlift1rm(e.target.value)} />
                &nbsp;
                {unitOfMeasure()}
              </td>
            </tr>
            <tr>
              <td class="mdl-data-table__cell--non-numeric">Overhead Press</td>
              <td>
                <input type="number" value={overheadPress1rm()} oninput={e => setOverheadPress1rm(e.target.value)} />
                &nbsp;
                {unitOfMeasure()}
              </td>
            </tr>
          </tbody>
        </table> */}
      </section>
      {/* <div class="mdl-tabs mdl-js-tabs">
        <div class="mdl-tabs__tab-bar">
            <a href="#starks-panel" class="mdl-tabs__tab is-active">Starks</a>
            <a href="#lannisters-panel" class="mdl-tabs__tab">Lannisters</a>
            <a href="#targaryens-panel" class="mdl-tabs__tab">Targaryens</a>
        </div>
      </div> */}
      <section class="weeks">
        <div class="mdl-tabs mdl-js-tabs">
          <div class="mdl-tabs__tab-bar">
            <For each={wendlerBeginners.weeks}>
              {(week, i) => {
                const classes = () => {
                  return cc({
                    'mdl-tabs__tab': true,
                    'is-active': i() === selectedWeek(),
                  });
                };

                const setSelectedWeekAndClearComplete = () => {
                  setSelectedWeek(i());
                  removeAllCompleted();
                }

                return (
                  <a class={classes()} onclick={setSelectedWeekAndClearComplete}>{week.name}</a>
                );
              }}
            </For>
          </div>
        </div>
      </section>
      <section class="days">
        <For each={wendlerBeginners.days}>
          {(day, d) => {
            return (
              <div class="day">
                <h2>{day.name}</h2>
                <For each={day.exercises}>
                  {(exercise, e) => {
                    return (
                      <div class="exercise">
                        <h3>{exercise.name}</h3>
                        <table class="sets mdl-data-table">
                          <thead>
                            <tr>
                              <th>% of TM</th>
                              <th>Weight</th>
                              <th>Reps</th>
                              <th></th>
                            </tr>
                          </thead>
                          <tbody>
                            <For each={wendlerBeginners.weeks[selectedWeek()].sets}>
                              {(set, s) => {
                                const [completed, setCompleted] = createLocalStorageSignal(false, `${selectedWeek()}-${d()}-${e()}-${s()}-c`);

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
                                    <td>
                                      <input type="checkbox" class="mdl-checkbox__input" checked={completed()} onclick={e => setCompleted(e.target.checked)} />
                                    </td>
                                  </tr>
                                );
                              }}
                            </For>
                          </tbody>
                        </table>
                      </div>
                    );
                  }}
                </For>
                <div class="exercise">
                  <h3>Assistance Work</h3>
                  <table class="sets mdl-data-table">
                    <thead>
                      <tr>
                        <th>Type</th>
                        <th>Exercise</th>
                        <th>Reps</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      <For each={wendlerBeginners.assistance}>
                        {(assistance, a) => {
                          const [selectedAssistance, setSelectedAssistance] = createLocalStorageSignal('', `${d()}-${assistance.name}`);

                          const completedKey = () => {
                            return `${selectedWeek()}-${d()}-a-${a()}-c`;
                          };

                          // TODO: This sticks between weeks
                          // Need to createEffect around it?
                          const [completed, setCompleted] = createLocalStorageSignal(false, completedKey());

                          createEffect(() => console.log('hello', completedKey(), completed()));

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
                              <td>
                                <input type="checkbox" class="mdl-checkbox__input" checked={completed()} onclick={e => setCompleted(e.target.checked)} />
                              </td>
                            </tr>
                          );
                        }}
                      </For>
                    </tbody>
                  </table>
                </div>
              </div>
            );
          }}
        </For>
      </section>
    </div>
  );
}

export default App;
