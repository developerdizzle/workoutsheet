import { children } from "solid-js";

function Week(props) {
  const c = children(() => props.children);

  return (
    <section class="tab-content flex flex-col md:flex-row md:space-x-8 md:justify-around p-8">
      {c()}
    </section>
  );
}

export { Week };
