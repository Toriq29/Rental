import * as XLSX from "xlsx"
import type { RentalData } from "../services/api"

export const exportToExcel = (data: RentalData[], filename: string) => {
  // Format number to Rupiah
  const formatRupiah = (value: number | string | null | undefined) => {
    const num = typeof value === "number" ? value : parseFloat(value || "0")
    return isNaN(num) ? "" : `Rp. ${num.toLocaleString("id-ID")}`
  }

  // Prepare data for Excel export
  const excelData = data.map((row) => ({
    ID: row.id || "",
    "Nama Unit Kerja": row.nama_unit_kerja || "",
    "Kode Unit Kerja": row.kode_unit_kerja || "",
    "KC Supervisi": row.kc_supervisi || "",
    "Lokasi": row.lokasi || "",
    "Biaya Sewa": formatRupiah(row.biaya_sewa) || "",
    "Jangka Waktu": row.jangka_waktu || "",
    "Tanggal Awal Sewa": row.tanggal_awal_sewa || "",
    "Tanggal Akhir Sewa": row.tanggal_akhir_sewa || "",
    State: row.state || "",
    Notification: row.notification ? "Yes" : "No",
  }))

  // Create workbook and worksheet
  const workbook = XLSX.utils.book_new()
  const worksheet = XLSX.utils.json_to_sheet(excelData)

  // Set column widths
  const columnWidths = [
    { wch: 5 }, { wch: 15 }, { wch: 10 }, { wch: 15 },
    { wch: 20 }, { wch: 15 }, { wch: 18 }, { wch: 20 },
    { wch: 15 }, { wch: 12 }, { wch: 12 }, { wch: 20 },
    { wch: 20 }, { wch: 25 }, { wch: 15 }, { wch: 15 },
    { wch: 10 }, { wch: 12 }, { wch: 20 }, { wch: 20 },
    { wch: 20 }
  ]
  worksheet["!cols"] = columnWidths

  // Add worksheet to workbook
  XLSX.utils.book_append_sheet(workbook, worksheet, "Rental Data")

  // Save file
  XLSX.writeFile(workbook, `${filename}.xlsx`)
}
