"use client";

import { useState } from "react";
import Link from "next/link";
import { TranslationProvider, useTranslation } from "@/lib/translations";
import { AuthProvider, useAuth } from "@/lib/auth-context";
import { MOCK_JOBS } from "@/lib/mock-data";
import { Student, calculateMatchScore } from "@/lib/smu-utils";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { JobCard } from "@/components/job-card";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, Briefcase } from "lucide-react";

function JobsPageContent() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState<string>("all");
  const [jobTypeFilter, setJobTypeFilter] = useState<string>("all");
  const [sectorFilter, setSectorFilter] = useState<string>("all");

  // Create student profile if logged in as student
  const studentProfile: Student | null =
    user && user.role === "student"
      ? {
          id: user.id,
          name: user.name,
          email: user.email,
          smu_id: user.smu_id || "",
          department: user.department || "",
          gpa: user.gpa || 0,
          skills: user.skills || [],
          bio: user.bio || "",
          graduation_year: user.graduation_year || new Date().getFullYear(),
          is_approved: user.is_approved,
        }
      : null;

  // Filter approved jobs
  const approvedJobs = MOCK_JOBS.filter((job) => job.is_approved);
  const filteredJobs = approvedJobs
    .filter((job) => {
      const matchesSearch =
        searchQuery === "" ||
        job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.company_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesDepartment =
        departmentFilter === "all" || job.department === departmentFilter;
      const matchesJobType =
        jobTypeFilter === "all" || job.job_type === jobTypeFilter;
      const matchesSector =
        sectorFilter === "all" || job.sector === sectorFilter;
      return matchesSearch && matchesDepartment && matchesJobType && matchesSector;
    })
    .map((job) => ({
      ...job,
      matchScore: studentProfile ? calculateMatchScore(studentProfile, job).total : 0,
    }))
    .sort((a, b) => {
      // Featured first, then by match score (if student) or date
      if (a.is_featured && !b.is_featured) return -1;
      if (!a.is_featured && b.is_featured) return 1;
      if (studentProfile) {
        return b.matchScore - a.matchScore;
      }
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });

  const departments = ["Computer Science", "Marketing", "Accounting", "Tourism", "Economics"];
  const jobTypes = [
    { value: "internship", label: "Internship" },
    { value: "full_time", label: "Full-Time" },
    { value: "part_time", label: "Part-Time" },
  ];
  const sectors = ["Technology", "Banking & Finance", "NGO", "Telecom", "Government"];

  return (
    <div className="flex min-h-screen flex-col bg-grain">
      <Navbar />
      <main className="flex-1 pb-24 pt-32 bg-grid-subtle">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-12">
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-foreground tracking-tight">{t("nav.jobs")}</h1>
            <p className="mt-4 text-lg text-muted-foreground leading-relaxed border-l-2 border-primary pl-6 py-1">
              Discover opportunities curated for St. Mary&apos;s academic departments.
            </p>
          </div>

          {/* Filters */}
          <Card className="mb-12 border-2 border-border bg-card shadow-sm rounded-sm">
            <CardContent className="p-6">
              <div className="flex flex-col gap-6">
                {/* Search */}
                <div className="relative group">
                  <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" />
                  <Input
                    placeholder="Search titles, institutions, or keywords..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="bg-background pl-11 h-12 border-2 focus-visible:ring-offset-0"
                  />
                </div>

                {/* Filter Row */}
                <div className="flex flex-wrap items-center gap-4">
                  <div className="flex items-center gap-3 pr-4 border-r border-border">
                    <Filter className="h-4 w-4 text-primary" />
                    <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Filters</span>
                  </div>

                  <select
                    value={departmentFilter}
                    onChange={(e) => setDepartmentFilter(e.target.value)}
                    className="rounded-sm border-2 border-border bg-background px-4 py-2 text-sm font-medium focus:outline-none focus:border-primary transition-colors cursor-pointer"
                  >
                    <option value="all">All Departments</option>
                    {departments.map((dept) => (
                      <option key={dept} value={dept}>
                        {dept}
                      </option>
                    ))}
                  </select>

                  <select
                    value={jobTypeFilter}
                    onChange={(e) => setJobTypeFilter(e.target.value)}
                    className="rounded-sm border-2 border-border bg-background px-4 py-2 text-sm font-medium focus:outline-none focus:border-primary transition-colors cursor-pointer"
                  >
                    <option value="all">All Engagement Types</option>
                    {jobTypes.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>

                  <select
                    value={sectorFilter}
                    onChange={(e) => setSectorFilter(e.target.value)}
                    className="rounded-sm border-2 border-border bg-background px-4 py-2 text-sm font-medium focus:outline-none focus:border-primary transition-colors cursor-pointer"
                  >
                    <option value="all">All Economic Sectors</option>
                    {sectors.map((sector) => (
                      <option key={sector} value={sector}>
                        {sector}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Results Count */}
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Briefcase className="h-4 w-4 text-primary/60" />
              <span className="text-sm font-bold uppercase tracking-widest text-muted-foreground">
                {filteredJobs.length} {filteredJobs.length === 1 ? "Opportunity" : "Opportunities"} Identified
              </span>
            </div>
            {!studentProfile && (
              <Badge variant="outline" className="px-3 py-1 bg-accent/10 border-accent/20">
                <Link href="/login" className="text-xs font-bold uppercase tracking-tighter text-accent-foreground">
                  Sign in for Match Analysis
                </Link>
              </Badge>
            )}
          </div>

          {/* Jobs List */}
          <div className="space-y-4">
            {filteredJobs.length === 0 ? (
              <Card className="border border-border bg-card p-8 text-center">
                <Briefcase className="mx-auto h-12 w-12 text-muted-foreground/50" />
                <p className="mt-4 text-muted-foreground">{t("msg.no_jobs")}</p>
              </Card>
            ) : (
              filteredJobs.map((job) => (
                <JobCard
                  key={job.id}
                  job={job}
                  student={studentProfile}
                  showMatchScore={!!studentProfile}
                />
              ))
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default function JobsPage() {
  return (
    <TranslationProvider>
      <AuthProvider>
        <JobsPageContent />
      </AuthProvider>
    </TranslationProvider>
  );
}
