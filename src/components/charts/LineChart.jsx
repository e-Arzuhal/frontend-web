import React, { useState } from 'react';
import { colors, fonts } from '../../styles/tokens';

const LineChart = ({
  data = [],
  height = 200,
  color = '#C8963E',
  yLabel = '',
}) => {
  const [hoverIdx, setHoverIdx] = useState(null);

  const width = 600;
  const padTop = 16;
  const padBottom = 32;
  const padLeft = 36;
  const padRight = 16;
  const chartW = width - padLeft - padRight;
  const chartH = height - padTop - padBottom;

  const max = Math.max(1, ...data.map((d) => d.value || 0));
  const yTicks = 4;
  const niceMax = Math.ceil(max / yTicks) * yTicks || yTicks;

  const x = (i) => {
    if (data.length <= 1) return padLeft + chartW / 2;
    return padLeft + (i / (data.length - 1)) * chartW;
  };
  const y = (v) => padTop + chartH - (v / niceMax) * chartH;

  const linePath = data
    .map((d, i) => `${i === 0 ? 'M' : 'L'} ${x(i)} ${y(d.value || 0)}`)
    .join(' ');

  const areaPath = data.length > 0
    ? `${linePath} L ${x(data.length - 1)} ${padTop + chartH} L ${x(0)} ${padTop + chartH} Z`
    : '';

  return (
    <div style={{ width: '100%', overflowX: 'auto' }}>
      <svg viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="xMidYMid meet" style={{ width: '100%', minWidth: 360, fontFamily: fonts.body }}>
        <defs>
          <linearGradient id="lineGradient" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.25" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>

        {Array.from({ length: yTicks + 1 }).map((_, i) => {
          const v = (niceMax / yTicks) * i;
          const yy = y(v);
          return (
            <g key={i}>
              <line x1={padLeft} x2={width - padRight} y1={yy} y2={yy} stroke={colors.border} strokeDasharray="3 3" />
              <text x={padLeft - 6} y={yy + 4} textAnchor="end" fontSize="10" fill={colors.textMuted}>
                {Math.round(v)}
              </text>
            </g>
          );
        })}

        {data.length > 0 && (
          <>
            <path d={areaPath} fill="url(#lineGradient)" />
            <path d={linePath} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </>
        )}

        {data.map((d, i) => {
          const cx = x(i);
          const cy = y(d.value || 0);
          const isHovered = hoverIdx === i;
          return (
            <g key={i}>
              <text x={cx} y={height - 10} textAnchor="middle" fontSize="11" fill={colors.textSecondary}>
                {d.label}
              </text>
              <circle
                cx={cx}
                cy={cy}
                r={isHovered ? 6 : 3.5}
                fill={color}
                stroke="#fff"
                strokeWidth="2"
                style={{ transition: 'r 0.15s', cursor: 'pointer' }}
                onMouseEnter={() => setHoverIdx(i)}
                onMouseLeave={() => setHoverIdx(null)}
              >
                <title>{`${d.label}: ${d.value}${yLabel ? ' ' + yLabel : ''}`}</title>
              </circle>
              {isHovered && (
                <g>
                  <rect x={cx - 22} y={cy - 32} width="44" height="22" rx="4" fill={colors.text} opacity="0.92" />
                  <text x={cx} y={cy - 17} textAnchor="middle" fontSize="11" fontWeight="600" fill="#fff">
                    {d.value}
                  </text>
                </g>
              )}
            </g>
          );
        })}

        {data.length === 0 && (
          <text x={width / 2} y={height / 2} textAnchor="middle" fontSize="13" fill={colors.textMuted}>
            Veri yok
          </text>
        )}
      </svg>
    </div>
  );
};

export default LineChart;
