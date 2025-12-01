import { LayoutMode, Museum, Position } from './types';

export interface LockerPlacement extends Position {
  id: string;
}

export const TILE_WIDTH = 160;
export const TILE_HEIGHT = 160;
export const GRID_GAP = 0;
export const STAGE_PADDING = 0;
const MAP_OVERSCAN = 2;

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
      return buildGridPositions(museums, usableStage);
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
  const clusters: Record<string, Museum[]> = {};
  museums.forEach((museum) => {
    const key = museum.topic ?? '기타';
    clusters[key] = clusters[key] || [];
    clusters[key].push(museum);
  });

  const positions: Record<string, Position> = {};
  const topics = Object.keys(clusters);
  const cols = Math.ceil(Math.sqrt(topics.length));
  const rows = Math.ceil(topics.length / cols);
  const padX = stage.width / Math.max(cols, 1);
  const padY = stage.height / Math.max(rows, 1);

  topics.forEach((topic, topicIndex) => {
    const col = topicIndex % cols;
    const row = Math.floor(topicIndex / cols);
    const baseX = col * padX + GRID_GAP;
    const baseY = row * padY + GRID_GAP;
    clusters[topic].forEach((museum, idx) => {
      const localX = (idx % 2) * (TILE_WIDTH + GRID_GAP / 2);
      const localY = Math.floor(idx / 2) * (TILE_HEIGHT + GRID_GAP / 2);
      positions[museum.id] = {
        x: baseX + localX,
        y: baseY + localY,
      };
    });
  });

  return positions;
}

function buildMapPositions(museums: Museum[], stage: { width: number; height: number }): Record<string, Position> {
  const positions: Record<string, Position> = {};
  const expandedStage = {
    width: stage.width * (1 + MAP_OVERSCAN),
    height: stage.height * (1 + MAP_OVERSCAN),
  };
  const offset = {
    x: (stage.width - expandedStage.width) / 2,
    y: (stage.height - expandedStage.height) / 2,
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
