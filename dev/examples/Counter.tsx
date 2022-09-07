import { createSignal } from "solid-js";

import { history } from "../App";
import { record } from "../../src";

const Counter = () => {
  const [count, setCount] = record(createSignal(0), history);
  return (
    <section>
      <button onClick={() => setCount((c) => c + 1)}>{count()}</button>
    </section>
  );
};

export default Counter;