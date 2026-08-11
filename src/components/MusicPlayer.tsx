import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useDragControls, type PanInfo } from "framer-motion";
import { GripVertical, MoreVertical, RotateCcw, Play, Pause, SkipBack, SkipForward } from "lucide-react";

const STORAGE_KEY = "birthday-player-position";
const PLAYER_WIDTH = 320;
const PLAYER_HEIGHT = 158;

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
    x: Math.max(16, width - PLAYER_WIDTH - 24),
    y: Math.max(16, height - PLAYER_HEIGHT - 24),
  };
}

function clampPosition(pos: Position): Position {
  const maxX = window.innerWidth - PLAYER_WIDTH - 8;
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

interface MusicPlayerProps {
  inline?: boolean;
}

export default function MusicPlayer({ inline = false }: MusicPlayerProps) {
  const dragControls = useDragControls();
  const containerElRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<any>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const seekLockRef = useRef<number>(0);
  const startedRef = useRef(false);

  const [ready, setReady] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [video, setVideo] = useState<CurrentVideo>({ videoId: "", title: "Loading...", author: "" });
  const [playlistItems, setPlaylistItems] = useState<CurrentVideo[]>([]);
  const [playlistOpen, setPlaylistOpen] = useState(false);
  const [currentPlaylistIndex, setCurrentPlaylistIndex] = useState(0);

  // Refs to avoid stale closures inside event handlers registered once
  const playlistOpenRef = useRef(playlistOpen);
  const playlistItemsRef = useRef(playlistItems);

  useEffect(function () {
    playlistOpenRef.current = playlistOpen;
  }, [playlistOpen]);

  useEffect(function () {
    playlistItemsRef.current = playlistItems;
  }, [playlistItems]);

  const playlistRef = useRef<HTMLDivElement | null>(null);
  const menuButtonRef = useRef<HTMLButtonElement | null>(null);

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
      const idx = playlistItemsRef.current.findIndex(function (item) {
        return item.videoId === data.video_id;
      });
      if (idx >= 0) {
        setCurrentPlaylistIndex(idx);
      }
    }
  }

  async function fetchVideoOEmbed(videoId: string): Promise<CurrentVideo> {
    const url = "https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=" + videoId + "&format=json";
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error("oembed fetch failed");
      const data = await res.json();
      return { videoId, title: data.title || "Track", author: data.author_name || "YouTube" };
    } catch (err) {
      return { videoId, title: "Track", author: "YouTube" };
    }
  }

  async function fetchMetadataForPlaylist(list: string[]) {
    if (!list || list.length === 0) {
      setPlaylistItems([]);
      return;
    }
    const promises = list.map(function (id) {
      return fetchVideoOEmbed(id);
    });
    const settled = await Promise.allSettled(promises);
    const items: CurrentVideo[] = settled.map(function (s, i) {
      if (s.status === "fulfilled") return s.value as CurrentVideo;
      return { videoId: list[i], title: "Track " + (i + 1), author: "YouTube" };
    });
    setPlaylistItems(items);
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
            refreshVideoData();
            if (playerRef.current && playerRef.current.getPlaylist) {
              const list = playerRef.current.getPlaylist();
              fetchMetadataForPlaylist(list || []);
            }
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

    function handleDocumentClick(e: MouseEvent | TouchEvent) {
      const target = e.target as HTMLElement;
      if (playlistOpenRef.current && playlistRef.current && menuButtonRef.current) {
        if (!playlistRef.current.contains(target) && !menuButtonRef.current.contains(target)) {
          setPlaylistOpen(false);
        }
      }
    }

    function handleDocumentKeydown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setPlaylistOpen(false);
      }
    }

    window.addEventListener("resize", handleResize);
    window.addEventListener("mousedown", handleDocumentClick);
    window.addEventListener("touchstart", handleDocumentClick);
    window.addEventListener("keydown", handleDocumentKeydown);
    return function () {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousedown", handleDocumentClick);
      window.removeEventListener("touchstart", handleDocumentClick);
      window.removeEventListener("keydown", handleDocumentKeydown);
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
    if (inline) return;
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

  function handleTogglePlaylist(e: React.MouseEvent<HTMLButtonElement>) {
    e.stopPropagation();
    setPlaylistOpen(function (open) {
      return !open;
    });
  }

  function handleSelectSong(index: number) {
    if (!playerRef.current || !window.YT) return;
    const playlist = playerRef.current.getPlaylist ? playerRef.current.getPlaylist() : [];
    if (!playlist || index < 0 || index >= playlist.length) return;
    if (playerRef.current.playVideoAt) {
      playerRef.current.playVideoAt(index);
      setPlaylistOpen(false);
      setCurrentPlaylistIndex(index);
    }
  }

  const progressPercent = duration > 0 ? Math.min((currentTime / duration) * 100, 100) : 0;

  const playlistDropdown = (
    <AnimatePresence>
      {playlistOpen && (
        <motion.div
          ref={playlistRef}
          initial={{ opacity: 0, y: -6, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -6, scale: 0.95 }}
          transition={{ duration: 0.15 }}
          className="absolute right-0 top-full mt-2 w-64 rounded-2xl border border-white/10 bg-charcoal-950/95 backdrop-blur-2xl shadow-glow z-50 overflow-hidden"
        >
          <div className="px-3 py-2 text-[11px] uppercase tracking-[0.22em] text-white/40 font-sans">
            Playlist
          </div>
          <div className="max-h-60 overflow-y-auto">
            {playlistItems.length > 0 ? (
              playlistItems.map(function (item, index) {
                return (
                  <button
                    key={item.videoId + index}
                    type="button"
                    onClick={function () {
                      handleSelectSong(index);
                    }}
                    className={
                      "w-full text-left px-3 py-2 text-sm font-sans transition-colors duration-200 " +
                      (index === currentPlaylistIndex
                        ? "bg-rose-500/10 text-white"
                        : "text-white/70 hover:bg-white/5")
                    }
                  >
                    <span className="block truncate">{item.title || "Song " + (index + 1)}</span>
                    <span className="block text-[11px] text-white/40 truncate mt-0.5">
                      {item.author || "YouTube playlist"}
                    </span>
                  </button>
                );
              })
            ) : (
              <div className="px-3 py-3 text-[12px] text-white/50">Loading tracks...</div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  if (inline) {
    return (
      <div className="mx-auto w-full max-w-[480px]">
        <div className="rounded-xl border border-white/8 bg-charcoal-900/50 backdrop-blur-md px-3 py-2 flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-md flex-shrink-0 border border-white/10 bg-cover bg-center"
            style={{
              backgroundImage: video.videoId ? "url(https://i.ytimg.com/vi/" + video.videoId + "/hqdefault.jpg)" : "none",
            }}
          />

          <div className="flex-1 min-w-0">
            <p className="font-sans text-sm text-white/85 truncate">{video.title}</p>
            <p className="font-sans text-[11px] text-white/40 truncate mt-0.5">{video.author}</p>
            <div onClick={handleSeekClick} className="mt-2 h-1 rounded-full bg-white/6 overflow-hidden cursor-pointer">
              <div className="h-full bg-rose-400" style={{ width: progressPercent + "%" }} />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onPointerDown={function (e) {
                e.stopPropagation();
              }}
              onClick={function (e) {
                e.stopPropagation();
                handlePrev();
              }}
              className="p-1.5 rounded-full hover:bg-white/6 text-white/60"
            >
              <SkipBack size={14} />
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
              className="p-2 rounded-full bg-rose-500 text-white"
            >
              {isPlaying ? <Pause size={14} /> : <Play size={14} />}
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
              className="p-1.5 rounded-full hover:bg-white/6 text-white/60"
            >
              <SkipForward size={14} />
            </button>
            <div className="relative">
              <button
                type="button"
                ref={menuButtonRef}
                onPointerDown={function (e) {
                  e.stopPropagation();
                }}
                onClick={handleTogglePlaylist}
                aria-label="Open playlist"
                className="p-1.5 rounded-full hover:bg-white/10 transition-colors duration-300 text-white/60"
              >
                <MoreVertical size={14} />
              </button>
              {playlistDropdown}
            </div>
          </div>

          <div ref={containerElRef} className="absolute -left-[9999px] w-px h-px" aria-hidden="true" />
        </div>
      </div>
    );
  }

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
      style={{ position: "fixed", top: 0, left: 0, width: PLAYER_WIDTH }}
      className="z-30"
    >
      <div className="relative rounded-2xl border border-white/10 bg-charcoal-900/70 backdrop-blur-md shadow-glow">
        <div
          onPointerDown={startDrag}
          className="flex items-center justify-between px-3 py-1.5 cursor-grab active:cursor-grabbing bg-white/5 rounded-t-2xl touch-none select-none"
        >
          <div className="flex items-center gap-1.5 text-white/40">
            <GripVertical size={14} />
            <span className="text-[10px] tracking-[0.15em] font-sans">DRAG</span>
          </div>
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
            <p className="font-sans text-sm text-white/85 truncate">{video.title}</p>
            <p className="font-sans text-[11px] text-white/40 truncate mt-0.5">{video.author}</p>
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

            <div className="relative">
              <button
                type="button"
                ref={menuButtonRef}
                onPointerDown={function (e) {
                  e.stopPropagation();
                }}
                onClick={handleTogglePlaylist}
                aria-label="Open playlist"
                className="p-1.5 rounded-full hover:bg-white/10 transition-colors duration-300 text-white/60"
              >
                <MoreVertical size={14} />
              </button>
              {playlistDropdown}
            </div>
          </div>
        </div>

        <div className="px-4 pb-3">
          <div
            onClick={handleSeekClick}
            className="h-1.5 w-full rounded-full bg-white/10 overflow-hidden cursor-pointer"
          >
            <div
              className="h-full bg-rose-400 transition-all duration-200"
              style={{ width: progressPercent + "%" }}
            />
          </div>
          <div className="flex justify-between mt-1">
            <span className="text-[10px] text-white/35 font-sans">{formatTime(currentTime)}</span>
            <span className="text-[10px] text-white/35 font-sans">{formatTime(duration)}</span>
          </div>
        </div>

        <div ref={containerElRef} className="absolute -left-[9999px] w-px h-px" aria-hidden="true" />
      </div>
    </motion.div>
  );
}