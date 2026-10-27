export type FormattedItemKind =
  | 'group_header'
  | 'definition'
  | 'callout'
  | 'numbered'
  | 'bullet';

export type CalloutTone = 'definition' | 'rule' | 'exception' | 'formula' | 'doctrine' | 'note' | 'concept';

export interface SubClauseItem {
  marker: string;
  text: string;
}

export interface FormattedModuleItem {
  kind: FormattedItemKind;
  tone: CalloutTone;
  number?: number;
  badgeLabel?: string;
  title?: string;
  body: string;
  subClauses?: SubClauseItem[];
}

/**
 * Cleanly strips leading bullet glyphs or "Bar Tip:" prefixes while preserving real text.
 */
export function cleanRuleText(raw: string): string {
  if (!raw) return '';
  return raw
    .replace(/^\s*[•\-\*▪▫►]\s*/, '')
    .replace(/^Bar Tip:\s*/i, '')
    .trim();
}

/**
 * Splits inline enumerations like "(1) First; (2) Second" or "(a) First; (b) Second" into structured sub-clauses.
 */
export function extractInlineSubClauses(text: string): { leadIn: string; subClauses: SubClauseItem[] } | null {
  if (!text) return null;

  // Check if string has at least two inline parenthesized markers: (1)...(2) or (a)...(b)
  const hasNumericPair = /\(1\)\s+\S/.test(text) && /\(2\)\s+\S/.test(text);
  const hasAlphaPair = /\(a\)\s+\S/i.test(text) && /\(b\)\s+\S/i.test(text);

  if (!hasNumericPair && !hasAlphaPair) {
    return null;
  }

  const markerPattern = hasNumericPair ? /\((\d+)\)\s*/g : /\(([a-z])\)\s*/gi;
  const matches = Array.from(text.matchAll(markerPattern));
  if (matches.length < 2 || matches[0].index === undefined) {
    return null;
  }

  const leadInRaw = text.slice(0, matches[0].index).trim();
  const leadIn = leadInRaw.replace(/[:;\s]+$/, '').trim();

  const subClauses: SubClauseItem[] = [];
  for (let i = 0; i < matches.length; i++) {
    const m = matches[i];
    const start = (m.index ?? 0) + m[0].length;
    const end = i + 1 < matches.length ? (matches[i + 1].index ?? text.length) : text.length;
    const rawSegment = text
      .slice(start, end)
      .replace(/^\s*[,;]\s*/, '')
      .replace(/\s*(?:;\s*(?:and|or)\s*|;\s*|\.\s*)$/i, '')
      .trim();

    if (rawSegment) {
      subClauses.push({
        marker: m[1],
        text: rawSegment.endsWith('.') ? rawSegment : `${rawSegment}.`,
      });
    }
  }

  if (subClauses.length < 2) return null;
  return { leadIn: leadIn ? `${leadIn}:` : '', subClauses };
}

function detectCalloutTone(label: string): { isDefinition: boolean; tone: CalloutTone; badge: string } {
  const lower = label.toLowerCase();

  if (
    /\b(definition|meaning|concept)\b/.test(lower) ||
    lower === 'kasambahay' ||
    lower === 'wage' ||
    lower === 'salary'
  ) {
    return { isDefinition: true, tone: 'definition', badge: 'DEFINITION' };
  }

  if (/\b(exception|excluded|exclusion|exemption|prohibited|ban|unlawful)\b/.test(lower)) {
    return { isDefinition: false, tone: 'exception', badge: 'EXCEPTION / LIMIT' };
  }

  if (/\b(formula|rate|rates|ratio|threshold|duration|maximum limits|schedule)\b/.test(lower)) {
    return { isDefinition: false, tone: 'formula', badge: 'STANDARD / RATE' };
  }

  if (/\b(general rule|general principle|general limit|general mandate|mandate|core doctrine|rule)\b/.test(lower)) {
    return { isDefinition: false, tone: 'rule', badge: 'GENERAL RULE' };
  }

  if (/\b(doctrine|test|presumption|rationale|validity|controlling factor|inquiry|proof|burden)\b/.test(lower)) {
    return { isDefinition: false, tone: 'doctrine', badge: 'DOCTRINE / TEST' };
  }

  if (/\b(note|critical conclusion|synthesis)\b/.test(lower)) {
    return { isDefinition: false, tone: 'note', badge: 'KEY NOTE' };
  }

  return { isDefinition: false, tone: 'concept', badge: 'PROVISION' };
}

