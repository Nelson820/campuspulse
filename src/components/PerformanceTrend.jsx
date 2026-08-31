import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { getPerformanceHistory } from "../lib/courseData";

function trendBadge(trend) {
  if (trend === "Improving") return { text: "↑ Improving", color: "text-green-600" };
  if (trend === "Declining") return { text: "↓ Declining", color: "text-red-600" };
  if (trend === "Stable") return { text: "→ Stable", color: "text-gray-600" };
  return { text: trend, color: "text-gray-400" };
}

function PerformanceTrend({ course }) {
  const history = getPerformanceHistory(course.assessments);
  const badge = trendBadge(course.trend);

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <h3 className="text-md font-semibold text-gray-900">{course.name}</h3>
        <span className={`text-sm font-medium ${badge.color}`}>{badge.text}</span>
      </div>

      {history.length < 2 ? (
        <p className="mt-4 text-sm text-gray-500">
          Not enough graded assessments yet to show a trend.
        </p>
      ) : (
        <div className="mt-4 h-48">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={history} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="cumulativeAverage"
                stroke="#0f172a"
                strokeWidth={2}
                dot={{ r: 3 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}

export default PerformanceTrend;