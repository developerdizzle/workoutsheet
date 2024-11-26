import "./App.css";

import cc from "classcat";

import { createSignal, createEffect } from "solid-js";
import { createStore } from "solid-js/store";

import { makePersisted } from "@solid-primitives/storage";

import { IncrementalCheckbox } from "./IncrementalCheckbox";
import { ProgressBar } from "./ProgressBar";
import { Set } from "./Set";

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
    <>
      <header>
        <nav class="navbar">
          <div class="flex-1">
            <h1 class="text-xl md:text-3xl pl-4 font-bold text-primary">
              5/3/1 for beginners
            </h1>
          </div>
          <div class="flex-none">
            <ul class="menu menu-horizontal px-1">
              <li class="justify-center">
                <a
                  class="link"
                  href="https://www.jimwendler.com/blogs/jimwendler-com/101065094-5-3-1-for-a-beginner"
                  target="_blank"
                >
                  How to start
                </a>
              </li>
              <li>
                <button
                  class="btn btn- btn-secondary btn-square btn-outline"
                  onclick={(e) => setUnitOfMeasure(notUnitOfMeasure())}
                >
                  {unitOfMeasure().toString().toUpperCase()}
                </button>
              </li>
            </ul>
          </div>
        </nav>
        <div role="tablist" class="tabs tabs-bordered tabs-lg md:w-1/2 mx-auto">
          <For each={wendlerBeginners.weeks}>
            {(week, i) => {
              const isSelected = () => i() === selectedWeek();
              const classes = () => {
                return cc({
                  tab: true,
                  "tab-active": isSelected(),
                });
              };

              const handleClick = () => {
                setSelectedWeek(i());
              };

              return (
                <a role="tab" class={classes()} onclick={handleClick}>
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
            <section
              class="tab-content flex flex-col md:flex-row md:space-x-8 md:justify-around p-8"
              style={style()}
            >
              <For each={wendlerBeginners.days}>
                {(day, d) => {
                  return (
                    <div class="prose text-center">
                      <h2>{day.name}</h2>
                      <For each={day.exercises}>
                        {(exercise, e) => {
                          const [trainingMax, setTrainingMax] = getTrainingMax(
                            exercise.key
                          );

                          createEffect(() => {
                            console.log(state.progress);
                          });

                          const sets = () =>
                            wendlerBeginners.weeks[selectedWeek()].sets;

                          return (
                            <div>
                              <h3>{exercise.name}</h3>
                              <ProgressBar
                                progress={state.progress}
                                week={w()}
                                day={d()}
                                exercise={e()}
                                sets={sets()}
                              />
                              <label className="input input-bordered input-accent flex items-center gap-2">
                                Training max
                                <input
                                  className="grow text-right w-0"
                                  placeholder="Training max"
                                  type="number"
                                  value={trainingMax()}
                                  oninput={(e) =>
                                    setTrainingMax(e.target.value)
                                  }
                                />
                                <span className="badge badge-accent">
                                  {unitOfMeasure()}
                                </span>
                              </label>
                              <table class="table">
                                <thead>
                                  <tr>
                                    <th>% of TM</th>
                                    <th>Weight</th>
                                    <th>Reps</th>
                                    <th></th>
                                  </tr>
                                </thead>
                                <tbody>
                                  <For each={sets()}>
                                    {(set, s) => {
                                      const progressKey = () =>
                                        `w${w()}d${d()}e${e()}s${s()}`;

                                      const progress = () =>
                                        state.progress?.[progressKey()];

                                      const setCompleted = (value) =>
                                        setState("progress", {
                                          [progressKey()]: value,
                                        });

                                      createEffect(() => {
                                        console.log(
                                          "progress",
                                          progressKey(),
                                          progress()
                                        );
                                      });

                                      return (
                                        <Set
                                          progress={progress()}
                                          onChange={setCompleted}
                                          trainingMax={trainingMax()}
                                          unitOfMeasure={unitOfMeasure()}
                                          steps={set.steps}
                                          percentage={set.percentage}
                                          reps={set.reps}
                                        />
                                      );
                                    }}
                                  </For>
                                </tbody>
                              </table>
                            </div>
                          );
                        }}
                      </For>
                      <div>
                        <h3>Assistance Work</h3>
                        <table class="table">
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
                                        class="input input-bordered input-accent w-full"
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
                                    <td class="text-nowrap">50-100</td>
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
      <p class="text-center">
        <button
          class="btn btn-secondary btn-outline btn-wide"
          onClick={() => clear()}
        >
          Clear
        </button>
      </p>
    </>
  );
}

export default App;
