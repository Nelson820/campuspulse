import { useEffect, useState } from "react";
import { fetchCourseAverages, getOverallRisk } from "../lib/courseData";
import StatCard from "../components/StatCard";
import CoursePerformance from "../components/CoursePerformance";
import CoursesAtRisk from "../components/CoursesAtRisk";

function Dashboard() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    const { courses, error } = await fetchCourseAverages();

    if (error) {
      setError(error);
      setLoading(false);
      return;
    }

    setCourses(courses);
    setLoading(false);
  }

  const coursesWithMarks = courses.filter((c) => c.mark !== null);
  const overallAverage = coursesWithMarks.length > 0
    ? Math.round(
        coursesWithMarks.reduce((sum, c) => sum + c.mark, 0) / coursesWithMarks.length
      )
    : null;

  const riskLevel = getOverallRisk(courses);

  if (loading) {
    return (
      <main className="p-8">
        <p className="text-gray-600">Loading dashboard...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="p-8">
        <p className="text-red-600">{error}</p>
      </main>
    );
  }

  return (
    <main className="p-8">
      <h1 className="text-3xl font-bold">
        Welcome to CampusPulse 👋
      </h1>

      <p className="mt-2 text-gray-600">
        Here's an overview of your academic performance.
      </p>

      <div className="mt-8 grid gap-6 md:grid-cols-3">
        <StatCard
          title="Overall Average"
          value={overallAverage !== null ? `${overallAverage}%` : "N/A"}
          description="Across all courses"
        />

        <StatCard
          title="Courses"
          value={courses.length}
          description="Currently enrolled"
        />

        <StatCard
          title="Academic Risk"
          value={riskLevel}
          description="Based on your most at-risk course"
        />
      </div>

      <CoursePerformance courses={courses} />
      <CoursesAtRisk courses={courses} />
    </main>
  );
}

export default Dashboard;