import { useAuth } from "@/hooks/useAuth";
import { formatCurrency, getCurrencySymbol } from "@/lib/currency";

export const useCurrency = () => {
  const { user } = useAuth();

  const currencyCode = user?.currency || "USD";
  const currencySymbol = user?.currencySymbol || "$";
  const locale = user?.locale || "en-US";

  return {
    getSymbol: () => getCurrencySymbol(currencyCode, currencySymbol),
    format: (
      amount: number | string,
      options?: Parameters<typeof formatCurrency>[3]
    ) =>
      formatCurrency(amount, currencyCode, currencySymbol, {
        ...options,
        locale
      }),
    currencyCode,
    currencySymbol: currencySymbol || getCurrencySymbol(currencyCode)
  };
};
