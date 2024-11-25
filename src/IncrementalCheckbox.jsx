import { createSignal } from "solid-js";

const IncrementalCheckbox = (props) => {
  const steps = props.steps || [];

  const [value, setValue] = createSignal(props.value || false);

  const onchange = (e) => {
    e.preventDefault();

    let newValue = false;

    if (value() !== true) {
      const i = steps.indexOf(value());

      if (i < steps.length - 1) {
        newValue = steps[i + 1];
      } else {
        newValue = true;
      }
    }

    e.target.checked = newValue === true;

    setValue(newValue);

    props.onchange &&
      props.onchange({
        ...e,
        target: {
          ...e.target,
          value: newValue,
        },
      });
  };

  return (
    <label class="incremental-checkbox ml-auto">
      <input
        type="checkbox"
        checked={value() === true}
        class="checkbox checkbox-info"
        onchange={onchange}
      />
      <Show when={value() !== true && value() !== false}>
        <span>{value()}</span>
      </Show>
    </label>
  );
};

export { IncrementalCheckbox };
