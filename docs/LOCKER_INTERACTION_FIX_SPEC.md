# Locker Interaction Fix Spec

## Current Issues
- **Drag jitter/disappearance**: Rapidly dragging a locker tile occasionally makes it jump to a different position or vanish momentarily.
- **Premature info popup**: Once a locker door is opened via click, the large info popup appears immediately without requiring a 1.5s hover on the opened door.

## Constraints and Intent
- Dragging should feel deterministic and should only update the tile's coordinates based on actual pointer movement.
- Door animation should trigger on click.
- Info popup (background expansion + detail content) should only appear after hovering over an already-open door for 1.5 seconds.
- Hover timers must reset cleanly when the user stops hovering, starts dragging, or closes the locker.

## Proposed Fixes
1. **Stabilize drag positioning**
   - Remove animated position transitions on the tile container during drag.
   - Drive the tile's `x`/`y` via direct style values so pointer movement and stored positions stay in sync.
   - Keep drag callbacks updating parent-managed positions without allowing transition springs to re-apply mid-drag.

2. **Gate popup strictly behind hover**
   - Separate the door-open state (click) from the detail-expanded state (delayed hover).
   - Use the delayed hover state (`isHeld`) as the sole trigger for background expansion and detail content visibility.
   - Maintain the existing 1.5s hover delay, clearing timers when conditions are no longer valid.

## Expected Outcomes
- Rapid drags no longer cause teleporting or disappearance; tiles track the pointer smoothly.
- Doors open on click, but the info popup only appears after 1.5s of hover on an open locker.
- Hover/drag cancellations reliably prevent unintended expansions.
