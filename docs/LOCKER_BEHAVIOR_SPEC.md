# Locker Interaction & Dragging Spec

## Goals
- Prevent position glitches when lockers are dragged quickly.
- Ensure the museum detail popup only appears after the intended hover dwell on an already opened locker door.
- Remove the bouncy motion when lockers are rearranged; movement should feel direct and steady.

## Interaction Flow
1. **Open door**: Clicking a locker toggles it to the open state, revealing the door interior and museum title. No detail popup should appear at this step.
2. **Detail popup**: While the door is open, hovering for **1.5 seconds** should trigger the expanded state and show the information popup. Leaving the locker or dragging cancels the timer and closes the popup.
3. **Dragging**: Dragging should update the locker position smoothly without overshooting or briefly disappearing. During active dragging, positions should follow the pointer without spring/bounce effects.
4. **Reordering transitions**: When layouts change or lockers are repositioned programmatically, movement should be linear/tweened (no bounce).

## Edge Cases
- Cancelling hover (pointer leave, drag start, or deactivation) resets the hover timer and hides the popup.
- Click suppression after dragging prevents accidental reopen events.
- Expanded state uses an increased clip radius suited to the current viewport, but only after the hover dwell completes.
