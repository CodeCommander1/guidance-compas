import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/hooks/use-auth";
import { api } from "@/convex/_generated/api";
import { motion } from "framer-motion";
import { 
  BookOpen, 
  Calendar, 
  GraduationCap, 
  MapPin, 
  TrendingUp, 
  User,
  Bell,
  Star,
  Clock,
  Calculator
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useMutation, useQuery } from "convex/react";
import { toast } from "sonner";

export default function Dashboard() {
  const { isLoading, isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  const recommendations = useQuery(api.recommendations.getForUser);
  const upcomingDates = useQuery(api.importantDates.getUpcoming, { limit: 5 });
  const generateRecommendations = useMutation(api.recommendations.generateRecommendations);
  const upsertMarks = useMutation(api.studentMarks.upsertForStudent);
  const currentMarks = useQuery(api.studentMarks.getCurrentUserMarks, {});

  // Marks form state
  const [classLevel, setClassLevel] = useState<"Class10" | "Class12">("Class12");
  const [marks, setMarks] = useState({
    science: { physics: 0, chemistry: 0, biology: 0, mathematics: 0, computerScience: 0 },
    commerce: { accountancy: 0, businessStudies: 0, economics: 0, mathematics: 0, english: 0 },
    arts: { history: 0, politicalScience: 0, sociology: 0, psychology: 0, languages: 0, fineArts: 0 },
    vocational: { agriculture: 0, it: 0, homeScience: 0, hospitality: 0, design: 0, skills: 0 },
  });

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate("/auth");
    }
  }, [isLoading, isAuthenticated, navigate]);

  useEffect(() => {
    if (currentMarks) {
      setClassLevel(currentMarks.classLevel);
      setMarks(currentMarks.streams);
    }
  }, [currentMarks]);

  const handleGenerateRecommendations = async () => {
    try {
      const count = await generateRecommendations();
      toast.success(`Generated ${count} personalized recommendations!`);
    } catch (error) {
      toast.error("Failed to generate recommendations");
    }
  };

  const handleSaveMarks = async () => {
    if (!user) return;
    
    try {
      await upsertMarks({
        studentId: user._id,
        classLevel,
        streams: marks,
      });
      toast.success("Marks saved successfully!");
    } catch (error) {
      toast.error("Failed to save marks");
    }
  };

  const handleResetMarks = () => {
    setMarks({
      science: { physics: 0, chemistry: 0, biology: 0, mathematics: 0, computerScience: 0 },
      commerce: { accountancy: 0, businessStudies: 0, economics: 0, mathematics: 0, english: 0 },
      arts: { history: 0, politicalScience: 0, sociology: 0, psychology: 0, languages: 0, fineArts: 0 },
      vocational: { agriculture: 0, it: 0, homeScience: 0, hospitality: 0, design: 0, skills: 0 },
    });
  };

  const updateMark = (stream: keyof typeof marks, subject: string, value: string) => {
    const numValue = Math.max(0, Math.min(100, parseInt(value) || 0));
    setMarks(prev => ({
      ...prev,
      [stream]: {
        ...prev[stream],
        [subject]: numValue,
      },
    }));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-bg">
      {/* Header */}
      <div className="border-b bg-background/95 backdrop-blur">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">
                Welcome back, {user?.name || "Student"}! 👋
              </h1>
              <p className="text-muted-foreground">
                Your personalized education and career guidance dashboard
              </p>
            </div>
            <Button onClick={() => navigate("/")} variant="outline">
              <BookOpen className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="recommendations" className="space-y-8">
          {/* Tabs + Take Assessment button inline next to Marks */}
          <TabsList className="flex items-center gap-2 flex-wrap">
            <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
            <TabsTrigger value="marks">Marks</TabsTrigger>
            <TabsTrigger
              value="assessment"
              onClick={() => navigate("/assessment")}
            >
              Take Assessment
            </TabsTrigger>
            <TabsTrigger value="timeline">Timeline</TabsTrigger>
            <TabsTrigger value="profile">Profile</TabsTrigger>
          </TabsList>

          <TabsContent value="recommendations" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold tracking-tight">Your Recommendations</h2>
                <p className="text-muted-foreground">
                  Personalized course suggestions based on your profile
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Button onClick={handleGenerateRecommendations}>
                  Generate New Recommendations
                </Button>
              </div>
            </div>

            {recommendations && recommendations.length > 0 ? (
              <div className="grid gap-6">
                {recommendations.map((rec, index) => (
                  <motion.div
                    key={rec._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card>
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <div>
                            <CardTitle className="text-lg">{rec.course?.name}</CardTitle>
                            <CardDescription>{rec.course?.description}</CardDescription>
                          </div>
                          <div className="text-right">
                            <div className="text-2xl font-bold text-primary">{rec.score}%</div>
                            <div className="text-sm text-muted-foreground">Match</div>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div>
                            <h4 className="font-medium mb-2">Why this course?</h4>
                            <ul className="text-sm text-muted-foreground space-y-1">
                              {rec.reasons.map((reason, i) => (
                                <li key={i} className="flex items-start">
                                  <span className="text-primary mr-2">•</span>
                                  {reason}
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {rec.course?.subjects.slice(0, 4).map((subject) => (
                              <span
                                key={subject}
                                className="px-2 py-1 bg-secondary text-secondary-foreground rounded-md text-xs"
                              >
                                {subject}
                              </span>
                            ))}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Star className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">No Recommendations Yet</h3>
                  <p className="text-muted-foreground text-center mb-4">
                    Complete your profile and generate personalized course recommendations
                  </p>
                  <Button onClick={handleGenerateRecommendations}>
                    Generate Recommendations
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="marks" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold tracking-tight">Academic Marks Entry</h2>
                <p className="text-muted-foreground">
                  School Entry (Demo) - Enter your academic performance for personalized recommendations
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Calculator className="h-4 w-4" />
                <span className="text-sm text-muted-foreground">Marks out of 100</span>
              </div>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Class Level</CardTitle>
              </CardHeader>
              <CardContent>
                <Select value={classLevel} onValueChange={(value: "Class10" | "Class12") => setClassLevel(value)}>
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Class10">Class 10</SelectItem>
                    <SelectItem value="Class12">Class 12</SelectItem>
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>

            {/* Science Stream */}
            <Card>
              <CardHeader>
                <CardTitle>Science Stream</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                  {Object.entries(marks.science).map(([subject, value]) => (
                    <div key={subject} className="space-y-2">
                      <Label className="capitalize">{subject.replace(/([A-Z])/g, ' $1').trim()}</Label>
                      <Input
                        type="number"
                        min="0"
                        max="100"
                        value={value}
                        onChange={(e) => updateMark('science', subject, e.target.value)}
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Commerce Stream */}
            <Card>
              <CardHeader>
                <CardTitle>Commerce Stream</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                  {Object.entries(marks.commerce).map(([subject, value]) => (
                    <div key={subject} className="space-y-2">
                      <Label className="capitalize">{subject.replace(/([A-Z])/g, ' $1').trim()}</Label>
                      <Input
                        type="number"
                        min="0"
                        max="100"
                        value={value}
                        onChange={(e) => updateMark('commerce', subject, e.target.value)}
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Arts Stream */}
            <Card>
              <CardHeader>
                <CardTitle>Arts/Humanities Stream</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                  {Object.entries(marks.arts).map(([subject, value]) => (
                    <div key={subject} className="space-y-2">
                      <Label className="capitalize">{subject.replace(/([A-Z])/g, ' $1').trim()}</Label>
                      <Input
                        type="number"
                        min="0"
                        max="100"
                        value={value}
                        onChange={(e) => updateMark('arts', subject, e.target.value)}
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Vocational Stream */}
            <Card>
              <CardHeader>
                <CardTitle>Vocational Stream</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                  {Object.entries(marks.vocational).map(([subject, value]) => (
                    <div key={subject} className="space-y-2">
                      <Label className="capitalize">{subject.replace(/([A-Z])/g, ' $1').trim()}</Label>
                      <Input
                        type="number"
                        min="0"
                        max="100"
                        value={value}
                        onChange={(e) => updateMark('vocational', subject, e.target.value)}
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={handleResetMarks}>
                Reset
              </Button>
              <Button onClick={handleSaveMarks}>
                Save Academic Marks
              </Button>
            </div>

            {currentMarks && (
              <Card>
                <CardHeader>
                  <CardTitle>Computed Averages</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {Object.entries(currentMarks.averages).map(([stream, avg]) => (
                      <div key={stream} className="text-center p-3 border rounded">
                        <div className="text-sm text-muted-foreground capitalize">{stream}</div>
                        <div className="text-2xl font-bold">{Math.round(avg)}%</div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="timeline" className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold tracking-tight">Important Timeline</h2>
              <p className="text-muted-foreground">
                Upcoming admission dates, exams, and deadlines
              </p>
            </div>

            {upcomingDates && upcomingDates.length > 0 ? (
              <div className="space-y-4">
                {upcomingDates.map((date, index) => (
                  <motion.div
                    key={date._id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card>
                      <CardContent className="flex items-center space-x-4 p-6">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                          <Calendar className="h-6 w-6 text-primary" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium">{date.title}</h3>
                          <p className="text-sm text-muted-foreground">{date.description}</p>
                          <div className="flex items-center mt-2 text-xs text-muted-foreground">
                            <Clock className="h-3 w-3 mr-1" />
                            {new Date(date.date).toLocaleDateString()}
                          </div>
                        </div>
                        <div className="text-right">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            date.type === 'exam' ? 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400' :
                            date.type === 'admission' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400' :
                            'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400'
                          }`}>
                            {date.type}
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Bell className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">No Upcoming Events</h3>
                  <p className="text-muted-foreground text-center">
                    We'll notify you when important dates are approaching
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="profile" className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold tracking-tight">Your Profile</h2>
              <p className="text-muted-foreground">
                Complete your profile to get better recommendations
              </p>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>
                  Your personal information and preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Name</label>
                    <p className="text-muted-foreground">{user?.name || "Not provided"}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Email</label>
                    <p className="text-muted-foreground">{user?.email || "Not provided"}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Education Level</label>
                    <p className="text-muted-foreground">{(user as any)?.educationLevel || "Not provided"}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Location</label>
                    <p className="text-muted-foreground">{(user as any)?.location || "Not provided"}</p>
                  </div>
                </div>
                
                {(user as any)?.interests && (user as any).interests.length > 0 && (
                  <div>
                    <label className="text-sm font-medium">Interests</label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {(user as any).interests.map((interest: string) => (
                        <span
                          key={interest}
                          className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm"
                        >
                          {interest}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <Button className="mt-4">
                  Edit Profile
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}