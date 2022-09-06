import { createSignal, onCleanup } from "solid-js";

import { history } from "../App";
import { record } from "../../src";

const Draggable = () => {
  const [position, setPosition] = record(createSignal({ x: 0, y: 0 }), history);

  function handlePointerDown() {
    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
    history.pause(1);
  }

  function handlePointerMove(e: PointerEvent) {
    setPosition((p) => ({ x: p.x + e.movementX, y: p.y + e.movementY }));
  }

  function handlePointerUp() {
    window.removeEventListener('pointermove', handlePointerMove);
    window.removeEventListener('pointerup', handlePointerUp);
    history.resume();
  }

  onCleanup(() => window.removeEventListener('pointerdown', handlePointerDown));

  return (
    <div
      onPointerDown={handlePointerDown}
      style={{
        transform: `translate(${position().x}px, ${position().y}px)`,
        width: '80px',
        height: '80px',
        background: 'pink',
        display: 'grid',
        cursor: 'move',
        "border-radius": "8px",
        'place-content': 'center',
      }}
    >
      Drag me
    </div>
  );
};

export default Draggable;