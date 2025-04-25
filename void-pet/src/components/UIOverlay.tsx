import React from "react";

interface UIOverlayProps {
  onFeed: () => void;
  onRest: () => void;
  onPlay: () => void;
  isLoading?: boolean;
}

const UIOverlay: React.FC<UIOverlayProps> = ({
  onFeed,
  onRest,
  onPlay,
  isLoading = false,
}) => {
  return (
    <div className="ui-overlay">
      <button
        className="action-button feed-button"
        onClick={onFeed}
        disabled={isLoading}
      >
        <span role="img" aria-label="Feed">
          🍰
        </span>{" "}
        Feed
      </button>

      <button
        className="action-button rest-button"
        onClick={onRest}
        disabled={isLoading}
      >
        <span role="img" aria-label="Rest">
          💤
        </span>{" "}
        Rest
      </button>

      <button
        className="action-button play-button"
        onClick={onPlay}
        disabled={isLoading}
      >
        <span role="img" aria-label="Play">
          🎮
        </span>{" "}
        Play
      </button>
    </div>
  );
};

export default UIOverlay;
