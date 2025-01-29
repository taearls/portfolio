import SocialMediaIcons from "@/components/SocialMediaIcons/SocialMediaIcons";
import { getCurrentYear } from "@/util/utils";

export default function Footer() {
  return (
    <footer>
      <SocialMediaIcons />
      <p className="py-2 text-center text-xs font-normal tracking-wide text-soft-black dark:text-white">
        {`\u{00A9} 1993-${getCurrentYear()} \u{2022} Cuckoo and the Birds`}
      </p>
    </footer>
  );
}
