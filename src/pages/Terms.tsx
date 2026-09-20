import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { FileText } from "lucide-react";

const Terms = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-1 py-12">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="flex items-center gap-3 mb-8">
            <FileText className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-3xl font-bold">Terms and Conditions</h1>
              <p className="text-muted-foreground">Last updated: September 2026</p>
            </div>
          </div>

          <div className="space-y-6 text-muted-foreground leading-relaxed">
            <section>
              <h2 className="text-xl font-semibold text-foreground mb-2">1. Acceptance of Terms</h2>
              <p>
                By creating an account or using SmartLand you agree to these Terms and Conditions and
                to our Privacy Policy. If you do not agree, please do not use the platform.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-2">2. Your Account</h2>
              <p>
                You are responsible for keeping your login details confidential and for all activity
                under your account. You must provide accurate information and be at least 18 years
                old, or have the consent of a parent or guardian.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-2">3. Acceptable Use</h2>
              <p>
                You agree not to misuse the platform, attempt to access other users' data, upload
                unlawful or harmful content, or use automated systems to overload our services.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-2">4. Advisory Nature of Content</h2>
              <p>
                Crop, land and tree recommendations are informational guidance generated with the
                help of artificial intelligence. They are not a substitute for professional
                agronomic, environmental or legal advice. You remain responsible for decisions taken
                on your land.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-2">5. Your Content</h2>
              <p>
                You keep ownership of the data, photos and suggestions you submit. You grant us a
                limited licence to store and process them in order to operate the platform.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-2">6. Availability and Liability</h2>
              <p>
                The platform is provided "as is" without warranties. We are not liable for crop
                losses, environmental outcomes or any indirect damages arising from use of the
                recommendations or from service interruptions.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-2">7. Termination</h2>
              <p>
                We may suspend or close accounts that breach these terms or our Fair Usage Policy.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-2">8. Changes</h2>
              <p>
                We may update these terms. Continued use of SmartLand after an update means you
                accept the revised terms.
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Terms;
