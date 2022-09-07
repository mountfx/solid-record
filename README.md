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

**[Examples](https://stackblitz.com/edit/solid-record-examples?file=src/Examples.tsx)**

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

Exposes all function to traverse the recorded state.

Accepts an options object as argument, which allows to define a maximum depth.

```tsx
const { undo, redo, ... } = createHistory({ depth: 24 });
```

## `record()`

The `record` function accepts 2 parameters:

1. signal or store
2. an optional history object

`record()` returns a tuple where the first two items are the getter and setter of the provided signal or store (with full typechecking) and the 3rd is the history object.

If no history is provided as the 2nd argument `record()` will create one.

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
