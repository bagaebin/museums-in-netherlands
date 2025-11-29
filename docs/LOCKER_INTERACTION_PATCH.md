# Locker Interaction Patch Spec

## Context
- Dragging lockers uses Framer Motion `drag` with animated `x`/`y` props and state-driven positions.
- Hover-based detail reveal currently ties detail animation to `isActive || isHeld`, so details appear as soon as a locker is opened.
- Users reported two regressions:
  1. Fast drags occasionally cause a locker to jump to an unexpected position or disappear.
  2. Information popups appear immediately after opening a locker instead of requiring a 1.5s hover while the door is open.

## Goals
- Stabilize drag interactions so locker tiles track the pointer smoothly, without teleporting or vanishing on rapid drags.
- Enforce the intended detail reveal sequence: click to open the door, then reveal the popup only after a 1.5s hover on the opened locker.

## Planned Changes
1. **Drag position handling**
   - Swap animated `x/y` props for motion values driven by `drag` and explicitly animated toward prop changes when not dragging.
   - Keep the parent position updates (`onDrag`) but decouple them from spring animations that compete with active drags.
2. **Detail gating**
   - Separate door-open state from detail-open state.
   - Drive door animation from `isActive`.
   - Drive detail background/content from `isHeld` (the post-hover state) to honor the 1.5s hover requirement.
   - Preserve hover timer reset on leave/drag/end to avoid stale `isHeld` flags.

## Acceptance Criteria
- Dragging a locker rapidly no longer causes sudden jumps or disappearance; the tile follows the cursor consistently.
- After clicking a locker, the info popup only appears after hovering for ~1.5s; simply opening without hovering does not show the popup.
- Existing callbacks (`onOpen`, `onExpand`, `onPositionChange`) still fire as before.
