import { NextResponse } from "next/server"
import DbConnection from "@/config/DbConnection"
import User from "@/components/models/User"
import mongoose from "mongoose"

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  await DbConnection()

  try {
    const { id } = await params

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ success: false, error: "Invalid user ID" }, { status: 400 })
    }

    const user = await User.findById(id).lean()

    if (!user) {
      return NextResponse.json({ success: false, error: "User not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true, user })
  } catch (error) {
    console.error("Error fetching user:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch user" }, { status: 500 })
  }
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  await DbConnection()

  try {
    const { id } = await params
    const body = await req.json()
    const { username, email, phone, address } = body

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ success: false, error: "Invalid user ID" }, { status: 400 })
    }

    if (!username || !email || !phone) {
      return NextResponse.json({ success: false, error: "Username, email, and phone are required" }, { status: 400 })
    }

    const updatedUser = await User.findByIdAndUpdate(
      id,
      { username, email, phone, address },
      { new: true, runValidators: true },
    )

    if (!updatedUser) {
      return NextResponse.json({ success: false, error: "User not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true, user: updatedUser })
  } catch (error: any) {
    console.error("Error updating user:", error)

    if (error.code === 11000) {
      return NextResponse.json({ success: false, error: "Email already exists" }, { status: 409 })
    }

    return NextResponse.json({ success: false, error: "Failed to update user" }, { status: 500 })
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  await DbConnection()

  try {
    const { id } = await params

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ success: false, error: "Invalid user ID" }, { status: 400 })
    }

    const deletedUser = await User.findByIdAndDelete(id)

    if (!deletedUser) {
      return NextResponse.json({ success: false, error: "User not found" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      message: "User deleted successfully",
      user: deletedUser,
    })
  } catch (error) {
    console.error("Error deleting user:", error)
    return NextResponse.json({ success: false, error: "Failed to delete user" }, { status: 500 })
  }
}
