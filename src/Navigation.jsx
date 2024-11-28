function Navigation(props) {
  return (
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
              onclick={(e) => props.handleToggleUnitOfMeasure()}
            >
              {props.unitOfMeasure.toString().toUpperCase()}
            </button>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export { Navigation };
