"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTranslation } from "@/lib/translations";
import { useAuth } from "@/lib/auth-context";
import { Navbar } from "@/components/navbar";
import { StatusBadge } from "@/components/status-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import {
  Briefcase, PlusCircle, Building2, Users, Clock, Eye,
  Loader2, GraduationCap, Mail, Globe,
} from "lucide-react";

const DEPARTMENTS = ["Computer Science", "Marketing", "Accounting", "Tourism", "Economics"];
const SECTORS = ["Technology", "Banking & Finance", "NGO", "Telecom", "Government"];
const JOB_TYPES = [
  { value: "internship", label: "Internship" },
  { value: "full_time", label: "Full-Time" },
  { value: "part_time", label: "Part-Time" },
];

function EmployerDashboardContent() {
  const { t } = useTranslation();
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [isPostingJob, setIsPostingJob] = useState(false);
  const [selectedJob, setSelectedJob] = useState<number | null>(null);
  const [applicantsDialogOpen, setApplicantsDialogOpen] = useState(false);
  const [jobs, setJobs] = useState<any[]>([]);
  const [applications, setApplications] = useState<any[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  const [jobForm, setJobForm] = useState({
    title: "", description: "", requirements: "", department: "",
    sector: "", job_type: "", salary_min: "", salary_max: "", location: "Addis Ababa",
  });

  useEffect(() => {
    if (!user || user.role !== "employer") return;
    fetch("/api/jobs?all=true")
      .then((r) => r.json())
      .then((data) => {
        setJobs(data);
        setLoadingData(false);
      })
      .catch(() => setLoadingData(false));
  }, [user]);

  if (isLoading || loadingData) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user || user.role !== "employer") {
    router.push("/login");
    return null;
  }

  const employerJobs = jobs.filter((job: any) => job.employer_id === user.id);

  const handlePostJob = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsPostingJob(true);
    try {
      const res = await fetch("/api/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          employer_id: user.id,
          title: jobForm.title,
          description: jobForm.description,
          requirements: jobForm.requirements.split(",").map((r) => r.trim()).filter(Boolean),
          department: jobForm.department,
          sector: jobForm.sector || user.company_sector || "Other",
          job_type: jobForm.job_type,
          salary_min: jobForm.salary_min ? Number(jobForm.salary_min) : undefined,
          salary_max: jobForm.salary_max ? Number(jobForm.salary_max) : undefined,
          location: jobForm.location,
          company_name: user.company_name,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setJobs((prev) => [data.job, ...prev]);
        setJobForm({ title: "", description: "", requirements: "", department: "", sector: "", job_type: "", salary_min: "", salary_max: "", location: "Addis Ababa" });
      }
    } catch {}
    setIsPostingJob(false);
  };

  const openApplicantsDialog = async (jobId: number) => {
    setSelectedJob(jobId);
    try {
      const res = await fetch(`/api/applications?job_id=${jobId}`);
      if (res.ok) setApplications(await res.json());
    } catch {}
    setApplicantsDialogOpen(true);
  };

  const selectedJobData = selectedJob ? jobs.find((j: any) => j.id === selectedJob) : null;

  const updateApplicationStatus = async (applicationId: number, status: string) => {
    await fetch("/api/applications", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: applicationId, status }),
    });
    setApplications((prev) => prev.map((a: any) => a.id === applicationId ? { ...a, status } : a));
  };

  return (
    <div className="min-h-screen bg-grain">
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 pb-24 pt-32 sm:px-6 lg:px-8 bg-grid-subtle">
        <div className="mb-12 border-l-4 border-accent pl-8 py-2">
          <h1 className="font-serif text-4xl font-bold text-foreground tracking-tight">
            {t("dashboard.welcome")}, {user.name.split(" ")[0]}
          </h1>
          <p className="mt-2 text-sm font-bold uppercase tracking-widest text-muted-foreground/60">
            {user.company_name} • {user.company_sector} • Institutional Partner
          </p>
        </div>

        <div className="mb-12 grid gap-6 sm:grid-cols-3">
          <Card className="border-2 border-border bg-card shadow-sm rounded-sm">
            <CardContent className="flex items-center gap-6 p-6">
              <div className="flex h-14 w-14 items-center justify-center rounded-sm bg-primary/5 border border-primary/10">
                <Briefcase className="h-7 w-7 text-primary" />
              </div>
              <div>
                <p className="text-3xl font-serif font-bold text-foreground">{employerJobs.length}</p>
                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">Active Postings</p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-2 border-border bg-card shadow-sm rounded-sm">
            <CardContent className="flex items-center gap-6 p-6">
              <div className="flex h-14 w-14 items-center justify-center rounded-sm bg-accent/5 border border-accent/10">
                <Users className="h-7 w-7 text-accent-foreground" />
              </div>
              <div>
                <p className="text-3xl font-serif font-bold text-foreground">
                  {employerJobs.reduce((sum: number, job: any) => sum + (job.application_count || 0), 0)}
                </p>
                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">Talent Pool Reach</p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-2 border-border bg-card shadow-sm rounded-sm">
            <CardContent className="flex items-center gap-6 p-6">
              <div className="flex h-14 w-14 items-center justify-center rounded-sm bg-primary/5 border border-primary/10">
                <Clock className="h-7 w-7 text-primary" />
              </div>
              <div>
                <p className="text-3xl font-serif font-bold text-foreground">
                  {employerJobs.filter((j: any) => !j.is_approved).length}
                </p>
                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">Pending Review</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="jobs" className="space-y-10">
          <TabsList className="bg-muted p-1 rounded-sm border-2 border-border">
            <TabsTrigger value="jobs" className="flex items-center gap-2 px-6 py-2 rounded-sm data-[state=active]:bg-primary data-[state=active]:text-primary-foreground font-bold text-xs uppercase tracking-widest transition-all">
              <Briefcase className="h-4 w-4" /> <span className="hidden sm:inline">{t("dashboard.my_jobs")}</span>
            </TabsTrigger>
            <TabsTrigger value="post" className="flex items-center gap-2 px-6 py-2 rounded-sm data-[state=active]:bg-primary data-[state=active]:text-primary-foreground font-bold text-xs uppercase tracking-widest transition-all">
              <PlusCircle className="h-4 w-4" /> <span className="hidden sm:inline">{t("dashboard.post_job")}</span>
            </TabsTrigger>
            <TabsTrigger value="company" className="flex items-center gap-2 px-6 py-2 rounded-sm data-[state=active]:bg-primary data-[state=active]:text-primary-foreground font-bold text-xs uppercase tracking-widest transition-all">
              <Building2 className="h-4 w-4" /> <span className="hidden sm:inline">Profile</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="jobs" className="space-y-6 outline-none">
            {employerJobs.length === 0 ? (
              <Card className="border-2 border-border bg-card p-20 text-center rounded-sm">
                <Briefcase className="mx-auto h-16 w-16 text-muted-foreground/20 mb-6" />
                <p className="text-xl font-serif text-muted-foreground italic">No opportunities published yet.</p>
              </Card>
            ) : (
              employerJobs.map((job: any) => (
                <Card key={job.id} className="border-2 border-border bg-card p-8 rounded-sm group">
                  <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                    <div className="space-y-3">
                      <div className="flex flex-wrap items-center gap-3">
                        <h3 className="text-xl font-serif font-bold text-foreground group-hover:text-primary transition-colors">{job.title}</h3>
                        {!job.is_approved && <Badge variant="outline" className="bg-warning/10 text-warning-foreground">Pending Review</Badge>}
                      </div>
                      <div className="flex flex-wrap items-center gap-4 text-xs font-bold uppercase tracking-widest text-muted-foreground">
                        <Badge variant="outline" className="border-2">{job.department}</Badge>
                        <Badge variant="secondary">{job.job_type?.replace("_", "-")}</Badge>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Button variant="outline" size="sm" onClick={() => openApplicantsDialog(job.id)} className="h-10 px-4 font-bold uppercase text-[10px] tracking-[0.2em] border-2">
                        <Users className="mr-2 h-4 w-4 text-primary" />
                        {job.application_count || 0} Candidates
                      </Button>
                      <Button variant="ghost" size="icon" asChild className="h-10 w-10 border-2 border-transparent hover:border-border">
                        <Link href={`/jobs/${job.id}`}><Eye className="h-4 w-4" /></Link>
                      </Button>
                    </div>
                  </div>
                </Card>
              ))
            )}
          </TabsContent>

          <TabsContent value="post" className="outline-none">
            <Card className="border-2 border-border bg-card rounded-sm overflow-hidden shadow-sm">
              <div className="h-2 bg-primary w-full" />
              <CardHeader className="p-8">
                <CardTitle className="text-3xl font-serif font-bold tracking-tight">{t("dashboard.post_job")}</CardTitle>
                <CardDescription className="text-xs font-bold uppercase tracking-widest text-muted-foreground/60 mt-1">
                  Opportunities will undergo academic review before publication.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-8">
                <form onSubmit={handlePostJob} className="space-y-8">
                  <div className="grid gap-8 sm:grid-cols-2">
                    <div className="space-y-3">
                      <Label className="text-xs font-bold uppercase tracking-widest">Position Title</Label>
                      <Input value={jobForm.title} onChange={(e) => setJobForm((p) => ({ ...p, title: e.target.value }))} required className="bg-background border-2 h-12" placeholder="e.g., Junior Developer" />
                    </div>
                    <div className="space-y-3">
                      <Label className="text-xs font-bold uppercase tracking-widest">Target Department</Label>
                      <Select value={jobForm.department} onValueChange={(v) => setJobForm((p) => ({ ...p, department: v }))}>
                        <SelectTrigger className="bg-background border-2 h-12"><SelectValue placeholder="Select" /></SelectTrigger>
                        <SelectContent>{DEPARTMENTS.map((d) => <SelectItem key={d} value={d}>{d}</SelectItem>)}</SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <Label className="text-xs font-bold uppercase tracking-widest">Description</Label>
                    <Textarea value={jobForm.description} onChange={(e) => setJobForm((p) => ({ ...p, description: e.target.value }))} required rows={6} className="bg-background border-2" />
                  </div>
                  <div className="space-y-3">
                    <Label className="text-xs font-bold uppercase tracking-widest">Requirements (comma-separated)</Label>
                    <Input value={jobForm.requirements} onChange={(e) => setJobForm((p) => ({ ...p, requirements: e.target.value }))} className="bg-background border-2 h-12" placeholder="JavaScript, React, Python..." />
                  </div>
                  <div className="grid gap-8 sm:grid-cols-3">
                    <div className="space-y-3">
                      <Label className="text-xs font-bold uppercase tracking-widest">Job Type</Label>
                      <Select value={jobForm.job_type} onValueChange={(v) => setJobForm((p) => ({ ...p, job_type: v }))}>
                        <SelectTrigger className="bg-background border-2 h-12"><SelectValue placeholder="Select" /></SelectTrigger>
                        <SelectContent>{JOB_TYPES.map((t) => <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>)}</SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-3">
                      <Label className="text-xs font-bold uppercase tracking-widest">Min Salary (ETB)</Label>
                      <Input type="number" value={jobForm.salary_min} onChange={(e) => setJobForm((p) => ({ ...p, salary_min: e.target.value }))} className="bg-background border-2 h-12" />
                    </div>
                    <div className="space-y-3">
                      <Label className="text-xs font-bold uppercase tracking-widest">Max Salary (ETB)</Label>
                      <Input type="number" value={jobForm.salary_max} onChange={(e) => setJobForm((p) => ({ ...p, salary_max: e.target.value }))} className="bg-background border-2 h-12" />
                    </div>
                  </div>
                  <Button type="submit" disabled={isPostingJob} className="btn-editorial h-14 px-10 font-bold">
                    {isPostingJob ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Publishing...</> : <><PlusCircle className="mr-2 h-5 w-5" /> Publish Opportunity</>}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="company" className="outline-none">
            <Card className="border-2 border-border bg-card rounded-sm overflow-hidden shadow-sm">
              <div className="h-2 bg-accent w-full" />
              <CardHeader className="p-8">
                <CardTitle className="text-3xl font-serif font-bold tracking-tight">Institutional Profile</CardTitle>
              </CardHeader>
              <CardContent className="p-8">
                <div className="grid gap-10 rounded-sm border-2 border-border bg-secondary/30 p-10 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Entity Name</Label>
                    <p className="text-2xl font-serif font-bold text-foreground">{user.company_name}</p>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Sector</Label>
                    <p className="text-lg font-bold text-primary">{user.company_sector}</p>
                  </div>
                  <div className="sm:col-span-2 space-y-2">
                    <Label className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Mission</Label>
                    <p className="text-sm text-foreground/80 leading-relaxed font-serif italic border-l-2 border-accent pl-8 py-2">&quot;{user.company_description}&quot;</p>
                  </div>
                  <div className="sm:col-span-2 space-y-2">
                    <Label className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Website</Label>
                    <a href={user.company_website} target="_blank" rel="noopener noreferrer" className="text-sm font-bold text-primary hover:underline flex items-center gap-2">
                      <Globe className="h-4 w-4" />{user.company_website}
                    </a>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Applicants Dialog */}
        <Dialog open={applicantsDialogOpen} onOpenChange={setApplicantsDialogOpen}>
          <DialogContent className="max-h-[80vh] overflow-y-auto sm:max-w-2xl">
            <DialogHeader>
              <DialogTitle>Applicants for {selectedJobData?.title}</DialogTitle>
              <DialogDescription>{applications.length} total applicants</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              {applications.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">No applicants yet.</p>
              ) : (
                applications.map((app: any) => (
                  <Card key={app.id} className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-bold">{app.student_name}</p>
                        <p className="text-xs text-muted-foreground">{app.student_department} • GPA {app.student_gpa}</p>
                        <p className="text-xs text-muted-foreground">{app.student_email}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <StatusBadge status={app.status} />
                        {app.status === "pending" && (
                          <div className="flex gap-1">
                            <Button size="sm" onClick={() => updateApplicationStatus(app.id, "accepted")} className="h-7 px-2 text-[10px] bg-success">Accept</Button>
                            <Button size="sm" variant="destructive" onClick={() => updateApplicationStatus(app.id, "rejected")} className="h-7 px-2 text-[10px]">Reject</Button>
                          </div>
                        )}
                      </div>
                    </div>
                    {app.cover_letter && <p className="mt-2 text-xs text-muted-foreground italic border-l-2 border-accent pl-3">{app.cover_letter}</p>}
                  </Card>
                ))
              )}
            </div>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
}

export default function EmployerDashboardPage() {
  return <EmployerDashboardContent />;
}
