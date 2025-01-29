import NavigationBar from "@/components/navigation/NavigationBar/NavigationBar";
import routes from "@/util/constants/data/navigation/navigationData";

export default function Header() {
  return (
    <header className="m-0 w-full">
      <NavigationBar links={routes} />
    </header>
  );
}
