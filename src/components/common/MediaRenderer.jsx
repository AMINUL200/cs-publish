const MediaRenderer = ({ media, className }) => {
  if (!media) return null;

  if (media.type === "image") {
    return (
      <img
        src={media.url}
        alt="Media"
        className={`w-full h-auto object-cover rounded-md ${className}`}
      />
    );
  }

  if (media.type === "youtube") {
    return (
      <div className={`relative w-full overflow-hidden rounded-md ${className}`} style={{ paddingTop: "56.25%" }}>
        <iframe
          src={media.url}
          title="YouTube video"
          frameBorder="0"
          allowFullScreen
          className="absolute top-0 left-0 w-full h-full rounded-md"
        ></iframe>
      </div>
    );
  }

  if (media.type === "video") {
    return (
      <video
        src={media.url}
        controls
        className={`w-full h-auto rounded-md ${className}`}
      />
    );
  }

  return null;
};

export default MediaRenderer;