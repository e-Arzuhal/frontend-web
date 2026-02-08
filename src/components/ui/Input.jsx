import React, { useState } from 'react';
import { colors, radius, fonts, shadows, transitions } from '../../styles/tokens';

const Input = ({
  label,
  placeholder,
  value,
  onChange,
  error,
  icon,
  disabled,
  required,
  type = 'text',
  name,
  autoComplete,
  inputMode,
  maxLength,
  iconBoxed = false,
}) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', width: '100%' }}>
      {label && (
        <label style={{ fontSize: '13px', fontWeight: 500, fontFamily: fonts.body, color: colors.text }}>
          {label}{required && <span style={{ color: colors.error, marginLeft: '4px' }}>*</span>}
        </label>
      )}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        padding: '12px 16px',
        borderRadius: radius.md,
        border: `1.5px solid ${error ? colors.error : isFocused ? colors.borderFocus : colors.border}`,
        background: disabled ? colors.surfaceAlt : colors.card,
        boxShadow: isFocused ? shadows.glow : 'none',
        transition: `all ${transitions.base}`,
      }}>
        {icon && (
          iconBoxed ? (
            <span
              style={{
                width: 32,
                height: 32,
                borderRadius: radius.sm,
                background: colors.surfaceAlt,
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: colors.textMuted,
                flex: '0 0 auto',
              }}
            >
              {icon}
            </span>
          ) : (
            <span style={{ color: colors.textMuted, display: 'inline-flex' }}>{icon}</span>
          )
        )}

        <input
          type={type}
          name={name}
          autoComplete={autoComplete}
          inputMode={inputMode}
          maxLength={maxLength}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          disabled={disabled}
          required={required}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          style={{
            flex: 1,
            border: 'none',
            outline: 'none',
            background: 'transparent',
            fontSize: '14px',
            fontFamily: fonts.body,
            color: colors.text,
          }}
        />
      </div>
      {error && <span style={{ fontSize: '12px', color: colors.error }}>{error}</span>}
    </div>
  );
};

export default Input;
