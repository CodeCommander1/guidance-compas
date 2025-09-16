import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router";

type Category = "Science" | "Commerce" | "Arts" | "Vocational";

type Question = {
  id: string;
  prompt: string;
  options: { label: string; category: Category }[];
};

// 15 questions exactly, mapping each option to a category
const QUESTIONS: Question[] = [
  {
    id: "q1",
    prompt: "Which activity do you enjoy the most?",
    options: [
      { label: "Solving puzzles and math problems", category: "Science" },
      { label: "Managing money or running a small business", category: "Commerce" },
      { label: "Writing stories, painting, or debating", category: "Arts" },
      { label: "Fixing gadgets or doing hands-on tasks", category: "Vocational" },
    ],
  },
  {
    id: "q2",
    prompt: "Your favorite school subject is:",
    options: [
      { label: "Mathematics / Physics", category: "Science" },
      { label: "Economics / Business Studies", category: "Commerce" },
      { label: "History / Literature", category: "Arts" },
      { label: "Computer / Crafts / Technical subjects", category: "Vocational" },
    ],
  },
  {
    id: "q3",
    prompt: "How do you prefer to work on a project?",
    options: [
      { label: "Experimenting and testing ideas logically", category: "Science" },
      { label: "Planning budgets and calculating costs", category: "Commerce" },
      { label: "Designing creative presentations", category: "Arts" },
      { label: "Building models or using tools", category: "Vocational" },
    ],
  },
  {
    id: "q4",
    prompt: "Which career sounds most exciting to you?",
    options: [
      { label: "Scientist, Engineer, Doctor", category: "Science" },
      { label: "Entrepreneur, Accountant, Banker", category: "Commerce" },
      { label: "Journalist, Teacher, Artist", category: "Arts" },
      { label: "Technician, ITI Professional, Skilled Worker", category: "Vocational" },
    ],
  },
  {
    id: "q5",
    prompt: "What type of problems do you enjoy solving?",
    options: [
      { label: "Logical or technical challenges", category: "Science" },
      { label: "Business or money-related issues", category: "Commerce" },
      { label: "Social or cultural issues", category: "Arts" },
      { label: "Practical, hands-on problems", category: "Vocational" },
    ],
  },
  {
    id: "q6",
    prompt: "If given a free day, what would you do?",
    options: [
      { label: "Read about science/technology", category: "Science" },
      { label: "Track stock markets/business news", category: "Commerce" },
      { label: "Write, paint, or attend cultural events", category: "Arts" },
      { label: "Repair/build something", category: "Vocational" },
    ],
  },
  {
    id: "q7",
    prompt: "Which skill describes you best?",
    options: [
      { label: "Analytical & logical", category: "Science" },
      { label: "Good with numbers & money", category: "Commerce" },
      { label: "Creative & expressive", category: "Arts" },
      { label: "Practical & technical", category: "Vocational" },
    ],
  },
  {
    id: "q8",
    prompt: "In a group project, your role is usually:",
    options: [
      { label: "The problem-solver with technical ideas", category: "Science" },
      { label: "The planner and organizer", category: "Commerce" },
      { label: "The presenter/communicator", category: "Arts" },
      { label: "The one who builds/executes", category: "Vocational" },
    ],
  },
  {
    id: "q9",
    prompt: "Your dream work environment is:",
    options: [
      { label: "Research lab, hospital, or tech company", category: "Science" },
      { label: "Corporate office or own business", category: "Commerce" },
      { label: "Media house, classroom, or creative studio", category: "Arts" },
      { label: "Workshop, fieldwork, or factory", category: "Vocational" },
    ],
  },
  {
    id: "q10",
    prompt: "Which government exam/job appeals to you most?",
    options: [
      { label: "Engineering/Medical Entrance (JEE/NEET)", category: "Science" },
      { label: "UPSC/CA/Bank PO", category: "Commerce" },
      { label: "Civil Services/Teaching/Journalism", category: "Arts" },
      { label: "ITI/Skilled Trades/Technical Officer", category: "Vocational" },
    ],
  },
  {
    id: "q11",
    prompt: "What motivates you the most?",
    options: [
      { label: "Discovering new knowledge", category: "Science" },
      { label: "Earning & managing wealth", category: "Commerce" },
      { label: "Expressing ideas & creativity", category: "Arts" },
      { label: "Building real things with skills", category: "Vocational" },
    ],
  },
  {
    id: "q12",
    prompt: "Your strength in exams is:",
    options: [
      { label: "Problem-solving questions", category: "Science" },
      { label: "Data interpretation & accounts", category: "Commerce" },
      { label: "Essay writing & theory", category: "Arts" },
      { label: "Practical tests", category: "Vocational" },
    ],
  },
  {
    id: "q13",
    prompt: "Which type of book/article do you like to read?",
    options: [
      { label: "Science magazines/tech blogs", category: "Science" },
      { label: "Business/finance news", category: "Commerce" },
      { label: "Literature, history, biographies", category: "Arts" },
      { label: "DIY manuals, how-to guides", category: "Vocational" },
    ],
  },
  {
    id: "q14",
    prompt: "If you had to choose a competition, it would be:",
    options: [
      { label: "Science/Math Olympiad", category: "Science" },
      { label: "Business Plan Contest", category: "Commerce" },
      { label: "Debate/Art/Literature Contest", category: "Arts" },
      { label: "Robotics/Model-making Contest", category: "Vocational" },
    ],
  },
  {
    id: "q15",
    prompt: "Your role model is likely to be:",
    options: [
      { label: "Scientist/Doctor/Engineer", category: "Science" },
      { label: "Business leader/Investor", category: "Commerce" },
      { label: "Writer/Teacher/Artist", category: "Arts" },
      { label: "Technician/Innovator", category: "Vocational" },
    ],
  },
];

