export type GithubIconProps = {
  fillColor?: string;
  hoverFillColor?: string;
};

export default function GithubIcon({
  fillColor = "fill-purple-700 dark:fill-purple-400",
  hoverFillColor = "group-hover:fill-cyan-400 dark:group-hover:fill-cyan-300",
}: GithubIconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height="40px"
      viewBox="0 0 24 24"
      width="40px"
      className="group"
    >
      <path d="m0 0h24v24h-24z" className="fill-white dark:fill-soft-black" />
      <path
        className={`${fillColor} ${hoverFillColor}`}
        d="m12 2a10 10 0 0 0 -3.16 19.5c.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.31-3.36-1.31a2.69 2.69 0 0 0 -1.14-1.5c-.91-.62.07-.6.07-.6a2.1 2.1 0 0 1 1.53 1 2.15 2.15 0 0 0 2.91.83 2.16 2.16 0 0 1 .63-1.34c-2.14-.22-4.52-1.08-4.52-4.89a3.87 3.87 0 0 1 1-2.71 3.58 3.58 0 0 1 .1-2.64s.84-.27 2.75 1a9.63 9.63 0 0 1 5 0c1.91-1.29 2.75-1 2.75-1a3.58 3.58 0 0 1 .1 2.64 3.87 3.87 0 0 1 1 2.71c0 3.82-2.34 4.66-4.57 4.91a2.39 2.39 0 0 1 .69 1.85v2.74c0 .27.16.59.67.5a10 10 0 0 0 -3.11-19.5z"
      />
    </svg>
  );
}
