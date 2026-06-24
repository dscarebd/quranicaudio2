import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Globe, Mail, MessageCircle, Info } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import annurLogo from "@/assets/annur-digital.png.asset.json";
import appLogo from "@/assets/logo.png.asset.json";

export const Route = createFileRoute("/developer-info")({
  head: () => ({
    meta: [
      { title: "Developer — Quran Audio" },
      { name: "description", content: "About the developer and the Quran Audio app." },
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
            className="h-24 w-24 object-contain"
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
            icon={<MessageCircle className="h-5 w-5" />}
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
              alt="Quran Audio"
              className="h-7 w-auto object-contain"
              draggable={false}
            />
          </div>
          <div className="min-w-0">
            <h2 className="text-lg font-bold font-display">About Quran Audio</h2>
            <p className="text-xs text-muted-foreground">
              Listen to the Quran, beautifully
            </p>
          </div>
        </div>

        <p className="mt-4 text-sm leading-relaxed text-foreground/80">
          Quran Audio lets you listen to all 114 Surahs from your favorite reciters.
          Save favorites, pick up where you left off with recently played, and drift
          off with the built-in sleep timer. Available in English and Bangla.
        </p>

        <div className="mt-5 pt-4 border-t border-border flex items-center justify-between text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1.5">
            <Info className="h-3.5 w-3.5" />
            Version
          </span>
          <span className="font-semibold text-foreground/80">1.0.0</span>
        </div>
      </section>
    </AppShell>
  );
}
