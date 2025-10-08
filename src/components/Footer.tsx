import { Leaf } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-muted/30 border-t border-border mt-20">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-primary font-semibold">
            <Leaf className="h-5 w-5" />
            <span>SmartLand</span>
          </div>
          <p className="text-sm text-muted-foreground text-center">
            Empowering sustainable agriculture through AI and data-driven insights
          </p>
          <p className="text-sm text-muted-foreground">
            © 2025 SmartLand. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
