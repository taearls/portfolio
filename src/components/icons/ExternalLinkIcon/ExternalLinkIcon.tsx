// TODO: add color and hoverColor props
export type ExternalLinkIconProps = {
  id?: string;
  title?: string;
  description?: string;
};

const DEFAULT_PROP_VALUES: ExternalLinkIconProps = {
  id: "external-link-icon",
  title: "External Link",
  description:
    "Icon indicating the user will visit an external site in a separate tab or window.",
};

export default function ExternalLinkIcon({
  id = DEFAULT_PROP_VALUES.id,
  title = DEFAULT_PROP_VALUES.title,
  description = DEFAULT_PROP_VALUES.description,
}: ExternalLinkIconProps) {
  return (
    <svg
      className="inline-block fill-current stroke-current text-purple-700 group-hover:text-cyan-400 dark:text-purple-400 dark:group-hover:text-cyan-300"
      height="24px"
      width="24px"
      stroke-width="5"
      xmlns="http://www.w3.org/2000/svg"
      version="1.1"
      x="0px"
      y="0px"
      viewBox="0 0 100 100"
      role="presentation"
      aria-labelledby={id}
    >
      <title id={id}>{title}</title>
      <desc>{description}</desc>
      <path d="M28.8,83.1h36l0,0c6.6,0,12-5.4,12-12v-22c0-1.1-0.9-2-2-2l0,0c-1.1,0-2,0.9-2,2v22c0,4.4-3.6,8-8,8l0,0h-36  c-4.4,0-8-3.6-8-8v-36c0-4.4,3.6-8,8-8l0,0h22l0,0c1.1,0,2-0.9,2-2s-0.9-2-2-2h-22l0,0c-6.6,0-12,5.4-12,12v36  C16.8,77.7,22.2,83.1,28.8,83.1z" />
      <path d="M83.2,37.2V18.9c0-0.1,0-0.3,0-0.4c0,0,0-0.1,0-0.1c0-0.1,0-0.2-0.1-0.3L83,18c0-0.1-0.1-0.2-0.1-0.2  c-0.1-0.2-0.3-0.4-0.6-0.6c-0.1-0.1-0.2-0.1-0.3-0.1H82L81.7,17h-0.1c-0.1,0-0.3,0-0.4,0l0,0H62.9l0,0c-1.1,0-2,0.9-2,2s0.9,2,2,2  h13.5L47.1,50.1c-0.8,0.8-0.8,2,0,2.8c0.8,0.8,2,0.8,2.8,0l29.3-29.2v13.5c0,1.1,0.9,2,2,2l0,0C82.3,39.2,83.2,38.3,83.2,37.2z" />
    </svg>
  );
}
