export type VideoPlayerProps = {
  title: string;
  src: string;
  width?: string | number;
  height?: string | number;
  allowFullScreen?: boolean;
};

export default function VideoPlayer({
  title = "Embedded Video Player",
  src,
  width = 560,
  height = 315,
  allowFullScreen = true,
}: VideoPlayerProps) {
  return (
    <iframe
      width={width}
      height={height}
      style={{ maxWidth: "var(--max-width-mobile)" }}
      src={src}
      title={title}
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
      referrerPolicy="strict-origin-when-cross-origin"
      allowFullScreen={allowFullScreen}
    />
  );
}
