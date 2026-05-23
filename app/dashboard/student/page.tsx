"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { TranslationProvider, useTranslation } from "@/lib/translations";
import { AuthProvider, useAuth } from "@/lib/auth-context";
import { MOCK_JOBS, MOCK_APPLICATIONS } from "@/lib/mock-data";
import { Student, calculateMatchScore } from "@/lib/smu-utils";
import { Navbar } from "@/components/navbar";
import { JobCard } from "@/components/job-card";
import { StatusBadge } from "@/components/status-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Briefcase,
  FileText,
  User,
  Search,
  Filter,
  Building2,
  Calendar,
  Loader2,
} from "lucide-react";

function StudentDashboardContent() {
  const { t } = useTranslation();
  const { user, isLoading, updateProfile } = useAuth();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState<string>("all");
  const [isSaving, setIsSaving] = useState(false);

  // Profile edit state
  const [profileData, setProfileData] = useState({
    skills: user?.skills?.join(", ") || "",
    bio: user?.bio || "",
  });

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user || user.role !== "student") {
    router.push("/login");
    return null;
  }

  const studentProfile: Student = {
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
  };

  // Filter and sort jobs
  const approvedJobs = MOCK_JOBS.filter((job) => job.is_approved);
  const filteredJobs = approvedJobs
    .filter((job) => {
      const matchesSearch =
        searchQuery === "" ||
        job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.company_name?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesDepartment =
        departmentFilter === "all" || job.department === departmentFilter;
      return matchesSearch && matchesDepartment;
    })
    .map((job) => ({
      ...job,
      matchScore: calculateMatchScore(studentProfile, job).total,
    }))
    .sort((a, b) => {
      // Featured first, then by match score
      if (a.is_featured && !b.is_featured) return -1;
      if (!a.is_featured && b.is_featured) return 1;
      return b.matchScore - a.matchScore;
    });

  // Get user's applications
  const userApplications = MOCK_APPLICATIONS.filter(
    (app) => app.student_id === user.id
  );

  const handleSaveProfile = async () => {
    setIsSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 500));
    updateProfile({
      skills: profileData.skills.split(",").map((s) => s.trim()).filter((s) => s),
      bio: profileData.bio,
    });
    setIsSaving(false);
  };

  const departments = ["Computer Science", "Marketing", "Accounting", "Tourism", "Economics"];

  return (
    <div className="min-h-screen bg-grain">
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 pb-24 pt-32 sm:px-6 lg:px-8 bg-grid-subtle">
        {/* Welcome Header */}
        <div className="mb-12 border-l-4 border-primary pl-8 py-2">
          <h1 className="text-4xl font-serif font-bold text-foreground tracking-tight">
            {t("dashboard.welcome")}, {user.name.split(" ")[0]}
          </h1>
          <p className="mt-2 text-sm font-bold uppercase tracking-widest text-muted-foreground/60">
            {user.department} • Academic Class of {user.graduation_year}
          </p>
        </div>

        {/* Dashboard Tabs */}
        <Tabs defaultValue="jobs" className="space-y-10">
          <TabsList className="bg-muted p-1 rounded-sm border-2 border-border">
            <TabsTrigger value="jobs" className="flex items-center gap-2 px-6 py-2 rounded-sm data-[state=active]:bg-primary data-[state=active]:text-primary-foreground font-bold text-xs uppercase tracking-widest transition-all">
              <Briefcase className="h-4 w-4" />
              <span className="hidden sm:inline">{t("dashboard.browse_jobs")}</span>
              <span className="sm:hidden">Jobs</span>
            </TabsTrigger>
            <TabsTrigger value="applications" className="flex items-center gap-2 px-6 py-2 rounded-sm data-[state=active]:bg-primary data-[state=active]:text-primary-foreground font-bold text-xs uppercase tracking-widest transition-all">
              <FileText className="h-4 w-4" />
              <span className="hidden sm:inline">{t("dashboard.my_applications")}</span>
              <span className="sm:hidden">Apps</span>
              {userApplications.length > 0 && (
                <Badge variant="secondary" className="ml-1 bg-accent/20 text-accent-foreground border-accent/30">
                  {userApplications.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="profile" className="flex items-center gap-2 px-6 py-2 rounded-sm data-[state=active]:bg-primary data-[state=active]:text-primary-foreground font-bold text-xs uppercase tracking-widest transition-all">
              <User className="h-4 w-4" />
              <span className="hidden sm:inline">{t("dashboard.my_profile")}</span>
              <span className="sm:hidden">Profile</span>
            </TabsTrigger>
          </TabsList>

          {/* Browse Jobs Tab */}
          <TabsContent value="jobs" className="space-y-8 outline-none">
            {/* Filters */}
            <Card className="border-2 border-border bg-card shadow-sm rounded-sm">
              <CardContent className="flex flex-col gap-6 p-6 sm:flex-row sm:items-center">
                <div className="relative flex-1 group">
                  <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" />
                  <Input
                    placeholder="Search opportunities or institutions..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="bg-background pl-11 h-12 border-2 focus-visible:ring-offset-0"
                  />
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 px-3 py-2 bg-secondary rounded-sm border-2 border-border">
                    <Filter className="h-4 w-4 text-primary" />
                    <select
                      value={departmentFilter}
                      onChange={(e) => setDepartmentFilter(e.target.value)}
                      className="bg-transparent text-xs font-bold uppercase tracking-widest focus:outline-none cursor-pointer"
                    >
                      <option value="all">All Disciplines</option>
                      {departments.map((dept) => (
                        <option key={dept} value={dept}>
                          {dept}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Jobs List */}
            <div className="space-y-6">
              {filteredJobs.length === 0 ? (
                <Card className="border-2 border-border bg-card p-12 text-center rounded-sm">
                  <p className="text-muted-foreground font-serif italic text-lg">{t("msg.no_jobs")}</p>
                </Card>
              ) : (
                filteredJobs.map((job) => (
                  <JobCard key={job.id} job={job} student={studentProfile} />
                ))
              )}
            </div>
          </TabsContent>

          {/* My Applications Tab */}
          <TabsContent value="applications" className="space-y-6 outline-none">
            {userApplications.length === 0 ? (
              <Card className="border-2 border-border bg-card p-20 text-center rounded-sm">
                <FileText className="mx-auto h-16 w-16 text-muted-foreground/20 mb-6" />
                <p className="text-xl font-serif text-muted-foreground italic mb-8">{t("msg.no_applications")}</p>
                <Button asChild className="btn-editorial h-12 px-8 font-bold">
                  <Link href="/jobs">Explore Job Board</Link>
                </Button>
              </Card>
            ) : (
              userApplications.map((app) => (
                <Card key={app.id} className="border-2 border-border bg-card p-8 rounded-sm hover:border-primary/50 transition-colors group">
                  <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                    <div className="space-y-2">
                      <h3 className="text-xl font-serif font-bold text-foreground group-hover:text-primary transition-colors">{app.job_title}</h3>
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs font-bold uppercase tracking-widest text-muted-foreground">
                        <span className="flex items-center gap-2 text-foreground">
                          <Building2 className="h-4 w-4 text-primary" />
                          {app.company_name}
                        </span>
                        <span className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 opacity-50" />
                          Applied {new Date(app.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <StatusBadge status={app.status} />
                  </div>
                  {app.cover_letter && (
                    <div className="mt-8 pt-8 border-t border-border">
                      <p className="text-sm text-muted-foreground leading-relaxed italic border-l-2 border-accent pl-6">
                        &quot;{app.cover_letter.slice(0, 150)}...&quot;
                      </p>
                    </div>
                  )}
                </Card>
              ))
            )}
          </TabsContent>

          {/* Profile Tab */}
          <TabsContent value="profile" className="outline-none">
            <Card className="border-2 border-border bg-card rounded-sm overflow-hidden shadow-sm">
              <div className="h-2 bg-primary w-full" />
              <CardHeader className="p-8">
                <CardTitle className="text-3xl font-serif font-bold tracking-tight">{t("dashboard.my_profile")}</CardTitle>
                <CardDescription className="text-xs font-bold uppercase tracking-widest text-muted-foreground/60 mt-1">
                  Institutional Record & Professional Identity
                </CardDescription>
              </CardHeader>
              <CardContent className="p-8 space-y-10">
                {/* Read-only Info */}
                <div className="grid gap-6 rounded-sm border-2 border-border bg-secondary/30 p-8 sm:grid-cols-3">
                  <div className="space-y-1">
                    <Label className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Legal Name</Label>
                    <p className="text-lg font-serif font-bold text-foreground">{user.name}</p>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Institutional Email</Label>
                    <p className="text-sm font-medium text-foreground">{user.email}</p>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Academic ID</Label>
                    <p className="text-sm font-mono font-bold text-primary">{user.smu_id}</p>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Discipline</Label>
                    <p className="text-sm font-bold text-foreground">{user.department}</p>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Cumulative GPA</Label>
                    <p className="text-sm font-bold text-foreground">{user.gpa?.toFixed(2)}</p>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Class Year</Label>
                    <p className="text-sm font-bold text-foreground">{user.graduation_year}</p>
                  </div>
                </div>

                {/* Editable Info */}
                <div className="space-y-8">
                  <div className="space-y-3">
                    <Label htmlFor="skills" className="text-xs font-bold uppercase tracking-widest text-foreground">{t("form.skills")}</Label>
                    <Input
                      id="skills"
                      placeholder="JavaScript, React, Python..."
                      value={profileData.skills}
                      onChange={(e) =>
                        setProfileData((prev) => ({ ...prev, skills: e.target.value }))
                      }
                      className="bg-background border-2 h-12 focus-visible:ring-offset-0"
                    />
                    <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60 italic">
                      Skills are parsed to determine academic-industry alignment scores.
                    </p>
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="bio" className="text-xs font-bold uppercase tracking-widest text-foreground">{t("form.bio")}</Label>
                    <Textarea
                      id="bio"
                      placeholder="Define your professional mission..."
                      value={profileData.bio}
                      onChange={(e) =>
                        setProfileData((prev) => ({ ...prev, bio: e.target.value }))
                      }
                      rows={5}
                      className="bg-background border-2 focus-visible:ring-offset-0 leading-relaxed"
                    />
                  </div>

                  <Button onClick={handleSaveProfile} disabled={isSaving} className="btn-editorial h-12 px-10 font-bold">
                    {isSaving ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving Records...
                      </>
                    ) : (
                      t("action.save")
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}

export default function StudentDashboardPage() {
  return (
    <TranslationProvider>
      <AuthProvider>
        <StudentDashboardContent />
      </AuthProvider>
    </TranslationProvider>
  );
}
