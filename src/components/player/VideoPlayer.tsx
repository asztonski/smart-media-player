import { useEffect, useRef } from "react";

const VideoPlayer = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const hasBufferedRef = useRef<boolean>(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Handler for intersection changes
    const handleIntersection = async (entries: IntersectionObserverEntry[]) => {
      const entry = entries[0];

      // Start buffering when video enters viewport for the first time
      if (entry.isIntersecting && !hasBufferedRef.current) {
        video.setAttribute("preload", "auto");
        // Force browser to start buffering
        video.load();
        hasBufferedRef.current = true;
      }

      // If video is not visible and is playing, enable PiP
      if (
        !entry.isIntersecting &&
        !video.paused &&
        document.pictureInPictureEnabled
      ) {
        if (document.pictureInPictureElement !== video) {
          try {
            await video.requestPictureInPicture();
          } catch (e) {
            // PiP request failed (maybe user gesture required)
          }
        }
      }
      // If video is visible and PiP is active, exit PiP
      if (entry.isIntersecting && document.pictureInPictureElement === video) {
        try {
          await document.exitPictureInPicture();
        } catch (e) {
          // exit PiP failed
        }
      }
    };

    observerRef.current = new window.IntersectionObserver(handleIntersection, {
      threshold: 0.1,
    });
    observerRef.current.observe(video);

    // Listen for play/pause to re-check PiP logic
    const onPlay = () => {
      if (observerRef.current && video) {
        observerRef.current.takeRecords();
      }
    };
    video.addEventListener("play", onPlay);

    // PiP on tab visibility change
    const onVisibilityChange = async () => {
      if (!video) return;
      if (document.visibilityState === "hidden") {
        if (
          document.pictureInPictureEnabled &&
          document.pictureInPictureElement !== video
        ) {
          try {
            await video.requestPictureInPicture();
          } catch (e) {}
        }
      } else if (document.visibilityState === "visible") {
        if (document.pictureInPictureElement === video) {
          try {
            await document.exitPictureInPicture();
          } catch (e) {}
        }
      }
    };
    document.addEventListener("visibilitychange", onVisibilityChange);

    // Media Session API integration
    if ("mediaSession" in navigator && video) {
      navigator.mediaSession.metadata = new window.MediaMetadata({
        title: "Przykładowy film",
        artist: "Autor demo",
        album: "Demo Album",
        artwork: [
          { src: "/sample-cover.jpg", sizes: "512x512", type: "image/jpeg" },
        ],
      });

      navigator.mediaSession.setActionHandler("play", () => {
        video.play();
      });
      navigator.mediaSession.setActionHandler("pause", () => {
        video.pause();
      });
      navigator.mediaSession.setActionHandler("seekbackward", (details) => {
        video.currentTime = Math.max(
          0,
          video.currentTime - (details?.seekOffset || 10),
        );
      });
      navigator.mediaSession.setActionHandler("seekforward", (details) => {
        video.currentTime = Math.min(
          video.duration,
          video.currentTime + (details?.seekOffset || 10),
        );
      });
      navigator.mediaSession.setActionHandler("seekto", (details) => {
        if (details?.fastSeek && "fastSeek" in video) {
          // @ts-ignore
          video.fastSeek(details.seekTime);
        } else if (typeof details?.seekTime === "number") {
          video.currentTime = details.seekTime;
        }
      });
      navigator.mediaSession.setActionHandler("stop", () => {
        video.pause();
        video.currentTime = 0;
      });
    }

    return () => {
      observerRef.current?.disconnect();
      video.removeEventListener("play", onPlay);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      if ("mediaSession" in navigator) {
        navigator.mediaSession.metadata = null;
        navigator.mediaSession.setActionHandler("play", null);
        navigator.mediaSession.setActionHandler("pause", null);
        navigator.mediaSession.setActionHandler("seekbackward", null);
        navigator.mediaSession.setActionHandler("seekforward", null);
        navigator.mediaSession.setActionHandler("seekto", null);
        navigator.mediaSession.setActionHandler("stop", null);
      }
    };
  }, []);

  return (
    <section className="my-8 bg-white p-6 rounded-lg shadow-lg">
      <h3 className="text-2xl font-bold mb-4 text-gray-800">
        Odtwarzacz wideo
      </h3>
      <div className="aspect-video bg-black rounded-lg overflow-hidden">
        <video
          ref={videoRef}
          className="w-full h-full"
          controls
          preload="none" // Start with no preload, set to auto when in viewport
        >
          <source src="/sample-video.mp4" type="video/mp4" />
          <source src="/sample-video.webm" type="video/webm" />
          Twoja przeglądarka nie obsługuje odtwarzania wideo.
        </video>
      </div>
    </section>
  );
};

export default VideoPlayer;
