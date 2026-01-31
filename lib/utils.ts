/**
 * Formats Indonesian Rupiah currency
 */
export function formatIdr(amount: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Formats IDR range (e.g., "Rp 800.000–900.000")
 */
export function formatIdrRange(min: number, max: number): string {
  const minFormatted = new Intl.NumberFormat("id-ID").format(min);
  const maxFormatted = new Intl.NumberFormat("id-ID").format(max);
  return `Rp ${minFormatted}–${maxFormatted}`;
}

/**
 * Formats confidence as percentage
 */
export function formatConfidence(confidence: number): string {
  return `${Math.round(confidence * 100)}%`;
}

/**
 * Formats date in Indonesian locale
 */
export function formatDate(isoString: string): string {
  const date = new Date(isoString);
  return new Intl.DateTimeFormat("id-ID", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}
