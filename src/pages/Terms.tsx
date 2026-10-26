import { APP_NAME, CONTACT_EMAIL, LEGAL_LAST_UPDATED } from '@/lib/site';

export default function Terms() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 text-sm leading-relaxed text-ink-secondary">
      <h1 className="text-2xl font-semibold text-ink-primary">Terms of Service</h1>
      <p className="mt-1 text-2xs text-ink-muted">Last updated: {LEGAL_LAST_UPDATED}</p>

      <h2 className="mt-8 text-base font-semibold text-ink-primary">1. About {APP_NAME}</h2>
      <p className="mt-2">
        {APP_NAME} is a tool for logging coding problems you have solved, revising them with spaced repetition,
        tracking your streak, and optionally syncing your solutions to your own GitHub repository. By creating an
        account or using the service you agree to these terms.
      </p>

      <h2 className="mt-6 text-base font-semibold text-ink-primary">2. Your account</h2>
      <p className="mt-2">
        You must provide a valid email address and keep your password confidential. You are responsible for activity
        on your account. Accounts with instructor or administrator access are created by {APP_NAME} administrators
        only. You must be at least 13 years old to use the service.
      </p>

      <h2 className="mt-6 text-base font-semibold text-ink-primary">3. Your content</h2>
      <p className="mt-2">
        The problems, notes and solution code you add remain yours. You give {APP_NAME} permission to store and
        display that content to you, and to your instructor if you join their class, solely to operate the service.
        Please do not upload content you do not have the right to share, and do not use the service to store anything
        unlawful or harmful.
      </p>

      <h2 className="mt-6 text-base font-semibold text-ink-primary">4. Acceptable use</h2>
      <p className="mt-2">
        Do not attempt to access other users' data, disrupt the service, scrape it at scale, or bypass security or
        role restrictions. We may suspend accounts that break these rules.
      </p>

      <h2 className="mt-6 text-base font-semibold text-ink-primary">5. GitHub integration</h2>
      <p className="mt-2">
        If you connect GitHub, you authorise {APP_NAME} to create and update files in a repository in your account on
        your request. You can disconnect at any time from the GitHub page or by revoking access in your GitHub
        settings. We are not responsible for content you choose to publish to GitHub.
      </p>

      <h2 className="mt-6 text-base font-semibold text-ink-primary">6. Plans and payments</h2>
      <p className="mt-2">
        {APP_NAME} offers a Free plan and a paid Premium plan. The features and price of each plan are shown in the app
        and may change; changes to price will not affect a period you have already paid for. Premium access is granted
        for the period you have paid for and ends when it expires unless renewed. If you believe you were charged in
        error, contact us and we will review it.
      </p>

      <h2 className="mt-6 text-base font-semibold text-ink-primary">7. Service availability</h2>
      <p className="mt-2">
        The service is provided "as is" without warranties. We try to keep it available and your data safe, but we do
        not guarantee uninterrupted operation, and we may change or discontinue features. To the extent permitted by
        law, we are not liable for indirect or consequential losses.
      </p>

      <h2 className="mt-6 text-base font-semibold text-ink-primary">8. Termination</h2>
      <p className="mt-2">
        You can delete your account at any time from Settings → Account. We may suspend or remove accounts that
        violate these terms.
      </p>

      <h2 className="mt-6 text-base font-semibold text-ink-primary">9. Changes and contact</h2>
      <p className="mt-2">
        We may update these terms; continued use after an update means you accept it. Questions? Email{' '}
        <a href={`mailto:${CONTACT_EMAIL}`} className="text-accent-400">{CONTACT_EMAIL}</a>.
      </p>
    </div>
  );
}
