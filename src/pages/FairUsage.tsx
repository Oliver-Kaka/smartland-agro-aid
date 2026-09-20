import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Scale } from "lucide-react";
import { FAIR_USAGE_POINTS } from "@/components/FairUsageGate";

const FairUsage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-1 py-12">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="flex items-center gap-3 mb-8">
            <Scale className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-3xl font-bold">Fair Usage Policy</h1>
              <p className="text-muted-foreground">For the AI-powered tools on SmartLand</p>
            </div>
          </div>

          <div className="space-y-6 text-muted-foreground leading-relaxed">
            <p>
              SmartLand's crop recommendation, land analysis, planting guide, text-to-speech and tree
              species tools run on shared AI capacity. This policy keeps the service fast, affordable
              and available to every farmer and environmentalist using it.
            </p>

            <ul className="space-y-3 list-disc pl-5">
              {FAIR_USAGE_POINTS.map((point) => (
                <li key={point}>{point}</li>
              ))}
            </ul>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-2">If limits are reached</h2>
              <p>
                When usage limits are hit you will see a clear message and can try again later.
                Repeated or deliberate abuse may result in AI access being withdrawn from your
                account.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-2">Accuracy</h2>
              <p>
                AI output may be incomplete or occasionally incorrect. Always sanity-check
                recommendations against local conditions and extension-officer advice before acting
                on them.
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default FairUsage;
