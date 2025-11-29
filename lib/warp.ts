import { Museum } from './types';

type WarpHandlers = {
  setActiveId: (id: string | null) => void;
  focusOnMuseum?: (id: string) => void;
};

export const warpToHash = (museums: Museum[], handlers: WarpHandlers) => {
  if (typeof window === 'undefined') return;
  const hash = window.location.hash.replace('#', '');
  if (!hash) return;
  const target = museums.find((museum) => museum.id === hash);
  if (!target) return;
  handlers.setActiveId(target.id);
  handlers.focusOnMuseum?.(target.id);
};

export const attachHashListener = (museums: Museum[], handlers: WarpHandlers) => {
  if (typeof window === 'undefined') return () => {};
  const onHashChange = () => warpToHash(museums, handlers);
  window.addEventListener('hashchange', onHashChange);
  return () => window.removeEventListener('hashchange', onHashChange);
};
