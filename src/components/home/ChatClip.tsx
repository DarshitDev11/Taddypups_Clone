"use client";

// The video clip inside the chat phone: shows the poster with a play badge, plays inline on tap.

import Image from "next/image";
import { useRef, useState } from "react";

interface ChatClipProps {
  src: string;
  poster: string;
  label: string;
}

export function ChatClip({ src, poster, label }: ChatClipProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);

  const toggle = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) void video.play();
    else video.pause();
  };

  return (
    <button type="button" className="home-clip" aria-label={playing ? `Pause: ${label}` : `Play: ${label}`} onClick={toggle}>
      <Image src={poster} alt="" fill sizes="9rem" style={{ objectFit: "cover", objectPosition: "50% 30%" }} />
      <video
        ref={videoRef}
        src={src}
        muted
        loop
        playsInline
        preload="none"
        className="home-clip__video"
        data-playing={playing}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
      />
      <span className="home-clip__play" data-playing={playing}>
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M8 5v14l11-7z" />
        </svg>
      </span>
    </button>
  );
}
