import { useEffect, useRef } from "react";
import {
  createIntersectionObserver,
  createVisibilityHandler,
  setupMediaSession,
  takeSnapshot,
} from "../../helpers/videoHelpers";

const VideoPlayer = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const hasBufferedRef = useRef<boolean>(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    observerRef.current = createIntersectionObserver(video, hasBufferedRef);

    const onVisibilityChange = createVisibilityHandler(video);
    document.addEventListener("visibilitychange", onVisibilityChange);
    // Also handle window blur and pagehide (minimize, tab change, navigation away)
    window.addEventListener("blur", onVisibilityChange);
    window.addEventListener("pagehide", onVisibilityChange);

    const cleanupMediaSession = setupMediaSession(video);

    return () => {
      observerRef.current?.disconnect();
      document.removeEventListener("visibilitychange", onVisibilityChange);
      window.removeEventListener("blur", onVisibilityChange);
      window.removeEventListener("pagehide", onVisibilityChange);
      cleanupMediaSession();
    };
  }, []);

  const pipSupported = document.pictureInPictureEnabled;

  return (
    <section className="my-8 bg-white p-6 rounded-lg shadow-lg">
      <h3 className="text-2xl font-bold mb-4 text-gray-800">
        Odtwarzacz wideo
      </h3>
      {!pipSupported && (
        <div className="mb-4 p-3 bg-yellow-100 text-yellow-800 rounded">
          Twoja przeglądarka nie obsługuje trybu Picture-in-Picture (PiP).
        </div>
      )}
      <div className="aspect-video bg-black rounded-lg overflow-hidden mb-4">
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
      <button
        onClick={() => takeSnapshot(videoRef.current!)}
        className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
      >
        Snapshot
      </button>
    </section>
  );
};

export default VideoPlayer;
