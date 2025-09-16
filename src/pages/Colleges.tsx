import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { motion } from "framer-motion";

export default function Colleges() {
  const colleges = useQuery(api.colleges.list, { limit: 30 });

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Government Colleges</h1>
        <p className="text-muted-foreground">Discover public institutions, programs, and facilities.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {(colleges || []).map((col, i) => (
          <motion.div key={col._id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}>
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>{col.name}</span>
                  <span className="text-xs px-2 py-0.5 rounded bg-secondary text-secondary-foreground">{col.city}, {col.state}</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-muted-foreground">
                <div>{col.address}</div>
                {col.accreditation && <div>Accreditation: {col.accreditation}</div>}
                <div className="flex flex-wrap gap-2 pt-1">
                  {col.facilities.slice(0, 6).map((f: string) => (
                    <span key={f} className="text-xs px-2 py-1 rounded bg-primary/10 text-primary">
                      {f}
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
