"use client";

import Link from "next/link";
import { Job, Student, calculateMatchScore, formatSalary } from "@/lib/smu-utils";
import { MatchScore } from "./match-score";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Building2, MapPin, Clock, Star, Users, Briefcase } from "lucide-react";

interface JobCardProps {
  job: Job;
  student?: Student | null;
  showMatchScore?: boolean;
}

export function JobCard({ job, student, showMatchScore = true }: JobCardProps) {
  const matchBreakdown = student
    ? calculateMatchScore(student, job)
    : null;

  const jobTypeLabels = {
    internship: "Internship",
    full_time: "Full-Time",
    part_time: "Part-Time",
  };

  return (
    <Link href={`/jobs/${job.id}`}>
      <Card
        className={`group relative overflow-hidden border-2 p-6 transition-all duration-700 rounded-sm ${
          job.is_featured
            ? "border-primary/40 bg-primary/[0.03] shadow-[0_10px_40px_-15px_rgba(191,155,48,0.2)]"
            : "border-white/5 bg-card/40 backdrop-blur-sm hover:border-primary/40 hover:bg-primary/[0.02]"
        }`}
      >
        {/* Featured Badge */}
        {job.is_featured && (
          <div className="absolute right-0 top-0">
            <div className="bg-primary px-4 py-1.5 text-[9px] font-bold uppercase tracking-[0.2em] text-background flex items-center gap-2 shadow-xl">
              <Star className="h-3 w-3 fill-current" />
              Institutional Partner
            </div>
          </div>
        )}

        <div className="flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex-1 space-y-5">
            {/* Title & Company */}
            <div>
              <h3 className="text-2xl font-serif font-bold text-white transition-all duration-500 group-hover:text-primary tracking-tight">
                {job.title}
              </h3>
              <div className="mt-3 flex flex-wrap items-center gap-x-6 gap-y-2 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
                <span className="flex items-center gap-2 text-primary/80">
                  <Building2 className="h-4 w-4" />
                  {job.company_name}
                </span>
                <span className="flex items-center gap-2 opacity-60">
                  <MapPin className="h-4 w-4" />
                  {job.location}
                </span>
              </div>
            </div>

            {/* Badges */}
            <div className="flex flex-wrap gap-3">
              <Badge variant="outline" className="rounded-sm border border-white/10 bg-white/5 text-white/60 font-bold uppercase text-[9px] tracking-widest px-3 py-1">{job.sector}</Badge>
              <Badge variant="secondary" className="rounded-sm bg-white/5 text-white/80 font-bold uppercase text-[9px] tracking-widest px-3 py-1 border border-white/5">{jobTypeLabels[job.job_type]}</Badge>
              <Badge variant="secondary" className="bg-primary/10 text-primary border border-primary/20 rounded-sm font-bold uppercase text-[9px] tracking-widest px-3 py-1">
                {job.department}
              </Badge>
            </div>

            {/* Salary & Stats */}
            <div className="flex flex-wrap items-center gap-8 pt-4 text-[10px] font-bold uppercase tracking-[0.2em] text-white/30 border-t border-white/5">
              <span className="text-primary flex items-center gap-2">
                <Briefcase className="h-3.5 w-3.5" />
                {formatSalary(job.salary_min, job.salary_max)}
              </span>
              {job.application_count !== undefined && (
                <span className="flex items-center gap-2 hover:text-white transition-colors duration-500">
                  <Users className="h-4 w-4" />
                  {job.application_count} Candidates
                </span>
              )}
              <span className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Posted {new Date(job.created_at).toLocaleDateString()}
              </span>
            </div>
          </div>

          {/* Match Score */}
          {showMatchScore && matchBreakdown && (
            <div className="flex-shrink-0 sm:ml-6 bg-black/40 p-4 rounded-sm border border-white/10 group-hover:border-primary/40 transition-all duration-700 shadow-2xl">
              <MatchScore score={matchBreakdown.total} size="md" showLabel />
              <p className="text-[8px] font-bold uppercase tracking-[0.3em] text-center mt-3 text-primary/40">Academic Match</p>
            </div>
          )}
        </div>
      </Card>
    </Link>
  );
}


