import { cn } from "@/lib/cn";

const W = 600, H = 240, PAD = { l: 44, r: 12, t: 14, b: 28 };
const fmt = (n: number) => (n >= 1000 ? `${Math.round(n / 100) / 10}k` : String(n));

function scale(values: number[]) {
  const max = Math.max(1, ...values);
  const top = Math.ceil(max / 5000) * 5000 || max;
  return { top, y: (v: number) => PAD.t + (1 - v / top) * (H - PAD.t - PAD.b) };
}

function Grid({ top, y }: { top: number; y: (v: number) => number }) {
  return (
    <g aria-hidden="true">
      {[0, 0.25, 0.5, 0.75, 1].map((f) => (
        <g key={f}>
          <line x1={PAD.l} x2={W - PAD.r} y1={y(top * f)} y2={y(top * f)} stroke="#232623" />
          <text x={PAD.l - 8} y={y(top * f) + 4} textAnchor="end" fontSize="10" fill="#8d9889">{fmt(top * f)}</text>
        </g>
      ))}
    </g>
  );
}

export type Series = { name: string; color: string; values: number[] };

export function LineChart({ labels, series, title, summary }: { labels: string[]; series: Series[]; title: string; summary: string }) {
  const { top, y } = scale(series.flatMap((s) => s.values));
  const x = (i: number) => PAD.l + (labels.length <= 1 ? 0 : (i / (labels.length - 1)) * (W - PAD.l - PAD.r));
  return (
    <figure>
      <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={`${title}. ${summary}`} className="w-full">
        <title>{title}</title>
        <Grid top={top} y={y} />
        {series.map((s) => (
          <g key={s.name}>
            <polyline fill="none" stroke={s.color} strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" points={s.values.map((v, i) => `${x(i)},${y(v)}`).join(" ")} />
            {s.values.map((v, i) => <circle key={i} cx={x(i)} cy={y(v)} r="3" fill={s.color} />)}
          </g>
        ))}
        {labels.map((l, i) => <text key={l + i} x={x(i)} y={H - 8} textAnchor="middle" fontSize="10" fill="#8d9889">{l}</text>)}
      </svg>
      <figcaption className="mt-2 flex flex-wrap gap-4 text-xs text-mute">
        {series.map((s) => (
          <span key={s.name} className="inline-flex items-center gap-1.5"><span aria-hidden="true" className="h-2 w-2 rounded-full" style={{ background: s.color }} />{s.name}</span>
        ))}
      </figcaption>
    </figure>
  );
}

export function BarChart({ labels, values, color = "#abb8a8", title, summary, negativeColor = "#e8789a" }: { labels: string[]; values: number[]; color?: string; negativeColor?: string; title: string; summary: string }) {
  const { top, y } = scale(values.map((v) => Math.abs(v)));
  const bw = (W - PAD.l - PAD.r) / Math.max(1, labels.length);
  return (
    <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={`${title}. ${summary}`} className="w-full">
      <title>{title}</title>
      <Grid top={top} y={y} />
      {values.map((v, i) => {
        const h = y(0) - y(Math.abs(v));
        return <rect key={i} x={PAD.l + i * bw + bw * 0.18} width={bw * 0.64} y={y(Math.abs(v))} height={Math.max(0, h)} rx="4" fill={v < 0 ? negativeColor : color} />;
      })}
      {labels.map((l, i) => <text key={l + i} x={PAD.l + i * bw + bw / 2} y={H - 8} textAnchor="middle" fontSize="10" fill="#8d9889">{l}</text>)}
    </svg>
  );
}

const DONUT = ["#abb8a8", "#f2b35e", "#e8789a", "#9a7bff", "#6fb7c9"];

export function Donut({ data, title }: { data: { label: string; value: number }[]; title: string }) {
  const total = data.reduce((a, d) => a + d.value, 0) || 1;
  const r = 52, c = 2 * Math.PI * r;
  let offset = 0;
  return (
    <figure className="flex flex-col items-center gap-4 sm:flex-row">
      <svg viewBox="0 0 140 140" role="img" aria-label={`${title}: ${data.map((d) => `${d.label} ${d.value}%`).join(", ")}`} className="h-36 w-36 shrink-0 -rotate-90">
        <title>{title}</title>
        <circle cx="70" cy="70" r={r} fill="none" stroke="#161816" strokeWidth="18" />
        {data.map((d, i) => {
          const len = (d.value / total) * c;
          const el = <circle key={d.label} cx="70" cy="70" r={r} fill="none" stroke={DONUT[i % DONUT.length]} strokeWidth="18" strokeDasharray={`${len} ${c - len}`} strokeDashoffset={-offset} />;
          offset += len;
          return el;
        })}
      </svg>
      <ul className="space-y-1.5 text-sm">
        {data.map((d, i) => (
          <li key={d.label} className="flex items-center gap-2"><span aria-hidden="true" className={cn("h-2.5 w-2.5 rounded-full")} style={{ background: DONUT[i % DONUT.length] }} />{d.label} <span className="font-mono text-mute">{d.value}%</span></li>
        ))}
      </ul>
    </figure>
  );
}
