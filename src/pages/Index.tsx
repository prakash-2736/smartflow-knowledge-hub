import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Upload, Users, BarChart3 } from "lucide-react";

const Index = () => {
  const quickActions = [
    {
      title: "Upload Documents",
      description: "Add new documents to the system",
      icon: Upload,
      action: () => console.log("Upload clicked")
    },
    {
      title: "View Documents", 
      description: "Browse document repository",
      icon: FileText,
      action: () => console.log("Documents clicked")
    },
    {
      title: "Department View",
      description: "Access department-specific content", 
      icon: Users,
      action: () => console.log("Departments clicked")
    },
    {
      title: "Analytics",
      description: "View system analytics and reports",
      icon: BarChart3, 
      action: () => console.log("Analytics clicked")
    }
  ];

  return (
    <Layout>
      <div className="space-y-8">
        {/* Welcome Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold font-inter text-foreground">
            Welcome to SmartDocFlow
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            AI-powered document automation platform for Kerala Metro Rail Limited. 
            Transform complex document workflows into streamlined, intelligent processes.
          </p>
        </div>

        {/* Quick Actions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {quickActions.map((item) => (
            <Card key={item.title} className="hover:shadow-lg transition-shadow cursor-pointer group">
              <CardHeader className="text-center">
                <div className="mx-auto h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <item.icon className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-lg">{item.title}</CardTitle>
                <CardDescription>{item.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button 
                  onClick={item.action}
                  className="w-full"
                  variant="outline"
                >
                  Get Started
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-primary">1,247</CardTitle>
              <CardDescription>Documents Processed</CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-accent">98%</CardTitle>
              <CardDescription>Processing Accuracy</CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-warning">6</CardTitle>
              <CardDescription>Active Departments</CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Index;
