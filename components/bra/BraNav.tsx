const LINKS = [
  { href: '#how', label: '量法' },
  { href: '#calculator', label: '計算器' },
  { href: '#chart', label: '對照表' },
  { href: '#fit', label: '合身檢查' },
  { href: '#faq', label: '常見問題' },
];

export default function BraNav() {
  return (
    <header className="sticky top-0 z-40 border-b border-rose-100 bg-white/85 backdrop-blur">
      <nav className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-3.5">
        <a href="#top" className="flex items-center gap-2 font-bold text-stone-900">
          <span aria-hidden className="grid h-8 w-8 place-items-center rounded-full bg-rose-500 text-sm text-white">
            尺
          </span>
          <span>合身尺</span>
        </a>
        <ul className="hidden items-center gap-1 md:flex">
          {LINKS.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                className="rounded-full px-3.5 py-2 text-sm text-stone-600 transition hover:bg-rose-50 hover:text-rose-600"
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>
        <a
          href="#calculator"
          className="rounded-full bg-rose-500 px-4 py-2 text-sm font-semibold text-white shadow transition hover:bg-rose-600"
        >
          開始量測
        </a>
      </nav>
    </header>
  );
}
