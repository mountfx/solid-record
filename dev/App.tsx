import { createHistory } from "../src";

import Counter from './examples/Counter';
import Draggable from "./examples/Draggable";
import Store from './examples/Store';

export const history = createHistory();

const App = () => {
  return (
    <div style={{ display: "grid", gap: "24px" }}>
      <Controls />
      <Counter />
      <Store />
      <Draggable />
    </div>
  );
};

const Controls = () => {
  const memory = "my-memory";
  return (
    <>
      <div class="header actions">
        <button disabled={!history.isUndoable()} onClick={history.undo}>
          Undo ({history.undos.length})
        </button>
        <button disabled={!history.isRedoable()} onClick={history.redo}>
          Redo ({history.redos.length})
        </button>
        <button onClick={() => history.capture(memory)}>Capture memory</button>
        <button onClick={() => history.restore(memory)}>Restore memory</button>
      </div>
    </>
  )
}

export default App;
