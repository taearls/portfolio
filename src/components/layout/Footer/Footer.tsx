import SocialMediaIcons from "@/components/SocialMediaIcons/SocialMediaIcons.tsx";
import { getCurrentYear } from "@/util/utils.ts";

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
