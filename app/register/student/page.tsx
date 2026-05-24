"use client";

import { useState } from "react";
import Link from "next/link";
import { useTranslation } from "@/lib/translations";
import { useAuth } from "@/lib/auth-context";
import { validateSmuId, getDepartmentFromId } from "@/lib/smu-utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Loader2, CheckCircle, AlertCircle } from "lucide-react";

export default function StudentRegisterPage() {
  const { t } = useTranslation();
  const { registerStudent } = useAuth();

  const [formData, setFormData] = useState({
    name: "", email: "", password: "", smu_id: "", gpa: "", skills: "", bio: "", graduation_year: "",
  });
  const [detectedDepartment, setDetectedDepartment] = useState<string | null>(null);
  const [smuIdError, setSmuIdError] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSmuIdChange = (value: string) => {
    setFormData((prev) => ({ ...prev, smu_id: value }));
    if (value.length === 0) { setDetectedDepartment(null); setSmuIdError(null); return; }
    if (validateSmuId(value)) {
      setDetectedDepartment(getDepartmentFromId(value));
      setSmuIdError(null);
    } else {
      setDetectedDepartment(null);
      if (value.length >= 3) setSmuIdError("Format: RCD/0045/2020 or ECD/0045/2020");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    if (!validateSmuId(formData.smu_id)) {
      setError("Please enter a valid SMU ID");
      setIsLoading(false);
      return;
    }

    const result = await registerStudent({
      name: formData.name,
      email: formData.email,
      password: formData.password,
      smu_id: formData.smu_id,
      gpa: parseFloat(formData.gpa),
      skills: formData.skills.split(",").map((s) => s.trim()).filter((s) => s),
      bio: formData.bio,
      graduation_year: parseInt(formData.graduation_year),
    });

    if (result.success) setSuccess(true);
    else setError(result.error || "Registration failed");
    setIsLoading(false);
  };

  if (success) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4 py-12 bg-grain bg-grid-subtle">
        <Card className="w-full max-w-md border border-border bg-card text-center shadow-2xl rounded-sm overflow-hidden relative z-10">
          <div className="h-2 bg-success w-full" />
          <CardContent className="pt-12 pb-10 px-8">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-success/10 border border-success/20">
              <CheckCircle className="h-8 w-8 text-success" />
            </div>
            <h2 className="text-3xl font-serif font-bold text-foreground tracking-tight">Registration Successful!</h2>
            <p className="mt-4 text-sm text-muted-foreground leading-relaxed">
              Your account has been created. An admin will verify your SMU ID before you can access the platform.
            </p>
            <Button asChild className="mt-8 w-full h-12 text-md font-bold btn-editorial">
              <Link href="/login">Return to Login</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const currentYear = new Date().getFullYear();
  const graduationYears = Array.from({ length: 6 }, (_, i) => currentYear + i);

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-12 bg-grain bg-grid-subtle">
      <div className="w-full max-w-lg relative z-10">
        <Link href="/register" className="mb-8 inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-muted-foreground transition-colors hover:text-primary">
          <ArrowLeft className="h-4 w-4" /> Back
        </Link>
        <Card className="border border-border bg-card shadow-2xl rounded-sm overflow-hidden">
          <div className="h-2 bg-primary w-full" />
          <CardHeader className="pt-8 px-8">
            <CardTitle className="text-3xl font-serif font-bold tracking-tight">Student Registration</CardTitle>
            <CardDescription className="text-xs font-bold uppercase tracking-widest text-muted-foreground/60 mt-1">
              Create your verified academic profile
            </CardDescription>
          </CardHeader>
          <CardContent className="px-8 pb-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && <div className="rounded-sm border border-destructive/20 bg-destructive/5 p-4 text-sm text-destructive font-medium">{error}</div>}
              <div className="grid gap-6 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">{t("form.name")}</Label>
                  <Input value={formData.name} onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))} required className="bg-background border-2" placeholder="Abebe Kebede" />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">{t("form.email")}</Label>
                  <Input type="email" value={formData.email} onChange={(e) => setFormData((p) => ({ ...p, email: e.target.value }))} required className="bg-background border-2" placeholder="you@smu.edu.et" />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">{t("form.password")}</Label>
                <Input type="password" value={formData.password} onChange={(e) => setFormData((p) => ({ ...p, password: e.target.value }))} required minLength={6} className="bg-background border-2" placeholder="Minimum 6 characters" />
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">{t("form.smu_id")}</Label>
                <Input value={formData.smu_id} onChange={(e) => handleSmuIdChange(e.target.value.toUpperCase())} required className={`bg-background font-mono border-2 ${smuIdError ? "border-destructive/50" : detectedDepartment ? "border-success/50" : ""}`} placeholder="RCD/0045/2020" />
                {smuIdError && <p className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-destructive"><AlertCircle className="h-3 w-3" />{smuIdError}</p>}
                {detectedDepartment && <p className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-success"><CheckCircle className="h-3 w-3" />Department: {detectedDepartment}</p>}
              </div>
              <div className="grid gap-6 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">{t("form.gpa")}</Label>
                  <Input type="number" step="0.01" min="0" max="4" value={formData.gpa} onChange={(e) => setFormData((p) => ({ ...p, gpa: e.target.value }))} required className="bg-background border-2" placeholder="3.50" />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">{t("form.graduation_year")}</Label>
                  <Select value={formData.graduation_year} onValueChange={(v) => setFormData((p) => ({ ...p, graduation_year: v }))}>
                    <SelectTrigger className="bg-background border-2"><SelectValue placeholder="Select year" /></SelectTrigger>
                    <SelectContent>{graduationYears.map((y) => <SelectItem key={y} value={y.toString()}>{y}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">{t("form.skills")}</Label>
                <Input value={formData.skills} onChange={(e) => setFormData((p) => ({ ...p, skills: e.target.value }))} className="bg-background border-2" placeholder="JavaScript, React, Python..." />
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">{t("form.bio")}</Label>
                <Textarea value={formData.bio} onChange={(e) => setFormData((p) => ({ ...p, bio: e.target.value }))} rows={3} className="bg-background border-2" placeholder="Tell employers about your academic focus..." />
              </div>
              <Button type="submit" className="w-full h-12 text-md font-bold btn-editorial" disabled={isLoading || !detectedDepartment}>
                {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processing...</> : t("form.register")}
              </Button>
            </form>
            <p className="mt-6 text-center text-sm text-muted-foreground">
              Already have an account? <Link href="/login" className="font-medium text-primary hover:underline">Sign in</Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
