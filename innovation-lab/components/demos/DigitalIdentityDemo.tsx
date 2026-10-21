"use client";
import { useEffect, useMemo, useState } from "react";
import { buildVCard, vcardFilename, type ContactCard } from "@/lib/vcard";
import { CopyButton } from "../CopyButton";
import { PrototypeBanner } from "../ui";

const START: ContactCard = {
  firstName: "Anuditha",
  lastName: "Hasarinda",
  title: "Founder & Brand Strategist",
  org: "Dynamic Horizon Media",
  phone: "",
  email: "anudithah@gmail.com",
  website: "",
  city: "Colombo",
  country: "Sri Lanka",
  note: "",
};

const fields: { key: keyof ContactCard; label: string; type?: string }[] = [
  { key: "firstName", label: "First name" },
  { key: "lastName", label: "Last name" },
  { key: "title", label: "Job title" },
  { key: "org", label: "Organisation" },
  { key: "phone", label: "Phone", type: "tel" },
  { key: "email", label: "Email", type: "email" },
  { key: "website", label: "Website", type: "url" },
  { key: "city", label: "City" },
  { key: "country", label: "Country" },
];

export function DigitalIdentityDemo() {
  const [c, setC] = useState<ContactCard>(START);
  const [qr, setQr] = useState<string>("");
  const [qrError, setQrError] = useState<string>("");
  const vcard = useMemo(() => buildVCard(c), [c]);
  const full = [c.firstName, c.lastName].filter(Boolean).join(" ");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const QR = (await import("qrcode")).default;
        const url = await QR.toDataURL(vcard, { errorCorrectionLevel: "M", margin: 1, width: 320, color: { dark: "#000000", light: "#ffffff" } });
        if (!cancelled) { setQr(url); setQrError(""); }
      } catch {
        if (!cancelled) { setQr(""); setQrError("This card holds too much data for a QR code. Shorten the note or remove a field."); }
      }
    })();
    return () => { cancelled = true; };
  }, [vcard]);

  function download() {
    const blob = new Blob([vcard], { type: "text/vcard;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = vcardFilename(c);
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  const large = vcard.length > 600;

  return (
    <div>
      <PrototypeBanner>Working prototype. Your card is generated in your browser and is never uploaded.</PrototypeBanner>
      <div className="grid gap-6 lg:grid-cols-2">
        <form className="card grid grid-cols-2 gap-4 p-5" onSubmit={(e) => e.preventDefault()} aria-label="Contact details">
          {fields.map((f) => (
            <div key={f.key} className={f.key === "title" || f.key === "org" || f.key === "email" || f.key === "website" ? "col-span-2" : ""}>
              <label className="label" htmlFor={`di-${f.key}`}>{f.label}</label>
              <input id={`di-${f.key}`} type={f.type || "text"} className="input" value={c[f.key] || ""} onChange={(e) => setC((p) => ({ ...p, [f.key]: e.target.value }))} />
            </div>
          ))}
          <div className="col-span-2">
            <label className="label" htmlFor="di-note">Note</label>
            <textarea id="di-note" rows={2} className="input" value={c.note || ""} onChange={(e) => setC((p) => ({ ...p, note: e.target.value }))} />
          </div>
        </form>

        <div className="space-y-4">
          <div className="card flex flex-col items-center gap-4 p-6 sm:flex-row">
            <div className="grid h-[160px] w-[160px] shrink-0 place-items-center rounded-xl bg-white p-2">
              {qr ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={qr} alt={`QR code containing the contact card for ${full || "this contact"}`} width={144} height={144} />
              ) : (
                <span className="px-2 text-center text-xs text-black">{qrError || "Generating QR code..."}</span>
              )}
            </div>
            <div className="min-w-0 text-center sm:text-left">
              <p className="text-xl font-bold">{full || "Your name"}</p>
              <p className="text-sm text-sage">{[c.title, c.org].filter(Boolean).join(" · ")}</p>
              <p className="mt-2 text-sm text-mute">{[c.email, c.phone].filter(Boolean).join(" · ")}</p>
              <p className="text-sm text-mute">{[c.city, c.country].filter(Boolean).join(", ")}</p>
            </div>
          </div>
          {large && !qrError ? <p className="text-xs text-amber-200">This card is getting large. Big QR codes are harder to scan; keep it short for best results.</p> : null}
          <div className="flex flex-wrap gap-3">
            <button type="button" className="btn btn-primary" onClick={download} disabled={!c.firstName.trim() && !c.lastName.trim()}>Download .vcf</button>
            <CopyButton text={vcard} label="Copy vCard text" />
          </div>
          <details className="card p-4">
            <summary className="cursor-pointer text-sm text-mute">View raw vCard</summary>
            <pre className="mt-3 overflow-x-auto font-mono text-xs leading-relaxed text-cream/80">{vcard}</pre>
          </details>
        </div>
      </div>
    </div>
  );
}
