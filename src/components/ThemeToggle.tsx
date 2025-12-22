import { Moon, Sun, Monitor } from "lucide-react";
import { useTheme } from "@/hooks/useTheme";
import { Button } from "./ui/button";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    if (theme === "light") {
      setTheme("dark");
    } else if (theme === "dark") {
      setTheme("system");
    } else {
      setTheme("light");
    }
  };

  const getIcon = () => {
    switch (theme) {
      case "light":
        return <Sun className="h-5 w-5" />;
      case "dark":
        return <Moon className="h-5 w-5" />;
      case "system":
        return <Monitor className="h-5 w-5" />;
    }
  };

//   const getLabel = () => {
//     switch (theme) {
//       case "light":
//         return "Claro";
//       case "dark":
//         return "Escuro";
//       case "system":
//         return "Sistema";
//     }
//   };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleTheme}
      className="flex items-center gap-2"
    //   title={`Tema: ${getLabel()}`}
    >
      {getIcon()}
      {/* <span className="hidden sm:inline text-sm">{getLabel()}</span> */}
    </Button>
  );
}
