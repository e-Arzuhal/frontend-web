import React, { useState } from 'react';
import { colors, radius, shadows, transitions } from '../../styles/tokens';

const Card = ({ children, hover = true, onClick, padding = '24px', style }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        background: colors.card,
        borderRadius: radius.lg,
        border: `1px solid ${hover && isHovered ? colors.accent : colors.border}`,
        boxShadow: hover && isHovered ? shadows.lg : shadows.sm,
        transition: `all ${transitions.slow}`,
        cursor: onClick ? 'pointer' : 'default',
        padding,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

export default Card;
