"use client"

import type React from "react"
import type { RentalData } from "../services/api"
import { FileLink } from "./FileLink"
import { EditableCell } from "./EditableCell"
import clsx from "clsx"

interface RentalTableProps {
  data: RentalData[]
  selectedRows: Set<number>
  onRowSelect: (id: number, checked: boolean) => void
  onSelectAll: (checked: boolean) => void
  onEditCell: (tid: string, lokasi: string, field: string, value: any) => void
  onFileUpload: (tid: string, lokasi: string, fileType: string, file: File) => void
}

export const RentalTable: React.FC<RentalTableProps> = ({
  data,
  selectedRows,
  onRowSelect,
  onSelectAll,
  onEditCell,
  onFileUpload,
}) => {
  const columns = [
    { key: "nama_unit_kerja", label: "Nama Unit Kerja" },
    { key: "kode_unit_kerja", label: "Kode Unit Kerja" },
    { key: "kc_supervisi", label: "KC Supervisi" },
    { key: "lokasi", label: "Lokasi" },
    { key: "biaya_sewa", label: "Biaya Sewa" },
    { key: "jangka_waktu", label: "Jangka Waktu" },
    { key: "tanggal_awal_sewa", label: "Tanggal Awal Sewa" },
    { key: "tanggal_akhir_sewa", label: "Tanggal Akhir Sewa" },
    { key: "state", label: "Kondisi" },
  ]

  const fileColumns = ["file_polis_asuransi_url", "file_pks_sewa_url", "file_sewa_kode_url"]
  const nonEditableColumns = ["harga_sewa_tahun", "total_harga_sewa_periode"]

  // Debug: Log the first few rows to see the data structure
  console.log("First 3 rows of data:", data.slice(0, 3))

  // Filter data to only include rows with valid IDs
  const validData = data.filter((row) => row.id !== undefined && row.id !== null)

  // Debug: Check if we have any valid data
  console.log("Valid data count:", validData.length, "Total data count:", data.length)
  console.log("Sample valid data:", validData.slice(0, 2))

  const allSelected = validData.length > 0 && validData.every((row) => selectedRows.has(row.id!))
  const someSelected = validData.some((row) => selectedRows.has(row.id!)) && !allSelected

  // Enhanced debug logs
  console.log("RentalTable - Data length:", data.length)
  console.log("RentalTable - Valid data length:", validData.length)
  console.log("RentalTable - Selected rows:", Array.from(selectedRows))
  console.log("RentalTable - All selected:", allSelected)
  console.log("RentalTable - Some selected:", someSelected)

  const handleSelectAllChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation()
    console.log("Header checkbox clicked:", e.target.checked)
    console.log("Valid data for selection:", validData.length)
    onSelectAll(e.target.checked)
  }

  const handleRowSelectChange = (e: React.ChangeEvent<HTMLInputElement>, rowId: number) => {
    e.stopPropagation()
    console.log("Row checkbox clicked:", rowId, e.target.checked)
    onRowSelect(rowId, e.target.checked)
  }

  // If no valid data, show a message
  if (data.length > 0 && validData.length === 0) {
    console.warn("No rows have valid IDs. Checkbox functionality will be disabled.")
  }

  // Format rupiah: 1000000000 -> Rp.1.000.000.000
  const formatCurrency = (value: number | string | null | undefined): string => {
    if (!value) return "-"
    const numValue = typeof value === "string" ? parseFloat(value) : value
    if (isNaN(numValue)) return "-"
    return "Rp." + new Intl.NumberFormat("id-ID").format(numValue)
  }

  // Format tanggal: 2024/06/13 00:00:00 -> 2024/06/13
  const formatDate = (value: string | null | undefined): string => {
    if (!value) return "-"
    // ambil hanya YYYY-MM-DD atau YYYY/MM/DD
    const match = value.match(/^\d{4}[-/]\d{2}[-/]\d{2}/)
    return match ? match[0].replace(/-/g, "/") : value
  }

  const dateColumns = ["tanggal_awal_sewa", "tanggal_akhir_sewa"]

  return (
    <div className="table-container">
      <table className="table">
        <thead>
          <tr>
            <th className="checkbox-header">
              <input
                type="checkbox"
                checked={allSelected}
                ref={(input) => {
                  if (input) input.indeterminate = someSelected
                }}
                onChange={handleSelectAllChange}
                className="checkbox"
                disabled={validData.length === 0}
                style={{
                  pointerEvents: "auto",
                  cursor: validData.length > 0 ? "pointer" : "not-allowed",
                }}
                title={validData.length === 0 ? "No selectable rows" : "Select all rows"}
              />
            </th>
            {columns.map((column) => (
              <th key={column.key}>{column.label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => {
            const isSelected = row.id ? selectedRows.has(row.id) : false
            const hasValidId = row.id !== undefined && row.id !== null

            // Enhanced logging for debugging
            if (index < 5) {
              // Only log first 5 rows to avoid spam
              console.log(
                `Row ${index}: TID=${row.kode_unit_kerja}, ID=${row.id}, HasValidId=${hasValidId}, Selected=${isSelected}`,
              )
            }

            return (
              <tr
                key={`${row.kode_unit_kerja}-${row.lokasi}-${row.id || index}`}
                data-row-id={`${row.kode_unit_kerja}-${row.lokasi}`}
                className={clsx({
                  "warning-row": row.state === "warning",
                  "selected-row": hasValidId && selectedRows.has(row.id!),
                })}
              >
                <td className="checkbox-cell">
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={(e) => {
                      e.stopPropagation()
                      if (hasValidId) {
                        handleRowSelectChange(e, row.id!)
                      } else {
                        console.warn(`Row with TID ${row.kode_unit_kerja} has no valid ID`)
                      }
                    }}
                    className="checkbox"
                    disabled={!hasValidId}
                    style={{
                      pointerEvents: "auto",
                      cursor: hasValidId ? "pointer" : "not-allowed",
                    }}
                    title={hasValidId ? "Select this row" : "Row has no valid ID"}
                  />
                </td>
                {columns.map((column) => (
                  <td key={column.key} className="relative">
                    {fileColumns.includes(column.key) ? (
                      <FileLink
                        tid={row.kode_unit_kerja}
                        lokasi={row.lokasi}
                        fileType={column.key.replace("file_", "").replace("_url", "")}
                        fileUrl={row[column.key as keyof RentalData] as string}
                        fileName={row[`${column.key.replace("_url", "_name")}` as keyof RentalData] as string}
                        onUpload={onFileUpload}
                      />
                    ) : nonEditableColumns.includes(column.key) ? (
                      <div className="non-editable-cell" title="Non-editable field">
                        {row[column.key as keyof RentalData] || "-"}
                      </div>
                    ) : (
                      <EditableCell
                        value={row[column.key as keyof RentalData] as string}
                        onSave={(value) => onEditCell(row.kode_unit_kerja, row.lokasi, column.key, value)}
                        type={column.key.includes("harga") ? "number" : "text"}
                      />
                    )}
                  </td>
                ))}
              </tr>
            )
          })}
        </tbody>
      </table>

      {/* Debug info */}
      {data.length > 0 && validData.length === 0 && (
        <div className="alert alert-yellow mt-4">
          <p className="text-sm">
            <strong>Note:</strong> No rows have valid IDs. Checkbox selection is disabled. This might indicate a backend
            issue where the 'id' field is not being returned properly.
          </p>
        </div>
      )}
    </div>
  )
}
