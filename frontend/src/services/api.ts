import axios from "axios"

const API_BASE_URL = import.meta.env.VITE_API_URL

const api = axios.create({
  baseURL: API_BASE_URL,
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token")
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token")
      localStorage.removeItem("user")
      window.location.href = "/login"
    }
    return Promise.reject(error)
  }
)

export interface RentalData {

  id?: number
  nama_unit_kerja: string
  kode_unit_kerja: string
  kc_supervisi: string
  lokasi: string
  biaya_sewa: string
  jangka_waktu: string
  tanggal_awal_sewa: string
  tanggal_akhir_sewa: string
  state?: string | null
  notification?: boolean | null
}

export const authAPI = {
  login: (username: string, password: string) => api.post("/auth/login", new URLSearchParams({ username, password })),

  register: (username: string, password: string) => api.post("/auth/register", { username, password }),

  getAllData: () => api.get<RentalData[]>("/auth/data"),

  addRow: (data: Partial<RentalData>) => api.post("/auth/add-row", data),

  editCell: (kode_unit_kerja: string, lokasi: string, field: string, value: any) =>
    api.patch("/auth/edit-cell", null, {
      params: { kode_unit_kerja, lokasi, field, value },
    }),

  uploadPdf: (tid: string, lokasi: string, fileType: string, file: File) => {
    const formData = new FormData()
    formData.append("file", file)
    formData.append("file_type", fileType)
    return api.post(`/auth/upload-pdf?tid=${tid}&lokasi=${lokasi}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    })
  },

  batchDelete: (ids: number[]) => api.post("/auth/batch-delete", ids),
}

export const rentalAPI = {
  uploadAndCreate: (file: File) => {
    const formData = new FormData()
    formData.append("file", file)
    return api.post("/rental/upload/create", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    })
  },

  uploadAndUpdate: (file: File) => {
    const formData = new FormData()
    formData.append("file", file)
    return api.post("/rental/upload/update", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    })
  },
}

export default api
