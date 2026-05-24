import fs from "fs";
import path from "path";

const DB_PATH = path.join(process.cwd(), "data", "db.json");

export interface DBUser {
  id: number;
  name: string;
  email: string;
  password: string;
  role: "student" | "employer" | "admin";
  is_approved: boolean;
  smu_id?: string;
  department?: string;
  gpa?: number;
  skills?: string[];
  bio?: string;
  graduation_year?: number;
  company_name?: string;
  company_sector?: string;
  company_description?: string;
  company_website?: string;
}

export interface DBJob {
  id: number;
  employer_id: number;
  title: string;
  description: string;
  requirements: string[];
  department: string;
  sector: string;
  job_type: string;
  salary_min?: number;
  salary_max?: number;
  location: string;
  is_approved: boolean;
  is_featured: boolean;
  created_at: string;
  company_name?: string;
  application_count?: number;
}

export interface DBApplication {
  id: number;
  student_id: number;
  job_id: number;
  status: "pending" | "reviewed" | "accepted" | "rejected";
  cover_letter: string;
  created_at: string;
  student_name?: string;
  student_email?: string;
  student_department?: string;
  student_gpa?: number;
  student_skills?: string[];
  student_bio?: string;
  student_smu_id?: string;
  job_title?: string;
  company_name?: string;
}

interface Database {
  users: DBUser[];
  jobs: DBJob[];
  applications: DBApplication[];
  nextIds: { user: number; job: number; application: number };
}

export function readDB(): Database {
  const raw = fs.readFileSync(DB_PATH, "utf-8");
  return JSON.parse(raw);
}

export function writeDB(db: Database): void {
  fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2));
}

export function findUserByEmail(email: string): DBUser | undefined {
  const db = readDB();
  return db.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
}

export function createUser(data: Omit<DBUser, "id">): DBUser {
  const db = readDB();
  const user: DBUser = { ...data, id: db.nextIds.user++ };
  db.users.push(user);
  writeDB(db);
  return user;
}

export function createApplication(data: Omit<DBApplication, "id">): DBApplication {
  const db = readDB();
  const app: DBApplication = { ...data, id: db.nextIds.application++ };
  db.applications.push(app);
  // increment job application count
  const job = db.jobs.find((j) => j.id === data.job_id);
  if (job) job.application_count = (job.application_count || 0) + 1;
  writeDB(db);
  return app;
}

export function getApplicationsByStudent(studentId: number): DBApplication[] {
  const db = readDB();
  return db.applications.filter((a) => a.student_id === studentId);
}

export function getApplicationsByJob(jobId: number): DBApplication[] {
  const db = readDB();
  return db.applications.filter((a) => a.job_id === jobId);
}

export function hasApplied(studentId: number, jobId: number): boolean {
  const db = readDB();
  return db.applications.some((a) => a.student_id === studentId && a.job_id === jobId);
}

export function getApprovedJobs(): DBJob[] {
  const db = readDB();
  return db.jobs.filter((j) => j.is_approved);
}

export function getAllJobs(): DBJob[] {
  return readDB().jobs;
}

export function getJobById(id: number): DBJob | undefined {
  return readDB().jobs.find((j) => j.id === id);
}

export function approveJob(id: number): void {
  const db = readDB();
  const job = db.jobs.find((j) => j.id === id);
  if (job) { job.is_approved = true; writeDB(db); }
}

export function rejectJob(id: number): void {
  const db = readDB();
  db.jobs = db.jobs.filter((j) => j.id !== id);
  writeDB(db);
}

export function approveUser(id: number): void {
  const db = readDB();
  const user = db.users.find((u) => u.id === id);
  if (user) { user.is_approved = true; writeDB(db); }
}

export function rejectUser(id: number): void {
  const db = readDB();
  db.users = db.users.filter((u) => u.id !== id);
  writeDB(db);
}

export function getAllUsers(): DBUser[] {
  return readDB().users;
}

export function createJob(data: Omit<DBJob, "id">): DBJob {
  const db = readDB();
  const job: DBJob = { ...data, id: db.nextIds.job++ };
  db.jobs.push(job);
  writeDB(db);
  return job;
}

export function updateApplicationStatus(appId: number, status: DBApplication["status"]): void {
  const db = readDB();
  const app = db.applications.find((a) => a.id === appId);
  if (app) { app.status = status; writeDB(db); }
}
