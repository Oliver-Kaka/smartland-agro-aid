import { Cookie } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { COOKIE_CONSENT_KEY, COOKIE_PREFERENCES_EVENT } from "@/components/CookieConsent";

const CookiePolicy = () => {
  const reviewChoices = () => {
    localStorage.removeItem(COOKIE_CONSENT_KEY);
    window.dispatchEvent(new Event(COOKIE_PREFERENCES_EVENT));
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-1 py-12">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="flex items-center gap-3 mb-8">
            <Cookie className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-3xl font-bold">Cookie Policy</h1>
              <p className="text-muted-foreground">Last updated: September 2026</p>
            </div>
          </div>

          <div className="space-y-6 text-muted-foreground leading-relaxed">
            <section>
              <h2 className="text-xl font-semibold text-foreground mb-2">1. What We Use</h2>
              <p>
                SmartLand uses cookies and similar browser storage to keep essential parts of the
                service working and to remember choices made on your device.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-2">2. Necessary Storage</h2>
              <p>
                Necessary storage supports secure sign-in, remembers your selected theme, records
                policy acceptance and saves your cookie choice. It cannot be switched off through
                the cookie banner because these functions are required for the service to work as
                expected.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-2">3. Optional Cookies</h2>
              <p>
                SmartLand currently does not use analytics or advertising cookies. Choosing
                “Accept all” records permission for optional cookies if they are introduced later.
                This policy will be updated before any new category is used.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-2">4. How Long Choices Last</h2>
              <p>
                Your cookie preference remains on your device until you clear your browser data or
                change your choice. Sign-in information follows the duration of your account
                session.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-2">5. Change Your Choice</h2>
              <p className="mb-4">
                You can reopen the cookie banner at any time. Selecting a new option replaces your
                previous choice.
              </p>
              <Button variant="outline" onClick={reviewChoices}>Review cookie choices</Button>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-2">6. Contact</h2>
              <p>Questions about this policy can be sent through the Suggestions page.</p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CookiePolicy;