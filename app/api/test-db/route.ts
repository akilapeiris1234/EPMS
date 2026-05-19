import { NextResponse } from "next/server";
import { getConnection } from "@/lib/db";

export async function GET() {
  try {
    const db = await getConnection();

    const [rows] = await db.query("SELECT 1 AS connected");

    return NextResponse.json({
      success: true,
      message: "MySQL connected successfully",
      data: rows,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json({
      success: false,
      message: "Database connection failed",
      error: String(error),
    });
  }
}