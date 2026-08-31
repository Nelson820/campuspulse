function riskDotColor(risk) {
  if (risk === "High") return "bg-red-500";
  return "bg-green-500";
}

function CoursesAtRisk({ courses }) {
  const atRiskCourses = courses
    .filter((c) => c.mark !== null && c.mark < 70)
    .map((c) => ({
      ...c,
      localRisk: c.mark < 60 ? "High" : "Low",
    }));

  return (
    <div className="mt-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-gray-900">
        Courses at Risk
      </h2>

      {atRiskCourses.length === 0 ? (
        <p className="mt-4 text-sm text-gray-500">
          No courses currently at risk.
        </p>
      ) : (
        <div className="mt-4 space-y-3">
          {atRiskCourses.map((course) => (
            <div
              key={course.id}
              className="flex items-center justify-between border-b border-gray-100 pb-3 last:border-0 last:pb-0"
            >
              <span className="text-sm font-medium text-gray-700">
                {course.name}
              </span>

              <div className="flex items-center gap-2">
                <span className={`h-2.5 w-2.5 rounded-full ${riskDotColor(course.localRisk)}`}></span>
                <span className="text-sm text-gray-600">
                  {course.localRisk}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default CoursesAtRisk;