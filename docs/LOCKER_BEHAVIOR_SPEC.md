# Locker Interaction & Dragging Spec

## Goals
- Prevent position glitches when lockers are dragged quickly.
- Ensure the museum detail popup only appears after the intended hover dwell on an already opened locker door.
- Remove the bouncy motion when lockers are rearranged; movement should feel direct and steady.
- Surface a clear hover dwell gauge so users can see progress toward opening the detail popup.

## Interaction Flow
1. **Open door**: Clicking a locker toggles it to the open state, revealing the door interior and museum title. No detail popup should appear at this step.
2. **Detail popup**: While the door is open, hovering for **1.5 seconds** should trigger the expanded state and show the information popup. A linear progress gauge across the top of the locker visualizes this dwell. Leaving the locker or dragging cancels the timer, resets the gauge immediately, and closes the popup; the interior title and hover background are visible only while the pointer stays over the opened locker. Progress is gated by a live bounding-box check of the pointer position, not just `:hover` state.
3. **Dragging**: Dragging should update the locker position smoothly without overshooting or briefly disappearing. During active dragging, positions should follow the pointer without spring/bounce effects.
4. **Reordering transitions**: When layouts change or lockers are repositioned programmatically, movement should be linear/tweened (no bounce).

## Edge Cases
- Cancelling hover (pointer leave, drag start, or deactivation) resets the hover timer and hides the popup. Dwell only advances while the pointer position is confirmed inside the locker bounds each frame; losing that check instantly zeros the gauge.
- Moving the pointer outside the locker (including fast exits or leaving the window) should instantly zero any hover dwell so the popup cannot continue opening, and the dwell counter should only advance while the pointer position is confirmed to be inside the locker bounds.
- Click suppression after dragging prevents accidental reopen events.
- Expanded state uses an increased clip radius suited to the current viewport, but only after the hover dwell completes.
