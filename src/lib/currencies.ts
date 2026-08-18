export const CURRENCIES = {
  KES: { code: "KES", symbol: "KSh", name: "Kenyan Shilling", flag: "🇰🇪", locale: "en-KE" },
  UGX: { code: "UGX", symbol: "USh", name: "Ugandan Shilling", flag: "🇺🇬", locale: "en-UG" },
  TZS: { code: "TZS", symbol: "TSh", name: "Tanzanian Shilling", flag: "🇹🇿", locale: "en-TZ" },
  RWF: { code: "RWF", symbol: "FRw", name: "Rwandan Franc", flag: "🇷🇼", locale: "en-RW" },
  BIF: { code: "BIF", symbol: "FBu", name: "Burundian Franc", flag: "🇧🇮", locale: "fr-BI" },
  ETB: { code: "ETB", symbol: "Br", name: "Ethiopian Birr", flag: "🇪🇹", locale: "en-ET" },
  SSP: { code: "SSP", symbol: "SSP", name: "South Sudanese Pound", flag: "🇸🇸", locale: "en-SS" },
  USD: { code: "USD", symbol: "$", name: "US Dollar", flag: "🇺🇸", locale: "en-US" },
  EUR: { code: "EUR", symbol: "€", name: "Euro", flag: "🇪🇺", locale: "en-IE" },
  GBP: { code: "GBP", symbol: "£", name: "British Pound", flag: "🇬🇧", locale: "en-GB" },
  NGN: { code: "NGN", symbol: "₦", name: "Nigerian Naira", flag: "🇳🇬", locale: "en-NG" },
  ZAR: { code: "ZAR", symbol: "R", name: "South African Rand", flag: "🇿🇦", locale: "en-ZA" },
} as const;

export type CurrencyCode = keyof typeof CURRENCIES;

export function formatPrice(amount: number, currencyCode: CurrencyCode): string {
  const currency = CURRENCIES[currencyCode];
  if (!currency) return `${amount}`;

  // Use locale-aware formatting for proper thousands separators
  const formatted = new Intl.NumberFormat(currency.locale, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);

  return `${currency.symbol} ${formatted}`;
}

export function getCurrencyOptions() {
  return Object.values(CURRENCIES).map((c) => ({
    value: c.code,
    label: `${c.flag} ${c.code} — ${c.name}`,
    symbol: c.symbol,
  }));
}

// East African currencies shown first, then others alphabetically
export function getSortedCurrencyOptions() {
  const eastAfrican = ["KES", "UGX", "TZS", "RWF", "BIF", "ETB", "SSP"] as const;
  const international = ["USD", "EUR", "GBP", "NGN", "ZAR"] as const;

  return [
    { group: "East Africa", options: eastAfrican.map((code) => ({ value: code, label: `${CURRENCIES[code].flag} ${code} — ${CURRENCIES[code].name}`, symbol: CURRENCIES[code].symbol })) },
    { group: "International", options: international.map((code) => ({ value: code, label: `${CURRENCIES[code].flag} ${code} — ${CURRENCIES[code].name}`, symbol: CURRENCIES[code].symbol })) },
  ];
}
