import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import { useLocation, useNavigate } from "react-router";

type Category = "Science" | "Commerce" | "Arts" | "Vocational";

const RECOMMENDATIONS: Record<
  Category,
  {
    headline: string;
    courses: string[];
    careers: string[];
    color: string;
    badgeBg: string;
  }
> = {
  Science: {
    headline: "Your strength is in Science",
    courses: ["B.Sc.", "B.Tech", "MBBS", "BCA"],
    careers: ["Engineer", "Scientist", "Doctor", "Data Analyst"],
    color: "text-blue-600",
    badgeBg: "bg-blue-50 dark:bg-blue-950/20",
  },
  Commerce: {
    headline: "Your strength is in Commerce",
    courses: ["B.Com", "BBA", "CA", "CFA", "MBA"],
    careers: ["Entrepreneur", "Accountant", "Banker", "Financial Analyst"],
    color: "text-emerald-600",
    badgeBg: "bg-emerald-50 dark:bg-emerald-950/20",
  },
  Arts: {
    headline: "Your strength is in Arts",
    courses: ["B.A.", "BFA", "BJMC", "B.Ed"],
    careers: ["Teacher", "Journalist", "Writer", "Artist", "Civil Services"],
    color: "text-purple-600",
    badgeBg: "bg-purple-50 dark:bg-purple-950/20",
  },
  Vocational: {
    headline: "Your strength is in Vocational/Skilled",
    courses: ["ITI", "Diploma", "Polytechnic", "B.Voc"],
    careers: ["Technician", "Skilled Worker", "Innovator", "ITI Professional"],
    color: "text-orange-600",
    badgeBg: "bg-orange-50 dark:bg-orange-950/20",
  },
};

export default function AssessmentResult() {
  const navigate = useNavigate();
  const location = useLocation() as {
    state?: {
      scores: Record<Category, number>;
      primary: Category;
      total: number;
    };
  };

  const data = location.state;
  if (!data) {
    return (
      <div className="container mx-auto px-4 py-16">
        <Card>
          <CardContent className="py-10 text-center">
            <h1 className="text-2xl font-semibold mb-2">No Result Found</h1>
            <p className="text-muted-foreground mb-6">Please take the assessment to see your recommendations.</p>
            <Button onClick={() => navigate("/assessment")}>Take Assessment</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const { scores, primary, total } = data;
  const rec = RECOMMENDATIONS[primary];

  const scoreEntries = (Object.entries(scores) as Array<[Category, number]>).sort(
    (a, b) => b[1] - a[1]
  );

  return (
    <div className="container mx-auto px-4 py-10">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-2xl">Your Assessment Result</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className={`inline-flex h-10 items-center rounded-xl px-4 ${rec.badgeBg}`}>
              <span className={`font-semibold ${rec.color}`}>{rec.headline}</span>
            </div>
            <div className="text-sm text-muted-foreground">
              Based on your answers, you align most with the {primary} field. Explore the suggested courses and career paths below.
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              {scoreEntries.map(([cat, val]) => (
                <div key={cat} className="rounded-lg border p-3">
                  <div className="text-sm text-muted-foreground">{cat}</div>
                  <div className="flex items-center justify-between mt-1">
                    <div className="font-semibold text-lg">{val} / {total}</div>
                    <div className="w-24 h-2 bg-secondary rounded">
                      <div
                        className="h-2 bg-primary rounded"
                        style={{ width: `${Math.round((val / total) * 100)}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
      >
        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Suggested Courses</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-2">
              {rec.courses.map((c) => (
                <span key={c} className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm">
                  {c}
                </span>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Career Paths</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-2">
              {rec.careers.map((c) => (
                <span key={c} className="px-3 py-1 rounded-full bg-secondary text-secondary-foreground text-sm">
                  {c}
                </span>
              ))}
            </CardContent>
          </Card>
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <Button onClick={() => navigate("/courses")}>Explore Courses</Button>
          <Button variant="outline" onClick={() => navigate("/careers")}>
            Explore Career Paths
          </Button>
          <Button variant="ghost" onClick={() => navigate("/assessment")}>
            Retake Assessment
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
