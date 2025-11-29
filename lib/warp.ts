import { Museum } from './types';

export interface WarpOptions {
  onOpen: (id: string) => void;
  onHighlight?: (id: string) => void;
}

export function applyHashWarp(museums: Museum[], options: WarpOptions) {
  if (typeof window === 'undefined') return;
  const { onOpen, onHighlight } = options;
  const hash = window.location.hash.replace('#', '');
  if (!hash) return;
  const target = museums.find((museum) => museum.id === hash);
  if (!target) return;
  requestAnimationFrame(() => {
    onOpen(target.id);
    onHighlight?.(target.id);
    const element = document.getElementById(`locker-${target.id}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });
    }
  });
}
