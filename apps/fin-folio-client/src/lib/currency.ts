/**
 * Currency code to symbol mapping
 * This is a fallback if currencySymbol is not provided from the API
 */
const CURRENCY_SYMBOL_MAP: Record<string, string> = {
  USD: "$",
  EUR: "€",
  GBP: "£",
  JPY: "¥",
  INR: "₹",
  AUD: "A$",
  CAD: "C$",
  CHF: "CHF",
  CNY: "¥",
  NZD: "NZ$",
  SEK: "kr",
  NOK: "kr",
  DKK: "kr",
  PLN: "zł",
  BRL: "R$",
  ZAR: "R",
  KRW: "₩",
  MXN: "$",
  SGD: "S$",
  HKD: "HK$",
  TRY: "₺",
  RUB: "₽"
};

/**
 * Get currency symbol from currency code or provided symbol
 * @param currencyCode - 3-letter currency code (e.g., 'USD', 'EUR')
 * @param currencySymbol - Optional symbol from API/User data
 * @returns Currency symbol string
 */
export function getCurrencySymbol(
  currencyCode?: string,
  currencySymbol?: string
): string {
  if (currencySymbol) {
    return currencySymbol;
  }

  if (currencyCode) {
    return CURRENCY_SYMBOL_MAP[currencyCode.toUpperCase()] || currencyCode;
  }

  return "$";
}

/**
 * Format amount with currency symbol
 * @param amount - Amount to format (number or string)
 * @param currencyCode - Optional currency code
 * @param currencySymbol - Optional currency symbol
 * @param options - Formatting options
 * @returns Formatted currency string (e.g., "$1,234.56")
 */
export function formatCurrency(
  amount: number | string,
  currencyCode?: string,
  currencySymbol?: string,
  options?: {
    showSymbol?: boolean;
    decimals?: number;
    locale?: string;
  }
): string {
  const { showSymbol = true, decimals = 2, locale = "en-US" } = options || {};

  const numAmount = typeof amount === "string" ? parseFloat(amount) : amount;

  if (isNaN(numAmount)) {
    return showSymbol
      ? `${getCurrencySymbol(currencyCode, currencySymbol)}0.00`
      : "0.00";
  }

  const formattedNumber = new Intl.NumberFormat(locale, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  }).format(numAmount);

  if (!showSymbol) {
    return formattedNumber;
  }

  const symbol = getCurrencySymbol(currencyCode, currencySymbol);
  return `${symbol}${formattedNumber}`;
}
