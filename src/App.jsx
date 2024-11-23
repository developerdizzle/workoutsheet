import "./App.css";

import cc from "classcat";

import { createSignal } from "solid-js";
import { createStore } from "solid-js/store";

import { makePersisted } from "@solid-primitives/storage";

import { IncrementalCheckbox } from "./IncrementalCheckbox";
import wendlerBeginners from "./workouts/wendler/beginners.json";

function App() {
  const [selectedWeek, setSelectedWeek] = makePersisted(createSignal(0), {
    name: "selectedWeek",
  });

  const [squatTrainingMax, setSquatTrainingMax] = makePersisted(
    createSignal(0),
    { name: "squatTrainingMax" }
  );
  const [benchPressTrainingMax, setBenchPressTrainingMax] = makePersisted(
    createSignal(0),
    { name: "benchPressTrainingMax" }
  );
  const [deadliftTrainingMax, setDeadliftTrainingMax] = makePersisted(
    createSignal(0),
    { name: "deadliftTrainingMax" }
  );
  const [overheadPressTrainingMax, setOverheadPressTrainingMax] = makePersisted(
    createSignal(0),
    { name: "overheadPressTrainingMax" }
  );

  const [unitOfMeasure, setUnitOfMeasure] = makePersisted(createSignal("lb"), {
    name: "unitOfMeasure",
  });

  // createMemo?
  const getTrainingMax = (key) => {
    switch (key) {
      case "squat":
        return [squatTrainingMax, setSquatTrainingMax];
      case "benchPress":
        return [benchPressTrainingMax, setBenchPressTrainingMax];
      case "deadlift":
        return [deadliftTrainingMax, setDeadliftTrainingMax];
      case "overheadPress":
        return [overheadPressTrainingMax, setOverheadPressTrainingMax];
    }

    return [];
  };

  // createMemo?
  const roundingInterval = () => {
    switch (unitOfMeasure()) {
      case "lb":
        return 5;
      case "kg":
        return 2.5;
    }

    return 1;
  };

  // createMemo?
  const roundWeight = (weight) => {
    const interval = roundingInterval();

    return Math.ceil(weight / interval) * interval;
  };

  // createMemo?
  const notUnitOfMeasure = () => {
    switch (unitOfMeasure()) {
      case "lb":
        return "kg";
      case "kg":
        return "lb";
      default:
        return "kg";
    }
  };

  const [state, setState] = makePersisted(createStore({ sets: {} }), {
    name: "workoutsheet",
  });

  const clear = () => {
    if (confirm("Clear progress?")) {
      setState("progress", undefined);
      setSelectedWeek(0);
    }
  };

  return (
    <div class="mdl-layout">
      <header class="mdl-layout__header mdl-layout--fixed-header">
        <div class="mdl-layout__header-row">
          <span class="mdl-layout-title">5/3/1 for beginners</span>
          <div class="mdl-layout-spacer"></div>
          <nav class="mdl-navigation">
            <a
              class="mdl-navigation__link"
              href="https://www.jimwendler.com/blogs/jimwendler-com/101065094-5-3-1-for-a-beginner"
              target="_blank"
            >
              How to start
            </a>
          </nav>
          <span class="unit-of-measure">
            <button
              class="mdl-button mdl-button--raised mdl-button--accent"
              onclick={(e) => setUnitOfMeasure(notUnitOfMeasure())}
            >
              {unitOfMeasure()}
            </button>
          </span>
        </div>
        <div class="mdl-layout__tab-bar mdl-js-ripple-effect">
          <For each={wendlerBeginners.weeks}>
            {(week, i) => {
              const classes = () => {
                return cc({
                  "mdl-layout__tab": true,
                  "is-active": i() === selectedWeek(),
                });
              };

              const handleClick = () => {
                setSelectedWeek(i());
              };

              return (
                <a class={classes()} onclick={handleClick}>
                  {week.name}
                </a>
              );
            }}
          </For>
        </div>
      </header>
      <For each={wendlerBeginners.weeks}>
        {(week, w) => {
          const style = () => {
            return {
              display: w() === selectedWeek() ? "" : "none",
            };
          };

          return (
            <section class="days" style={style()}>
              <For each={wendlerBeginners.days}>
                {(day, d) => {
                  return (
                    <div class="day">
                      <h2>{day.name}</h2>
                      <For each={day.exercises}>
                        {(exercise, e) => {
                          const [trainingMax, setTrainingMax] = getTrainingMax(
                            exercise.key
                          );

                          const tm = trainingMax();

                          return (
                            <div class="exercise">
                              <h3>{exercise.name}</h3>
                              <p>
                                Training Max: &nbsp;
                                <input
                                  type="number"
                                  value={trainingMax()}
                                  oninput={(e) =>
                                    setTrainingMax(e.target.value)
                                  }
                                />
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
                                  <For
                                    each={
                                      wendlerBeginners.weeks[selectedWeek()]
                                        .sets
                                    }
                                  >
                                    {(set, s) => {
                                      const progressKey = `w${w()}d${d()}e${e()}s${s()}`;

                                      const completed =
                                        state.progress?.[progressKey];
                                      const setCompleted = (value) =>
                                        setState("progress", {
                                          [progressKey]: value,
                                        });

                                      const weight = () => {
                                        const weight =
                                          set.percentage * trainingMax();

                                        return (
                                          roundWeight(weight).toString() +
                                          " " +
                                          unitOfMeasure().toString()
                                        );
                                      };

                                      const percentage = set.percentage * 100;

                                      const classes = cc({
                                        set: true,
                                        [`set--${set.type}`]: true,
                                      });

                                      return (
                                        <tr class={classes} title={set.tooltip}>
                                          <td>{percentage}%</td>
                                          <td>{weight()}</td>
                                          <td>{set.reps}</td>
                                          <td>
                                            <IncrementalCheckbox
                                              value={completed}
                                              steps={set.steps}
                                              onchange={(e) =>
                                                setCompleted(e.target.value)
                                              }
                                            />
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
                                const assistanceKey = `d${d()}eAs${a()}`;
                                const progressKey = `w${w()}d${d()}eAs${a()}`;

                                const [
                                  selectedAssistance,
                                  setSelectedAssistance,
                                ] = makePersisted(createSignal(""), {
                                  name: assistanceKey + "n",
                                });

                                const completed = state.progress?.[progressKey];
                                const setCompleted = (value) =>
                                  setState("progress", {
                                    [progressKey]: value,
                                  });

                                return (
                                  <tr>
                                    <td>{assistance.name}</td>
                                    <td>
                                      <input
                                        type="text"
                                        list={progressKey}
                                        value={selectedAssistance()}
                                        oninput={(e) =>
                                          setSelectedAssistance(e.target.value)
                                        }
                                      />
                                      <datalist id={progressKey}>
                                        <For each={assistance.exercises}>
                                          {(exercise) => (
                                            <option value={exercise}>
                                              {exercise}
                                            </option>
                                          )}
                                        </For>
                                      </datalist>
                                    </td>
                                    <td>50-100</td>
                                    <td>
                                      <IncrementalCheckbox
                                        value={completed}
                                        steps={[1, 2, 3, 4]}
                                        onchange={(e) =>
                                          setCompleted(e.target.value)
                                        }
                                      />
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
          );
        }}
      </For>
      <button
        onClick={() => clear()}
        class="mdl-button mdl-button--raised mdl-button--accent"
      >
        Clear
      </button>
    </div>
  );
}

export default App;
