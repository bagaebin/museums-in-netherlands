import { forceSimulation, forceManyBody, forceX, forceY } from "d3-force";
import { LayoutMode, MuseumData, Position } from "./types";

interface PositionedMuseum extends MuseumData {
  screenPosition: Position;
}

export function computeGridPosition(museum: MuseumData, size = 160, gap = 16): Position {
  return {
    x: museum.positionGrid.x * (size + gap),
    y: museum.positionGrid.y * (size + gap),
  };
}

export function computeTopicLayout(museums: MuseumData[], width = 1200, height = 800): PositionedMuseum[] {
  const topicCenters = new Map<string, Position>();
  const topics = Array.from(new Set(museums.map((m) => m.topic || "기타")));
  topics.forEach((topic, idx) => {
    const angle = (idx / topics.length) * Math.PI * 2;
    topicCenters.set(topic, {
      x: width / 2 + Math.cos(angle) * 220,
      y: height / 2 + Math.sin(angle) * 180,
    });
  });

  const nodes = museums.map((museum) => ({
    ...museum,
    x: width / 2,
    y: height / 2,
  }));

  forceSimulation(nodes as any)
    .force(
      "x",
      forceX((d: any) => topicCenters.get(d.topic || "기타")?.x ?? width / 2).strength(0.3)
    )
    .force(
      "y",
      forceY((d: any) => topicCenters.get(d.topic || "기타")?.y ?? height / 2).strength(0.3)
    )
    .force("charge", forceManyBody().strength(-60))
    .stop()
    .tick(80);

  return nodes.map((node) => ({
    ...(node as MuseumData),
    screenPosition: { x: node.x as number, y: node.y as number },
  }));
}

export function computeMapPosition(museum: MuseumData, width = 1200, height = 800): Position {
  return {
    x: museum.positionMap.x * width,
    y: museum.positionMap.y * height,
  };
}

export function getPositionByLayout(
  museum: MuseumData,
  layout: LayoutMode,
  topicNodes?: PositionedMuseum[],
  width?: number,
  height?: number
): Position {
  switch (layout) {
    case "grid":
      return computeGridPosition(museum);
    case "map":
      return computeMapPosition(museum, width, height);
    case "topic": {
      const match = topicNodes?.find((node) => node.id === museum.id);
      return match?.screenPosition ?? { x: 0, y: 0 };
    }
    default:
      return { x: 0, y: 0 };
  }
}
