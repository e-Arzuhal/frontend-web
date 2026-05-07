import React, { useState } from 'react';
import { colors, fonts } from '../../styles/tokens';

const DEFAULT_PALETTE = [
  '#C8963E', '#1B2A4A', '#3F8F73', '#B5454A',
  '#7A5BA1', '#D08A4A', '#4F7AA8', '#8B8B8B',
];

const polarToCartesian = (cx, cy, r, angle) => {
  const rad = ((angle - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
};

const arcPath = (cx, cy, rOuter, rInner, startAngle, endAngle) => {
  const largeArc = endAngle - startAngle > 180 ? 1 : 0;
  const p1 = polarToCartesian(cx, cy, rOuter, endAngle);
  const p2 = polarToCartesian(cx, cy, rOuter, startAngle);
  const p3 = polarToCartesian(cx, cy, rInner, startAngle);
  const p4 = polarToCartesian(cx, cy, rInner, endAngle);
  return [
    `M ${p1.x} ${p1.y}`,
    `A ${rOuter} ${rOuter} 0 ${largeArc} 0 ${p2.x} ${p2.y}`,
    `L ${p3.x} ${p3.y}`,
    `A ${rInner} ${rInner} 0 ${largeArc} 1 ${p4.x} ${p4.y}`,
    'Z',
  ].join(' ');
};

const DonutChart = ({ data = [], size = 200, thickness = 36, palette = DEFAULT_PALETTE, centerLabel }) => {
  const [hoverIdx, setHoverIdx] = useState(null);
  const total = data.reduce((sum, d) => sum + (d.value || 0), 0);
  const cx = size / 2;
  const cy = size / 2;
  const rOuter = size / 2 - 4;
  const rInner = rOuter - thickness;

  let cumulative = 0;
  const slices = data.map((d, i) => {
    const value = d.value || 0;
    const ratio = total > 0 ? value / total : 0;
    const start = cumulative * 360;
    cumulative += ratio;
    const end = cumulative * 360;
    return { ...d, start, end, ratio, color: d.color || palette[i % palette.length], idx: i };
  });

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '24px', flexWrap: 'wrap' }}>
      <div style={{ position: 'relative', width: size, height: size, flexShrink: 0 }}>
        <svg width={size} height={size}>
          {total === 0 ? (
            <circle cx={cx} cy={cy} r={(rOuter + rInner) / 2} fill="none" stroke={colors.border} strokeWidth={thickness} />
          ) : slices.length === 1 ? (
            <circle cx={cx} cy={cy} r={(rOuter + rInner) / 2} fill="none" stroke={slices[0].color} strokeWidth={thickness} />
          ) : (
            slices.map((s) => {
              if (s.ratio === 0) return null;
              const isHovered = hoverIdx === s.idx;
              const path = arcPath(
                cx, cy,
                isHovered ? rOuter + 3 : rOuter,
                rInner,
                s.start,
                s.end - 0.5,
              );
              return (
                <path
                  key={s.idx}
                  d={path}
                  fill={s.color}
                  opacity={hoverIdx === null || isHovered ? 1 : 0.55}
                  style={{ transition: 'opacity 0.15s, d 0.15s', cursor: 'pointer' }}
                  onMouseEnter={() => setHoverIdx(s.idx)}
                  onMouseLeave={() => setHoverIdx(null)}
                >
                  <title>{`${s.label}: ${s.value} (${(s.ratio * 100).toFixed(1)}%)`}</title>
                </path>
              );
            })
          )}
        </svg>
        <div style={{
          position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center', pointerEvents: 'none',
        }}>
          <div style={{ fontSize: '28px', fontWeight: 700, color: colors.text, fontFamily: fonts.heading }}>
            {hoverIdx !== null ? slices[hoverIdx].value : total}
          </div>
          <div style={{ fontSize: '11px', color: colors.textMuted, marginTop: '2px' }}>
            {hoverIdx !== null ? slices[hoverIdx].label : (centerLabel || 'Toplam')}
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1, minWidth: 140 }}>
        {slices.length === 0 ? (
          <div style={{ fontSize: '13px', color: colors.textMuted }}>Veri yok</div>
        ) : slices.map((s) => (
          <div
            key={s.idx}
            onMouseEnter={() => setHoverIdx(s.idx)}
            onMouseLeave={() => setHoverIdx(null)}
            style={{
              display: 'flex', alignItems: 'center', gap: '10px',
              padding: '4px 6px', borderRadius: '6px', cursor: 'pointer',
              background: hoverIdx === s.idx ? colors.surfaceAlt : 'transparent',
              transition: 'background 0.15s',
            }}
          >
            <span style={{ width: 10, height: 10, borderRadius: '50%', background: s.color, flexShrink: 0 }} />
            <span style={{ fontSize: '13px', color: colors.text, flex: 1 }}>{s.label}</span>
            <span style={{ fontSize: '13px', color: colors.textSecondary, fontWeight: 500 }}>
              {s.value}{total > 0 && ` · ${(s.ratio * 100).toFixed(0)}%`}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DonutChart;
