import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";
import { useEffect } from "react";
import { useNavigate } from "react-router";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { motion } from "framer-motion";
import { toast } from "sonner";

export default function School() {
  const { isLoading, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const roleDoc = useQuery(api.roles.getCurrentRole, {});
  const setRole = useMutation(api.roles.setRole);

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

  const handleSwitchToSchool = async () => {
    try {
      await setRole({ role: "school" });
      toast.success("Switched to School role");
    } catch {
      toast.error("Failed to switch role");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-bg">
      <div className="border-b bg-background/95 backdrop-blur">
        <div className="container mx-auto px-4 py-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">School Portal</h1>
            <p className="text-muted-foreground">
              Role-based access for schools to manage student data
            </p>
          </div>
          <Button variant="outline" onClick={() => navigate("/")}>Back to Home</Button>
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
            <Card>
              <CardHeader>
                <CardTitle>Welcome to the School Portal</CardTitle>
                <CardDescription>
                  You have School role access. Future: add student roster, marks import, approvals, and reports.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-3">
                <Button onClick={() => navigate("/dashboard")}>Open Dashboard</Button>
                <Button variant="outline" onClick={() => navigate("/assessment")}>Student Assessment</Button>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
}
