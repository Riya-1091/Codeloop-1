import { useState } from 'react';
import { ChevronDown, Search, LifeBuoy } from 'lucide-react';
import { faqData } from '@/data/mockData';
import { PageHeader, EmptyState } from '@/components/ui/Section';

export default function Help() {
  const [open, setOpen] = useState<string | null>(`${faqData[0].category}-0`);
  const [search, setSearch] = useState('');

  const q = search.toLowerCase().trim();
  const filtered = q
    ? faqData
        .map((cat) => ({
          ...cat,
          questions: cat.questions.filter((item) => item.q.toLowerCase().includes(q) || item.a.toLowerCase().includes(q)),
        }))
        .filter((cat) => cat.questions.length > 0)
    : faqData;

  return (
    <div>
      <PageHeader title="Help & FAQ" subtitle="Find answers to common questions about CodeLoop." />

      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-muted" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search FAQs..."
          className="input-field pl-9"
        />
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={LifeBuoy}
          title="No results found"
          description={`No FAQ matches "${search}". Try a different search or contact us.`}
        />
      ) : (
        <div className="space-y-6">
          {filtered.map((cat) => (
            <div key={cat.category}>
              <h2 className="mb-3 text-sm font-semibold text-ink-primary">{cat.category}</h2>
              <div className="space-y-2">
                {cat.questions.map((item, i) => {
                  const key = `${cat.category}-${i}`;
                  const isOpen = open === key;
                  return (
                    <div key={key} className="card overflow-hidden">
                      <button
                        onClick={() => setOpen(isOpen ? null : key)}
                        className="flex w-full items-center justify-between px-4 py-3 text-left"
                      >
                        <span className="text-sm font-medium text-ink-primary">{item.q}</span>
                        <ChevronDown className={`h-4 w-4 shrink-0 text-ink-muted transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                      </button>
                      {isOpen && (
                        <div className="border-t border-line px-4 py-3">
                          <p className="text-sm leading-relaxed text-ink-secondary">{item.a}</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
