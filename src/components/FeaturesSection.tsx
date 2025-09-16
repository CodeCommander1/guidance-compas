import { motion } from "framer-motion";
import { 
  BookOpen, 
  Brain, 
  Calendar, 
  GraduationCap, 
  MapPin, 
  TrendingUp,
  Users,
  Zap
} from "lucide-react";

export default function FeaturesSection() {
  const features = [
    {
      icon: Brain,
      title: "AI-Powered Recommendations",
      description: "Get personalized course and career suggestions based on your interests, strengths, and goals using advanced AI algorithms.",
      color: "text-blue-600",
      bgColor: "bg-blue-50 dark:bg-blue-950/20",
    },
    {
      icon: MapPin,
      title: "Location-Based College Search",
      description: "Find government colleges near you with GPS-based search, complete with facilities, cut-offs, and admission details.",
      color: "text-green-600",
      bgColor: "bg-green-50 dark:bg-green-950/20",
    },
    {
      icon: TrendingUp,
      title: "Career Path Visualization",
      description: "Explore detailed career roadmaps showing government exam eligibility, private sector opportunities, and growth prospects.",
      color: "text-purple-600",
      bgColor: "bg-purple-50 dark:bg-purple-950/20",
    },
    {
      icon: Calendar,
      title: "Timeline Tracker",
      description: "Never miss important dates with notifications for admissions, entrance exams, scholarships, and counseling windows.",
      color: "text-orange-600",
      bgColor: "bg-orange-50 dark:bg-orange-950/20",
    },
    {
      icon: BookOpen,
      title: "Free Educational Resources",
      description: "Access e-books, skill development materials, and government-funded learning resources at no cost.",
      color: "text-indigo-600",
      bgColor: "bg-indigo-50 dark:bg-indigo-950/20",
    },
    {
      icon: Users,
      title: "Parent & Student Dashboard",
      description: "Collaborative platform where both students and parents can track progress and make informed decisions together.",
      color: "text-pink-600",
      bgColor: "bg-pink-50 dark:bg-pink-950/20",
    },
  ];

  return (
    <section className="py-24 bg-gradient-to-b from-background to-accent/5">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center space-y-4 mb-16"
        >
          <h2 className="text-3xl lg:text-5xl font-bold tracking-tight">
            Everything You Need for{" "}
            <span className="text-primary">Smart Career Decisions</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Our comprehensive platform combines AI technology with extensive databases 
            to provide personalized guidance for your educational journey.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group relative p-8 rounded-2xl border bg-card hover:shadow-xl transition-all duration-300"
            >
              <div className="space-y-4">
                <div className={`inline-flex h-14 w-14 items-center justify-center rounded-xl ${feature.bgColor}`}>
                  <feature.icon className={`h-7 w-7 ${feature.color}`} />
                </div>
                
                <h3 className="text-xl font-semibold tracking-tight">
                  {feature.title}
                </h3>
                
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>

              {/* Hover effect */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" />
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-center mt-16 p-8 rounded-2xl bg-primary/5 border"
        >
          <div className="flex items-center justify-center mb-4">
            <Zap className="h-8 w-8 text-primary mr-2" />
            <span className="text-2xl font-bold">Ready to Get Started?</span>
          </div>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Join thousands of students who have already discovered their perfect career path 
            with our intelligent guidance system.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
