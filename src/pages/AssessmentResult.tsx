import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import { useNavigate } from "react-router";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

type StreamType = "science" | "commerce" | "arts" | "vocational";

const STREAM_INFO: Record<StreamType, {
  headline: string;
  courses: string[];
  careers: string[];
  color: string;
  badgeBg: string;
  emoji: string;
}> = {
  science: {
    headline: "Your strength is in Science",
    courses: ["B.Sc.", "B.Tech", "MBBS", "BCA", "B.Pharm"],
    careers: ["Engineer", "Scientist", "Doctor", "Data Analyst", "Researcher"],
    color: "text-blue-600",
    badgeBg: "bg-blue-50 dark:bg-blue-950/20",
    emoji: "🔬",
  },
  commerce: {
    headline: "Your strength is in Commerce",
    courses: ["B.Com", "BBA", "CA", "CFA", "MBA"],
    careers: ["Entrepreneur", "Accountant", "Banker", "Financial Analyst", "Business Manager"],
    color: "text-emerald-600",
    badgeBg: "bg-emerald-50 dark:bg-emerald-950/20",
    emoji: "💼",
  },
  arts: {
    headline: "Your strength is in Arts",
    courses: ["B.A.", "BFA", "BJMC", "B.Ed", "LLB"],
    careers: ["Teacher", "Journalist", "Writer", "Artist", "Civil Services", "Lawyer"],
    color: "text-purple-600",
    badgeBg: "bg-purple-50 dark:bg-purple-950/20",
    emoji: "🎨",
  },
  vocational: {
    headline: "Your strength is in Vocational/Skilled",
    courses: ["ITI", "Diploma", "Polytechnic", "B.Voc", "Certificate Courses"],
    careers: ["Technician", "Skilled Worker", "Innovator", "ITI Professional", "Craftsperson"],
    color: "text-orange-600",
    badgeBg: "bg-orange-50 dark:bg-orange-950/20",
    emoji: "🔧",
  },
};

export default function AssessmentResult() {
  const navigate = useNavigate();
  const recommendation = useQuery(api.recommendations.computeStreamRecommendation, {});
  const colleges = useQuery(api.colleges.list, { limit: 6 });
  const resources = useQuery(api.resources.getAll, { limit: 8 });

  if (!recommendation) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if ("error" in recommendation) {
    return (
      <div className="container mx-auto px-4 py-16">
        <Card>
          <CardContent className="py-10 text-center">
            <h1 className="text-2xl font-semibold mb-2">Complete Your Profile</h1>
            <p className="text-muted-foreground mb-6">
              {!recommendation.hasMarks && "Please add your academic marks. "}
              {!recommendation.hasAssessment && "Please complete the interest assessment."}
            </p>
            <div className="flex gap-3 justify-center">
              {!recommendation.hasAssessment && (
                <Button onClick={() => navigate("/assessment")}>Take Assessment</Button>
              )}
              {!recommendation.hasMarks && (
                <Button variant="outline" onClick={() => navigate("/dashboard")}>
                  Add Marks
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const primaryInfo = STREAM_INFO[recommendation.primary as StreamType];
  const alternativeInfo = recommendation.alternative ? STREAM_INFO[recommendation.alternative.stream as StreamType] : null;

  return (
    <div className="container mx-auto px-4 py-10">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-2xl">Your Personalized Recommendation</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Primary Recommendation */}
            <div className={`inline-flex h-12 items-center rounded-xl px-6 ${primaryInfo.badgeBg}`}>
              <span className="text-2xl mr-3">{primaryInfo.emoji}</span>
              <span className={`font-semibold text-lg ${primaryInfo.color}`}>
                ✅ {primaryInfo.headline}
              </span>
            </div>

            {/* Alternative Recommendation */}
            {recommendation.alternative && alternativeInfo && (
              <div className={`inline-flex h-10 items-center rounded-xl px-4 ${alternativeInfo.badgeBg} ml-4`}>
                <span className="text-lg mr-2">{alternativeInfo.emoji}</span>
                <span className={`font-medium ${alternativeInfo.color}`}>
                  ⚡ Alternative: {alternativeInfo.headline}
                </span>
                <span className="text-xs ml-2 opacity-75">
                  ({recommendation.alternative.reason === "within_5" ? "Very Close Match" : "Close Match"})
                </span>
              </div>
            )}

            {/* Score Breakdown */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4">
              {Object.entries(recommendation.scores).map(([stream, score]) => (
                <div key={stream} className="rounded-lg border p-3">
                  <div className="text-sm text-muted-foreground capitalize">{stream}</div>
                  <div className="flex items-center justify-between mt-1">
                    <div className="font-semibold text-lg">{Math.round(score)}%</div>
                    <div className="w-16 h-2 bg-secondary rounded">
                      <div
                        className="h-2 bg-primary rounded"
                        style={{ width: `${Math.min(100, score)}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-sm text-muted-foreground">
              <strong>How we calculated this:</strong> 60% Academic Performance + 40% Interest Assessment
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Recommendations Grid */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Courses */}
          <Card>
            <CardHeader>
              <CardTitle>🎓 Suggested Degree Programs</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-2">
              {primaryInfo.courses.map((course) => (
                <span key={course} className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm">
                  {course}
                </span>
              ))}
            </CardContent>
          </Card>

          {/* Careers */}
          <Card>
            <CardHeader>
              <CardTitle>💼 Career Opportunities</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-2">
              {primaryInfo.careers.map((career) => (
                <span key={career} className="px-3 py-1 rounded-full bg-secondary text-secondary-foreground text-sm">
                  {career}
                </span>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Colleges */}
        {colleges && colleges.length > 0 && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>🏫 Nearby Government Colleges</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {colleges.slice(0, 6).map((college) => (
                  <div key={college._id} className="p-3 border rounded-lg">
                    <h4 className="font-medium">{college.name}</h4>
                    <p className="text-sm text-muted-foreground">{college.city}, {college.state}</p>
                    <p className="text-xs text-muted-foreground mt-1">{college.type}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Resources */}
        {resources && resources.length > 0 && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>📚 Open Educational Resources</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                {resources.slice(0, 4).map((resource) => (
                  <div key={resource._id} className="p-3 border rounded-lg">
                    <h4 className="font-medium">{resource.title}</h4>
                    <p className="text-sm text-muted-foreground">{resource.description}</p>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {resource.tags.slice(0, 3).map((tag) => (
                        <span key={tag} className="px-2 py-1 bg-muted text-muted-foreground rounded text-xs">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3">
          <Button onClick={() => navigate("/courses")}>Explore Courses</Button>
          <Button variant="outline" onClick={() => navigate("/colleges")}>
            Find Colleges
          </Button>
          <Button variant="outline" onClick={() => navigate("/careers")}>
            Career Paths
          </Button>
          <Button variant="ghost" onClick={() => navigate("/assessment")}>
            Retake Assessment
          </Button>
        </div>
      </motion.div>
    </div>
  );
}