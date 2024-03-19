export type PageContainerProps = {
  children: React.ReactNode | React.ReactNode[];
};

export default function PageContainer({ children }: PageContainerProps) {
  return (
    <div className="top-0 mt-48 w-screen bg-none p-8 sm:mt-16">{children}</div>
  );
}
