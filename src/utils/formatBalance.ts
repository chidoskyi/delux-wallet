export const formatBalance = (
  balance: string,
  symbol: string,
  decimals: number
): string => {
  const num = Number(balance);

  // Define decimal rules per cryptocurrency (like Trust Wallet)
  let displayDecimals: number;

  switch (symbol) {
    case "BTC":
      displayDecimals = num >= 1 ? 6 : 8; // 1.123456 or 0.00000001
      break;
    case "ETH":
      displayDecimals = num >= 1 ? 4 : 6; // 1.1234 or 0.000001
      break;
    default:
      // For other tokens (e.g., USDT), use 2 decimals if balance >= 1, else 6
      displayDecimals = num >= 1 ? 2 : 6;
  }

  // Format the number (trim trailing zeros)
  let formatted = num.toLocaleString(undefined, {
    minimumFractionDigits: 0,
    maximumFractionDigits: displayDecimals,
  });

  // Remove unnecessary trailing zeros (e.g., "0.000" → "0")
  if (formatted.includes(".")) {
    formatted = formatted.replace(/\.?0+$/, "");
  }

  return `${formatted} ${symbol}`;
};
