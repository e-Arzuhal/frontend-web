import React from 'react';
import { colors, radius, fonts } from '../../styles/tokens';

const ProgressBar = ({ value, max = 100, label }) => {
  const pct = Math.min(Math.round((value / max) * 100), 100);

  return (
    <div style={{ width: '100%' }}>
      {label && (
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
          <span style={{ fontSize: '12px', fontFamily: fonts.body, fontWeight: 500 }}>{label}</span>
          <span style={{ fontSize: '12px', fontFamily: fonts.mono, fontWeight: 600, color: colors.accent }}>{pct}%</span>
        </div>
      )}
      <div style={{ width: '100%', height: '8px', background: colors.surfaceAlt, borderRadius: radius.full }}>
        <div style={{ width: `${pct}%`, height: '100%', background: colors.accent, borderRadius: radius.full, transition: 'width 0.5s ease' }} />
      </div>
    </div>
  );
};

export default ProgressBar;