/**
 * Intelligently classifies every item in a module's `rule.items` array so that:
 * - Only genuinely numbered items (`1. ...`, `2. ...`) receive sequential numeric badges.
 * - Definitions (`Definition: ...`, `Working Conditions Definition: ...`, `Child Definition: ...`) NEVER get numbered.
 * - Group headers ending in `:` (`5 Exclusions...:`, `Working Hours Matrix:`) render as unnumbered section dividers.
 * - Named rules/exceptions/doctrines (`General Rule: ...`, `Exception: ...`) render as unnumbered semantic callouts.
 * - Bullet/prose items render with clean unnumbered markers.
 */
export function formatModuleRuleItems(items: readonly string[]): FormattedModuleItem[] {
  const results: FormattedModuleItem[] = [];

  for (const raw of items) {
    if (!raw || !raw.trim()) continue;
    const trimmed = raw.trim();

    // 1. Group / Section Header ending in ':' with no body (e.g., "5 Exclusions from Equal Work for Equal Pay:")
    if (/^[^:]{3,110}:\s*$/.test(trimmed) && !/^\d+[\.\)]/.test(trimmed)) {
      results.push({
        kind: 'group_header',
        tone: 'rule',
        body: trimmed.replace(/:\s*$/, ''),
      });
      continue;
    }

    // 2. Explicitly numbered item: "1. Overtime Pay..." or "2) ..."
    const numberedMatch = trimmed.match(/^(\d+)[\.\)]\s*(?:[•\-\*▪▫►]\s*)?(.+)$/);
    if (numberedMatch) {
      const itemNum = parseInt(numberedMatch[1], 10);
      const rest = numberedMatch[2].trim();

      // Check if numbered item has a bold title prefix: "1. Managerial Employees: Vested with..."
      const titleSplit = rest.match(/^([^:]{2,55}):\s+(.+)$/);
      const bodyToCheck = titleSplit ? titleSplit[2] : rest;
      const inline = extractInlineSubClauses(bodyToCheck);

      results.push({
        kind: 'numbered',
        tone: 'rule',
        number: itemNum,
        title: titleSplit ? titleSplit[1].trim() : undefined,
        body: inline ? inline.leadIn : bodyToCheck,
        subClauses: inline?.subClauses,
      });
      continue;
    }

    // 3. Explicit bullet prefix: "• Below 15 years old: ..."
    const isExplicitBullet = /^\s*[•\-\*▪▫►]\s+/.test(trimmed);
    const cleaned = cleanRuleText(trimmed);

    // 4. Key-Value / Definition / Named Rule item: "Definition: Work exceeding..." or "General Rule: ..."
    const kvMatch = cleaned.match(/^([^:]{2,64}):\s+(.+)$/);
    if (kvMatch && !isExplicitBullet) {
      const label = kvMatch[1].trim();
      const value = kvMatch[2].trim();
      const { isDefinition, tone, badge } = detectCalloutTone(label);
      const inline = extractInlineSubClauses(value);

      // Strip redundant word "Definition" from display title if badge already says DEFINITION, or keep clean term
      const cleanTitle = isDefinition
        ? label.replace(/\s*\bDefinition\b\s*/i, ' ').replace(/\s+/g, ' ').trim() || 'Statutory Definition'
        : label;

      results.push({
        kind: isDefinition ? 'definition' : 'callout',
        tone,
        badgeLabel: badge,
        title: cleanTitle,
        body: inline ? inline.leadIn : value,
        subClauses: inline?.subClauses,
      });
      continue;
    }

    // 5. Explicit bullet with optional bold prefix (e.g., "• Below 15 years old: Maximum 4 hours...")
    if (isExplicitBullet && kvMatch) {
      const inline = extractInlineSubClauses(kvMatch[2].trim());
      results.push({
        kind: 'bullet',
        tone: 'concept',
        title: kvMatch[1].trim(),
        body: inline ? inline.leadIn : kvMatch[2].trim(),
        subClauses: inline?.subClauses,
      });
      continue;
    }

    // 6. Plain unnumbered prose / bullet statement
    const inline = extractInlineSubClauses(cleaned);
    results.push({
      kind: 'bullet',
      tone: 'concept',
      body: inline ? inline.leadIn : cleaned,
      subClauses: inline?.subClauses,
    });
  }

  return results;
}
