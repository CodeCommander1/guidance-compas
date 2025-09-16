import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  Clock
} from "lucide-react";
import { useEffect } from "react";
import { useNavigate } from "react-router";
import { useMutation, useQuery } from "convex/react";
import { toast } from "sonner";

export default function Dashboard() {
  const { isLoading, isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  const recommendations = useQuery(api.recommendations.getForUser);
  const upcomingDates = useQuery(api.importantDates.getUpcoming, { limit: 5 });
  const generateRecommendations = useMutation(api.recommendations.generateRecommendations);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate("/auth");
    }
  }, [isLoading, isAuthenticated, navigate]);

  const handleGenerateRecommendations = async () => {
    try {
      const count = await generateRecommendations();
      toast.success(`Generated ${count} personalized recommendations!`);
    } catch (error) {
      toast.error("Failed to generate recommendations");
    }
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
        <Tabs defaultValue="overview" className="space-y-8">
          <TabsList className="grid w-full grid-cols-4 lg:w-[600px]">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
            <TabsTrigger value="timeline">Timeline</TabsTrigger>
            <TabsTrigger value="profile">Profile</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-8">
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Recommendations</CardTitle>
                    <Star className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{recommendations?.length || 0}</div>
                    <p className="text-xs text-muted-foreground">Personalized for you</p>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Upcoming Events</CardTitle>
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{upcomingDates?.length || 0}</div>
                    <p className="text-xs text-muted-foreground">Important dates</p>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Profile Complete</CardTitle>
                    <User className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {user?.interests?.length ? "85%" : "45%"}
                    </div>
                    <p className="text-xs text-muted-foreground">Add interests to improve</p>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Courses Explored</CardTitle>
                    <GraduationCap className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">12</div>
                    <p className="text-xs text-muted-foreground">Keep exploring</p>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => navigate("/courses")}>
                  <CardHeader>
                    <div className="flex items-center space-x-2">
                      <GraduationCap className="h-5 w-5 text-primary" />
                      <CardTitle className="text-lg">Explore Courses</CardTitle>
                    </div>
                    <CardDescription>
                      Discover degree programs that match your interests and career goals
                    </CardDescription>
                  </CardHeader>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => navigate("/colleges")}>
                  <CardHeader>
                    <div className="flex items-center space-x-2">
                      <MapPin className="h-5 w-5 text-primary" />
                      <CardTitle className="text-lg">Find Colleges</CardTitle>
                    </div>
                    <CardDescription>
                      Search for government colleges near you with detailed information
                    </CardDescription>
                  </CardHeader>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
              >
                <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => navigate("/careers")}>
                  <CardHeader>
                    <div className="flex items-center space-x-2">
                      <TrendingUp className="h-5 w-5 text-primary" />
                      <CardTitle className="text-lg">Career Paths</CardTitle>
                    </div>
                    <CardDescription>
                      Visualize career opportunities and growth prospects for each field
                    </CardDescription>
                  </CardHeader>
                </Card>
              </motion.div>
            </div>
          </TabsContent>

          <TabsContent value="recommendations" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold tracking-tight">Your Recommendations</h2>
                <p className="text-muted-foreground">
                  Personalized course suggestions based on your profile
                </p>
              </div>
              <Button onClick={handleGenerateRecommendations}>
                Generate New Recommendations
              </Button>
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
                    <p className="text-muted-foreground">{user?.educationLevel || "Not provided"}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Location</label>
                    <p className="text-muted-foreground">{user?.location || "Not provided"}</p>
                  </div>
                </div>
                
                {user?.interests && user.interests.length > 0 && (
                  <div>
                    <label className="text-sm font-medium">Interests</label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {user.interests.map((interest) => (
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
