export type ContactCard = {
  firstName: string;
  lastName: string;
  title?: string;
  org?: string;
  phone?: string;
  email?: string;
  website?: string;
  city?: string;
  country?: string;
  note?: string;
};

/** Escape a value for a vCard text field (RFC 2426 section 4). */
export const escapeVCard = (v: string) =>
  v.replace(/\\/g, "\\\\").replace(/\r?\n/g, "\\n").replace(/,/g, "\\,").replace(/;/g, "\\;");

/** Fold lines longer than 75 characters; continuation lines start with one space. */
export function foldLine(line: string): string {
  const out: string[] = [];
  let rest = line;
  while (rest.length > 75) {
    out.push(rest.slice(0, 75));
    rest = " " + rest.slice(75);
  }
  out.push(rest);
  return out.join("\r\n");
}

export function buildVCard(c: ContactCard): string {
  const first = c.firstName.trim();
  const last = c.lastName.trim();
  const full = [first, last].filter(Boolean).join(" ");
  const lines = ["BEGIN:VCARD", "VERSION:3.0", `N:${escapeVCard(last)};${escapeVCard(first)};;;`, `FN:${escapeVCard(full)}`];
  const add = (key: string, value?: string) => {
    if (value && value.trim()) lines.push(`${key}:${escapeVCard(value.trim())}`);
  };
  add("ORG", c.org);
  add("TITLE", c.title);
  add("TEL;TYPE=CELL", c.phone);
  add("EMAIL;TYPE=INTERNET", c.email);
  // URLs are not comma/semicolon escaped in vCard 3.0
  if (c.website && c.website.trim()) lines.push(`URL:${c.website.trim()}`);
  if ((c.city && c.city.trim()) || (c.country && c.country.trim())) {
    lines.push(`ADR;TYPE=WORK:;;;${escapeVCard((c.city || "").trim())};;;${escapeVCard((c.country || "").trim())}`);
  }
  add("NOTE", c.note);
  lines.push("END:VCARD");
  return lines.map(foldLine).join("\r\n") + "\r\n";
}

export const vcardFilename = (c: ContactCard) =>
  ([c.firstName, c.lastName].filter(Boolean).join("-").toLowerCase().replace(/[^a-z0-9-]+/g, "") || "contact") + ".vcf";
