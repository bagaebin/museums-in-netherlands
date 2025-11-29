# Locker Interaction & Dragging Spec

## Current Context
- Locker tiles are rendered via `components/Locker.tsx` inside `LockersGrid` and can be dragged freely on the atlas stage.
- Clicking a locker marks it active, rotating the door open. Hovering for 1.5s is intended to expand the background and show detail content.

## Reported Issues
1. **Drag jitter/disappearance:** Rapid drags occasionally cause the locker to snap to an unexpected spot or vanish briefly.
2. **Popup gating failure:** Once a locker is opened via click, the detail popup appears immediately without honoring the 1.5s hover dwell.

## Intended Interaction
1. Clicking a locker opens the door animation (door rotation only).
2. With the door open, hovering for **1.5 seconds** should expand the background and reveal the info popup. Leaving hover or dragging should cancel the dwell.

## Fix Plan
### Drag Stability
- Decouple drag visuals from external position updates by tracking a local `currentPosition` during drag.
- Ignore prop-driven position updates while dragging, syncing after drag end. This prevents `animate` position targets from fighting with the drag transform.
- Continue emitting `onDrag` updates so relations/other layers stay aligned.

### Popup Timing
- Separate the "door open" state from "detail expanded" state.
- Drive the door rotation with `isActive`, but show the detail background/content **only** when the hover dwell marks the tile as held (`isHeld`).
- Keep pointer events for detail content disabled until the dwell completes.
