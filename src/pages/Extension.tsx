import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Download, Copy, Check, Github, Flame, MousePointerClick } from 'lucide-react';
import { PageHeader } from '@/components/ui/Section';

const ZIP_URL = '/downloads/codeloop-chrome-extension.zip';
const EXT_VERSION = '1.2.0';

const perks = [
  { icon: MousePointerClick, title: 'One-click save', text: 'After an Accepted submission, a small card or panel appears. One click saves the problem (title, difficulty, topic, language, your code) to CodeLoop. No manual typing.' },
  { icon: Github, title: 'Push to GitHub', text: 'The same card can also commit your solution to your GitHub repo, once you have connected GitHub on the CodeLoop website.' },
  { icon: Flame, title: 'Streak at a glance', text: 'Click the extension icon to see your CodeLoop streak and stats without opening the site.' },
];

const sites = [
  { name: 'LeetCode', how: 'Card appears automatically after an Accepted submission.' },
  { name: 'GeeksforGeeks', how: 'Panel opens when "Problem Solved Successfully" shows. Or use the floating button.' },
  { name: 'Codeforces', how: 'Open your accepted submission page and the panel opens. Or use the floating button on a problem page.' },
  { name: 'HackerRank', how: 'Panel opens when the success message shows. Or use the floating button.' },
  { name: 'CodeChef', how: 'Use the floating "Save to CodeLoop" button on the problem page.' },
];

export default function Extension() {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText('chrome://extensions');
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard blocked — the text is shown on screen to type instead */
    }
  };

  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader title="CodeLoop Chrome extension" subtitle="Save your solutions to CodeLoop and push them to GitHub, right from the coding site." />

      <div className="card mb-4 flex flex-col items-start gap-3 p-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-sm font-semibold text-ink-primary">Download (v{EXT_VERSION})</h2>
          <p className="mt-1 text-xs text-ink-muted">
            Free. Works on LeetCode, GeeksforGeeks, Codeforces, HackerRank and CodeChef. Built for Chrome; other Chromium browsers (Edge, Brave) may work but are untested.
          </p>
        </div>
        <a href={ZIP_URL} download className="btn-primary">
          <Download className="h-3.5 w-3.5" />
          Download extension
        </a>
      </div>

      <div className="mb-4 grid gap-4 sm:grid-cols-3">
        {perks.map((p) => (
          <div key={p.title} className="card p-4">
            <p.icon className="mb-2 h-4 w-4 text-accent-400" />
            <h3 className="text-sm font-semibold text-ink-primary">{p.title}</h3>
            <p className="mt-1 text-xs leading-relaxed text-ink-secondary">{p.text}</p>
          </div>
        ))}
      </div>

      <div className="card mb-4 p-5">
        <h2 className="mb-1 text-sm font-semibold text-ink-primary">Supported sites</h2>
        <p className="mb-3 text-xs text-ink-muted">How each site works today. You can always edit the details before saving.</p>
        <div className="divide-y divide-line/60 text-xs">
          {sites.map((s) => (
            <div key={s.name} className="flex flex-col gap-0.5 py-2 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
              <span className="font-medium text-ink-primary">{s.name}</span>
              <span className="text-ink-secondary sm:max-w-sm sm:text-right">{s.how}</span>
            </div>
          ))}
        </div>
        <p className="mt-3 text-2xs text-ink-faint">
          Some sites are newer in the extension and still being tested; if the panel does not appear automatically, use the floating “Save to CodeLoop” button on the problem page.
        </p>
      </div>

      <div className="card mb-4 p-5">
        <h2 className="mb-1 text-sm font-semibold text-ink-primary">How to install (about 1 minute)</h2>
        <p className="mb-4 text-xs text-ink-muted">
          It is not on the Chrome Web Store yet, so it is installed manually. This is a normal Chrome feature for developer extensions.
        </p>
        <ol className="space-y-4">
          <Step n={1} title="Download and unzip">
            Click <b>Download extension</b> above, then unzip the file. You will get a folder named <code className="rounded bg-base-800 px-1 py-0.5 text-2xs">codeloop-extension</code>. Keep it somewhere permanent: if you delete the folder, the extension stops working.
          </Step>
          <Step n={2} title="Open Chrome's extensions page">
            <div className="flex flex-wrap items-center gap-2">
              <span>Type</span>
              <code className="rounded bg-base-800 px-1.5 py-0.5 text-2xs">chrome://extensions</code>
              <span>in a new tab's address bar.</span>
              <button type="button" onClick={copy} className="btn-secondary px-2 py-1 text-2xs">
                {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                {copied ? 'Copied' : 'Copy'}
              </button>
            </div>
          </Step>
          <Step n={3} title="Turn on Developer mode">
            Use the <b>Developer mode</b> switch at the top-right of that page.
          </Step>
          <Step n={4} title="Load the folder">
            Click <b>Load unpacked</b> and select the unzipped <code className="rounded bg-base-800 px-1 py-0.5 text-2xs">codeloop-extension</code> folder (the one that directly contains <code className="rounded bg-base-800 px-1 py-0.5 text-2xs">manifest.json</code>).
          </Step>
          <Step n={5} title="Log in">
            Pin the extension from the puzzle-piece menu, click its icon and log in with your CodeLoop account. To push to GitHub, connect GitHub once on the <Link to="/github" className="text-accent-400">GitHub page</Link>.
          </Step>
          <Step n={6} title="Solve a problem">
            Submit a solution on leetcode.com. When it says Accepted, the CodeLoop card appears in the bottom-right corner.
          </Step>
        </ol>
      </div>

      <div className="card p-5 text-xs leading-relaxed text-ink-secondary">
        <h2 className="mb-2 text-sm font-semibold text-ink-primary">Good to know</h2>
        <ul className="list-disc space-y-1.5 pl-4">
          <li>Updating: replace the folder with the new version, then press the reload icon on the extension's card in <code className="rounded bg-base-800 px-1 py-0.5 text-2xs">chrome://extensions</code> and refresh your LeetCode tab.</li>
          <li>The extension reads your code only after an Accepted result, and sends it only when you click a button on the card. See the <Link to="/privacy" className="text-accent-400">Privacy page</Link>.</li>
          <li>Card or button not showing up? Reload the extension, refresh the tab, and make sure you are on a problem page of a supported site.</li>
        </ul>
      </div>
    </div>
  );
}

function Step({ n, title, children }: { n: number; title: string; children: React.ReactNode }) {
  return (
    <li className="flex gap-3">
      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent-400/15 text-xs font-semibold text-accent-400">{n}</span>
      <div>
        <div className="text-sm font-medium text-ink-primary">{title}</div>
        <div className="mt-1 text-xs leading-relaxed text-ink-secondary">{children}</div>
      </div>
    </li>
  );
}
