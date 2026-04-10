import { format } from "date-fns";

export function formatCurrency(amount: number, currency: string): string {
  const symbols: Record<string, string> = { GBP: "£", EUR: "€", INR: "₹", USD: "$" };
  const symbol = symbols[currency] || currency + " ";
  return `${symbol}${amount.toLocaleString("en-GB", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export function formatDate(date: string | Date): string {
  return format(new Date(date), "yyyy-MM-dd");
}

export function formatDateLong(date: string | Date): string {
  return format(new Date(date), "d MMM yyyy, HH:mm");
}
