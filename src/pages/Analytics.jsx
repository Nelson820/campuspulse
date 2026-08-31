import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { fetchCourseAverages } from "../lib/courseData";
import PerformanceTrend from "../components/PerformanceTrend";

function Analytics() {
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

  const chartData = courses
    .filter((c) => c.mark !== null)
    .map((c) => ({ course: c.name, mark: c.mark }));

  return (
    <main className="p-8">
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900">
          Performance by Course
        </h2>

        {loading ? (
          <p className="mt-6 text-sm text-gray-500">Loading...</p>
        ) : error ? (
          <p className="mt-6 text-sm text-red-600">{error}</p>
        ) : chartData.length === 0 ? (
          <p className="mt-6 text-sm text-gray-500">
            No course marks recorded yet.
          </p>
        ) : (
          <div className="mt-6 h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                margin={{ top: 10, right: 20, left: 10, bottom: 60 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="course" angle={-20} textAnchor="end" interval={0} />
                <YAxis
                  domain={[0, 100]}
                  label={{ value: "Mark (%)", angle: -90, position: "insideLeft" }}
                />
                <Tooltip />
                <Bar dataKey="mark" fill="#0f172a" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {!loading && !error && courses.length > 0 && (
        <div className="mt-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Performance Trends
          </h2>

          <div className="grid gap-6 md:grid-cols-2">
            {courses.map((course) => (
              <PerformanceTrend key={course.id} course={course} />
            ))}
          </div>
        </div>
      )}
    </main>
  );
}

export default Analytics;