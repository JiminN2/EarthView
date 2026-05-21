import { useEffect, useRef, useState, type SyntheticEvent } from "react";
import styles from "./Introduction.module.css";
import IntroductionBg from "./IntroductionBg.tsx";

type Props = {
  activeTrack: {
    label: string;
    file: string;
  } | null;
  isPlaying: boolean;
  hasNextTrack: boolean;
  onTogglePlay: () => void;
  onNextTrack: () => void;
  onTrackEnd: () => void;
};

export default function Introduction({
  activeTrack,
  isPlaying,
  hasNextTrack,
  onTogglePlay,
  onNextTrack,
  onTrackEnd,
}: Props) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.play().catch(() => {});
    } else {
      audio.pause();
    }
  }, [isPlaying, activeTrack]);

  useEffect(() => {
    if (!activeTrack) {
      setProgress(0);
    }
  }, [activeTrack]);

  const handleTimeUpdate = (event: SyntheticEvent<HTMLAudioElement>) => {
    const audio = event.currentTarget;
    if (!audio.duration) return;
    setProgress((audio.currentTime / audio.duration) * 100);
  };

  const handleLoadedMetadata = (event: SyntheticEvent<HTMLAudioElement>) => {
    const audio = event.currentTarget;
    if (!audio.duration) return;
    setProgress((audio.currentTime / audio.duration) * 100);
  };

  return (
    <div className={styles.landing}>
      <IntroductionBg isPlaying={isPlaying}/>
       {/* ── All UI sits above the canvas ── */}
      {/* <div style={{ position: "relative", zIndex: 1 }}></div> */}
      <div className={styles.centerControls}>
        {activeTrack && (
          <>
            <button
              type="button"
              className={styles.controlButton}
              onClick={onTogglePlay}
              aria-label={isPlaying ? "Pause" : "Play"}
            >
              {isPlaying ? (
                <svg viewBox="0 0 24 24" width="48" height="48" aria-hidden="true">
                  <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" fill="currentColor" />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" width="48" height="48" aria-hidden="true">
                  <path d="M8 5v14l11-7z" fill="currentColor" />
                </svg>
              )}
            </button>
            <button
              type="button"
              className={styles.nextButton}
              onClick={onNextTrack}
              disabled={!hasNextTrack}
            >
              Next Track
            </button>
          </>
        )}
      </div>

      <h1>Introduction</h1>
      <p>Welcome to the Earth Project</p>

      {activeTrack && (
        <>
          <audio
            ref={audioRef}
            src={`/audio/${activeTrack.file}.mp3`}
            onLoadedMetadata={handleLoadedMetadata}
            onTimeUpdate={handleTimeUpdate}
            onEnded={onTrackEnd}
          />

          <div className={styles.trackBar}>
            <div className={styles.trackLabel}>Now playing: {activeTrack.label}</div>
            <div className={styles.progressContainer}>
              <div
                className={styles.progressFill}
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
}
