import LogoIcon from "@/assets/images/fin-folio-logo.svg?react";
import { Link } from "react-router";
import { Separator } from "./ui/separator";

const AppHeader = () => {
  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="flex items-center justify-between mt-4">
        <Link to="/" className="flex items-center gap-3">
          <LogoIcon className="h-8 w-auto text-primary" />
          <div className="h-5">
            <Separator
              orientation="vertical"
              className="bg-muted-foreground/20"
            />
          </div>
        </Link>
      </div>
    </header>
  );
};

export default AppHeader;
