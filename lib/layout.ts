import { forceSimulation, forceManyBody, forceX, forceY } from 'd3-force';
import { LayoutMode, Museum, PositionedMuseum } from './types';

const GRID_GAP = 160;

export const computeGridLayout = (museums: Museum[]): PositionedMuseum[] => {
  return museums.map((museum) => ({
    ...museum,
    x: museum.positionGrid.x * GRID_GAP,
    y: museum.positionGrid.y * GRID_GAP,
  }));
};

export const computeTopicLayout = (museums: Museum[]): PositionedMuseum[] => {
  const width = 800;
  const height = 600;
  const groupedByRegion: Record<string, Museum[]> = museums.reduce((acc, museum) => {
    acc[museum.region] = acc[museum.region] || [];
    acc[museum.region].push(museum);
    return acc;
  }, {} as Record<string, Museum[]>);

  const centers = Object.keys(groupedByRegion).map((region, index) => ({
    region,
    x: 200 + (index % 3) * 250,
    y: 200 + Math.floor(index / 3) * 200,
  }));

  const nodes = museums.map((museum) => ({ ...museum, x: width / 2, y: height / 2 }));

  const simulation = forceSimulation(nodes as any)
    .force(
      'charge',
      forceManyBody()
        .strength(-50)
        .distanceMin(40)
        .distanceMax(180)
    )
    .force('x', forceX((d: any) => centers.find((c) => c.region === d.region)?.x ?? width / 2).strength(0.3))
    .force('y', forceY((d: any) => centers.find((c) => c.region === d.region)?.y ?? height / 2).strength(0.3))
    .stop();

  // Run a few ticks manually for deterministic layout
  for (let i = 0; i < 60; i += 1) {
    simulation.tick();
  }

  return nodes as PositionedMuseum[];
};

export const computeMapLayout = (museums: Museum[], width: number, height: number): PositionedMuseum[] => {
  return museums.map((museum) => ({
    ...museum,
    x: museum.positionMap.x * width,
    y: museum.positionMap.y * height,
  }));
};

export const computeLayout = (
  mode: LayoutMode,
  museums: Museum[],
  canvas: { width: number; height: number }
): PositionedMuseum[] => {
  if (mode === 'grid') return computeGridLayout(museums);
  if (mode === 'topic') return computeTopicLayout(museums);
  return computeMapLayout(museums, canvas.width, canvas.height);
};
