import { NextResponse } from "next/server"
import DbConnection from "@/config/DbConnection"
import User from "@/components/models/User"

export async function GET() {
  await DbConnection()

  try {
    const users = await User.find().lean()
    return NextResponse.json({ success: true, users })
  } catch (error) {
    console.error("Error fetching users:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch users" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  await DbConnection()

  try {
    const body = await req.json()
    const { username, email, phone, address } = body

    if (!username || !email || !phone) {
      return NextResponse.json({ success: false, error: "Username, email, and phone are required" }, { status: 400 })
    }

    const newUser = await User.create({ username, email, phone, address })

    return NextResponse.json({ success: true, user: newUser }, { status: 201 })
  } catch (error: any) {
    console.error("Error creating user:", error)

    if (error.code === 11000) {
      return NextResponse.json({ success: false, error: "Email already exists" }, { status: 409 })
    }

    return NextResponse.json({ success: false, error: "Failed to create user" }, { status: 500 })
  }
}
