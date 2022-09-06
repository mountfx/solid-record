import { createHistory } from "../src";

import Counter from './examples/Counter';
import Draggable from "./examples/Draggable";
import Store from './examples/Store';

export const history = createHistory();

const App = () => {
  return (
    <div style={{ display: "grid", gap: "24px" }}>
      <Controls />
      <section><Counter /></section>
      <section><Store /></section>
      <section><Draggable /></section>
    </div>
  );
};

const Controls = () => {
  const snapshot = "my-snapshot";
  return (
    <>
      <div class="header actions">
        <button disabled={!history.isUndoable()} onClick={history.undo}>
          Undo ({history.undos().length})
        </button>
        <button disabled={!history.isRedoable()} onClick={history.redo}>
          Redo ({history.redos().length})
        </button>
        <button onClick={() => {
          history.snapshot()[snapshot] ? history.restore(snapshot) : history.capture(snapshot);
        }}>
          {history.snapshot()[snapshot] ? "Restore snapshot" : "Capture snapshot"}
        </button>
      </div>
    </>
  )
}

export default App;
