// src/components/Controls/Controls.tsx
import React from "react";
import styles from "./Controls.module.css";

interface ControlsProps {
  onFeed: () => void;
  onPlay: () => void;
  onSleep: () => void;
  isLoading?: boolean; // To disable buttons during an action
}

const Controls: React.FC<ControlsProps> = ({
  onFeed,
  onPlay,
  onSleep,
  isLoading,
}) => {
  return (
    <aside className={styles.controlsPanel}>
      <button
        onClick={onFeed}
        className={styles.controlButton}
        disabled={isLoading}
      >
        Feed
      </button>
      <button
        onClick={onSleep}
        className={styles.controlButton}
        disabled={isLoading}
      >
        Sleep
      </button>
      <button
        onClick={onPlay}
        className={styles.controlButton}
        disabled={isLoading}
      >
        Play
      </button>
    </aside>
  );
};

export default Controls;
