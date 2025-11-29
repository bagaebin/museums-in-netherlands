export type LayoutMode = 'grid' | 'topic' | 'map';

export interface MuseumRelation {
  targetId: string;
  label: string;
}

export interface MuseumDetail {
  description: string;
  images: string[];
  url: string;
}

export interface Museum {
  id: string;
  name: string;
  type: string;
  region: string;
  city: string;
  positionGrid: { x: number; y: number };
  positionMap: { x: number; y: number };
  relations: MuseumRelation[];
  detail: MuseumDetail;
}

export interface PositionedMuseum extends Museum {
  x: number;
  y: number;
}
