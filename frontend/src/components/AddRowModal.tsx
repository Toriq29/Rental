"use client"

import type React from "react"
import { useState } from "react"
import type { RentalData } from "../services/api"
import { X } from "lucide-react"

interface AddRowModalProps {
  onClose: () => void
  onSubmit: (data: Partial<RentalData>) => void
}

export const AddRowModal: React.FC<AddRowModalProps> = ({ onClose, onSubmit }) => {
  const [formData, setFormData] = useState<Partial<RentalData>>({
    nama_unit_kerja: "",
    kode_unit_kerja: "",
    kc_supervisi: "",
    lokasi: "",
    biaya_sewa: "",
    jangka_waktu: "",
    tanggal_awal_sewa: "",
    tanggal_akhir_sewa: "",
    state: "safe",
    notification: false,
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Clean up the data before sending - convert empty strings to null for optional fields
    const cleanedData: Partial<RentalData> = {
      nama_unit_kerja: formData.nama_unit_kerja || "",
      kode_unit_kerja: formData.kode_unit_kerja || "",
      kc_supervisi: formData.kc_supervisi || "",
      lokasi: formData.lokasi || "",
      biaya_sewa: formData.biaya_sewa || "",
      jangka_waktu: formData.jangka_waktu || "",
      tanggal_awal_sewa: formData.tanggal_awal_sewa || "",
      tanggal_akhir_sewa: formData.tanggal_akhir_sewa || "",
      state: "safe",
      notification: false,
    }

    onSubmit(cleanedData)
  }

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2 className="text-xl font-bold">Add New Rental Row</h2>
          <button onClick={onClose} className="modal-close">
            <X style={{ height: "1.25rem", width: "1.25rem" }} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="form-group">
              <label className="form-label">Nama Unit Kerja *</label>
              <input
                type="text"
                required
                className="input"
                value={formData.nama_unit_kerja || ""}
                onChange={(e) => handleChange("nama_unit_kerja", e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Kode Unit Kerja *</label>
              <input
                type="text"
                required
                className="input"
                value={formData.kode_unit_kerja || ""}
                onChange={(e) => handleChange("kode_unit_kerja", e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">KC Supervisi *</label>
              <input
                type="text"
                required
                className="input"
                value={formData.kc_supervisi || ""}
                onChange={(e) => handleChange("kc_supervisi", e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Lokasi *</label>
              <input
                type="text"
                required
                className="input"
                value={formData.lokasi || ""}
                onChange={(e) => handleChange("lokasi", e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Biaya Sewa</label>
              <input
                type="text"
                className="input"
                value={formData.biaya_sewa || ""}
                onChange={(e) => handleChange("biaya_sewa", e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Jangka Waktu/Tahun</label>
              <input
                type="number"
                className="input"
                value={formData.jangka_waktu || ""}
                onChange={(e) => handleChange("jangka_waktu", e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Tanggal Awal Sewa</label>
              <input
                type="number"
                className="input"
                value={formData.tanggal_awal_sewa || ""}
                onChange={(e) => handleChange("tanggal_awal_sewa", e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Tanggal Akhir Sewa</label>
              <input
                type="text"
                className="input"
                value={formData.tanggal_akhir_sewa || ""}
                onChange={(e) => handleChange("tanggal_akhir_sewa", e.target.value)}
              />
            </div>
          </div>
          <div className="form-actions">
            <button type="button" onClick={onClose} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Add Row
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}