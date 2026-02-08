const VideoPlayer = () => {
  return (
    <section className="my-8 bg-white p-6 rounded-lg shadow-lg">
      <h3 className="text-2xl font-bold mb-4 text-gray-800">
        Odtwarzacz wideo
      </h3>
      <div className="aspect-video bg-black rounded-lg overflow-hidden">
        <video className="w-full h-full" controls preload="metadata">
          <source src="/public/sample-video.mp4" type="video/mp4" />
          <source src="/public/sample-video.webm" type="video/webm" />
          Twoja przeglądarka nie obsługuje odtwarzania wideo.
        </video>
      </div>
    </section>
  );
};

export default VideoPlayer;
