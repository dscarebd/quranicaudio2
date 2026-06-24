import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { TopBar } from "@/components/TopBar";

const APP_NAME = "Listen Quran";
const OWNER = "Listen Quran";
const CONTACT_EMAIL = "support@annurdigital.com";
const JURISDICTION = "Bangladesh";
const EFFECTIVE_DATE = "June 24, 2026";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: `Privacy Policy — ${APP_NAME}` },
      {
        name: "description",
        content: `Privacy policy for the ${APP_NAME} mobile and web app. We do not collect personal data, do not use analytics, and do not show ads.`,
      },
    ],
  }),
  component: PrivacyPage,
});

function PrivacyPage() {
  return (
    <AppShell>
      <TopBar />
      <div className="px-5 pb-8">
        <header className="mb-6">
          <h1 className="text-2xl font-bold font-display">Privacy Policy</h1>
          <p className="text-xs text-muted-foreground mt-1">
            Effective {EFFECTIVE_DATE} · App: {APP_NAME} (com.annur.listenquran)
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            This page is maintained by {OWNER} to explain how {APP_NAME} handles
            your information.
          </p>
        </header>

        <div className="rounded-3xl bg-surface border border-border p-5 space-y-6 text-sm leading-relaxed">
          <Section title="1. Summary">
            <p>
              {APP_NAME} is a free Quran audio player. We respect your privacy.
              The app <strong>does not collect, store, or share any personal
              information</strong> on our servers. There are no user accounts,
              no analytics, no advertising, and no third-party trackers.
            </p>
          </Section>

          <Section title="2. Information we collect">
            <p>
              We do not collect personally identifiable information. The app
              works without sign-in.
            </p>
            <p className="mt-2">
              The following data stays <strong>only on your device</strong> and
              is never transmitted to us:
            </p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>Your selected reciter and playback preferences (shuffle, repeat, speed).</li>
              <li>Your favorites and recently played surahs.</li>
              <li>Your optional display name and profile picture (stored locally only).</li>
              <li>Surah audio files you choose to download for offline listening.</li>
            </ul>
            <p className="mt-2">
              This data is stored in your device&apos;s local storage and cache.
              You can erase it any time by clearing favorites/recents from the
              Settings page, removing downloads from the Downloads page, or
              uninstalling the app.
            </p>
          </Section>

          <Section title="3. Permissions the app uses">
            <ul className="list-disc pl-5 space-y-1">
              <li>
                <strong>Internet access</strong> — to stream Quran audio and
                download surahs you select.
              </li>
              <li>
                <strong>Storage</strong> — to save downloaded audio so you can
                listen offline.
              </li>
              <li>
                <strong>Foreground service / media playback</strong> — to keep
                audio playing when the screen is locked.
              </li>
            </ul>
            <p className="mt-2">
              The app does <strong>not</strong> request access to your contacts,
              camera, microphone, location, SMS, call logs, or photos. A profile
              picture, if you choose one, is selected from your device gallery
              and stored only locally.
            </p>
          </Section>

          <Section title="4. Third-party services">
            <p>
              Audio files are streamed from public Quran audio providers such as
              <em> mp3quran.net</em> and <em>everyayah.com</em>. When you stream
              or download audio, your device makes a direct connection to those
              providers, which may log standard request information (such as IP
              address) under their own privacy policies. We do not control or
              receive that data.
            </p>
            <p className="mt-2">
              {APP_NAME} does <strong>not</strong> include Google Analytics,
              Firebase Analytics, AdMob, Facebook SDK, or any other analytics or
              advertising SDK.
            </p>
          </Section>

          <Section title="5. Children's privacy">
            <p>
              {APP_NAME} is safe for users of all ages and does not knowingly
              collect any personal information from anyone, including children
              under 13. The app contains only Quran recitations and is suitable
              under Google Play&apos;s Families policy.
            </p>
          </Section>

          <Section title="6. Data security">
            <p>
              Because all your in-app data is stored locally on your device, its
              security depends on your device&apos;s own protections (screen
              lock, OS security updates). We have no servers that store your
              data, so there is no remote database that could be breached.
            </p>
          </Section>

          <Section title="7. Your rights and choices">
            <ul className="list-disc pl-5 space-y-1">
              <li>Clear favorites and recently played from Settings → Data.</li>
              <li>Remove individual or all downloaded surahs from the Downloads page.</li>
              <li>Uninstall the app to delete all locally stored data.</li>
            </ul>
            <p className="mt-2">
              Since we do not hold any personal data about you, there is nothing
              for us to export or delete on our side.
            </p>
          </Section>

          <Section title="8. Changes to this policy">
            <p>
              We may update this Privacy Policy from time to time. The updated
              version will be posted in the app with a new effective date. Major
              changes will be highlighted in the app&apos;s release notes.
            </p>
          </Section>

          <Section title="9. Governing law">
            <p>
              This policy is governed by the laws of {JURISDICTION}, without
              regard to its conflict-of-law principles.
            </p>
          </Section>

          <Section title="10. Contact us">
            <p>
              If you have any questions about this Privacy Policy or the app,
              please contact:
            </p>
            <p className="mt-2">
              <strong>{OWNER}</strong>
              <br />
              Email:{" "}
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="text-primary underline"
              >
                {CONTACT_EMAIL}
              </a>
            </p>
          </Section>
        </div>
      </div>
    </AppShell>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="text-base font-semibold mb-2">{title}</h2>
      <div className="text-muted-foreground">{children}</div>
    </section>
  );
}
