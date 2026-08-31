function riskBadgeStyle(risk) {
  if (risk === "High") return "bg-red-100 text-red-700";
  if (risk === "Medium") return "bg-amber-100 text-amber-700";
  if (risk === "Low") return "bg-green-100 text-green-700";
  return "bg-gray-100 text-gray-700";
}

function barColor(risk) {
  if (risk === "High-risk") return "bg-red-500";
  if (risk === "Medium-risk") return "bg-amber-500";
  if (risk === "Low-risk") return "bg-slate-900";
  return "bg-gray-400";
}

function CoursePerformance({ courses }) {
  return (
    <div className="mt-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-gray-900">
        Course Performance
      </h2>

      {courses.length === 0 ? (
        <p className="mt-4 text-sm text-gray-500">
          No courses added yet.
        </p>
      ) : (
        <div className="mt-6 space-y-5">
          {courses.map((course) => (
            <div key={course.id}>
              <div className="mb-2 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-700">
                    {course.name}
                  </span>

                  <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${riskBadgeStyle(course.risk)}`}>
                    {course.risk === "High" ? "At Risk" : course.risk}
                  </span>
                </div>

                <span className="text-sm font-semibold text-gray-900">
                  {course.mark !== null ? `${course.mark}%` : "No marks yet"}
                </span>
              </div>

              <div className="h-2 rounded-full bg-gray-200">
                <div
                  className={`h-2 rounded-full ${barColor(course.risk)}`}
                  style={{ width: `${course.mark ?? 0}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default CoursePerformance;