export const formatCurrency = (value: number | string | null | undefined): string => {
  if (!value || value === "" || value === 0) return "-"

  let numValue: number
  if (typeof value === "string") {
    // buang simbol selain angka, minus, titik
    const cleanValue = value.replace(/[^\d.-]/g, "")
    numValue = Number.parseFloat(cleanValue)
  } else {
    numValue = value
  }

  if (isNaN(numValue)) return "-"

  // Format angka dulu
  const formatted = new Intl.NumberFormat("id-ID", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(numValue)

  // Tambahkan "Rp." dengan titik
  return `Rp.${formatted}`
}

export const formatDate = (value: string | null | undefined): string => {
  if (!value) return "-"
  return value.split(" ")[0] // ambil hanya bagian YYYY/MM/DD
}