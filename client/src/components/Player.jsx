import { useEffect, useRef } from "react";
import { socket } from "../socket";

export default function Player({ roomId }) {
  const playerRef = useRef(null);
  const isHostRef = useRef(false);

  // Host sends updates
  const onPlayerStateChange = (event) => {
    if (!isHostRef.current || !playerRef.current) return;

    const videoState = {
      videoId: playerRef.current.getVideoData().video_id,
      time: playerRef.current.getCurrentTime(),
      playing: event.data === window.YT.PlayerState.PLAYING,
    };

    socket.emit("video-update", { roomId, videoState });
  };

  // Load YouTube API
  useEffect(() => {
    if (window.YT) {
      playerRef.current = new window.YT.Player("player", {
        height: "360",
        width: "640",
        events: {
          onStateChange: onPlayerStateChange,
        },
      });
      return;
    }

    const tag = document.createElement("script");
    tag.src = "https://www.youtube.com/iframe_api";
    document.body.appendChild(tag);

    window.onYouTubeIframeAPIReady = () => {
      playerRef.current = new window.YT.Player("player", {
        height: "360",
        width: "640",
        events: {
          onStateChange: onPlayerStateChange,
        },
      });
    };
  }, []);

  // Sync from server, and request init when roomId changes
  useEffect(() => {
    if (roomId) {
      socket.emit("request-init", { roomId });
    }

    socket.on("init-state", (room) => {
      if (socket.id === room.host) isHostRef.current = true;

      if (room.videoState && room.videoState.videoId && playerRef.current) {
        playerRef.current.loadVideoById(room.videoState.videoId);
        playerRef.current.seekTo(room.videoState.time);

        room.videoState.playing
          ? playerRef.current.playVideo()
          : playerRef.current.pauseVideo();
      }
    });

    socket.on("sync-video", (videoState) => {
      if (!playerRef.current) return;

      playerRef.current.loadVideoById(videoState.videoId);
      playerRef.current.seekTo(videoState.time);

      videoState.playing
        ? playerRef.current.playVideo()
        : playerRef.current.pauseVideo();
    });

    return () => {
      socket.off("init-state");
      socket.off("sync-video");
    };
  }, [roomId]);

 return (
  <div className="bg-zinc-900 rounded-2xl p-4 shadow-xl border border-zinc-800">
    <div id="player" className="w-full aspect-video rounded-xl overflow-hidden" />
  </div>
);

}
