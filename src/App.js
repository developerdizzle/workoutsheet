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

  const [squatTrainingMax, setSquatTrainingMax] = createLocalStorageSignal(0, 'squatTrainingMax');
  const [benchPressTrainingMax, setBenchPressTrainingMax] = createLocalStorageSignal(0, 'benchPressTrainingMax');
  const [deadliftTrainingMax, setDeadliftTrainingMax] = createLocalStorageSignal(0, 'deadliftTrainingMax');
  const [overheadPressTrainingMax, setOverheadPressTrainingMax] = createLocalStorageSignal(0, 'overheadPressTrainingMax');

  const [unitOfMeasure, setUnitOfMeasure] = createLocalStorageSignal('lb', 'unitOfMeasure');

  // createMemo?
  const getTrainingMax = (key) => {
    switch (key) {
      case 'squat':
        return [squatTrainingMax, setSquatTrainingMax];
      case 'benchPress':
        return [benchPressTrainingMax, setBenchPressTrainingMax];
      case 'deadlift':
        return [deadliftTrainingMax, setDeadliftTrainingMax];
      case 'overheadPress':
       return [overheadPressTrainingMax, setOverheadPressTrainingMax];
    }

    return [];
  };

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
  const roundWeight = weight => {
    const interval = roundingInterval();

    return Math.ceil(weight / interval) * interval;
  };

  // createMemo?
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

  const uncheckAllCheckboxes = () => {
    [].slice.call(document.getElementsByTagName('input')).filter(e => e.type=='checkbox' && e.checked == true).forEach(e => e.click());
  };

  return (
    <div class="mdl-layout">
      <header class="mdl-layout__header mdl-layout--fixed-header">
        <div class="mdl-layout__header-row">
          <span class="mdl-layout-title">Jim Wendler's 5/3/1 for beginners</span>
          <div class="mdl-layout-spacer"></div>
          <nav class="mdl-navigation">
            <a class="mdl-navigation__link" href="https://www.jimwendler.com/blogs/jimwendler-com/101065094-5-3-1-for-a-beginner" target="_blank">How to start</a>
          </nav>
          <span class="unit-of-measure">
            <button class="mdl-button mdl-button--raised mdl-button--accent" onclick={e => setUnitOfMeasure(notUnitOfMeasure())}>
              {unitOfMeasure()}
            </button>
          </span>
        </div>
        <div class="mdl-layout__tab-bar mdl-js-ripple-effect">
          <For each={wendlerBeginners.weeks}>
            {(week, i) => {
              const classes = () => {
                return cc({
                  'mdl-layout__tab': true,
                  'is-active': i() === selectedWeek(),
                });
              };

              const setSelectedWeekAndClearComplete = () => {
                setSelectedWeek(i());
                uncheckAllCheckboxes();
              };

              return (
                <a class={classes()} onclick={setSelectedWeekAndClearComplete}>{week.name}</a>
              );
            }}
          </For>
        </div>
      </header>
      <section class="days">
        <For each={wendlerBeginners.days}>
          {(day, d) => {
            return (
              <div class="day">
                <h2>{day.name}</h2>
                <For each={day.exercises}>
                  {(exercise, e) => {
                    const [trainingMax, setTrainingMax] = getTrainingMax(exercise.key);

                    return (
                      <div class="exercise">
                        <h3>{exercise.name}</h3>
                        <p>
                          Training Max:
                          &nbsp;
                          <input type="number" value={trainingMax()} oninput={e => setTrainingMax(e.target.value)} />
                          &nbsp;
                          {unitOfMeasure()}
                        </p>
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
                                const [completed, setCompleted] = createLocalStorageSignal(false, `d${d()}e${e()}s${s()}-c`);

                                const weight = () => {
                                  const weight = set.percentage * trainingMax();

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
                          const [selectedAssistance, setSelectedAssistance] = createLocalStorageSignal('', `d${d()}eAs${a()}`);

                          const [completed, setCompleted] = createLocalStorageSignal(false, `d${d()}eAs${a()}-c`);

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
