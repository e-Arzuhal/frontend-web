import React from 'react';
import { colors, fonts } from '../../styles/tokens';

const StepIndicator = ({ steps, currentStep = 0 }) => {
  return (
    <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
      {steps.map((step, index) => {
        const isCompleted = index < currentStep;
        const isCurrent = index === currentStep;
        const isLast = index === steps.length - 1;

        return (
          <React.Fragment key={index}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '13px',
                fontWeight: 600,
                fontFamily: fonts.body,
                background: isCompleted ? colors.success : isCurrent ? colors.accent : colors.surfaceAlt,
                color: isCompleted || isCurrent ? '#fff' : colors.textMuted,
                border: isCurrent ? `2px solid ${colors.accentLight}` : 'none',
              }}>
                {isCompleted ? '✓' : index + 1}
              </div>
              <span style={{
                fontSize: '12px',
                fontFamily: fonts.body,
                fontWeight: isCurrent ? 600 : 400,
                color: index > currentStep ? colors.textMuted : colors.text,
                marginTop: '8px',
                textAlign: 'center',
              }}>
                {step}
              </span>
            </div>
            {!isLast && (
              <div style={{
                flex: 1,
                height: '2px',
                background: isCompleted ? colors.success : colors.border,
                margin: '0 8px',
                marginBottom: '28px',
              }} />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};

export default StepIndicator;
