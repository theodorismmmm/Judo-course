"use client";

import { useEffect, useRef, useState } from "react";

type YTPlayer = {
  destroy: () => void;
  playVideo: () => void;
  mute: () => void;
  seekTo: (seconds: number, allowSeekAhead: boolean) => void;
  getIframe: () => HTMLIFrameElement;
};

type PlayerState = { PLAYING: number; ENDED: number };

declare global {
  interface Window {
    YT?: {
      Player: new (
        el: HTMLElement,
        options: {
          videoId: string;
          host?: string;
          playerVars?: Record<string, number | string>;
          events?: {
            onReady?: (event: { target: YTPlayer }) => void;
            onStateChange?: (event: { data: number; target: YTPlayer }) => void;
            onError?: () => void;
          };
        },
      ) => YTPlayer;
      PlayerState: PlayerState;
    };
    onYouTubeIframeAPIReady?: () => void;
  }
}

let apiReady: Promise<void> | null = null;

function loadYouTube() {
  if (typeof window === "undefined") return Promise.resolve();
  if (window.YT?.Player) return Promise.resolve();
  if (apiReady) return apiReady;
  apiReady = new Promise((resolve) => {
    const previous = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      previous?.();
      resolve();
    };
    if (!document.querySelector("script[data-yt-api]")) {
      const script = document.createElement("script");
      script.src = "https://www.youtube.com/iframe_api";
      script.async = true;
      script.dataset.ytApi = "1";
      document.head.appendChild(script);
    }
  });
  return apiReady;
}

type Phase = "cover" | "play" | "end";

export function QuietFilm({ id }: { id: string }) {
  const slotRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<YTPlayer | null>(null);
  const [phase, setPhase] = useState<Phase>("cover");
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let gone = false;
    const slot = slotRef.current;
    void loadYouTube().then(() => {
      if (gone || !slot || !window.YT?.Player) return;
      const playing = window.YT.PlayerState.PLAYING;
      const ended = window.YT.PlayerState.ENDED;
      playerRef.current = new window.YT.Player(slot, {
        videoId: id,
        host: "https://www.youtube-nocookie.com",
        playerVars: {
          autoplay: 1,
          controls: 0,
          rel: 0,
          modestbranding: 1,
          iv_load_policy: 3,
          disablekb: 1,
          fs: 0,
          playsinline: 1,
          origin: window.location.origin,
        },
        events: {
          onReady: (event) => {
            const frame = event.target.getIframe();
            frame.title = "Lehrfilm";
            event.target.mute();
            event.target.playVideo();
          },
          onStateChange: (event) => {
            if (event.data === playing) setPhase("play");
            if (event.data === ended) setPhase("end");
          },
          onError: () => setFailed(true),
        },
      });
    });
    return () => {
      gone = true;
      try {
        playerRef.current?.destroy();
      } catch {
        // Der Player ist schon weg, wenn die Lektion wechselt.
      }
      playerRef.current = null;
    };
  }, [id]);

  function start() {
    const player = playerRef.current;
    if (!player) return;
    if (phase === "end") player.seekTo(0, true);
    player.mute();
    player.playVideo();
  }

  return (
    <div className="quiet-film">
      <div className="quiet-stage">
        <div ref={slotRef} />
        <div className="quiet-shade quiet-shade-top" />
        <div className="quiet-shade quiet-shade-name" />
        {phase !== "play" && (
          <button type="button" className="quiet-poster" onClick={start}>
            {failed ? "Film gerade nicht da" : phase === "end" ? "Nochmal" : "Film abspielen"}
          </button>
        )}
      </div>
      <p className="quiet-note">Lehrfilm</p>
    </div>
  );
}