export default function Assessment() {
  const navigate = useNavigate();
  const [answers, setAnswers] = useState<Record<string, Category | undefined>>({});

  const progress = useMemo(() => {
    const answered = Object.values(answers).filter(Boolean).length;
    return Math.round((answered / QUESTIONS.length) * 100);
  }, [answers]);

  const handleChange = (qid: string, category: Category) => {
    setAnswers((prev) => ({ ...prev, [qid]: category }));
  };

  const canSubmit = useMemo(() => {
    return QUESTIONS.every((q) => !!answers[q.id]);
  }, [answers]);

  const handleSubmit = () => {
    if (!canSubmit) return;

    const tally: Record<Category, number> = {
      Science: 0,
      Commerce: 0,
      Arts: 0,
      Vocational: 0,
    };

    Object.values(answers).forEach((cat) => {
      if (cat) tally[cat] += 1;
    });

    // Determine primary by highest score; tie-break by fixed order
    const order: Category[] = ["Science", "Commerce", "Arts", "Vocational"];
    const primary = order.reduce((best, cur) => (tally[cur] > tally[best] ? cur : best), order[0]);

    navigate("/assessment/result", {
      state: {
        scores: tally,
        primary,
        total: QUESTIONS.length,
      },
    });
  };

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Career Interest Assessment</h1>
          <p className="text-muted-foreground">
            Answer {QUESTIONS.length} quick questions to discover your best-fit field.
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
                  {idx + 1}. {q.prompt}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <RadioGroup
                  value={answers[q.id] ?? ""}
                  onValueChange={(val) => handleChange(q.id, val as Category)}
                  className="grid gap-3"
                >
                  {q.options.map((opt) => {
                    const value = opt.category;
                    const id = `${q.id}-${value}`;
                    return (
                      <div key={id} className="flex items-center space-x-3 rounded-lg border p-3 hover:bg-accent/30">
                        <RadioGroupItem id={id} value={value} />
                        <Label htmlFor={id} className="cursor-pointer">
                          {opt.label}
                        </Label>
                        <span className="ml-auto text-xs px-2 py-0.5 rounded bg-secondary text-secondary-foreground">
                          {value}
                        </span>
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
          See My Result
        </Button>
      </div>
    </div>
  );
}
