// src/components/StatsDisplay/StatsDisplay.tsx
import React from "react";
import styles from "./StatsDisplay.module.css";
import type { Pet } from "../../models/pet.model"; // Adjust path as needed

interface StatsDisplayProps {
  stats: Pet["stats"]; // Takes only the stats object from the Pet
}

interface StatDetailProps {
  label: string;
  value: number;
  barColorClass?: string; // e.g., styles.hungerFill
}

const StatDetail: React.FC<StatDetailProps> = ({
  label,
  value,
  barColorClass,
}) => {
  const percentage = Math.max(0, Math.min(100, Math.round(value)));

  // Special handling for tiredness: if 0 means not tired, and 100 means exhausted,
  // the bar width should represent the level of fatigue.
  // If you want the bar to represent "energy" (inverse of tiredness), then width = 100 - percentage.
  // For now, let's assume the bar directly represents the stat value.
  const barWidth = `${percentage}%`;

  return (
    <div className={styles.statItem}>
      <div className={styles.statLabel}>{label}</div>
      <div className={styles.statBox}>
        <div className={styles.statValue}>{percentage}%</div>
        <div className={styles.progressBarBackground}>
          <div
            className={`${styles.progressBarFill} ${barColorClass || ""}`}
            style={{ width: barWidth }}
            role="progressbar"
            aria-valuenow={percentage}
            aria-valuemin={0}
            aria-valuemax={100}
          ></div>
        </div>
      </div>
    </div>
  );
};

const StatsDisplay: React.FC<StatsDisplayProps> = ({ stats }) => {
  return (
    <div className={styles.statsBarContainer}>
      <StatDetail
        label="Hunger"
        value={stats.hunger}
        barColorClass={styles.hungerFill}
      />
      {/* For Tiredness: 0 = not tired, 100 = exhausted.
          A low stat value is good. The bar will reflect the stat value directly.
          So a low bar means low tiredness. */}
      <StatDetail
        label="Tiredness"
        value={stats.tiredness}
        barColorClass={styles.tirednessFill}
      />
      <StatDetail
        label="Entertainment"
        value={stats.entertainment}
        barColorClass={styles.entertainmentFill}
      />
    </div>
  );
};

export default StatsDisplay;
