import { useEffect, useRef } from "react";

const VideoPlayer = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Handler for intersection changes
    const handleIntersection = async (entries: IntersectionObserverEntry[]) => {
      const entry = entries[0];
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
    const onPause = async () => {
      // If paused and in PiP, exit PiP
      if (document.pictureInPictureElement === video) {
        try {
          await document.exitPictureInPicture();
        } catch (e) {}
      }
    };
    video.addEventListener("play", onPlay);
    video.addEventListener("pause", onPause);

    // PiP on tab visibility change
    const onVisibilityChange = async () => {
      if (!video) return;
      if (document.visibilityState === "hidden") {
        if (
          !video.paused &&
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

    return () => {
      observerRef.current?.disconnect();
      video.removeEventListener("play", onPlay);
      video.removeEventListener("pause", onPause);
      document.removeEventListener("visibilitychange", onVisibilityChange);
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
          preload="metadata"
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
