// src/components/Chart.jsx
import React from 'react';

const Chart = ({ data, type = 'bar', width = 400, height = 200 }) => {
  if (!data || data.length === 0) return null;

  const maxValue = Math.max(...data.map(d => d.value));
  const barWidth = width / data.length - 10;

  if (type === 'bar') {
    return (
      <div style={{ width, height, position: 'relative', backgroundColor: '#f9fafb', borderRadius: '8px', padding: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'end', height: height - 60, gap: '5px' }}>
          {data.map((item, index) => {
            const barHeight = (item.value / maxValue) * (height - 80);
            return (
              <div key={index} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}>
                <div style={{ fontSize: '12px', marginBottom: '5px', color: '#6b7280' }}>
                  {item.value}
                </div>
                <div style={{
                  width: '100%',
                  maxWidth: '40px',
                  height: barHeight,
                  backgroundColor: '#3b82f6',
                  borderRadius: '4px 4px 0 0',
                  transition: 'all 0.3s ease'
                }} />
                <div style={{ fontSize: '11px', marginTop: '8px', color: '#374151', textAlign: 'center', wordBreak: 'break-word' }}>
                  {item.label}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  if (type === 'line') {
    const points = data.map((item, index) => {
      const x = (index / (data.length - 1)) * (width - 40) + 20;
      const y = height - 40 - (item.value / maxValue) * (height - 80);
      return `${x},${y}`;
    }).join(' ');

    return (
      <div style={{ width, height, position: 'relative', backgroundColor: '#f9fafb', borderRadius: '8px', padding: '20px' }}>
        <svg width={width} height={height}>
          <polyline
            points={points}
            fill="none"
            stroke="#3b82f6"
            strokeWidth="2"
          />
          {data.map((item, index) => {
            const x = (index / (data.length - 1)) * (width - 40) + 20;
            const y = height - 40 - (item.value / maxValue) * (height - 80);
            return (
              <circle
                key={index}
                cx={x}
                cy={y}
                r="4"
                fill="#3b82f6"
              />
            );
          })}
        </svg>
      </div>
    );
  }

  return null;
};

export default Chart;