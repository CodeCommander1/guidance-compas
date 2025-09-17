import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { toast } from "sonner";

type LikertAnswer = {
  id: string;
  value: number; // 1-5
};

type Question = {
  id: string;
  statement: string;
};

// 15 Likert scale statements
const QUESTIONS: Question[] = [
  { id: "q1", statement: "I enjoy solving complex mathematical problems" },
  { id: "q2", statement: "I am curious about how things work scientifically" },
  { id: "q3", statement: "I like conducting experiments and analyzing results" },
  { id: "q4", statement: "I am interested in business and entrepreneurship" },
  { id: "q5", statement: "I enjoy working with numbers and financial data" },
  { id: "q6", statement: "I like understanding market trends and economics" },
  { id: "q7", statement: "I express myself well through writing or speaking" },
  { id: "q8", statement: "I am interested in history, culture, and society" },
  { id: "q9", statement: "I enjoy creative activities like art, music, or literature" },
  { id: "q10", statement: "I prefer hands-on, practical work" },
  { id: "q11", statement: "I enjoy building or creating things with my hands" },
  { id: "q12", statement: "I like learning technical skills and crafts" },
  { id: "q13", statement: "I am good at logical reasoning and analysis" },
  { id: "q14", statement: "I prefer working on projects that help people directly" },
  { id: "q15", statement: "I am comfortable presenting ideas to groups" },
];

const LIKERT_OPTIONS = [
  { value: 1, label: "Strongly Disagree" },
  { value: 2, label: "Disagree" },
  { value: 3, label: "Neutral" },
  { value: 4, label: "Agree" },
  { value: 5, label: "Strongly Agree" },
];

export default function Assessment() {
  const navigate = useNavigate();
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const submitAssessment = useMutation(api.assessments.submitLikert);

  const progress = useMemo(() => {
    const answered = Object.keys(answers).length;
    return Math.round((answered / QUESTIONS.length) * 100);
  }, [answers]);

  const handleChange = (qid: string, value: number) => {
    setAnswers((prev) => ({ ...prev, [qid]: value }));
  };

  const canSubmit = useMemo(() => {
    return QUESTIONS.every((q) => answers[q.id] !== undefined);
  }, [answers]);

  const handleSubmit = async () => {
    if (!canSubmit) return;

    try {
      const answerArray: LikertAnswer[] = QUESTIONS.map((q) => ({
        id: q.id,
        value: answers[q.id],
      }));

      await submitAssessment({ answers: answerArray });
      toast.success("Assessment completed successfully!");
      navigate("/assessment/result");
    } catch (error) {
      toast.error("Failed to submit assessment. Please try again.");
      console.error("Assessment submission error:", error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Interest Assessment</h1>
          <p className="text-muted-foreground">
            Rate each statement based on how much you agree with it (1-5 scale).
          </p>
        </div>
        <div className="text-right">
          <div className="text-sm text-muted-foreground">Progress</div>
          <div className="w-40 h-2 bg-secondary rounded overflow-hidden">
            <div
              className="h-2 bg-primary transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="text-xs text-muted-foreground mt-1">{progress}%</div>
        </div>
      </div>

      <div className="grid gap-6">
        {QUESTIONS.map((q, idx) => (
          <motion.div
            key={q.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.02 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">
                  {idx + 1}. {q.statement}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <RadioGroup
                  value={answers[q.id]?.toString() ?? ""}
                  onValueChange={(val) => handleChange(q.id, parseInt(val))}
                  className="grid grid-cols-1 sm:grid-cols-5 gap-3"
                >
                  {LIKERT_OPTIONS.map((opt) => {
                    const id = `${q.id}-${opt.value}`;
                    return (
                      <div key={id} className="flex items-center space-x-2 rounded-lg border p-3 hover:bg-accent/30">
                        <RadioGroupItem id={id} value={opt.value.toString()} />
                        <Label htmlFor={id} className="cursor-pointer text-sm">
                          <div className="font-medium">{opt.value}</div>
                          <div className="text-xs text-muted-foreground">{opt.label}</div>
                        </Label>
                      </div>
                    );
                  })}
                </RadioGroup>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="mt-8 flex items-center justify-between">
        <Button variant="outline" onClick={() => history.back()}>
          Back
        </Button>
        <Button disabled={!canSubmit} onClick={handleSubmit}>
          Submit Assessment
        </Button>
      </div>
    </div>
  );
}