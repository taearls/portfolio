export type BandcampIconProps = {
  fillColor?: string;
  hoverFillColor?: string;
};

export default function BandcampIcon({
  fillColor = "fill-purple-700 dark:fill-purple-400",
  hoverFillColor = "group-hover:fill-cyan-400 dark:group-hover:fill-cyan-300",
}: BandcampIconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="40px"
      height="40px"
      viewBox="0 0 48 48"
      fill="none"
      className="group"
    >
      <circle
        className={`${fillColor} ${hoverFillColor}`}
        cx="24"
        cy="24"
        r="20"
      />
      <path
        d="M28.36 31.1025H12L19.6398 16.9999H36L28.36 31.1025Z"
        className="fill-soft-black"
      />
    </svg>
  );
}
