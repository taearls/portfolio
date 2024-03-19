export type ParagraphProps = {
  children: React.ReactNode | React.ReactNode[];
};

export default function Paragraph({ children }: ParagraphProps) {
  return (
    <p className="my-4 text-lg leading-normal text-soft-black md:text-xl dark:text-white">
      {children}
    </p>
  );
}
