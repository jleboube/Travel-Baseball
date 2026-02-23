import { NextRequest, NextResponse } from "next/server"
import { getAuthUser } from "@/lib/auth-helper"
import { db } from "@/lib/db"
import { z } from "zod"

const eventSchema = z.object({
  title: z.string().min(1),
  type: z.enum(["PRACTICE", "GAME", "TOURNAMENT", "TEAM_MEETING", "FUNDRAISER", "OFF_DAY", "INDIVIDUAL_LESSON"]),
  start: z.string(),
  end: z.string(),
  allDay: z.boolean().optional(),
  location: z.string().nullable().optional(),
  locationUrl: z.string().nullable().optional(),
  description: z.string().nullable().optional(),
  color: z.string().nullable().optional(),
  opponent: z.string().nullable().optional(),
  governingBody: z.enum(["NA", "PBR", "USSSA", "JP_SPORTS", "PG", "GAMEDAY"]).optional(),
  requiresTravel: z.boolean().optional(),
  recurring: z.boolean().optional(),
  rrule: z.string().nullable().optional(),
  tournamentId: z.string().nullable().optional(),
})

export async function GET() {
  try {
    const events = await db.event.findMany({
      orderBy: { start: "asc" },
      include: {
        rsvps: true,
        tournament: true,
      },
    })

    return NextResponse.json(events)
  } catch (error) {
    console.error("Error fetching events:", error)
    return NextResponse.json(
      { error: "Failed to fetch events" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getAuthUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const validatedData = eventSchema.parse(body)

    const eventData = {
      title: validatedData.title,
      type: validatedData.type,
      start: new Date(validatedData.start),
      end: new Date(validatedData.end),
      allDay: validatedData.allDay || false,
      location: validatedData.location || null,
      locationUrl: validatedData.locationUrl || null,
      description: validatedData.description || null,
      color: validatedData.color || null,
      opponent: validatedData.opponent || null,
      governingBody: validatedData.governingBody || "NA",
      requiresTravel: validatedData.requiresTravel || false,
      recurring: validatedData.recurring || false,
      rrule: validatedData.rrule || null,
      tournamentId: validatedData.tournamentId || null,
    }

    const event = await db.event.create({
      data: eventData,
      include: {
        rsvps: true,
        tournament: true,
      },
    })

    return NextResponse.json(event, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid event data", details: error.errors },
        { status: 400 }
      )
    }
    console.error("Error creating event:", error)
    return NextResponse.json(
      { error: "Failed to create event", message: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    )
  }
}
