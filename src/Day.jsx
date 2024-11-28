import { children } from "solid-js";

function Day(props) {
  const c = children(() => props.children);

  return (
    <div class="prose text-center">
      <h2>{props.name}</h2>
      {c()}
    </div>
  );
}

export { Day };
