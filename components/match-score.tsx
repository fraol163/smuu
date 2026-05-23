"use client";

interface MatchScoreProps {
  score: number;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
  breakdown?: {
    department: number;
    skills: number;
    jobType: number;
  };
}

export function MatchScore({
  score,
  size = "md",
  showLabel = false,
  breakdown,
}: MatchScoreProps) {
  const sizeClasses = {
    sm: "h-12 w-12 text-xs",
    md: "h-14 w-14 text-sm",
    lg: "h-18 w-18 text-base",
  };

  const getColor = () => {
    if (score >= 70) return { bg: "bg-success/10", text: "text-success", border: "border-success/30", label: "Strong Match" };
    if (score >= 40) return { bg: "bg-warning/10", text: "text-warning", border: "border-warning/30", label: "Partial Match" };
    return { bg: "bg-destructive/10", text: "text-destructive", border: "border-destructive/30", label: "Low Match" };
  };

  const { bg, text, border, label } = getColor();

  return (
    <div className="flex flex-col items-center gap-2">
      <div 
        className={`${sizeClasses[size]} ${bg} ${border} border-2 rounded-sm flex items-center justify-center font-serif`}
      >
        <span className={`font-bold ${text}`}>{score}%</span>
      </div>
      {showLabel && (
        <span className={`text-[10px] font-bold uppercase tracking-widest ${text}`}>{label}</span>
      )}
      {breakdown && (
        <div className="mt-4 w-full space-y-2 text-[10px] font-bold uppercase tracking-tighter">
          <div className="flex justify-between items-center pb-1 border-b border-border/50">
            <span className="text-muted-foreground">Discipline</span>
            <span className="text-foreground">{breakdown.department}/50</span>
          </div>
          <div className="flex justify-between items-center pb-1 border-b border-border/50">
            <span className="text-muted-foreground">Competency</span>
            <span className="text-foreground">{breakdown.skills}/30</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Engagement</span>
            <span className="text-foreground">{breakdown.jobType}/20</span>
          </div>
        </div>
      )}
    </div>
  );
}
