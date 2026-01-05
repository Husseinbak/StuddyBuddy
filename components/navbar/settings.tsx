import { SettingsIcon } from "lucide-react";
import { useRouter } from "next/navigation";

const NavbarUserSettings = () => {
  const router = useRouter();

  return (
    <button
      type="button"
      aria-label="Settings"
      title="Settings"
      onClick={() => router.push("/settings")}
      className="inline-flex items-center justify-center rounded-full p-2 text-inherit hover:bg-black/5 transition-colors"
    >
      <SettingsIcon />
    </button>
  );
};

export default NavbarUserSettings;
