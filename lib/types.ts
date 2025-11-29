export interface MuseumRelation {
  targetId: string;
  label: string;
}

export interface Position {
  x: number;
  y: number;
}

export interface MuseumDetail {
  description: string;
  images: string[];
  url: string;
}

export interface MuseumData {
  id: string;
  name: string;
  type: string;
  region: string;
  city: string;
  topic?: string;
  positionGrid: Position;
  positionMap: Position;
  relations?: MuseumRelation[];
  detail: MuseumDetail;
}

export type LayoutMode = "grid" | "topic" | "map";
