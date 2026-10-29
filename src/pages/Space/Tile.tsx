import React from 'react';
import { ComputedTile, Project } from '../../types/portfolio';
import { SPACE_CONFIG } from '../../data/portfolioData';

interface TileProps {
  computed: ComputedTile;
  isHovered: boolean;
  onMouseEnter?: (project: Project) => void;
  onMouseLeave?: () => void;
  onClick: (project: Project) => void;
}

const BG_COLORS = ['#1a1918', '#22201e', '#1c1b1a', '#242220', '#1e1c1b'];

export const Tile: React.FC<TileProps> = ({
  computed,
  isHovered,
  onMouseEnter,
  onMouseLeave,
  onClick
}) => {
  const { project, posX, posY, totalZ, cylRotX, cylRotY, cylRotZ, depthOpacity, uniqueStackIndex, width, height } = computed;

  const restTransform = `translate(-50%, -50%) translate3d(${posX.toFixed(1)}px, ${posY.toFixed(1)}px, ${totalZ.toFixed(1)}px) rotateX(${cylRotX.toFixed(2)}deg) rotateY(${cylRotY.toFixed(2)}deg) rotateZ(${cylRotZ.toFixed(2)}deg) scale(1)`;
  const hoverTransform = `translate(-50%, -50%) translate3d(${posX.toFixed(1)}px, ${posY.toFixed(1)}px, ${(totalZ + 30).toFixed(1)}px) rotateX(${(cylRotX * 0.25).toFixed(2)}deg) rotateY(${(cylRotY * 0.25).toFixed(2)}deg) rotateZ(0deg) scale(1.02)`;

  const filter = isHovered
    ? 'brightness(1.08) saturate(1.05) drop-shadow(0px 18px 48px rgba(0,0,0,0.98))'
    : `brightness(${SPACE_CONFIG.TILE_REST_BRIGHTNESS}) saturate(${SPACE_CONFIG.TILE_REST_SATURATE}) drop-shadow(0px 16px 42px rgba(0,0,0,0.88))`;

  const src = project.thumb || project.media?.src || '';
  const isVideo = project.thumbType === 'video' || project.mediaKind === 'video' || project.media?.type === 'video';
  const bgCol = BG_COLORS[computed.index % BG_COLORS.length];

  return (
    <div
      className={`tile ${computed.sizeClass || 'medium'} ${isHovered ? 'is-hovered' : ''}`}
      data-slug={project.slug}
      data-target-slug={project.targetSlug || undefined}
      data-x={computed.posX}
      data-y={computed.posY}
      data-zpx={computed.totalZ}
      data-rx={computed.cylRotX}
      data-ry={computed.cylRotY}
      data-rz={computed.cylRotZ}
      data-index={computed.index}
      data-cursor="Learn More"
      data-x-pos={computed.posX > 35 ? 'right' : undefined}
      style={
        {
          width: `${width}px`,
          height: `${height}px`,
          '--tile-w': `${width}px`,
          '--tile-h': `${height}px`,
          '--tile-transform': restTransform,
          '--tile-hover-transform': hoverTransform,
          transform: isHovered ? hoverTransform : restTransform,
          opacity: isHovered ? 1.0 : depthOpacity,
          zIndex: isHovered ? 9999 : uniqueStackIndex,
          filter
        } as React.CSSProperties
      }
      onMouseEnter={() => onMouseEnter?.(project)}
      onMouseLeave={onMouseLeave}
      onClick={() => onClick(project)}
    >
      <div className="frame">
        {isVideo ? (
          <video
            src={src}
            autoPlay
            loop
            muted
            playsInline
            poster={project.media?.poster || ''}
          />
        ) : src ? (
          <img
            src={src}
            alt={project.title}
            loading="lazy"
            decoding="async"
          />
        ) : (
          <svg
            width="100%"
            height="100%"
            viewBox="0 0 400 260"
            preserveAspectRatio="xMidYMid slice"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect width="400" height="260" fill={bgCol} />
            <circle cx="200" cy="130" r="70" fill="none" stroke="rgba(201,168,117,0.15)" strokeWidth="1.5" />
            <path d="M160 130 L240 130 M200 90 L200 170" stroke="rgba(233,231,226,0.2)" strokeWidth="1" />
            <text
              x="200"
              y="134"
              fontFamily="Zapf-Humanist-Demi, serif"
              fontSize="12"
              fill="#c9a875"
              letterSpacing="3"
              textAnchor="middle"
              opacity="0.6"
            >
              {project.title.toUpperCase()}
            </text>
          </svg>
        )}
      </div>
    </div>
  );
};
