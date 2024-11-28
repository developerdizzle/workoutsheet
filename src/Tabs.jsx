import cc from "classcat";

function Tabs(props) {
  return (
    <div role="tablist" class="tabs tabs-bordered tabs-lg md:w-1/2 mx-auto">
      <For each={props.weeks}>
        {(week, i) => {
          const isSelected = () => i() === props.selectedWeek;
          const classes = () => {
            return cc({
              tab: true,
              "tab-active": isSelected(),
            });
          };

          const handleClick = () => {
            props.handleSelectWeek(i());
          };

          return (
            <a role="tab" class={classes()} onclick={handleClick}>
              {week.name}
            </a>
          );
        }}
      </For>
    </div>
  );
}

export { Tabs };
