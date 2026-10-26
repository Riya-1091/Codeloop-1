import { APP_NAME, CONTACT_EMAIL, LEGAL_LAST_UPDATED } from '@/lib/site';

export default function Privacy() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 text-sm leading-relaxed text-ink-secondary">
      <h1 className="text-2xl font-semibold text-ink-primary">Privacy Policy</h1>
      <p className="mt-1 text-2xs text-ink-muted">Last updated: {LEGAL_LAST_UPDATED}</p>

      <h2 className="mt-8 text-base font-semibold text-ink-primary">What we collect</h2>
      <ul className="mt-2 list-disc space-y-1 pl-5">
        <li><b>Account data:</b> your name, email address and an encrypted (hashed) password.</li>
        <li><b>Learning data:</b> problems you log (title, link, topic, difficulty, notes, solution code), revision history, streaks and notifications.</li>
        <li><b>Class data:</b> classes you create or join, and your instructor's ability to see your progress in those classes.</li>
        <li><b>Chrome extension (only if you install it):</b> on problem pages of LeetCode, GeeksforGeeks, Codeforces, HackerRank and CodeChef it reads the problem details and your solution code (after an Accepted result, or when you click its button), and only sends them to {APP_NAME} (and on to your GitHub) when you click Save or Push. It does not send anything otherwise.</li>
        <li><b>GitHub data (only if you connect):</b> your GitHub username, avatar and an access token used to commit files you choose to sync. The token is stored server-side and is never shown in the app.</li>
        <li><b>Messages:</b> anything you send through the contact form.</li>
      </ul>

      <h2 className="mt-6 text-base font-semibold text-ink-primary">How we use it</h2>
      <p className="mt-2">
        To run {APP_NAME}: sign you in, show your progress, schedule revisions, sync to GitHub when you ask, let
        instructors monitor classes you joined, send account emails (confirmation and password reset), and respond to
        your messages. We do not sell your data and we do not show ads.
      </p>

      <h2 className="mt-6 text-base font-semibold text-ink-primary">Who can see your data</h2>
      <ul className="mt-2 list-disc space-y-1 pl-5">
        <li>You can see all of your own data.</li>
        <li>An instructor can see the progress of students who joined <i>their</i> class, and only those students.</li>
        <li>{APP_NAME} administrators can access data to operate and support the service.</li>
      </ul>

      <h2 className="mt-6 text-base font-semibold text-ink-primary">Services we rely on</h2>
      <p className="mt-2">
        We use Supabase (database and authentication), Vercel (website hosting), Brevo (sending account emails) and
        GitHub (only if you connect it). These providers process data on our behalf under their own privacy terms.
      </p>

      <h2 className="mt-6 text-base font-semibold text-ink-primary">Your choices and rights</h2>
      <ul className="mt-2 list-disc space-y-1 pl-5">
        <li>Edit your profile and preferences in Settings.</li>
        <li>Disconnect GitHub at any time.</li>
        <li>Delete your account and all associated data from Settings → Account.</li>
        <li>Ask us to correct or export your data by emailing us.</li>
      </ul>

      <h2 className="mt-6 text-base font-semibold text-ink-primary">Retention and security</h2>
      <p className="mt-2">
        We keep your data while your account exists and delete it when you delete your account. Data is stored with
        access controls so users can only read what they are permitted to. No system is perfectly secure, so please use
        a strong, unique password.
      </p>

      <h2 className="mt-6 text-base font-semibold text-ink-primary">Contact</h2>
      <p className="mt-2">
        Privacy questions or requests: <a href={`mailto:${CONTACT_EMAIL}`} className="text-accent-400">{CONTACT_EMAIL}</a>.
      </p>
    </div>
  );
}
