'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import museumsData from '../data/museums.json';
import relationHubsData from '../data/relationHubs.json';
import { LayoutToggle } from '../components/LayoutToggle';
import { LockersGrid } from '../components/LockersGrid';
import { RelationsLayer } from '../components/RelationsLayer';
import { FabButtons } from '../components/FabButtons';
import { applyHashWarp } from '../lib/warp';
import { TILE_HEIGHT, TILE_WIDTH, computeLayoutPositions } from '../lib/layout';
import {
  ExternalLink,
  LayoutMode,
  Museum,
  Position,
  RelationHub,
  RelationHubProviderRole,
} from '../lib/types';

const museums = museumsData as Museum[];
const relationHubs = relationHubsData as RelationHub[];
const providerRoleLabels: Record<RelationHubProviderRole, string> = {
  fund: 'Fund',
  studio: 'Studio',
  curator: 'Curator',
  producer: 'Producer',
  other: 'Partner',
};

const linkIcons = {
  website: '🌐',
  instagram: '📸',
  map: '🗺️',
  video: '▶️',
  other: '↗',
} as const;

const TOPIC_ROW_LABELS = ['Local', 'Education', 'Conservation', 'Festival'];

type RelationDetail =
  | {
    type: 'pair';
    source: Museum;
    target: Museum;
    label: string;
    description?: string;
    links?: ExternalLink[];
  }
  | {
    type: 'hub';
    hub: RelationHub;
    member: Museum;
    label: string;
  }
  | {
    type: 'hub-info';
    hub: RelationHub;
    label: string;
  };

