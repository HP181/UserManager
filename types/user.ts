export interface User {
  _id: string
  username: string
  email: string
  phone: string
  address: string
  createdAt: string
  updatedAt: string
}

export interface UserFormData {
  username: string
  email: string
  phone: string
  address: string
}
