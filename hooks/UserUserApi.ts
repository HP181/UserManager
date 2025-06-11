"use client"

import { useState } from "react"
import { toast } from "sonner"
import type { User, UserFormData } from "@/types/user"

export function useUserApi() {
  const [loading, setLoading] = useState(false)

  const fetchUsers = async (): Promise<User[]> => {
    setLoading(true)
    try {
      const response = await fetch("/api/user")
      const data = await response.json()

      if (data.success) {
        return data.users
      } else {
        toast.error("Failed to fetch users")
        return []
      }
    } catch (error) {
      toast.error("Network error occurred")
      return []
    } finally {
      setLoading(false)
    }
  }

  const createUser = async (userData: UserFormData): Promise<boolean> => {
    setLoading(true)
    try {
      const response = await fetch("/api/user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      })

      const data = await response.json()

      if (data.success) {
        toast.success("User created successfully")
        return true
      } else {
        toast.error(data.error || "Failed to create user")
        return false
      }
    } catch (error) {
      toast.error("Network error occurred")
      return false
    } finally {
      setLoading(false)
    }
  }

  const updateUser = async (userId: string, userData: UserFormData): Promise<boolean> => {
    setLoading(true)
    try {
      const response = await fetch(`/api/user/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      })

      const data = await response.json()

      if (data.success) {
        toast.success("User updated successfully")
        return true
      } else {
        toast.error(data.error || "Failed to update user")
        return false
      }
    } catch (error) {
      toast.error("Network error occurred")
      return false
    } finally {
      setLoading(false)
    }
  }

  const deleteUser = async (userId: string): Promise<boolean> => {
    if (!confirm("Are you sure you want to delete this user?")) return false

    setLoading(true)
    try {
      const response = await fetch(`/api/user/${userId}`, {
        method: "DELETE",
      })

      const data = await response.json()

      if (data.success) {
        toast.success("User deleted successfully")
        return true
      } else {
        toast.error(data.error || "Failed to delete user")
        return false
      }
    } catch (error) {
      toast.error("Network error occurred")
      return false
    } finally {
      setLoading(false)
    }
  }

  return {
    loading,
    fetchUsers,
    createUser,
    updateUser,
    deleteUser,
  }
}
