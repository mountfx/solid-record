import { createStore, produce } from "solid-js/store";

import { history } from "../App";
import { record } from "../../src";

const Store = () => {
  const [people, setPeople] = record(
    createStore([
      { name: { surname: 'John', givenName: 'Doe' }, age: 30 },
      { name: { surname: 'Jane', givenName: 'Smith' }, age: 24 },
    ]),
    history,
  );
  return (
    <div>
      <div class="actions">
        <button onClick={() => setPeople(0, "name", "surname", "Peter")}>Change name</button>
        <button onClick={() => setPeople(1, produce(p => p.age++))}>Increase age</button>
      </div>
      <pre>{JSON.stringify(people, null, 2)}</pre>
    </div>
  );
};

export default Store;