export default function HomePage() {
  const stageRef = useRef<HTMLDivElement | null>(null);
  const [layout, setLayout] = useState<LayoutMode>('grid');
  const [activeId, setActiveId] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [highlightId, setHighlightId] = useState<string | null>(null);
  const [relationDetail, setRelationDetail] = useState<RelationDetail | null>(null);
  const [stageSize, setStageSize] = useState({ width: 1200, height: 760 });
  const [positions, setPositions] = useState<Record<string, Position>>(() =>
    computeLayoutPositions(museums, 'grid', { width: 1200, height: 760 })
  );
  const [topicRowLabelsDismissed, setTopicRowLabelsDismissed] = useState(layout !== 'topic');
  const [mapScale, setMapScale] = useState(1);
  const [mapOffset, setMapOffset] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const panOrigin = useRef<{ x: number; y: number } | null>(null);

  const renderLinkButton = (link: ExternalLink, key?: string) => (
    <a
      key={key ?? link.url}
      className="mega-action"
      href={link.url}
      target="_blank"
      rel="noreferrer"
    >
      <span className="mega-action-icon">{linkIcons[link.type] ?? linkIcons.other}</span>
      <span>{link.label}</span>
    </a>
  );

  useEffect(() => {
    const resize = () => {
      const rect = stageRef.current?.getBoundingClientRect();
      if (!rect) return;
      setStageSize({ width: rect.width, height: rect.height });
    };
    resize();
    window.addEventListener('resize', resize);
    return () => window.removeEventListener('resize', resize);
  }, []);

  useEffect(() => {
    setPositions(computeLayoutPositions(museums, layout, stageSize));
    setExpandedId(null);
  }, [layout, stageSize]);

  useEffect(() => {
    setTopicRowLabelsDismissed(layout !== 'topic');
  }, [layout]);

  useEffect(() => {
    if (layout !== 'map') {
      setMapScale(1);
      setMapOffset({ x: 0, y: 0 });
      return;
    }

    const entries = Object.values(positions);
    if (!entries.length) return;

    const minX = Math.min(...entries.map((p) => p.x));
    const minY = Math.min(...entries.map((p) => p.y));
    const maxX = Math.max(...entries.map((p) => p.x));
    const maxY = Math.max(...entries.map((p) => p.y));
    const contentWidth = maxX - minX + TILE_WIDTH;
    const contentHeight = maxY - minY + TILE_HEIGHT;

    const padding = 120;
    const fitScale = Math.min(
      stageSize.width / (contentWidth + padding * 2),
      stageSize.height / (contentHeight + padding * 2)
    );

    const clampedScale = Math.min(Math.max(fitScale, 0.3), 2.6);
    const centeredOffset = {
      x: -minX * clampedScale + (stageSize.width - contentWidth * clampedScale) / 2,
      y: -minY * clampedScale + (stageSize.height - contentHeight * clampedScale) / 2,
    };

    setMapScale(clampedScale);
    setMapOffset(centeredOffset);
  }, [layout, positions, stageSize]);

  useEffect(() => {
    applyHashWarp(museums, {
      onOpen: (id) => {
        setActiveId(id);
        setExpandedId(null);
      },
      onHighlight: (id) => {
        setHighlightId(id);
        setTimeout(() => setHighlightId(null), 2600);
      },
    });
  }, []);

  const museumById = useMemo(
    () => Object.fromEntries(museums.map((museum) => [museum.id, museum])),
    []
  );

  useEffect(() => {
    if (!relationDetail) return;
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setRelationDetail(null);
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [relationDetail]);

  const expandedMuseum = expandedId ? museumById[expandedId] : null;

  const overviewContent = useMemo(
    () => (
      <div>
        <h3>About</h3>
        <p>One of the routines I developed during my four months in the Netherlands was visiting museums. The concepts of “박물관” and “미술관” in Korea differ from what “museum” means here. Museums in the Netherlands are multifaceted spaces that build communities through their unique structures, collections, and curatorial approaches. Their goals and values go far beyond preservation and exhibition; these qualities are embedded into their architecture, interior spaces, and exhibition methods, forming a distinct identity of their own.</p>
        <p>I do not want to be a designer who thinks only about convenience or money. I want to create spaces that speak about society in richer and more meaningful ways. For this reason, museums are the kind of environment I hope to work in. I want to reframe artworks to complete their artistic voice, and at the same time, listen closely to the voices of the visitors who experience them.</p>
      </div>
    ),
    []
  );

  const galleryContent = useMemo(
    () => (
      <div>
        <span className="mega-kicker">Visuals</span>
        <h2>Gallery</h2>
        <p>Share concepts quickly with real storage and exhibition photos.</p>
        <div className="gallery-grid">
          {[
            'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee',
            'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85',
            'https://images.unsplash.com/photo-1517817748497-61c8956dbe22',
            'https://images.unsplash.com/photo-1529429617124-aee5f4ae7890',
            'https://images.unsplash.com/photo-1460317442991-0ec209397118',
            'https://images.unsplash.com/photo-1505842679547-5133c17caa2c',
            'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429',
            'https://images.unsplash.com/photo-1469474968028-56623f02e42e',
            'https://images.unsplash.com/photo-1498050108023-c5249f4df085',
          ].map((src, i) => (
            <div key={i} className="gallery-item">
              <img src={`${src}?auto=format&fit=crop&w=600&q=80`} alt={`Gallery image ${i + 1}`} />
            </div>
          ))}
        </div>
      </div>
    ),
    []
  );  const [modal, setModal] = useState<'overview' | 'gallery' | null>(null);

  const handleLockerOpen = (id: string) => {
    setActiveId(id);
    setExpandedId(null);
    setRelationDetail(null);
  };

  const handleRelationClick = (
    sourceId: string,
    targetId: string,
    labelFromHub?: string,
    meta?: { hub?: RelationHub; targetType?: 'hub-member' | 'hub-node' }
  ) => {
    if (meta?.hub && meta.targetType === 'hub-node') {
      const infoLabel = meta.hub.info?.summary ?? labelFromHub ?? `${meta.hub.label} 허브 정보`;
      setRelationDetail({ type: 'hub-info', hub: meta.hub, label: infoLabel });
      setExpandedId(null);
      return;
    }

    if (meta?.hub) {
      const member = museumById[targetId];
      if (!member) return;
      setRelationDetail({
        type: 'hub',
        hub: meta.hub,
        member,
        label: labelFromHub ?? `${meta.hub.label} – ${member.name}`,
      });
      setExpandedId(null);
      return;
    }

    const source = museumById[sourceId];
    const target = museumById[targetId];
    const forwardRelation = source?.relations.find((rel) => rel.targetId === targetId);
    const reverseRelation = target?.relations.find((rel) => rel.targetId === sourceId);
    const forwardLabel = forwardRelation?.label;
    const reverseLabel = reverseRelation?.label;

    if (!source || !target) return;

    setRelationDetail({
      type: 'pair',
      source,
      target,
      label: labelFromHub ?? forwardLabel ?? reverseLabel ?? 'Connection Info',
      description: forwardRelation?.description ?? reverseRelation?.description,
      links: forwardRelation?.externalLinks ?? reverseRelation?.externalLinks,
    });
    setExpandedId(null);
  };

  const handlePositionChange = (id: string, pos: Position) => {
    setPositions((prev) => ({ ...prev, [id]: pos }));
    if (!topicRowLabelsDismissed && layout === 'topic') {
      setTopicRowLabelsDismissed(true);
    }
  };

  const handleWheelZoom = (event: React.WheelEvent) => {
    if (layout !== 'map') return;
    event.preventDefault();
    const rect = stageRef.current?.getBoundingClientRect();
    if (!rect) return;

    const cursor = { x: event.clientX - rect.left, y: event.clientY - rect.top };
    const zoomIntensity = 0.0012;
    const nextScale = Math.min(Math.max(mapScale - event.deltaY * zoomIntensity, 0.3), 2.6);
    const scaleRatio = nextScale / mapScale;

    const nextOffset = {
      x: cursor.x - (cursor.x - mapOffset.x) * scaleRatio,
      y: cursor.y - (cursor.y - mapOffset.y) * scaleRatio,
    };

    setMapScale(nextScale);
    setMapOffset(nextOffset);
  };

  const handlePointerDown = (event: React.PointerEvent) => {
    if (layout !== 'map' || event.button !== 0) return;
    setIsPanning(true);
    panOrigin.current = { x: event.clientX, y: event.clientY };
    (event.target as HTMLElement)?.setPointerCapture(event.pointerId);
  };

  const handlePointerMove = (event: React.PointerEvent) => {
    if (layout !== 'map' || !isPanning || !panOrigin.current) return;
    const dx = event.clientX - panOrigin.current.x;
    const dy = event.clientY - panOrigin.current.y;
    panOrigin.current = { x: event.clientX, y: event.clientY };
    setMapOffset((prev) => ({ x: prev.x + dx, y: prev.y + dy }));
  };

  const stopPanning = (event: React.PointerEvent) => {
    if (!isPanning) return;
    setIsPanning(false);
    panOrigin.current = null;
    (event.target as HTMLElement)?.releasePointerCapture(event.pointerId);
  };

  return (
    <main className="main-shell">
      <header className="controls">
        <LayoutToggle value={layout} onChange={setLayout} />
      </header>
      <div
        ref={stageRef}
        className={`atlas-stage${layout === 'map' ? ' map-mode' : ''}${isPanning ? ' is-panning' : ''}`}
        onWheel={handleWheelZoom}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={stopPanning}
        onPointerCancel={stopPanning}
      >
        <div
          className="atlas-content"
          style={{
            transform: `translate(${mapOffset.x}px, ${mapOffset.y}px) scale(${mapScale})`,
            transformOrigin: '0 0',
          }}
        >
          {layout === 'map' && (
            <div className="map-layer" aria-hidden>
              <div className="map-background" />
            </div>
          )}
          <RelationsLayer
            museums={museums}
            positions={positions}
            stage={stageSize}
            layout={layout}
            onRelationClick={handleRelationClick}
            relationHubs={relationHubs}
          />
          <LockersGrid
            museums={museums}
            positions={positions}
            activeId={activeId}
            expandedId={expandedId}
            layout={layout}
            highlightId={highlightId}
            onOpen={handleLockerOpen}
            onExpand={(id) => {
              setActiveId(id);
              setExpandedId(id);
            }}
            onPositionChange={handlePositionChange}
            clipStyle={layout === 'map' ? 'circle' : 'rect'}
            expansionRadius={Math.hypot(stageSize.width, stageSize.height)}
            stage={stageSize}
            topicRowLabels={TOPIC_ROW_LABELS}
            showTopicRowLabels={layout === 'topic' && !topicRowLabelsDismissed}
          />
        </div>
      </div>

      <AnimatePresence>
        {modal && (
          <motion.div
            className="mega-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setModal(null)}
            style={{ zIndex: 40 }}
          >
            <motion.div
              className="mega-panel"
              style={{ width: 'min(600px, 90vw)' }}
              initial={{ scale: 0.95, opacity: 0, y: 14 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 14 }}
              transition={{ type: 'spring', stiffness: 120, damping: 16 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="mega-close"
                onClick={() => setModal(null)}
              >
                ✕
              </button>
              <div className="mega-header">
                {modal === 'overview' ? overviewContent : galleryContent}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <FabButtons onShowOverview={() => setModal('overview')} onShowGallery={() => setModal('gallery')} />

      <AnimatePresence>
        {relationDetail && (
          <motion.div
            className="relation-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setRelationDetail(null)}
          >
            <motion.div
              className="relation-panel"
              initial={{ scale: 0.96, opacity: 0, y: 12 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.96, opacity: 0, y: 12 }}
              transition={{ type: 'spring', stiffness: 140, damping: 18 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="relation-close"
                onClick={(e) => {
                  e.stopPropagation();
                  setRelationDetail(null);
                }}
                aria-label="Close connection info"
              >
                ✕
              </button>
              <div className="relation-head">
                <span className="relation-chip">Connection Info</span>
                {relationDetail.type === 'hub-info' ? (
                  <>
                    <h3>{relationDetail.hub.label}</h3>
                    {relationDetail.hub.info?.summary && (
                      <p className="relation-subtitle">{relationDetail.hub.info.summary}</p>
                    )}
                  </>
                ) : relationDetail.type === 'hub' ? (
                  <>
                    <h3>{relationDetail.hub.label}</h3>
                    {relationDetail.hub.info?.summary && (
                      <p className="relation-subtitle">{relationDetail.hub.info.summary}</p>
                    )}
                  </>
                ) : (
                  <>
                    <h3>{relationDetail.label}</h3>
                    {relationDetail.type === 'pair' && (
                      <p className="relation-subtitle">{`${relationDetail.source.name} ↔ ${relationDetail.target.name}`}</p>
                    )}
                  </>
                )}
                {relationDetail.type === 'pair' && relationDetail.description && (
                  <p className="relation-note">{relationDetail.description}</p>
                )}
                {relationDetail.type === 'pair' && relationDetail.links?.length ? (
                  <div className="relation-links">
                    {relationDetail.links.map((link) => renderLinkButton(link))}
                  </div>
                ) : null}
              </div>
              {relationDetail.type === 'hub' && (
                <div className="relation-hub-members">
                  <small>Connecting with</small>
                  <div className="relation-hub-pills">
                    {relationDetail.hub.members
                      .filter((id) => id !== relationDetail.member.id)
                      .map((id) => (
                        <span key={id} className="relation-hub-pill">
                          {museumById[id]?.name ?? id}
                        </span>
                      ))}
                  </div>
                </div>
              )}
              {relationDetail.type === 'hub-info' && (
                <div className="relation-hub-providers">
                  <div className="relation-hub-provider-chips">
                    {relationDetail.hub.info?.providers?.length ? (
                      relationDetail.hub.info.providers.map((provider) => {
                        const museum = provider.museumId ? museumById[provider.museumId] : null;
                        const isClickable = !!museum;
                        const TagName = isClickable ? 'button' : 'span';
                        return (
                          <TagName
                            key={`${provider.role}-${provider.name}`}
                            className={`relation-hub-provider role-${provider.role}${isClickable ? ' clickable' : ''}`}
                            onClick={isClickable ? () => {
                              setRelationDetail(null);
                              setExpandedId(provider.museumId!);
                            } : undefined}
                            type={isClickable ? 'button' : undefined}
                          >
                            <em>{providerRoleLabels[provider.role] ?? 'Partner'}</em>
                            <strong>{provider.name}</strong>
                          </TagName>
                        );
                      })
                    ) : (
                      <span className="relation-hub-provider empty">No registered providers</span>
                    )}
                  </div>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {expandedMuseum && (
          <motion.div
            className="mega-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setExpandedId(null)}
          >
            <motion.div
              className="mega-panel"
              initial={{ scale: 0.95, opacity: 0, y: 14 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 14 }}
              transition={{ type: 'spring', stiffness: 120, damping: 16 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button className="mega-close" onClick={() => setExpandedId(null)} aria-label="Close">
                ✕
              </button>

              <div className="mega-header">
                <div className="mega-kicker-group">
                  {expandedMuseum.topic?.split(',').map((tag) => (
                    <span key={tag.trim()} className="mega-kicker">
                      {tag.trim()}
                    </span>
                  ))}
                </div>
                <h2>{expandedMuseum.name}</h2>
                <p>{expandedMuseum.whatTheyDo?.title ?? expandedMuseum.detail.description}</p>
              </div>

              {/* Location & Opening Hours - 2열 카드 */}
              <div className="mega-info-grid">
                {expandedMuseum.location && (
                  <div className="mega-info-card">
                    <small>Location</small>
                    {expandedMuseum.locationUrl ? (
                      <a href={expandedMuseum.locationUrl} target="_blank" rel="noopener noreferrer" className="mega-info-link">
                        {expandedMuseum.location}
                      </a>
                    ) : (
                      <span>{expandedMuseum.location}</span>
                    )}
                  </div>
                )}
                {expandedMuseum.openingTime?.length ? (
                  <div className="mega-info-card">
                    <small>Opening Hours</small>
                    <ul>
                      {expandedMuseum.openingTime.map((line) => (
                        <li key={line}>{line}</li>
                      ))}
                    </ul>
                  </div>
                ) : null}
              </div>

              {/* Organization, Website, Instagram - 3열 1행 버튼 */}
              <div className="mega-link-buttons">
                {expandedMuseum.organizationUrl &&
                  renderLinkButton(
                    {
                      type: 'website',
                      label: 'Organization',
                      url: expandedMuseum.organizationUrl,
                    },
                    `${expandedMuseum.id}-org`
                  )}
                {expandedMuseum.externalLinks?.map((link) => renderLinkButton(link, `${expandedMuseum.id}-${link.url}`))}
              </div>

              {/* What They Do & Connections - 1열 카드형 (세로 2행) */}
              <div className="mega-content-cards">
                <div className="mega-content-card">
                  <h4>What they do</h4>
                  <p>{expandedMuseum.detail.description}</p>
                  {expandedMuseum.whatTheyDo?.bullets?.length ? (
                    <ul className="mega-bullets">
                      {expandedMuseum.whatTheyDo.bullets.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  ) : null}
                  {expandedMuseum.detail.highlights?.length ? (
                    <>
                      <h5>Highlights</h5>
                      <ul className="mega-bullets">
                        {expandedMuseum.detail.highlights.map((item) => (
                          <li key={item}>{item}</li>
                        ))}
                      </ul>
                    </>
                  ) : null}
                </div>

                <div className="mega-content-card">
                  <h4>Connections</h4>
                  {expandedMuseum.relations.length || relationHubs.some((hub) => hub.members.includes(expandedMuseum.id)) ? (
                    <ul className="mega-relations">
                      {/* Direct relations */}
                      {expandedMuseum.relations.map((rel) => (
                        <li 
                          key={rel.targetId}
                          className="mega-relation-clickable"
                          onClick={() => {
                            const targetMuseum = museumById[rel.targetId];
                            if (targetMuseum) {
                              setExpandedId(rel.targetId);
                            }
                          }}
                        >
                          <div>
                            <strong>{museumById[rel.targetId]?.name ?? rel.targetId}</strong>
                            <span> · {rel.label}</span>
                            {rel.description && <p className="mega-relation-note">{rel.description}</p>}
                          </div>
                          {rel.externalLinks?.length ? (
                            <div className="mega-relation-links">
                              {rel.externalLinks.map((link) => renderLinkButton(link, `${rel.targetId}-${link.url}`))}
                            </div>
                          ) : null}
                        </li>
                      ))}
                      {/* Relation hubs */}
                      {relationHubs
                        .filter((hub) => hub.members.includes(expandedMuseum.id))
                        .map((hub) => (
                          <li 
                            key={hub.id}
                            className="mega-relation-clickable"
                            onClick={() => {
                              const member = museumById[expandedMuseum.id];
                              if (member) {
                                setRelationDetail({
                                  type: 'hub-info',
                                  hub,
                                  label: hub.label,
                                });
                              }
                            }}
                          >
                            <div>
                              <strong>{hub.label}</strong>
                              <span> · Hub with {hub.members.length} members</span>
                              {hub.info?.summary && <p className="mega-relation-note">{hub.info.summary}</p>}
                            </div>
                          </li>
                        ))}
                    </ul>
                  ) : (
                    <p className="mega-empty">No connection</p>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
