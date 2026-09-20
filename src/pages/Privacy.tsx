import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { ShieldCheck } from "lucide-react";

const Privacy = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-1 py-12">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="flex items-center gap-3 mb-8">
            <ShieldCheck className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-3xl font-bold">Privacy Policy</h1>
              <p className="text-muted-foreground">Last updated: September 2026</p>
            </div>
          </div>

          <div className="space-y-6 text-muted-foreground leading-relaxed">
            <section>
              <h2 className="text-xl font-semibold text-foreground mb-2">1. Information We Collect</h2>
              <p>
                When you create a SmartLand account we collect your email address and full name.
                When you use our tools we may also store the farm details you enter (soil pH,
                location, land size, previous crops), tree planting records including species,
                quantity, location and coordinates, photos you upload, and any suggestions or
                comments you submit.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-2">2. How We Use Your Information</h2>
              <p>
                We use your information to generate crop, land and tree recommendations, to keep a
                personal history of your tree planting activity, to improve the platform, and to
                respond to your feedback. We do not sell your personal information.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-2">3. AI Processing</h2>
              <p>
                Text you submit to our AI-powered tools is sent to third-party AI providers solely
                to generate a response. Please avoid entering sensitive personal information into
                these tools.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-2">4. Data Storage and Security</h2>
              <p>
                Your data is stored securely in our managed cloud database. Access rules ensure that
                your tree planting history, profile and suggestions are visible only to you, and to
                administrators where necessary for moderation.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-2">5. Your Rights</h2>
              <p>
                You may access, correct or delete your records at any time from within the platform,
                or request full account deletion by contacting us.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-2">6. Cookies and Local Storage</h2>
              <p>
                We use local storage to keep you signed in, remember your theme preference and record
                your acceptance of our policies. No advertising trackers are used.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-2">7. Contact</h2>
              <p>
                Questions about this policy can be sent through the Suggestions page.
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Privacy;
