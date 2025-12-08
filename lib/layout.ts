import { LayoutMode, Museum, Position } from './types';

export interface LockerPlacement extends Position {
  id: string;
}

export const TILE_WIDTH = 160;
export const TILE_HEIGHT = 160;
export const GRID_GAP = 0;
export const STAGE_PADDING = 0;
const MAP_OVERSCAN = 2;
const MAP_BASE_WIDTH = 612;
const MAP_BASE_HEIGHT = 792;

export function computeLayoutPositions(
  museums: Museum[],
  layout: LayoutMode,
  stage: { width: number; height: number }
): Record<string, Position> {
  const usableStage = {
    width: Math.max(stage.width - STAGE_PADDING * 2, TILE_WIDTH),
    height: Math.max(stage.height - STAGE_PADDING * 2, TILE_HEIGHT),
  };
  switch (layout) {
    case 'grid':
      return buildUniformGridPositions(museums, usableStage);
    case 'topic':
      return buildTopicPositions(museums, usableStage);
    case 'map':
      return buildMapPositions(museums, usableStage);
    default:
      return buildGridPositions(museums, usableStage);
  }
}

function buildGridPositions(museums: Museum[], stage: { width: number; height: number }): Record<string, Position> {
  const positions: Record<string, Position> = {};
  museums.forEach((museum) => {
    positions[museum.id] = {
      x: museum.positionGrid.x * (TILE_WIDTH + GRID_GAP) + GRID_GAP,
      y: museum.positionGrid.y * (TILE_HEIGHT + GRID_GAP) + GRID_GAP,
    };
  });
  return centerPositions(positions, stage);
}

function buildTopicPositions(museums: Museum[], stage: { width: number; height: number }): Record<string, Position> {
  return buildGridPositions(museums, stage);
}

function buildUniformGridPositions(museums: Museum[], stage: { width: number; height: number }): Record<string, Position> {
  const positions: Record<string, Position> = {};
  const sorted = museums.slice().sort((a, b) => a.name.localeCompare(b.name));
  const columns = Math.max(1, Math.floor(stage.width / (TILE_WIDTH + GRID_GAP)));

  sorted.forEach((museum, index) => {
    const col = index % columns;
    const row = Math.floor(index / columns);
    positions[museum.id] = {
      x: col * (TILE_WIDTH + GRID_GAP) + GRID_GAP,
      y: row * (TILE_HEIGHT + GRID_GAP) + GRID_GAP,
    };
  });

  return centerPositions(positions, stage);
}

function buildMapPositions(museums: Museum[], stage: { width: number; height: number }): Record<string, Position> {
  const positions: Record<string, Position> = {};
  const expandedStage = {
    width: MAP_BASE_WIDTH * (1 + MAP_OVERSCAN),
    height: MAP_BASE_HEIGHT * (1 + MAP_OVERSCAN),
  };
  const offset = {
    x: (MAP_BASE_WIDTH - expandedStage.width) / 2,
    y: (MAP_BASE_HEIGHT - expandedStage.height) / 2,
  };
  museums.forEach((museum) => {
    positions[museum.id] = {
      x: offset.x + museum.positionMap.x * Math.max(expandedStage.width - TILE_WIDTH, 0),
      y: offset.y + museum.positionMap.y * Math.max(expandedStage.height - TILE_HEIGHT, 0),
    };
  });
  return positions;
}

function centerPositions(positions: Record<string, Position>, stage: { width: number; height: number }): Record<string, Position> {
  const entries = Object.values(positions);
  if (!entries.length) return positions;
  const minX = Math.min(...entries.map((p) => p.x));
  const minY = Math.min(...entries.map((p) => p.y));
  const maxX = Math.max(...entries.map((p) => p.x));
  const maxY = Math.max(...entries.map((p) => p.y));
  const width = maxX - minX + TILE_WIDTH;
  const height = maxY - minY + TILE_HEIGHT;
  const offsetX = (stage.width - width) / 2 - minX;
  const offsetY = (stage.height - height) / 2 - minY;

  const centered: Record<string, Position> = {};
  Object.entries(positions).forEach(([id, pos]) => {
    centered[id] = { x: pos.x + offsetX, y: pos.y + offsetY };
  });
  return centered;
}

export function computePathPoints(a: Position, b: Position): string {
  const distance = Math.hypot(b.x - a.x, b.y - a.y);
  const straightThreshold = Math.min(TILE_WIDTH, TILE_HEIGHT);

  if (distance <= straightThreshold) {
    return `M ${a.x} ${a.y} L ${b.x} ${b.y}`;
  }

  const midX = (a.x + b.x) / 2;
  const curve = 80;
  const c1x = midX;
  const c1y = a.y - curve;
  const c2x = midX;
  const c2y = b.y + curve;
  return `M ${a.x} ${a.y} C ${c1x} ${c1y}, ${c2x} ${c2y}, ${b.x} ${b.y}`;
}

export function estimateReveal(label: string, distance: number, threshold = 280): string {
  if (!label) return '';
  const ratio = Math.min(distance / threshold, 1);
  const visibleCount = Math.max(1, Math.round(label.length * ratio));
  return label.slice(0, visibleCount);
}
