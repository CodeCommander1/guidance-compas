import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { motion } from "framer-motion";

export default function Careers() {
  const paths = useQuery(api.careerPaths.getAll, { limit: 30 });

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Career Paths</h1>
        <p className="text-muted-foreground">See roles, skills, growth, and study routes linked to each degree.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {(paths || []).map((p, i) => (
          <motion.div key={p._id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}>
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>{p.title}</span>
                  {p.course?.shortName && (
                    <span className="text-xs px-2 py-0.5 rounded bg-secondary text-secondary-foreground">{p.course.shortName}</span>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-muted-foreground">
                <p>{p.description}</p>
                <div className="flex flex-wrap gap-2">
                  {p.requiredSkills.slice(0, 5).map((s: string) => (
                    <span key={s} className="text-xs px-2 py-1 rounded bg-primary/10 text-primary">
                      {s}
                    </span>
                  ))}
                </div>
                <div className="text-xs">
                  <div>Roles: {p.jobRoles.slice(0, 3).join(", ")}{p.jobRoles.length > 3 ? "..." : ""}</div>
                  <div>Growth: {p.growthProspects} • Salary: {p.salaryRange}</div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
