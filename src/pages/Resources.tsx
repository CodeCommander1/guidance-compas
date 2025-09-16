import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { motion } from "framer-motion";

export default function Resources() {
  const resources = useQuery(api.resources.getAll, { limit: 40 });

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Open Educational Resources</h1>
        <p className="text-muted-foreground">Free ebooks, videos, and articles to support your learning.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {(resources || []).map((r, i) => (
          <motion.div key={r._id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}>
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>{r.title}</span>
                  <span className="text-xs px-2 py-0.5 rounded bg-secondary text-secondary-foreground">{r.type}</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-muted-foreground">
                <p>{r.description}</p>
                <div className="flex flex-wrap gap-2">
                  {r.tags.slice(0, 5).map((t: string) => (
                    <span key={t} className="text-xs px-2 py-1 rounded bg-primary/10 text-primary">
                      {t}
                    </span>
                  ))}
                </div>
                {r.url && (
                  <a
                    href={r.url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-sm text-primary underline underline-offset-4"
                  >
                    Open Resource
                  </a>
                )}
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
