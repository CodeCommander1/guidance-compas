import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { motion } from "framer-motion";

export default function Courses() {
  const courses = useQuery(api.courses.list, {});

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Degree Courses</h1>
        <p className="text-muted-foreground">Explore programs across Arts, Science, Commerce, Management, and more.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {(courses || []).map((c, i) => (
          <motion.div key={c._id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}>
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>{c.name}</span>
                  <span className="text-xs px-2 py-0.5 rounded bg-secondary text-secondary-foreground">{c.category}</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground">{c.description}</p>
                <div className="text-xs text-muted-foreground">
                  <div>Duration: {c.duration}</div>
                  <div>Eligibility: {c.eligibility}</div>
                </div>
                <div className="flex flex-wrap gap-2 pt-1">
                  {c.subjects.slice(0, 4).map((s) => (
                    <span key={s} className="text-xs px-2 py-1 rounded bg-primary/10 text-primary">
                      {s}
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
