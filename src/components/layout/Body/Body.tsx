export type BodyProps = {
  children: React.ReactNode | React.ReactNode[];
};

export default function Body({ children }: BodyProps) {
  return (
    <body className="w-full overflow-y-auto overflow-x-hidden bg-white dark:bg-soft-black">
      {children}
    </body>
  );
}
