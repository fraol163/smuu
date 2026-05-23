// SMU ID validation and department detection

export const DEPT_MAP: Record<string, string> = {
  RCD: "Computer Science",
  ECD: "Computer Science",
  RMD: "Marketing",
  EMD: "Marketing",
  RAD: "Accounting",
  EAD: "Accounting",
  RTD: "Tourism",
  ETD: "Tourism",
  RED: "Economics",
  EED: "Economics",
};

// Related department groups for matching
export const RELATED_DEPARTMENTS: Record<string, string[]> = {
  "Computer Science": ["Economics"],
  Economics: ["Computer Science"],
  Marketing: ["Accounting", "Tourism"],
  Accounting: ["Marketing", "Tourism"],
  Tourism: ["Marketing", "Accounting"],
};

// Validate SMU ID format: [R/E][A-Z]D/####/####
export function validateSmuId(id: string): boolean {
  const pattern = /^[RE][A-Z]D\/\d{4}\/\d{4}$/;
  return pattern.test(id);
}

// Extract department from SMU ID
export function getDepartmentFromId(id: string): string | null {
  if (!validateSmuId(id)) return null;
  const prefix = id.substring(0, 3);
  return DEPT_MAP[prefix] || null;
}

// Check if ID is for extension program
export function isExtensionStudent(id: string): boolean {
  if (!validateSmuId(id)) return false;
  return id.startsWith("E");
}

// Extract year from SMU ID
export function getYearFromId(id: string): number | null {
  if (!validateSmuId(id)) return null;
  const parts = id.split("/");
  return parseInt(parts[2], 10);
}

export interface Student {
  id: number;
  name: string;
  email: string;
  smu_id: string;
  department: string;
  gpa: number;
  skills: string[];
  bio: string;
  graduation_year: number;
  is_approved: boolean;
}

export interface Job {
  id: number;
  employer_id: number;
  title: string;
  description: string;
  requirements: string[];
  department: string;
  sector: string;
  job_type: "internship" | "full_time" | "part_time";
  salary_min?: number;
  salary_max?: number;
  location: string;
  is_approved: boolean;
  is_featured: boolean;
  created_at: string;
  company_name?: string;
  application_count?: number;
}

export interface MatchBreakdown {
  department: number;
  skills: number;
  jobType: number;
  total: number;
}

// Calculate match score between a student and a job
export function calculateMatchScore(
  student: Student,
  job: Job
): MatchBreakdown {
  let departmentScore = 0;
  let skillsScore = 0;
  let jobTypeScore = 0;

  // Department match (50% weight)
  if (student.department === job.department) {
    departmentScore = 50;
  } else if (RELATED_DEPARTMENTS[student.department]?.includes(job.department)) {
    departmentScore = 25;
  }

  // Skills match (30% weight)
  if (job.requirements && job.requirements.length > 0) {
    const studentSkillsLower = student.skills.map((s) => s.toLowerCase());
    const matchingSkills = job.requirements.filter((req) =>
      studentSkillsLower.includes(req.toLowerCase())
    );
    skillsScore = Math.round((matchingSkills.length / job.requirements.length) * 30);
  } else {
    skillsScore = 15; // Default half if no requirements listed
  }

  // Job type match (20% weight)
  const currentYear = new Date().getFullYear();
  const isGraduate = student.graduation_year <= currentYear;

  if (isGraduate && job.job_type === "full_time") {
    jobTypeScore = 20;
  } else if (!isGraduate && job.job_type === "internship") {
    jobTypeScore = 20;
  } else {
    jobTypeScore = 8; // Partial match
  }

  const total = departmentScore + skillsScore + jobTypeScore;

  return {
    department: departmentScore,
    skills: skillsScore,
    jobType: jobTypeScore,
    total,
  };
}

// Get match label based on score
export function getMatchLabel(score: number): "strong" | "partial" | "low" {
  if (score >= 70) return "strong";
  if (score >= 40) return "partial";
  return "low";
}

// Get match color based on score
export function getMatchColor(score: number): string {
  if (score >= 70) return "text-primary";
  if (score >= 40) return "text-warning";
  return "text-destructive";
}

// Format salary range
export function formatSalary(min?: number, max?: number): string {
  if (!min && !max) return "Negotiable";
  if (min && max) {
    return `${min.toLocaleString()} - ${max.toLocaleString()} ETB`;
  }
  if (min) return `From ${min.toLocaleString()} ETB`;
  if (max) return `Up to ${max.toLocaleString()} ETB`;
  return "Negotiable";
}

// Parse skills from comma-separated string
export function parseSkills(skillsString: string): string[] {
  return skillsString
    .split(",")
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
}
