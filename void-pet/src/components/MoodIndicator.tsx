import React from "react";
//import '../styles/MoodIndicator.css';

interface MoodIndicatorProps {
  hunger: number;
  tiredness: number;
  entertainment: number;
}

const MoodIndicator: React.FC<MoodIndicatorProps> = ({
  hunger,
  tiredness,
  entertainment,
}) => {
  const formatValue = (value: number): number => {
    return Math.max(0, Math.min(100, Math.round(value)));
  };

  const getColorClass = (value: number): string => {
    if (value > 70) return "mood-high";
    if (value > 40) return "mood-medium";
    return "mood-low";
  };

  return (
    <div className="mood-indicator">
      <div className="mood-bars">
        <div className="mood-bar">
          <div className="mood-label">Hunger</div>
          <div className="mood-bar-container">
            <div
              className={`mood-bar-fill ${getColorClass(hunger)}`}
              style={{ width: `${formatValue(hunger)}%` }}
            />
          </div>
          <div className="mood-value">{formatValue(hunger)}%</div>
        </div>

        <div className="mood-bar">
          <div className="mood-label">Energy</div>
          <div className="mood-bar-container">
            <div
              className={`mood-bar-fill ${getColorClass(tiredness)}`}
              style={{ width: `${formatValue(tiredness)}%` }}
            />
          </div>
          <div className="mood-value">{formatValue(tiredness)}%</div>
        </div>

        <div className="mood-bar">
          <div className="mood-label">Fun</div>
          <div className="mood-bar-container">
            <div
              className={`mood-bar-fill ${getColorClass(entertainment)}`}
              style={{ width: `${formatValue(entertainment)}%` }}
            />
          </div>
          <div className="mood-value">{formatValue(entertainment)}%</div>
        </div>
      </div>
    </div>
  );
};

export default MoodIndicator;
