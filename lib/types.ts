export type LayoutMode = 'grid' | 'topic' | 'map';

export interface Relation {
  targetId: string;
  label: string;
}

export interface MuseumDetail {
  description: string;
  images: string[];
  url: string;
}

export interface Position {
  x: number;
  y: number;
}

export interface Museum {
  id: string;
  name: string;
  type: string;
  region: string;
  city: string;
  doorSvg?: string;
  interiorColor?: string;
  positionGrid: Position;
  positionMap: Position;
  topic?: string;
  relations: Relation[];
  detail: MuseumDetail;
}
