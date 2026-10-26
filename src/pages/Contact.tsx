import { useState } from 'react';
import { Mail, MapPin, MessageSquare, Send } from 'lucide-react';
import { PageHeader } from '@/components/ui/Section';
import { Input, Textarea, Button } from '@/components/ui/Form';
import { useToast } from '@/contexts/ToastContext';
import { CONTACT_EMAIL } from '@/lib/site';
import { sendContactMessage } from '@/lib/api';

export default function Contact() {
  const { toast } = useToast();
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = 'Name is required';
    if (!form.email.trim()) e.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Invalid email format';
    if (!form.subject.trim()) e.subject = 'Subject is required';
    if (!form.message.trim()) e.message = 'Message is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setSubmitted(true);
    try {
      await sendContactMessage({ name: form.name.trim(), email: form.email.trim(), subject: form.subject.trim(), message: form.message.trim() });
      toast('Message sent. Our team will get back to you.', 'success');
      setForm({ name: '', email: '', subject: '', message: '' });
    } catch (e) {
      toast(e instanceof Error ? e.message : 'Could not send message.', 'error');
    } finally {
      setTimeout(() => setSubmitted(false), 1500);
    }
  };

  return (
    <div className="mx-auto max-w-2xl">
      <PageHeader title="Contact" subtitle="Have a question or feedback? We'd love to hear from you." />

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="card p-3 text-center">
          <Mail className="mx-auto mb-2 h-5 w-5 text-accent-400" />
          <div className="text-xs font-medium text-ink-primary">Email</div>
          <div className="mt-0.5 break-all text-2xs text-ink-muted">{CONTACT_EMAIL}</div>
        </div>
        <div className="card p-3 text-center">
          <MessageSquare className="mx-auto mb-2 h-5 w-5 text-accent-400" />
          <div className="text-xs font-medium text-ink-primary">Response time</div>
          <div className="mt-0.5 text-2xs text-ink-muted">Within 2 working days</div>
        </div>
        <div className="card p-3 text-center">
          <MapPin className="mx-auto mb-2 h-5 w-5 text-accent-400" />
          <div className="text-xs font-medium text-ink-primary">Location</div>
          <div className="mt-0.5 text-2xs text-ink-muted">Remote-first</div>
        </div>
      </div>

      <div className="card mt-4 p-5">
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Input label="Name" placeholder="Your name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} error={errors.name} />
            <Input label="Email" placeholder="you@example.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} error={errors.email} />
          </div>
          <Input label="Subject" placeholder="What's this about?" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} error={errors.subject} />
          <Textarea label="Message" placeholder="Tell us more..." value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} error={errors.message} rows={5} />
          <div className="flex items-center justify-end gap-2">
            {submitted && <span className="text-sm text-success">Thank you! We'll get back to you soon.</span>}
            <Button variant="primary" onClick={handleSubmit}>
              <Send className="h-3.5 w-3.5" />
              Send Message
            </Button>
          </div>
        </div>
        <div className="mt-4 rounded-lg border border-line bg-base-850/50 p-3 text-2xs text-ink-muted">
          Your message goes straight to our team. We use your email only to reply to you.
        </div>
      </div>
    </div>
  );
}
