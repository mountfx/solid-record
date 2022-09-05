<p>
  <img width="100%" src="https://assets.solidjs.com/banner?type=solid-record&background=tiles&project=%20" alt="solid-record">
</p>

# solid-record

[![pnpm](https://img.shields.io/badge/maintained%20with-pnpm-cc00ff.svg?style=for-the-badge&logo=pnpm)](https://pnpm.io/)

Simple undo/redo primitive for solidjs

🕹 Uses command pattern

🧩 Works with signals, stores and custom primitives

⛓ Share a single history between multiple signals and stores (mix and match)

✋ Pause and resume history

📦 Commands can be merged into a single action

🦾 Ability to manually record changes

<hr />

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

[Examples](https://stackblitz.com/edit/solid-record-examples?file=src/Examples.tsx)
