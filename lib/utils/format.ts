const SAP_NULL_DATE = '1899-11-30'

export function formatSAPDate(iso: string): string {
  if (!iso || iso.startsWith(SAP_NULL_DATE)) return '—'
  return new Date(iso).toLocaleDateString('en-GB', {
    day: '2-digit', month: 'short', year: 'numeric',
  })
}

export function formatAmount(amount: string, currency: string): string {
  const num = parseFloat(amount)
  if (isNaN(num)) return '—'
  try {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: currency || 'GBP',
      minimumFractionDigits: 2,
    }).format(num)
  } catch {
    return `${currency} ${num.toLocaleString('en-GB', { minimumFractionDigits: 2 })}`
  }
}

export function formatQty(qty: string): string {
  const num = parseFloat(qty)
  return isNaN(num) ? '—' : num.toLocaleString()
}
