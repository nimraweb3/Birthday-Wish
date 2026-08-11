import { useEffect, useRef, useState } from "react";
import { motion, useDragControls, type PanInfo } from "framer-motion";
import {
  GripHorizontal,
  RotateCcw,
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume,
  VolumeX,
  Music,
} from "lucide-react";

const STORAGE_KEY = "birthday-player-position";
const PLAYER_WIDTH = 320;
const PLAYER_HEIGHT = 158;

// Replace with your playlist ID (the part after "list=" in the YouTube playlist URL)
const YOUTUBE_PLAYLIST_ID = "PLY27-o_1nQvM";

interface Position {
  x: number;
  y: number;
}

declare global {
  interface Window {
    onYouTubeIframeAPIReady?: () => void;
    YT?: any;
  }
}

function getDefaultPosition(): Position {
  const width = window.innerWidth;
  const height = window.innerHeight;
  return {
    x: Math.max(16, width - Math.min(PLAYER_WIDTH, width - 32) - 24),
    y: Math.max(16, height - PLAYER_HEIGHT - 24),
  };
}

function clampPosition(pos: Position): Position {
  const effW = Math.min(PLAYER_WIDTH, window.innerWidth - 32);
  const maxX = window.innerWidth - effW - 8;
  const maxY = window.innerHeight - PLAYER_HEIGHT - 8;
  return {
    x: Math.min(Math.max(pos.x, 8), Math.max(maxX, 8)),
    y: Math.min(Math.max(pos.y, 8), Math.max(maxY, 8)),
  };
}

function formatTime(seconds: number): string {
  if (!isFinite(seconds) || seconds < 0) return "0:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60).toString().padStart(2, "0");
  return mins + ":" + secs;
}

interface CurrentVideo {
  videoId: string;
  title: string;
  author: string;
}

