import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { CardFooter } from "@/components/ui/card";

export default function School() {
  const { isLoading, isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const roleDoc = useQuery(api.roles.getCurrentRole, {});
  const setRole = useMutation(api.roles.setRole);
  const stats = useQuery(api.school.getDashboardStats, {});
  const [search, setSearch] = useState("");
  const students = useQuery(api.school.listStudents, { search, limit: 100 });
  const upsertMarksSchool = useMutation(api.school.upsertMarksForStudentBySchool);
  const updateMyName = useMutation(api.profile.updateMyName);

  // Selected student and marks form state
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);
  const [classLevel, setClassLevel] = useState<"Class10" | "Class12">("Class12");
  const [marks, setMarks] = useState({
    science: { physics: 0, chemistry: 0, biology: 0, mathematics: 0, computerScience: 0 },
    commerce: { accountancy: 0, businessStudies: 0, economics: 0, mathematics: 0, english: 0 },
    arts: { history: 0, politicalScience: 0, sociology: 0, psychology: 0, languages: 0, fineArts: 0 },
    vocational: { agriculture: 0, it: 0, homeScience: 0, hospitality: 0, design: 0, skills: 0 },
  });

  const [profileName, setProfileName] = useState<string>("");
  const [profileSchoolName, setProfileSchoolName] = useState<string>("");

  useEffect(() => {
    if (user) {
      setProfileName(user.name || "");
    }
  }, [user]);

  useEffect(() => {
    if (roleDoc) {
      setProfileSchoolName(roleDoc.schoolName || "");
    }
  }, [roleDoc]);

  const updateMark = (stream: keyof typeof marks, subject: string, value: string) => {
    const num = Math.max(0, Math.min(100, parseInt(value) || 0));
    setMarks((prev) => ({
      ...prev,
      [stream]: { ...prev[stream], [subject]: num },
    }));
  };

  const handleSaveMarksForStudent = async () => {
    if (!selectedStudentId) {
      toast.error("Please select a student first");
      return;
    }
    try {
      await upsertMarksSchool({
        studentId: selectedStudentId as any,
        classLevel,
        streams: marks as any,
      });
      toast.success("Marks saved for student");
    } catch {
      toast.error("Failed to save marks");
    }
  };

  const handleSwitchToSchool = async () => {
    try {
      await setRole({ role: "school", schoolName: "Your School" });
      toast.success("Switched to School role");
      navigate("/school");
    } catch {
      toast.error("Failed to switch role");
    }
  };

  const handleSaveProfile = async () => {
    try {
      if (profileName && profileName !== (user?.name || "")) {
        await updateMyName({ name: profileName });
      }
      // Persist school name via roles.setRole
      if (profileSchoolName !== (roleDoc?.schoolName || "")) {
        await setRole({ role: "school", schoolName: profileSchoolName || "Your School" });
      }
      toast.success("Profile updated");
    } catch {
      toast.error("Failed to update profile");
    }
  };

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate("/auth");
    }
  }, [isLoading, isAuthenticated, navigate]);

  if (isLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  const isSchool = roleDoc?.role === "school";
  const teacherName = "Teacher"; // derive from user in future if needed
  const schoolName = roleDoc?.schoolName || "Your School";

  return (
    <div className="min-h-screen bg-gradient-bg">
      {/* Header */}
      <div className="border-b bg-background/95 backdrop-blur">
        <div className="container mx-auto px-4 py-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/logo.svg" alt="School Logo" className="h-8 w-8" />
            <div>
              <h1 className="text-2xl font-bold tracking-tight">{schoolName} — School Portal</h1>
              <p className="text-muted-foreground">Logged in: {teacherName} (School)</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => navigate("/dashboard")}>Profile</Button>
            <Button variant="outline" onClick={() => navigate("/")}>Help</Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 space-y-6">
        {!isSchool ? (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
            <Card>
              <CardHeader>
                <CardTitle>Access Restricted</CardTitle>
                <CardDescription>
                  You need the School role to access this portal.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-3">
                <Button onClick={handleSwitchToSchool}>Switch to School role</Button>
                <Button variant="outline" onClick={() => navigate("/dashboard")}>
                  Go to Dashboard
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        ) : (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            {/* Profile (Editable) */}
            <Card>
              <CardHeader>
                <CardTitle>Profile</CardTitle>
                <CardDescription>Update your display name and school name</CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="displayName">Display Name</Label>
                  <Input
                    id="displayName"
                    placeholder="Your name"
                    value={profileName}
                    onChange={(e) => setProfileName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="schoolName">School Name</Label>
                  <Input
                    id="schoolName"
                    placeholder="Enter school name"
                    value={profileSchoolName}
                    onChange={(e) => setProfileSchoolName(e.target.value)}
                  />
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button onClick={handleSaveProfile}>Save Profile</Button>
              </CardFooter>
            </Card>

            {/* Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Total Students</CardTitle>
                </CardHeader>
                <CardContent><div className="text-2xl font-bold">{stats?.totalStudents ?? 0}</div></CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Marks Submitted</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats?.marksSubmittedCount ?? 0}</div>
                  <div className="text-xs text-muted-foreground">{stats?.marksSubmittedPercent ?? 0}%</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Assessments Completed</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats?.assessmentsCompletedCount ?? 0}</div>
                  <div className="text-xs text-muted-foreground">{stats?.assessmentsPercent ?? 0}%</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Students with Recommendations</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats?.recommendedStudentsCount ?? 0}</div>
                </CardContent>
              </Card>
            </div>

            {/* Student Management */}
            <Card>
              <CardHeader>
                <CardTitle>Student Management</CardTitle>
                <CardDescription>Search and manage students</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-col md:flex-row gap-3 md:items-center justify-between">
                  <Input
                    placeholder="Search by name or email..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="max-w-md"
                  />
                  <div className="text-sm text-muted-foreground">
                    Pending Entries: {stats?.pendingStudents?.length ?? 0}
                  </div>
                </div>
                <div className="overflow-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-left border-b">
                        <th className="py-2 pr-3">Name</th>
                        <th className="py-2 pr-3">Email</th>
                        <th className="py-2 pr-3">Class</th>
                        <th className="py-2 pr-3">Marks</th>
                        <th className="py-2 pr-3">Assessment</th>
                        <th className="py-2 pr-3">Recommendations</th>
                        <th className="py-2 pr-3">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(students ?? []).map((s) => (
                        <tr key={s.userId} className="border-b last:border-0">
                          <td className="py-2 pr-3">{s.name || "—"}</td>
                          <td className="py-2 pr-3">{s.email || "—"}</td>
                          <td className="py-2 pr-3">{s.classLevel || "—"}</td>
                          <td className="py-2 pr-3">
                            <span className={`px-2 py-1 rounded text-xs ${s.hasMarks ? "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400" : "bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400"}`}>
                              {s.hasMarks ? "✅ Complete" : "❌ Pending"}
                            </span>
                          </td>
                          <td className="py-2 pr-3">
                            <span className={`px-2 py-1 rounded text-xs ${s.hasAssessment ? "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400" : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400"}`}>
                              {s.hasAssessment ? "Completed" : "Not Attempted"}
                            </span>
                          </td>
                          <td className="py-2 pr-3">
                            <span className={`px-2 py-1 rounded text-xs ${s.hasRecommendations ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}`}>
                              {s.hasRecommendations ? "Available" : "None"}
                            </span>
                          </td>
                          <td className="py-2 pr-3">
                            <Button size="sm" variant={selectedStudentId === (s.userId as any) ? "default" : "outline"} onClick={() => setSelectedStudentId(s.userId as any)}>
                              {selectedStudentId === (s.userId as any) ? "Selected" : "Select"}
                            </Button>
                          </td>
                        </tr>
                      ))}
                      {(students ?? []).length === 0 && (
                        <tr>
                          <td colSpan={7} className="py-6 text-center text-muted-foreground">No students found</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            {/* Marks Entry Module */}
            <Card>
              <CardHeader>
                <CardTitle>Marks Entry</CardTitle>
                <CardDescription>Enter marks for the selected student</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex flex-wrap items-center gap-3">
                  <div className="text-sm">
                    Selected Student:{" "}
                    <span className="font-medium">
                      {selectedStudentId
                        ? (students ?? []).find((s) => (s.userId as any) === selectedStudentId)?.name || selectedStudentId
                        : "None"}
                    </span>
                  </div>
                  <Select value={classLevel} onValueChange={(v: "Class10" | "Class12") => setClassLevel(v)}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Class level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Class10">Class 10</SelectItem>
                      <SelectItem value="Class12">Class 12</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Science */}
                <div>
                  <div className="font-medium mb-2">Science</div>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                    {Object.entries(marks.science).map(([subject, value]) => (
                      <div key={subject} className="space-y-1">
                        <Label className="capitalize">{subject.replace(/([A-Z])/g, " $1").trim()}</Label>
                        <Input type="number" min="0" max="100" value={value} onChange={(e) => updateMark("science", subject, e.target.value)} />
                      </div>
                    ))}
                  </div>
                </div>
                {/* Commerce */}
                <div>
                  <div className="font-medium mb-2">Commerce</div>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                    {Object.entries(marks.commerce).map(([subject, value]) => (
                      <div key={subject} className="space-y-1">
                        <Label className="capitalize">{subject.replace(/([A-Z])/g, " $1").trim()}</Label>
                        <Input type="number" min="0" max="100" value={value} onChange={(e) => updateMark("commerce", subject, e.target.value)} />
                      </div>
                    ))}
                  </div>
                </div>
                {/* Arts */}
                <div>
                  <div className="font-medium mb-2">Arts / Humanities</div>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                    {Object.entries(marks.arts).map(([subject, value]) => (
                      <div key={subject} className="space-y-1">
                        <Label className="capitalize">{subject.replace(/([A-Z])/g, " $1").trim()}</Label>
                        <Input type="number" min="0" max="100" value={value} onChange={(e) => updateMark("arts", subject, e.target.value)} />
                      </div>
                    ))}
                  </div>
                </div>
                {/* Vocational */}
                <div>
                  <div className="font-medium mb-2">Vocational</div>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                    {Object.entries(marks.vocational).map(([subject, value]) => (
                      <div key={subject} className="space-y-1">
                        <Label className="capitalize">{subject.replace(/([A-Z])/g, " $1").trim()}</Label>
                        <Input type="number" min="0" max="100" value={value} onChange={(e) => updateMark("vocational", subject, e.target.value)} />
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button onClick={handleSaveMarksForStudent} disabled={!selectedStudentId}>
                  Save Marks
                </Button>
              </CardFooter>
            </Card>

            {/* Assessment Tracking */}
            <Card>
              <CardHeader>
                <CardTitle>Assessment Tracking</CardTitle>
                <CardDescription>Progress of the 15-question assessment</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="text-sm text-muted-foreground mb-1">
                    {stats?.assessmentsPercent ?? 0}% students completed
                  </div>
                  <div className="w-full h-2 bg-secondary rounded overflow-hidden">
                    <div
                      className="h-2 bg-primary transition-all"
                      style={{ width: `${stats?.assessmentsPercent ?? 0}%` }}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="text-sm font-medium">Pending Assessment (sample)</div>
                  <div className="flex flex-wrap gap-2">
                    {(students ?? [])
                      .filter((s) => !s.hasAssessment)
                      .slice(0, 10)
                      .map((s) => (
                        <div key={s.userId} className="px-2 py-1 rounded border text-xs flex items-center gap-2">
                          <span>{s.name || s.email || s.userId}</span>
                          <Button
                            size="sm" variant="outline"
                            onClick={() => toast.success(`Reminder sent to ${s.email || s.name || "student"}`)}
                          >
                            Send Reminder
                          </Button>
                        </div>
                      ))}
                    {(students ?? []).filter((s) => !s.hasAssessment).length === 0 && (
                      <div className="text-xs text-muted-foreground">No pending assessments</div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
}