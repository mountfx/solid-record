import { createSignal } from 'solid-js';

type Setter = (...args: any[]) => any;
type Command = ReturnType<typeof createCommand>;
type History = ReturnType<typeof createHistory>;

function limit<A extends any[]>(array: A, length: number) {
  const diff = array.length - length;
  return diff < 0 ? array : array.slice(diff, array.length);
}

function copy<T>(value: T): T {
  if (typeof value === 'object' && value !== null) {
    return JSON.parse(JSON.stringify(value));
  }
  return value;
}

function isEqual(a: any, b: any) {
  if (typeof a !== 'object') {
    return a === b;
  }
  return JSON.stringify(a) === JSON.stringify(b);
}

function createCommand<S extends Setter>(
  setter: S,
  ...args: any[] | ((v: any) => any)[]
) {
  const path = args.slice(0, args.length - 1);
  const tail = args.at(-1);

  let prevValue: any;

  setter(...path, (v: any) => {
    prevValue = copy(v);
    return v;
  });

  const nextValue = tail === 'function' ? tail(prevValue) : tail;

  return Object.assign(() => setter(...path, prevValue), {
    new: () => createCommand(setter, ...args),
    hasChanged: () => !isEqual(prevValue, nextValue),
  });
}

function createHistory(options: { depth?: number } = {}) {
  const [undos, setUndos] = createSignal<Command[][]>([]);
  const [redos, setRedos] = createSignal<Command[][]>([]);

  const [isPaused, setIsPaused] = createSignal(false);
  const [isBatched, setIsBatched] = createSignal(false);

  let depth = options.depth || 128;
  let deferPause = 0;
  let buffer: Command[] = [];
  let memory: { [key: string]: Command[] } = {}
  let setters: Setter[] = [];

  function add<S extends Setter>(
    setter: S,
    ...args: any[] | ((v: any) => any)[]
  ) {
    if (isPaused()) {
      setter(...args);
      return;
    }

    const command = createCommand(setter, ...args);
    setter(...args);

    if (!command.hasChanged()) return;

    if (redos().length > 0) setRedos([]);

    if (isBatched()) buffer.push(command);
    else setUndos((u) => limit([...u, [command]], depth));

    if (deferPause === 0) return;
    if (deferPause > 1) deferPause--;
    else setIsPaused(true);
  }

  function addCommands(commands: Command[], timeline: Command[][]) {
    return limit([...timeline, commands.map(c => c.new())], depth);
  }

  function undo() {
    const commands = undos().at(-1);
    if (!commands) return;
    setUndos((u) => u.slice(0, u.length - 1));
    setRedos((r) => addCommands(commands, r));
    commands.reverse().forEach((c) => c());
  }

  function redo() {
    const commands = redos().at(-1);
    if (!commands) return;
    setRedos((r) => r.slice(0, r.length - 1));
    setUndos((u) => addCommands(commands, u));
    commands.forEach((c) => c());
  }

  function batch<T>(fn?: () => T) {
    setIsBatched(true);
    if (!fn) return;
    const value = fn();
    unbatch();
    return value;
  }

  function unbatch() {
    if (buffer.length > 0) {
      setUndos((u) => limit([...u, buffer], depth));
    }
    setIsBatched(false);
    buffer = [];
  }

  function pause(defer = 0) {
    if (defer) deferPause = defer;
    else setIsPaused(true);
  }

  function resume() {
    setIsPaused(false);
    deferPause = 0;
  }

  function register(setter: Setter) {
    setters.push(setter);
  }

  function capture(label: string) {
    memory[label] = setters.map(s => createCommand(s));
  }

  function restore(label: string) {
    const commands = memory[label];
    if (!commands) return;
    setUndos(u => addCommands(commands, u));
    commands.forEach((c) => c());
  }

  return {
    get undos() {
      return undos();
    },
    get redos() {
      return redos();
    },

    add,
    undo,
    redo,

    batch,
    unbatch,

    pause,
    resume,

    register,
    capture,
    restore,

    isPaused,
    isBatched,
    isUndoable: () => undos().length > 0,
    isRedoable: () => redos().length > 0,
  };
}

function record<G, S extends Setter>(
  [getter, setter]: [G, S],
  history = createHistory()
) {
  history.register(setter);
  type Record = [G, S, History];
  return [getter, (...args) => history.add(setter, ...args), history] as Record;
}

export { createHistory, record };
export type { History, Command };