export default function MusicPlayer() {
  const dragControls = useDragControls();
  const containerElRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<any>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const seekLockRef = useRef<number>(0);
  const startedRef = useRef(false);

  const [ready, setReady] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [volume, setVolume] = useState(80);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [video, setVideo] = useState<CurrentVideo>({ videoId: "", title: "Loading...", author: "" });

  const [pos, setPos] = useState<Position>(function () {
    if (typeof window === "undefined") return { x: 24, y: 24 };
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return clampPosition(JSON.parse(saved) as Position);
      }
    } catch (err) {
      console.error("Failed to read player position:", err);
    }
    return clampPosition(getDefaultPosition());
  });

  function refreshVideoData() {
    if (!playerRef.current || !playerRef.current.getVideoData) return;
    const data = playerRef.current.getVideoData();
    if (data && data.video_id) {
      setVideo({
        videoId: data.video_id,
        title: data.title || "Untitled",
        author: data.author || "",
      });
    }
  }

  useEffect(function () {
    function startTimer() {
      if (timerRef.current) clearInterval(timerRef.current);
      timerRef.current = setInterval(function () {
        if (!playerRef.current) return;
        if (Date.now() < seekLockRef.current) return;
        const c = playerRef.current.getCurrentTime ? playerRef.current.getCurrentTime() : 0;
        const d = playerRef.current.getDuration ? playerRef.current.getDuration() : 0;
        setCurrentTime(c || 0);
        setDuration(d || 0);
      }, 250);
    }

    function initPlayer() {
      if (!containerElRef.current || !window.YT) return;
      playerRef.current = new window.YT.Player(containerElRef.current, {
        playerVars: {
          listType: "playlist",
          list: YOUTUBE_PLAYLIST_ID,
          controls: 0,
          disablekb: 1,
          playsinline: 1,
          rel: 0,
          modestbranding: 1,
        },
        events: {
          onReady: function () {
            setReady(true);
                try {
                  if (playerRef.current && playerRef.current.setVolume) playerRef.current.setVolume(volume);
                  if (playerRef.current && muted) playerRef.current.mute();
                } catch (err) {
                  console.warn("YT set volume failed", err);
                }
            refreshVideoData();
          },
          onError: function () {
            if (playerRef.current && playerRef.current.nextVideo) {
              playerRef.current.nextVideo();
            }
          },
          onStateChange: function (e: { data: number }) {
            const YT = window.YT;
            const playing = e.data === YT.PlayerState.PLAYING;
            setIsPlaying(playing);

            if (playing) {
              startedRef.current = true;
              startTimer();
              refreshVideoData();
            } else if (timerRef.current) {
              clearInterval(timerRef.current);
            }

                if (e.data === YT.PlayerState.CUED) {
                  refreshVideoData();
                }

                if (e.data === YT.PlayerState.ENDED) {
                  if (playerRef.current && playerRef.current.nextVideo) playerRef.current.nextVideo();
                }
          },
        },
      });
    }

    if (window.YT && window.YT.Player) {
      initPlayer();
    } else {
      const existingScript = document.querySelector('script[src="https://www.youtube.com/iframe_api"]');
      window.onYouTubeIframeAPIReady = initPlayer;
      if (!existingScript) {
        const tag = document.createElement("script");
        tag.src = "https://www.youtube.com/iframe_api";
        document.head.appendChild(tag);
      }
    }

    return function () {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  useEffect(function () {
    function handleResize() {
      setPos(function (prev) {
        return clampPosition(prev);
      });
    }
    window.addEventListener("resize", handleResize);
    return function () {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  function savePosition(next: Position) {
    setPos(next);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch (err) {
      console.error("Failed to save player position:", err);
    }
  }

  function handleDragEnd(_e: unknown, info: PanInfo) {
    savePosition(clampPosition({ x: pos.x + info.offset.x, y: pos.y + info.offset.y }));
  }

  function handleReset() {
    savePosition(clampPosition(getDefaultPosition()));
  }

  function startDrag(e: React.PointerEvent) {
    dragControls.start(e);
  }

  function handlePlayPause() {
    if (!playerRef.current || !window.YT) return;
    const state = playerRef.current.getPlayerState();
    if (state === window.YT.PlayerState.PLAYING) {
      playerRef.current.pauseVideo();
    } else {
      playerRef.current.playVideo();
    }
  }

  function handleToggleMute() {
    if (!playerRef.current) return;
    if (muted) {
      playerRef.current.unMute && playerRef.current.unMute();
      setMuted(false);
    } else {
      playerRef.current.mute && playerRef.current.mute();
      setMuted(true);
    }
  }

  function handleSetVolume(v: number) {
    setVolume(v);
    try {
      if (playerRef.current && playerRef.current.setVolume) playerRef.current.setVolume(v);
      if (v === 0) {
        playerRef.current && playerRef.current.mute && playerRef.current.mute();
        setMuted(true);
      } else if (muted) {
        playerRef.current && playerRef.current.unMute && playerRef.current.unMute();
        setMuted(false);
      }
    } catch (err) {
      console.warn("setVolume failed", err);
    }
  }

  function handleNext() {
    if (playerRef.current && playerRef.current.nextVideo) {
      playerRef.current.nextVideo();
    }
  }

  function handlePrev() {
    if (playerRef.current && playerRef.current.previousVideo) {
      playerRef.current.previousVideo();
    }
  }

  function handleSeekClick(e: React.MouseEvent<HTMLDivElement>) {
    if (!playerRef.current || !ready) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const fraction = Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width));
    const dur = playerRef.current.getDuration ? playerRef.current.getDuration() : 0;
    const seekTime = fraction * dur;
    setCurrentTime(seekTime);
    seekLockRef.current = Date.now() + 2000;
    playerRef.current.seekTo(seekTime, true);
  }

  const progressPercent = duration > 0 ? Math.min((currentTime / duration) * 100, 100) : 0;

  return (
    <motion.div
      drag
      dragListener={false}
      dragControls={dragControls}
      dragMomentum={false}
      onDragEnd={handleDragEnd}
      initial={false}
      animate={{ x: pos.x, y: pos.y }}
      transition={{ type: "spring", stiffness: 400, damping: 40 }}
      style={{ position: "fixed", top: 0, left: 0, width: "min(92vw, 320px)" }}
      className="z-30"
    >
      <div className="rounded-2xl border border-white/10 bg-charcoal-900/70 backdrop-blur-md shadow-glow overflow-hidden">
        <div
          onPointerDown={startDrag}
          className="flex items-center justify-between px-3 py-1.5 cursor-grab active:cursor-grabbing bg-white/5 touch-none select-none"
        >
          <div className="flex items-center gap-2 text-white/60">
            <Music size={14} />
            <div className="text-[12px] font-semibold">Azeen's playlist</div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onPointerDown={function (e) {
                e.stopPropagation();
              }}
              onClick={function (e) {
                e.stopPropagation();
                handleReset();
              }}
              aria-label="Reset player position"
              className="p-1 rounded-full hover:bg-rose-500/20 transition-colors duration-300 text-white/50 hover:text-rose-300"
            >
              <RotateCcw size={13} />
            </button>

            <div className="p-1.5 rounded-md cursor-grab active:cursor-grabbing text-white/40" aria-hidden>
              <GripHorizontal size={14} />
            </div>
          </div>
        </div>

        <div className="px-4 py-3 flex items-center gap-3">
          <div
            className="w-12 h-12 rounded-xl flex-shrink-0 border border-white/10 bg-cover bg-center bg-charcoal-800"
            style={{
              backgroundImage: video.videoId
                ? "url(https://i.ytimg.com/vi/" + video.videoId + "/hqdefault.jpg)"
                : "none",
            }}
          />

          <div className="flex-1 min-w-0">
            <div className="overflow-hidden">
              <div className="text-[11px] text-white/50 uppercase tracking-wide">Now Playing</div>
              <motion.div key={video.title} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.32 }}>
                <p className="font-sans text-sm text-white/85 truncate">{video.title}</p>
                <p className="font-sans text-[11px] text-white/40 truncate mt-0.5">{video.author}</p>
              </motion.div>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onPointerDown={function (e) {
                e.stopPropagation();
              }}
              onClick={function (e) {
                e.stopPropagation();
                handlePrev();
              }}
              disabled={!ready}
              aria-label="Previous song"
              className="p-1.5 rounded-full hover:bg-white/10 transition-colors duration-300 text-white/60 disabled:opacity-30"
            >
              <SkipBack size={14} fill="currentColor" />
            </button>

            <button
              type="button"
              onPointerDown={function (e) {
                e.stopPropagation();
              }}
              onClick={function (e) {
                e.stopPropagation();
                handlePlayPause();
              }}
              disabled={!ready}
              aria-label={isPlaying ? "Pause" : "Play"}
              className="p-2 rounded-full bg-rose-500/90 hover:bg-rose-400 transition-colors duration-300 text-white disabled:opacity-40"
            >
              {isPlaying ? <Pause size={15} fill="currentColor" /> : <Play size={15} fill="currentColor" />}
            </button>

            <button
              type="button"
              onPointerDown={function (e) {
                e.stopPropagation();
              }}
              onClick={function (e) {
                e.stopPropagation();
                handleNext();
              }}
              disabled={!ready}
              aria-label="Next song"
              className="p-1.5 rounded-full hover:bg-white/10 transition-colors duration-300 text-white/60 disabled:opacity-30"
            >
              <SkipForward size={14} fill="currentColor" />
            </button>
          </div>
        </div>

        <div className="px-4 pb-2">
          <div
            onClick={handleSeekClick}
            className="h-1.5 w-full rounded-full bg-white/10 overflow-hidden cursor-pointer"
          >
            <div
              className="h-full bg-rose-400 transition-all duration-200"
              style={{ width: progressPercent + "%" }}
            />
          </div>
          <div className="flex items-center justify-between mt-2 gap-3">
            <div className="flex items-center gap-3">
              <span className="text-[11px] text-white/35 font-sans">{formatTime(currentTime)}</span>
              <div className="w-[36px] h-6 flex items-center">
                <button
                  type="button"
                  onPointerDown={function (e) {
                    e.stopPropagation();
                  }}
                  onClick={function (e) {
                    e.stopPropagation();
                    handleToggleMute();
                  }}
                  className="p-1 rounded-full hover:bg-white/5 transition-colors duration-150 text-white/60"
                >
                  {muted || volume === 0 ? <VolumeX size={14} /> : <Volume size={14} />}
                </button>
                <input
                  aria-label="Volume"
                  onPointerDown={(e) => e.stopPropagation()}
                  onChange={(ev) => handleSetVolume(Number(ev.target.value))}
                  value={volume}
                  type="range"
                  min={0}
                  max={100}
                  className="ml-2 w-20 accent-rose-400"
                />
              </div>
            </div>

            <span className="text-[11px] text-white/35 font-sans">{formatTime(duration)}</span>
          </div>
        </div>

        <div className="px-4 pb-3">
          <div className="flex items-center gap-2 justify-center opacity-80">
            <div className={`w-1 h-3 bg-rose-400 rounded-sm ${isPlaying ? 'animate-eq1' : 'opacity-30'}`} />
            <div className={`w-1 h-4 bg-rose-300 rounded-sm ${isPlaying ? 'animate-eq2' : 'opacity-30'}`} />
            <div className={`w-1 h-2 bg-rose-400 rounded-sm ${isPlaying ? 'animate-eq3' : 'opacity-30'}`} />
          </div>
        </div>

        <div ref={containerElRef} className="absolute -left-[9999px] w-px h-px" aria-hidden="true" />
      </div>
    </motion.div>
  );
}