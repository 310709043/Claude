'use client';

import { useState } from 'react';
import SectionHeader from './SectionHeader';
import Reveal from './Reveal';
import { profile } from '@/lib/data';
import { useLang, ui } from '@/lib/i18n';
import { Mail, Phone, MapPin, Send, CheckCircle2, AlertCircle } from 'lucide-react';

type Status = 'idle' | 'sending' | 'success' | 'error';

const WEB3FORMS_KEY = process.env.NEXT_PUBLIC_WEB3FORMS_KEY;

export default function Contact() {
  const { t } = useLang();
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState<Status>('idle');
  const [error, setError] = useState<string>('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus('sending');
    setError('');

    // Fallback: if no Web3Forms key, open the user's mail client with content prefilled.
    if (!WEB3FORMS_KEY) {
      const subject = encodeURIComponent(`[Portfolio] Message from ${form.name}`);
      const body = encodeURIComponent(
        `Name: ${form.name}\nEmail: ${form.email}\n\n${form.message}`
      );
      window.location.href = `mailto:${profile.email}?subject=${subject}&body=${body}`;
      setStatus('success');
      setForm({ name: '', email: '', message: '' });
      return;
    }

    try {
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          access_key: WEB3FORMS_KEY,
          subject: `[Portfolio] Message from ${form.name}`,
          from_name: form.name,
          reply_to: form.email,
          name: form.name,
          email: form.email,
          message: form.message,
          // honeypot field (must remain empty)
          botcheck: '',
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Failed to send');
      }
      setStatus('success');
      setForm({ name: '', email: '', message: '' });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send');
      setStatus('error');
    }
  }

  return (
    <section id="contact" className="section">
      <div className="container-page">
        <SectionHeader
          eyebrow={ui.contact.eyebrow}
          title={ui.contact.title}
          subtitle={ui.contact.subtitle}
        />

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.2fr] gap-6">
          <Reveal>
            <div className="card p-6 h-full">
              <h3 className="text-lg font-semibold mb-5">
                {t(ui.contact.getInTouch)}
              </h3>
              <ul className="space-y-4 text-sm">
                <li className="flex items-center gap-3">
                  <span className="grid place-items-center w-9 h-9 rounded-lg bg-bg border border-border text-accent">
                    <Mail size={16} />
                  </span>
                  <a
                    href={`mailto:${profile.email}`}
                    className="text-ink/90 hover:text-accent break-all"
                  >
                    {profile.email}
                  </a>
                </li>
                <li className="flex items-center gap-3">
                  <span className="grid place-items-center w-9 h-9 rounded-lg bg-bg border border-border text-accent">
                    <Phone size={16} />
                  </span>
                  <a
                    href={`tel:${profile.phone.replace(/\s/g, '')}`}
                    className="text-ink/90 hover:text-accent"
                  >
                    {profile.phone}
                  </a>
                </li>
                <li className="flex items-center gap-3">
                  <span className="grid place-items-center w-9 h-9 rounded-lg bg-bg border border-border text-accent">
                    <MapPin size={16} />
                  </span>
                  <span className="text-ink/90">{t(profile.location)}</span>
                </li>
              </ul>

              <div className="mt-8 pt-6 border-t border-border text-xs text-muted leading-relaxed">
                {t(ui.contact.fallbackNote)}
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <form onSubmit={handleSubmit} className="card p-6 space-y-4">
              {/* honeypot */}
              <input
                type="text"
                name="botcheck"
                tabIndex={-1}
                autoComplete="off"
                className="hidden"
                aria-hidden="true"
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field
                  label={t(ui.contact.name)}
                  required
                  value={form.name}
                  onChange={(v) => setForm({ ...form, name: v })}
                />
                <Field
                  label={t(ui.contact.email)}
                  type="email"
                  required
                  value={form.email}
                  onChange={(v) => setForm({ ...form, email: v })}
                />
              </div>

              <div>
                <label className="text-xs text-muted">
                  {t(ui.contact.message)}
                </label>
                <textarea
                  required
                  rows={5}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-border bg-bg/50 px-4 py-3 text-sm outline-none focus:border-accent transition-colors resize-none"
                  placeholder={t(ui.contact.placeholder)}
                />
              </div>

              <div className="flex items-center justify-between gap-3 pt-2">
                <div className="text-xs">
                  {status === 'success' && (
                    <span className="inline-flex items-center gap-1.5 text-emerald-400">
                      <CheckCircle2 size={14} /> {t(ui.contact.success)}
                    </span>
                  )}
                  {status === 'error' && (
                    <span className="inline-flex items-center gap-1.5 text-rose-400">
                      <AlertCircle size={14} />{' '}
                      {error || t(ui.contact.failError)}
                    </span>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={status === 'sending'}
                  className="btn-primary disabled:opacity-60"
                >
                  <Send size={14} />
                  {status === 'sending'
                    ? t(ui.contact.sending)
                    : t(ui.contact.send)}
                </button>
              </div>
            </form>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function Field({
  label,
  value,
  onChange,
  required,
  type = 'text',
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
  type?: string;
}) {
  return (
    <div>
      <label className="text-xs text-muted">{label}</label>
      <input
        type={type}
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full rounded-lg border border-border bg-bg/50 px-4 py-2.5 text-sm outline-none focus:border-accent transition-colors"
      />
    </div>
  );
}
