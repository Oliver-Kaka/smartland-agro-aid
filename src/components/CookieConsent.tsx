import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Cookie } from "lucide-react";
import { Button } from "@/components/ui/button";

export const COOKIE_CONSENT_KEY = "smartland_cookie_consent";
export const COOKIE_PREFERENCES_EVENT = "smartland:review-cookie-preferences";

type CookieChoice = "all" | "necessary";

const CookieConsent = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(localStorage.getItem(COOKIE_CONSENT_KEY) === null);

    const reviewPreferences = () => setVisible(true);
    window.addEventListener(COOKIE_PREFERENCES_EVENT, reviewPreferences);
    return () => window.removeEventListener(COOKIE_PREFERENCES_EVENT, reviewPreferences);
  }, []);

  const saveChoice = (choice: CookieChoice) => {
    localStorage.setItem(
      COOKIE_CONSENT_KEY,
      JSON.stringify({ choice, savedAt: new Date().toISOString() }),
    );
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <aside
      aria-label="Cookie preferences"
      className="fixed inset-x-3 bottom-3 z-[100] mx-auto max-w-3xl border border-border bg-background p-4 shadow-lg sm:bottom-5 sm:flex sm:items-center sm:gap-5 sm:p-5"
    >
      <div className="flex min-w-0 flex-1 items-start gap-3">
        <Cookie className="mt-0.5 h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
        <div>
          <h2 className="font-semibold text-foreground">Your cookie choice</h2>
          <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
            SmartLand uses necessary storage for sign-in, preferences and policy acceptance. You
            can also allow optional cookies if we add them later. Read our{" "}
            <Link to="/cookie-policy" className="font-medium text-primary underline underline-offset-2">
              Cookie Policy
            </Link>
            .
          </p>
        </div>
      </div>
      <div className="mt-4 flex shrink-0 flex-col-reverse gap-2 sm:mt-0 sm:flex-row">
        <Button variant="outline" onClick={() => saveChoice("necessary")}>
          Necessary only
        </Button>
        <Button onClick={() => saveChoice("all")}>Accept all</Button>
      </div>
    </aside>
  );
};

export default CookieConsent;