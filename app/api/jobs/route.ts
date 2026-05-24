import { NextRequest, NextResponse } from "next/server";
import { getApprovedJobs, getAllJobs, getJobById, createJob, approveJob, rejectJob } from "@/lib/db";

export async function GET(req: NextRequest) {
  const all = req.nextUrl.searchParams.get("all");
  const id = req.nextUrl.searchParams.get("id");

  if (id) {
    const job = getJobById(parseInt(id));
    if (!job) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(job);
  }

  const jobs = all === "true" ? getAllJobs() : getApprovedJobs();
  return NextResponse.json(jobs);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const job = createJob({
      ...body,
      is_approved: false,
      is_featured: false,
      created_at: new Date().toISOString(),
      application_count: 0,
    });
    return NextResponse.json({ success: true, job }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const { id, action } = await req.json();
    if (action === "approve") approveJob(id);
    else if (action === "reject") rejectJob(id);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
