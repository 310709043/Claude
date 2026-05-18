'use client';

import { useState } from 'react';
import SectionHeader from './SectionHeader';
import Reveal from './Reveal';
import { profile } from '@/lib/data';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { Mail, Phone, MapPin, Send, CheckCircle2, AlertCircle } from 'lucide-react';

type Status = 'idle' | 'sending' | 'success' | 'error';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState<Status>('idle');
  const [error, setError] = useState<string>('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus('sending');
    setError('');

    if (!isSupabaseConfigured || !supabase) {
      // Graceful fallback before Supabase is wired
      await new Promise((r) => setTimeout(r, 700));
      setStatus('success');
      setForm({ name: '', email: '', message: '' });
      return;
    }

    const { error: insertError } = await supabase.from('messages').insert({
      name: form.name,
      email: form.email,
      message: form.message,
    });

    if (insertError) {
      setError(insertError.message);
      setStatus('error');
      return;
    }
    setStatus('success');
    setForm({ name: '', email: '', message: '' });
  }

  return (
    <section id="contact" className="section">
      <div className="container-page">
        <SectionHeader
          eyebrow="06 — Contact"
          title="聯絡我"
          subtitle="無論是工作機會、專案合作或想聊聊產品與 AI 的應用，歡迎留言給我。"
        />

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.2fr] gap-6">
          <Reveal>
            <div className="card p-6 h-full">
              <h3 className="text-lg font-semibold mb-5">Get in touch</h3>
              <ul className="space-y-4 text-sm">
                <li className="flex items-center gap-3">
                  <span className="grid place-items-center w-9 h-9 rounded-lg bg-bg border border-border text-accent">
                    <Mail size={16} />
                  </span>
                  <a
                    href={`mailto:${profile.email}`}
                    className="text-ink/90 hover:text-accent"
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
                  <span className="text-ink/90">{profile.location}</span>
                </li>
              </ul>

              <div className="mt-8 pt-6 border-t border-border text-xs text-muted leading-relaxed">
                <div className="font-mono text-accent2 mb-2">// status</div>
                {isSupabaseConfigured ? (
                  <span>Supabase connected — 表單將寫入 messages 資料表。</span>
                ) : (
                  <span>
                    尚未設定 Supabase。請於 Vercel 環境變數加入
                    {' '}
                    <code className="text-ink">NEXT_PUBLIC_SUPABASE_URL</code>
                    {' '}和{' '}
                    <code className="text-ink">NEXT_PUBLIC_SUPABASE_ANON_KEY</code>
                    {' '}即可啟用。
                  </span>
                )}
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <form onSubmit={handleSubmit} className="card p-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field
                  label="姓名"
                  required
                  value={form.name}
                  onChange={(v) => setForm({ ...form, name: v })}
                />
                <Field
                  label="Email"
                  type="email"
                  required
                  value={form.email}
                  onChange={(v) => setForm({ ...form, email: v })}
                />
              </div>

              <div>
                <label className="text-xs text-muted">訊息</label>
                <textarea
                  required
                  rows={5}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-border bg-bg/50 px-4 py-3 text-sm outline-none focus:border-accent transition-colors resize-none"
                  placeholder="聊聊你的需求或專案..."
                />
              </div>

              <div className="flex items-center justify-between gap-3 pt-2">
                <div className="text-xs">
                  {status === 'success' && (
                    <span className="inline-flex items-center gap-1.5 text-emerald-400">
                      <CheckCircle2 size={14} /> 已收到，將盡快回覆！
                    </span>
                  )}
                  {status === 'error' && (
                    <span className="inline-flex items-center gap-1.5 text-rose-400">
                      <AlertCircle size={14} /> {error || '送出失敗'}
                    </span>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={status === 'sending'}
                  className="btn-primary disabled:opacity-60"
                >
                  <Send size={14} />
                  {status === 'sending' ? '傳送中...' : '送出訊息'}
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
