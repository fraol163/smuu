"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { TranslationProvider, useTranslation } from "@/lib/translations";
import { AuthProvider, useAuth } from "@/lib/auth-context";
import { MOCK_JOBS, MOCK_APPLICATIONS } from "@/lib/mock-data";
import { Student, calculateMatchScore, formatSalary } from "@/lib/smu-utils";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { MatchScore } from "@/components/match-score";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  ArrowLeft,
  Building2,
  MapPin,
  Clock,
  Users,
  Star,
  Globe,
  Briefcase,
  CheckCircle,
  Loader2,
} from "lucide-react";

function JobDetailContent() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const params = useParams();
  const [coverLetter, setCoverLetter] = useState("");
  const [isApplying, setIsApplying] = useState(false);
  const [applied, setApplied] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  const jobId = parseInt(params.id as string);
  const job = MOCK_JOBS.find((j) => j.id === jobId);

  if (!job) {
    return (
      <div className="flex min-h-screen flex-col bg-grain">
        <Navbar />
        <main className="flex flex-1 items-center justify-center pt-24 bg-grid-subtle">
          <Card className="border-2 border-border bg-card p-12 text-center rounded-sm">
            <p className="text-xl font-serif text-muted-foreground italic mb-6">Opportunity not identified in records.</p>
            <Button asChild className="btn-editorial h-12 px-8 font-bold">
              <Link href="/jobs">Browse Job Archive</Link>
            </Button>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  // Check if student has already applied
  const hasApplied =
    user?.role === "student" &&
    MOCK_APPLICATIONS.some(
      (app) => app.student_id === user.id && app.job_id === jobId
    );

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

  const matchBreakdown = studentProfile
    ? calculateMatchScore(studentProfile, job)
    : null;

  const handleApply = async () => {
    setIsApplying(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setApplied(true);
    setIsApplying(false);
    setDialogOpen(false);
  };

  const jobTypeLabels = {
    internship: "Internship",
    full_time: "Full-Time",
    part_time: "Part-Time",
  };

  return (
    <div className="flex min-h-screen flex-col bg-grain">
      <Navbar />
      <main className="flex-1 pb-24 pt-32 bg-grid-subtle">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          {/* Back Link */}
          <Link
            href="/jobs"
            className="mb-10 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground transition-all hover:text-primary hover:-translate-x-1"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Archive
          </Link>

          <div className="grid gap-10 lg:grid-cols-3">
            {/* Main Content */}
            <div className="space-y-10 lg:col-span-2">
              {/* Job Header */}
              <Card className="border-2 border-border bg-card shadow-sm rounded-sm overflow-hidden">
                <div className="h-2 bg-primary w-full" />
                <CardContent className="p-8">
                  <div className="flex flex-wrap items-start justify-between gap-6">
                    <div className="space-y-4">
                      {job.is_featured && (
                        <div className="inline-flex items-center gap-2 px-2 py-0.5 bg-accent text-accent-foreground text-[10px] font-bold uppercase tracking-widest rounded-sm">
                          <Star className="h-3 w-3 fill-current" />
                          Partnered Institution
                        </div>
                      )}
                      <h1 className="text-3xl md:text-4xl font-serif font-bold text-foreground tracking-tight">{job.title}</h1>
                      <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs font-bold uppercase tracking-widest text-muted-foreground">
                        <span className="flex items-center gap-2 text-foreground">
                          <Building2 className="h-4 w-4 text-primary" />
                          {job.company_name}
                        </span>
                        <span className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 opacity-50" />
                          {job.location}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 flex flex-wrap gap-3">
                    <Badge variant="outline" className="border-2 border-border font-bold text-[10px] tracking-widest rounded-sm uppercase">{job.sector}</Badge>
                    <Badge variant="secondary" className="font-bold text-[10px] tracking-widest rounded-sm uppercase">{jobTypeLabels[job.job_type]}</Badge>
                    <Badge variant="secondary" className="bg-primary text-primary-foreground font-bold text-[10px] tracking-widest rounded-sm uppercase">
                      {job.department}
                    </Badge>
                  </div>

                  <div className="mt-10 flex flex-wrap items-center gap-8 pt-6 border-t border-border/50 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
                    <div className="space-y-1">
                      <p className="opacity-60">Estimated Compensation</p>
                      <p className="text-sm text-foreground">{formatSalary(job.salary_min, job.salary_max)}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="opacity-60">Current Applicants</p>
                      <p className="text-sm text-foreground">{job.application_count} Students</p>
                    </div>
                    <div className="space-y-1 ml-auto">
                      <p className="opacity-60">Publication Date</p>
                      <p className="text-sm text-foreground">{new Date(job.created_at).toLocaleDateString()}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Job Description */}
              <Card className="border-2 border-border bg-card rounded-sm shadow-sm">
                <CardHeader className="p-8 pb-0">
                  <CardTitle className="text-xl font-serif font-bold">Institutional Brief</CardTitle>
                </CardHeader>
                <CardContent className="p-8">
                  <p className="whitespace-pre-wrap text-muted-foreground leading-relaxed font-sans">
                    {job.description}
                  </p>
                </CardContent>
              </Card>

              {/* Requirements */}
              <Card className="border-2 border-border bg-card rounded-sm shadow-sm">
                <CardHeader className="p-8 pb-0">
                  <CardTitle className="text-xl font-serif font-bold">Academic & Professional Requirements</CardTitle>
                </CardHeader>
                <CardContent className="p-8">
                  <ul className="grid gap-4 sm:grid-cols-2">
                    {job.requirements.map((req, index) => (
                      <li key={index} className="flex items-start gap-3 p-3 bg-secondary/30 rounded-sm border border-border/50">
                        <CheckCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
                        <span className="text-sm font-medium text-foreground/80">{req}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-10">
              {/* Match Score Card */}
              {matchBreakdown && (
                <Card className="border-2 border-border bg-card rounded-sm overflow-hidden shadow-sm">
                  <div className="h-1 bg-accent w-full" />
                  <CardHeader className="p-6 text-center">
                    <CardTitle className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Match Analysis</CardTitle>
                  </CardHeader>
                  <CardContent className="px-6 pb-8 flex flex-col items-center">
                    <MatchScore
                      score={matchBreakdown.total}
                      size="lg"
                      showLabel
                      breakdown={matchBreakdown}
                    />
                    <p className="mt-6 text-[10px] font-bold uppercase tracking-tighter text-muted-foreground/60 text-center leading-relaxed">
                      Score based on your current academic record and departmental alignment.
                    </p>
                  </CardContent>
                </Card>
              )}

              {/* Apply Card */}
              <Card className="border-2 border-border bg-card rounded-sm shadow-lg overflow-hidden sticky top-24">
                <CardContent className="p-8">
                  {!user ? (
                    <div className="text-center space-y-6">
                      <p className="text-sm font-bold uppercase tracking-widest text-muted-foreground">
                        Institutional access required to apply
                      </p>
                      <Button asChild className="btn-editorial w-full h-12 font-bold">
                        <Link href="/login">Authenticate Now</Link>
                      </Button>
                    </div>
                  ) : user.role !== "student" ? (
                    <p className="text-center text-xs font-bold uppercase tracking-widest text-muted-foreground italic">
                      Restricted to verified student applicants.
                    </p>
                  ) : hasApplied || applied ? (
                    <div className="text-center space-y-6">
                      <div className="mx-auto h-14 w-14 rounded-full bg-success/10 border-2 border-success flex items-center justify-center">
                        <CheckCircle className="h-8 w-8 text-success" />
                      </div>
                      <div>
                        <p className="font-serif font-bold text-xl text-foreground tracking-tight">Application Submitted</p>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mt-2">
                          Institutional Record Created
                        </p>
                      </div>
                      <Button asChild variant="outline" className="w-full h-12 font-bold border-2">
                        <Link href="/dashboard/student">Monitor Status</Link>
                      </Button>
                    </div>
                  ) : (
                    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                      <DialogTrigger asChild>
                        <Button className="btn-editorial w-full h-14 text-md font-bold" size="lg">
                          <Briefcase className="mr-3 h-5 w-5" />
                          {t("action.apply")}
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-xl rounded-sm border-2">
                        <DialogHeader>
                          <DialogTitle className="text-2xl font-serif font-bold">Submit Institutional Application</DialogTitle>
                          <DialogDescription className="text-xs font-bold uppercase tracking-widest text-muted-foreground mt-2">
                            Applying for: {job.title}
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-6 py-6">
                          <div className="space-y-3">
                            <Label htmlFor="cover_letter" className="text-xs font-bold uppercase tracking-widest text-foreground">Personal Statement (Optional)</Label>
                            <Textarea
                              id="cover_letter"
                              placeholder="Briefly state your academic focus and why you're a fit for this institutional role..."
                              value={coverLetter}
                              onChange={(e) => setCoverLetter(e.target.value)}
                              rows={8}
                              className="bg-secondary/30 border-2 focus-visible:ring-offset-0 leading-relaxed"
                            />
                          </div>
                        </div>
                        <DialogFooter className="gap-3">
                          <Button
                            variant="outline"
                            onClick={() => setDialogOpen(false)}
                            className="font-bold border-2"
                          >
                            Cancel
                          </Button>
                          <Button onClick={handleApply} disabled={isApplying} className="btn-editorial font-bold px-8">
                            {isApplying ? (
                              <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Processing...
                              </>
                            ) : (
                              "Confirm Submission"
                            )}
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  )}
                </CardContent>
              </Card>

              {/* Company Card */}
              <Card className="border-2 border-border bg-card rounded-sm shadow-sm">
                <CardHeader className="p-6 pb-0">
                  <CardTitle className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Entity Profile</CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="flex h-14 w-14 items-center justify-center rounded-sm bg-primary/5 border border-primary/10">
                      <Building2 className="h-7 w-7 text-primary" />
                    </div>
                    <div>
                      <p className="font-serif font-bold text-lg text-foreground tracking-tight">{job.company_name}</p>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-primary">{job.sector}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-widest text-muted-foreground bg-secondary/30 p-3 rounded-sm">
                    <MapPin className="h-4 w-4 text-primary" />
                    <span>Addis Ababa, Ethiopia</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default function JobDetailPage() {
  return (
    <TranslationProvider>
      <AuthProvider>
        <JobDetailContent />
      </AuthProvider>
    </TranslationProvider>
  );
}
