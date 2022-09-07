<p>
  <img width="100%" src="https://assets.solidjs.com/banner?type=solid-record&background=tiles&project=%20" alt="solid-record">
</p>

# solid-record

[![pnpm](https://img.shields.io/badge/maintained%20with-pnpm-cc00ff.svg?style=for-the-badge&logo=pnpm)](https://pnpm.io/)

**Simple undo/redo primitive for solidjs using the command pattern**

🧩 Use it with signals, stores and custom primitives

⛓ Share a single history between multiple signals and stores

✋ Pause and resume history

📦 Merge commands into a single action

🦾 Manually record changes

🌌 Capture recorded state and restore it

---

**[Examples on ⚡️ Stackblitz](https://stackblitz.com/edit/solid-record-examples?file=src/Examples.tsx)**

---

## Quick start

Install it:

```bash
npm i solid-record
# or
yarn add solid-record
# or
pnpm add solid-record
```

Use it:

```tsx
import { record } from "solid-record";

const [count, setCount, { undo, redo }] = record(createSignal(0));
```

## `createHistory()`

Exposes all methods to access and traverse recorded state.

Accepts an `options` object as argument, which allows you to define a maximum `depth`.

```tsx
const { undo, redo, ... } = createHistory({ depth: 24 });
```

### Methods

#### `undo()`

Undoes the last commands on the `undos` stack.
Adds commands to the `redos` stack.

#### `redo()`

Redoes the last commands on the `redos` stack.
Adds commands to the `undos` stack.

#### `add()`

`add()` allows you to manually record updates.

Instead of updating signals or stores directly you can use the `add()` method instead, by providing the setter function as the first argument and the update path, callback function or value thereafter.

It calls the setter, creates a command and adds it to the `undos` stack.

Internally, the `record()` function wraps signals or stores and calls `add()` function on every update.

#### `batch()`

Batch multiple updates together into one command. The command will be added to the `undos` stack when `unbatch()` is called.

If a callback function is provided it will automatically call `unbatch()` at the end.

#### `unbatch()`

Unbatches updates, add them to the `undos` stack and resume recording normally.

#### `pause()`

Pauses recording.
Accepts a number as argument, which lets you defer pausing the recording after # updates.

#### `resume()`

Resumes recording.

#### `register()`

Accepts a setter function as argument. Only setters that are registered can be captured using the `capture()` method.

If you are manually recording updates using the `add()` method, make sure you also register the setter function.

Using the `record()` function will automatically register the setter of a given signal or store.

#### `capture()`

Caches current state. Accepts a `string` as an argument that can be used to restore the state.

#### `restore()`

Restores a captured state. Accepts a `string` as an argument used while capturing.

Restoring state is an undoable action.

#### `isPaused()`

Returns `true` if recording is paused, otherwise returns `false`.

#### `isBatched()`

Returns `true` if updates are currently batched, otherwise returns `false`.

#### `isUndoable()`

Returns `true` if the `undos` stack is not empty, otherwise returns `false`.

#### `isRedoable()`

Returns `true` if the `redos` stack is not empty, otherwise returns `false`.

## `record()`

The `record` function accepts 2 parameters:

1. signal or store
2. an optional history object

`record()` returns a tuple where the first two items are the getter and setter of the provided signal or store (with full typechecking) and the 3rd is the history object.

If no history is provided as the 2nd argument `record()` will create one.

Note that setting a recorded value will clear the redo stack if it's not empty.

```tsx
// Record returns a getter, setter and history object

const [count, setCount, history] = record(createSignal(0));
const [person, setPerson, history] = record(createStore({ name: "John" }));

// By providing a history object as the 2nd argument
// you can have multiple signals or stores sharing the same history stack

const history = createHistory();

const [count, setCount, history] = record(createSignal(0), history);
const [person, setPerson, history] = record(createStore({ name: "John" }, history));
```
