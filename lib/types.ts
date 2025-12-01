export type LayoutMode = 'grid' | 'topic' | 'map';

export interface Relation {
  targetId: string;
  label: string;
}

export interface RelationHubOffset {
  layout: LayoutMode;
  offset: Position;
}

export type RelationHubProviderRole = 'fund' | 'studio' | 'curator' | 'producer' | 'other';

export interface RelationHubProvider {
  role: RelationHubProviderRole;
  name: string;
}

export interface RelationHubInfo {
  summary: string;
  providers: RelationHubProvider[];
}

export interface RelationHub {
  id: string;
  label: string;
  members: string[];
  offset?: Position;
  layoutOffsets?: RelationHubOffset[];
  info?: RelationHubInfo;
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
  interiorBaseColor?: string;
  interiorHoverColor?: string;
  positionGrid: Position;
  positionMap: Position;
  topic?: string;
  relations: Relation[];
  detail: MuseumDetail;
}
