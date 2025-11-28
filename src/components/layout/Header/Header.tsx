import NavigationBar from "@/components/navigation/NavigationBar/NavigationBar.tsx";
import routes from "@/constants/navigationData";

export default function Header() {
  return (
    <header className="m-0 w-full">
      <NavigationBar links={routes} />
    </header>
  );
}
