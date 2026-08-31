import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchCourseAverages, addCourse } from "../lib/courseData";

function Courses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [newName, setNewName] = useState("");
  const [newCode, setNewCode] = useState("");
  const [adding, setAdding] = useState(false);
  const [addError, setAddError] = useState("");

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

  async function handleAddCourse(e) {
    e.preventDefault();
    setAdding(true);
    setAddError("");

    const { error } = await addCourse(newName, newCode);

    setAdding(false);

    if (error) {
      setAddError(error);
      return;
    }

    setNewName("");
    setNewCode("");
    setShowForm(false);
    loadData();
  }

  function statusStyle(risk) {
    if (risk === "High") return "bg-red-100 text-red-700";
    if (risk === "Medium") return "bg-amber-100 text-amber-700";
    if (risk === "Low") return "bg-green-100 text-green-700";
    return "bg-gray-100 text-gray-700";
  }

  return (
    <div className="p-8">
      <div className="mb-8 flex items-start justify-between">
        

        <button
          onClick={() => setShowForm(!showForm)}
          className="rounded-lg bg-slate-900 px-5 py-2 text-white hover:bg-slate-700"
        >
          {showForm ? "Cancel" : "+ Add Course"}
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={handleAddCourse}
          className="mb-8 flex flex-wrap items-end gap-3 rounded-xl border border-gray-200 bg-white p-6 shadow-sm"
        >
          <div className="flex-1 min-w-[160px]">
            <label className="text-sm font-medium text-gray-700">
              Course name
            </label>
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              required
              placeholder="e.g. Computer Science"
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-slate-900"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">Code</label>
            <input
              type="text"
              value={newCode}
              onChange={(e) => setNewCode(e.target.value)}
              required
              placeholder="e.g. CS101"
              className="mt-1 w-32 rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-slate-900"
            />
          </div>

          <button
            type="submit"
            disabled={adding}
            className="rounded-lg bg-slate-900 px-5 py-2 text-white hover:bg-slate-700 disabled:opacity-50"
          >
            {adding ? "Adding..." : "Add"}
          </button>

          {addError && (
            <p className="w-full text-sm text-red-600">{addError}</p>
          )}
        </form>
      )}

      {loading ? (
        <p className="text-sm text-gray-500">Loading...</p>
      ) : error ? (
        <p className="text-sm text-red-600">{error}</p>
      ) : courses.length === 0 ? (
        <p className="text-sm text-gray-500">No courses added yet.</p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {courses.map((course) => (
            <Link
              key={course.id}
              to={`/courses/${course.id}`}
              className="block rounded-xl border border-gray-200 bg-white p-6 shadow-sm hover:border-slate-400 transition-colors"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    {course.code}
                  </p>
                  <h2 className="mt-1 text-lg font-semibold text-gray-900">
                    {course.name}
                  </h2>
                </div>

                <span className={`rounded-full px-3 py-1 text-xs font-medium ${statusStyle(course.risk)}`}>
                  {course.risk === "High" ? "At Risk" : course.risk}
                </span>
              </div>

              <div className="mt-6">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Current Mark</span>
                  <span className="text-sm font-bold text-gray-900">
                    {course.mark !== null ? `${course.mark}%` : "N/A"}
                  </span>
                </div>

                <div className="mt-2 h-2 rounded-full bg-gray-200">
                  <div
                    className="h-2 rounded-full bg-slate-900"
                    style={{ width: `${course.mark ?? 0}%` }}
                  ></div>
                </div>
              </div>

              <div className="mt-6 text-center text-sm font-medium text-slate-900 underline">
                View Details →
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default Courses;