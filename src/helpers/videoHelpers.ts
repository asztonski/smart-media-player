export function createIntersectionObserver(
  video: HTMLVideoElement,
  hasBufferedRef: { current: boolean },
) {
  const enterPiPIfNeeded = async () => {
    if (!document.pictureInPictureEnabled) return;
    if (document.pictureInPictureElement === video) return;
    if (video.disablePictureInPicture) return;

    // require at least some media data or playback progress
    if (video.readyState < 2 && video.currentTime === 0 && video.paused) return;

    try {
      await video.requestPictureInPicture();
    } catch (e) {
      // fail silently but log for debugging
      // eslint-disable-next-line no-console
      console.warn("requestPictureInPicture failed:", e);
    }
  };

  const exitPiPIfNeeded = async () => {
    if (document.pictureInPictureElement === video) {
      try {
        await document.exitPictureInPicture();
      } catch (e) {
        // eslint-disable-next-line no-console
        console.warn("exitPictureInPicture failed:", e);
      }
    }
  };

  const handleIntersection = async (entries: IntersectionObserverEntry[]) => {
    const entry = entries[0];
    if (!entry) return;

    if (entry.isIntersecting && !hasBufferedRef.current) {
      video.setAttribute("preload", "auto");
      video.load();
      hasBufferedRef.current = true;
    }

    if (!entry.isIntersecting && !video.paused) {
      await enterPiPIfNeeded();
    }

    if (entry.isIntersecting) {
      await exitPiPIfNeeded();
    }
  };

  const observer = new window.IntersectionObserver(handleIntersection, {
    threshold: 0.1,
  });
  observer.observe(video);
  return observer;
}

export function createVisibilityHandler(video: HTMLVideoElement) {
  const enterPiPIfNeeded = async () => {
    if (!document.pictureInPictureEnabled) return;
    if (document.pictureInPictureElement === video) return;
    if (video.disablePictureInPicture) return;

    if (video.readyState < 2 && video.currentTime === 0 && video.paused) return;

    try {
      await video.requestPictureInPicture();
    } catch (e) {
      // eslint-disable-next-line no-console
      console.warn("requestPictureInPicture failed:", e);
    }
  };

  const exitPiPIfNeeded = async () => {
    if (document.pictureInPictureElement === video) {
      try {
        await document.exitPictureInPicture();
      } catch (e) {
        // eslint-disable-next-line no-console
        console.warn("exitPictureInPicture failed:", e);
      }
    }
  };

  return async function onVisibilityChange() {
    if (document.visibilityState === "hidden") {
      await enterPiPIfNeeded();
    } else if (document.visibilityState === "visible") {
      await exitPiPIfNeeded();
    }
  };
}

export function setupMediaSession(video: HTMLVideoElement) {
  if (!("mediaSession" in navigator)) return () => {};

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  navigator.mediaSession.metadata = new window.MediaMetadata({
    title: "Przykładowy film",
    artist: "Autor demo",
    album: "Demo Album",
    artwork: [
      { src: "/sample-cover.jpg", sizes: "512x512", type: "image/jpeg" },
    ],
  });

  navigator.mediaSession.setActionHandler("play", () => video.play());
  navigator.mediaSession.setActionHandler("pause", () => video.pause());
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
  navigator.mediaSession.setActionHandler("seekto", (details: any) => {
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

  return () => {
    // cleanup
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    navigator.mediaSession.metadata = null;
    navigator.mediaSession.setActionHandler("play", null);
    navigator.mediaSession.setActionHandler("pause", null);
    navigator.mediaSession.setActionHandler("seekbackward", null);
    navigator.mediaSession.setActionHandler("seekforward", null);
    navigator.mediaSession.setActionHandler("seekto", null);
    navigator.mediaSession.setActionHandler("stop", null);
  };
}

export function takeSnapshot(video: HTMLVideoElement): Promise<void> {
  return new Promise((resolve) => {
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth || video.clientWidth || 640;
    canvas.height = video.videoHeight || video.clientHeight || 360;
    const ctx = canvas.getContext("2d");
    if (!ctx) return resolve();
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    canvas.toBlob((blob) => {
      if (!blob) return resolve();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "snapshot.webp";
      document.body.appendChild(a);
      a.click();
      setTimeout(() => {
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        resolve();
      }, 100);
    }, "image/webp");
  });
}
