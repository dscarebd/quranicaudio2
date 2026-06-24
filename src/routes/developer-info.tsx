import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Globe, Mail } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import annurLogo from "@/assets/annur-digital.png.asset.json";
import appLogo from "@/assets/logo.png.asset.json";


export const Route = createFileRoute("/developer-info")({
  head: () => ({
    meta: [
      { title: "Developer — Listen Quran" },
      { name: "description", content: "About the developer and the Listen Quran app." },
    ],
  }),
  component: DeveloperInfoPage,
});

function ContactRow({
  icon,
  label,
  value,
  href,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  href: string;
}) {
  const external = href.startsWith("http");
  return (
    <a
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      className="flex items-center gap-3 rounded-2xl bg-muted/60 hover:bg-muted transition px-3 py-3"
    >
      <div className="h-10 w-10 shrink-0 rounded-full bg-primary/15 text-primary inline-flex items-center justify-center">
        {icon}
      </div>
      <div className="min-w-0">
        <div className="text-xs text-muted-foreground">{label}</div>
        <div className="text-sm font-semibold truncate">{value}</div>
      </div>
    </a>
  );
}

function DeveloperInfoPage() {
  return (
    <AppShell>
      <div className="px-5 pt-5 pb-2">
        <Link
          to="/profile"
          className="inline-flex items-center gap-2 text-sm font-medium text-foreground/80 hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to profile
        </Link>
      </div>

      {/* Developer card */}
      <section className="mx-5 mt-3 mb-6 rounded-3xl bg-surface border border-border p-6">
        <div className="flex flex-col items-center text-center">
          <img
            src={annurLogo.url}
            alt="An-Nur Digital"
            className="h-24 w-36 object-contain rounded-xl"
            draggable={false}
          />
          <h1 className="mt-3 text-2xl font-bold font-display">An-Nur Digital</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Crafting digital experiences with purpose
          </p>
        </div>

        <div className="mt-6 flex flex-col gap-2">
          <ContactRow
            icon={<Globe className="h-5 w-5" />}
            label="Website"
            value="annurdigital.com"
            href="https://annurdigital.com"
          />
          <ContactRow
            icon={<Mail className="h-5 w-5" />}
            label="Email"
            value="support@annurdigital.com"
            href="mailto:support@annurdigital.com"
          />
          <ContactRow
            icon={
              <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
                <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
              </svg>
            }
            label="Telegram"
            value="@nuralamin.official"
            href="https://t.me/nuralamin.official"
          />
        </div>
      </section>

      {/* About app card */}
      <section className="mx-5 mb-10 rounded-3xl bg-surface border border-border p-5">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 shrink-0 rounded-2xl bg-primary/15 inline-flex items-center justify-center">
            <img
              src={appLogo.url}
              alt="Listen Quran"
              className="h-7 w-auto object-contain"
              draggable={false}
            />
          </div>
          <div className="min-w-0">
            <h2 className="text-lg font-bold font-display">About Listen Quran</h2>
            <p className="text-xs text-muted-foreground">
              Listen to the Quran, beautifully
            </p>
          </div>
        </div>

        <p className="mt-4 text-sm leading-relaxed text-foreground/80">
          Listen Quran lets you listen to all 114 Surahs from your favorite reciters.
          Save favorites, pick up where you left off with recently played, and drift
          off with the built-in sleep timer. Available in English and Bangla.
        </p>

      </section>
    </AppShell>
  );
}
