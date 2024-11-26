import "./App.css";

import cc from "classcat";

import { createSignal, createEffect } from "solid-js";
import { createStore, reconcile } from "solid-js/store";

import { makePersisted } from "@solid-primitives/storage";

import { IncrementalCheckbox } from "./IncrementalCheckbox";
import { ProgressBar } from "./ProgressBar";
import { Set } from "./Set";

import wendlerBeginners from "./workouts/wendler/beginners.json";

function App() {
  const [state, setState] = makePersisted(createStore(), {
    name: "531beginner",
  });
  // const [state, setState] = createStore();

  createEffect(() => {
    console.log("state.setProgress", state.setProgress);
  });

  return (
    <For each={wendlerBeginners.weeks}>
      {(week, w) => {
        return (
          <>
            <h2>{week.name}</h2>
            <For each={wendlerBeginners.days}>
              {(day, d) => {
                return (
                  <>
                    <h3>{day.name}</h3>
                    <For each={day.exercises}>
                      {(exercise, e) => {
                        const [setsCompleted, setSetsCompleted] =
                          createSignal(0);

                        createEffect(() =>
                          setSetsCompleted(
                            Object.entries(
                              state[w()]?.[d()]?.[e()] || {}
                            ).filter((entry) => entry[1] === true).length
                          )
                        );

                        return (
                          <>
                            <h5>
                              {exercise.name} - {setsCompleted()}
                            </h5>
                            <For each={week.sets}>
                              {(set, s) => {
                                const handleChange = (event) => {
                                  setState(
                                    reconcile({
                                      ...state,
                                      [w()]: {
                                        ...state[w()],
                                        [d()]: {
                                          ...state[w()]?.[d()],
                                          [e()]: {
                                            ...state[w()]?.[d()]?.[e()],
                                            [s()]: event.target.checked,
                                          },
                                        },
                                      },
                                    })
                                  );
                                };

                                const isChecked =
                                  state[w()]?.[d()]?.[e()]?.[s()];

                                return (
                                  <>
                                    <h4>Set</h4>
                                    <input
                                      type="checkbox"
                                      class="checkbox checkbox-info"
                                      checked={isChecked}
                                      onchange={handleChange}
                                    />
                                  </>
                                );
                              }}
                            </For>
                          </>
                        );
                      }}
                    </For>
                  </>
                );
              }}
            </For>
          </>
        );
      }}
    </For>
  );
}

export default App;
