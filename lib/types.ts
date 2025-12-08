export type LayoutMode = 'grid' | 'topic' | 'map';

export type ExternalLinkType = 'website' | 'instagram' | 'map' | 'video' | 'other';

export interface ExternalLink {
  type: ExternalLinkType;
  label: string;
  url: string;
}

export interface Relation {
  targetId: string;
  label: string;
  description?: string;
  images?: string[];
  externalLinks?: ExternalLink[];
}

export interface RelationHubOffset {
  layout: LayoutMode;
  offset: Position;
}

export type RelationHubProviderRole = 'fund' | 'studio' | 'curator' | 'producer' | 'other';

export interface RelationHubProvider {
  role: RelationHubProviderRole;
  name: string;
  museumId?: string;
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

export interface MuseumWhatTheyDo {
  title?: string;
  bullets?: string[];
}

export interface MuseumDetail {
  title?: string;
  description: string;
  highlights?: string[];
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
  location?: string;
  locationUrl?: string;
  openingTime?: string[];
  doorSvg?: string;
  interiorColor?: string;
  interiorBaseColor?: string;
  interiorHoverColor?: string;
  positionGrid: Position;
  positionMap: Position;
  topic?: string;
  whatTheyDo?: MuseumWhatTheyDo;
  organizationUrl?: string;
  externalLinks?: ExternalLink[];
  relations: Relation[];
  detail: MuseumDetail;
}
