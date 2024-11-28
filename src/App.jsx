import "./App.css";

import cc from "classcat";

import { createSignal, createEffect, createComputed } from "solid-js";
import { createStore, reconcile } from "solid-js/store";

import { makePersisted } from "@solid-primitives/storage";

import { roundWeight } from "./roundWeight";

import { Navigation } from "./Navigation";
import { Tabs } from "./Tabs";
import { Week } from "./Week";
import { Day } from "./Day";

import wendlerBeginners from "./workouts/wendler/531beginners.js";

console.log(wendlerBeginners);

function App() {
  const [progress, setProgress] = makePersisted(createStore(), {
    name: "progress",
  });

  const [unitOfMeasure, setUnitOfMeasure] = makePersisted(createSignal("lb"), {
    name: "unitOfMeasure",
  });

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

  const handleToggleUnitOfMeasure = () => {
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

    setUnitOfMeasure(notUnitOfMeasure());
  };

  const [week, setWeek] = createSignal(0);

  createComputed(() => {
    setWeek(wendlerBeginners.weeks[selectedWeek()]);
  });

  return (
    <>
      <header>
        <Navigation
          unitOfMeasure={unitOfMeasure()}
          handleToggleUnitOfMeasure={handleToggleUnitOfMeasure}
        />
        <Tabs
          weeks={wendlerBeginners.weeks}
          selectedWeek={selectedWeek()}
          handleSelectWeek={(i) => setSelectedWeek(i)}
        />
      </header>
      <Week name={week().name}>
        <For each={wendlerBeginners.days}>
          {(day, d) => {
            return (
              <Day name={day.name}>
                <For each={day.exercises}>
                  {(exercise, e) => {
                    const [setsCompleted, setSetsCompleted] = createSignal(0);

                    createComputed(() => {
                      setSetsCompleted(
                        week()
                          .sets.map(
                            (set, i) =>
                              progress[selectedWeek()]?.[d()]?.[e()]?.[i] ===
                              true
                          )
                          .filter(Boolean).length
                      );
                    });

                    const [trainingMax, setTrainingMax] = getTrainingMax(
                      exercise.key
                    );

                    const percentage = () =>
                      (setsCompleted() * 100) / week().sets.length;

                    const progressClasses = () =>
                      cc({
                        progress: true,
                        "progress-info": percentage() < 100,
                        "progress-success": percentage() === 100,
                      });

                    return (
                      <>
                        <h5>{exercise.name}</h5>
                        <progress
                          class={progressClasses()}
                          value={percentage()}
                          max="100"
                        />
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
                            <For each={week().sets}>
                              {(set, s) => {
                                const handleChange = (event) => {
                                  setProgress(
                                    reconcile({
                                      ...progress,
                                      [selectedWeek()]: {
                                        ...progress[selectedWeek()],
                                        [d()]: {
                                          ...progress[selectedWeek()]?.[d()],
                                          [e()]: {
                                            ...progress[selectedWeek()]?.[
                                              d()
                                            ]?.[e()],
                                            [s()]: event.target.checked,
                                          },
                                        },
                                      },
                                    })
                                  );
                                };

                                const isComplete = () =>
                                  progress[selectedWeek()]?.[d()]?.[e()]?.[s()];

                                const weight = () =>
                                  set.percentage * trainingMax();

                                return (
                                  <tr>
                                    <td>{set.percentage * 100}%</td>
                                    <td>
                                      {roundWeight(
                                        weight(),
                                        unitOfMeasure()
                                      ).toString()}{" "}
                                      {unitOfMeasure()}
                                    </td>
                                    <td>{set.reps}</td>
                                    <td>
                                      <input
                                        type="checkbox"
                                        class="checkbox checkbox-info"
                                        checked={isComplete()}
                                        onchange={handleChange}
                                      />
                                    </td>
                                  </tr>
                                );
                              }}
                            </For>
                          </tbody>
                        </table>
                      </>
                    );
                  }}
                </For>
              </Day>
            );
          }}
        </For>
      </Week>
    </>
  );
}

export default App;
