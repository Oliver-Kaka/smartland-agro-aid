import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Scale } from "lucide-react";

const STORAGE_KEY = "smartland_fair_usage_accepted";

export const FAIR_USAGE_POINTS = [
  "Use the AI tools for genuine agricultural, land reclamation and environmental purposes only.",
  "Requests are intended for individual use — automated scripts, scraping or bulk querying are not allowed.",
  "Avoid submitting the same request repeatedly; reuse the results you have already generated.",
  "Do not enter sensitive personal data, or content that is unlawful, abusive or misleading.",
  "AI recommendations are guidance only and must be verified before acting on them.",
  "Excessive usage may be rate-limited so that capacity stays available for other users.",
];

export const hasAcceptedFairUsage = () =>
  typeof window !== "undefined" && localStorage.getItem(STORAGE_KEY) === "true";

const FairUsageGate = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (!hasAcceptedFairUsage()) setOpen(true);
  }, []);

  const accept = () => {
    localStorage.setItem(STORAGE_KEY, "true");
    setOpen(false);
  };

  return (
    <Dialog open={open}>
      <DialogContent className="max-w-lg" hideClose>
        <DialogHeader>
          <div className="flex items-center gap-2 text-primary mb-1">
            <Scale className="h-5 w-5" />
            <span className="font-semibold">Fair Usage Policy</span>
          </div>
          <DialogTitle>Before you use the AI tools</DialogTitle>
          <DialogDescription>
            Our AI features run on shared capacity. Please accept the fair usage policy to continue.
          </DialogDescription>
        </DialogHeader>

        <ul className="space-y-2 text-sm text-muted-foreground list-disc pl-5 max-h-64 overflow-y-auto">
          {FAIR_USAGE_POINTS.map((point) => (
            <li key={point}>{point}</li>
          ))}
        </ul>

        <div className="flex items-start gap-2">
          <Checkbox
            id="fair-usage-accept"
            checked={checked}
            onCheckedChange={(v) => setChecked(v === true)}
          />
          <Label htmlFor="fair-usage-accept" className="text-sm font-normal leading-snug">
            I have read and accept the{" "}
            <Link to="/fair-usage" target="_blank" className="text-primary underline">
              Fair Usage Policy
            </Link>
            .
          </Label>
        </div>

        <DialogFooter className="gap-2 sm:gap-2">
          <Button variant="outline" onClick={() => navigate("/")}>
            Back to home
          </Button>
          <Button onClick={accept} disabled={!checked}>
            Accept and continue
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default FairUsageGate;
