import React, { useState } from 'react';
import { colors, radius, fonts, shadows, transitions } from '../../styles/tokens';

const TextArea = ({ label, placeholder, value, onChange, error, rows = 4, maxLength, showCount, required }) => {
  const [isFocused, setIsFocused] = useState(false);
  const charCount = value?.length || 0;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', width: '100%' }}>
      {label && (
        <label style={{ fontSize: '13px', fontWeight: 500, fontFamily: fonts.body, color: colors.text }}>
          {label}{required && <span style={{ color: colors.error, marginLeft: '4px' }}>*</span>}
        </label>
      )}
      <div style={{
        borderRadius: radius.md,
        border: `1.5px solid ${error ? colors.error : isFocused ? colors.borderFocus : colors.border}`,
        background: colors.card,
        boxShadow: isFocused ? shadows.glow : 'none',
        transition: `all ${transitions.base}`,
      }}>
        <textarea
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          rows={rows}
          maxLength={maxLength}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          style={{
            width: '100%',
            padding: '14px 16px',
            border: 'none',
            outline: 'none',
            background: 'transparent',
            fontSize: '14px',
            fontFamily: fonts.body,
            color: colors.text,
            lineHeight: 1.6,
            resize: 'vertical',
          }}
        />
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        {error && <span style={{ fontSize: '12px', color: colors.error }}>{error}</span>}
        {showCount && <span style={{ fontSize: '12px', color: colors.textMuted, marginLeft: 'auto' }}>{charCount}{maxLength ? `/${maxLength}` : ''}</span>}
      </div>
    </div>
  );
};

export default TextArea;
