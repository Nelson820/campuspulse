import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  fetchCourseDetail,
  addAssessment,
  saveMark,
  calculateWhatIf,
  updateAssessment,
  deleteAssessment,
} from "../lib/courseData";

function AssessmentRow({ assessment, courseId, onSaved }) {
  const existingMark = assessment.marks[0] || null;
  const [score, setScore] = useState(existingMark?.score ?? "");
  const [maxScore, setMaxScore] = useState(existingMark?.max_score ?? "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [editing, setEditing] = useState(false);
  const [editName, setEditName] = useState(assessment.name);
  const [editType, setEditType] = useState(assessment.type);
  const [editWeight, setEditWeight] = useState(assessment.weight);
  const [editSaving, setEditSaving] = useState(false);
  const [editError, setEditError] = useState("");
  const [deleting, setDeleting] = useState(false);

  async function handleSaveMark() {
    setSaving(true);
    setError("");

    const { error } = await saveMark(
      assessment.id,
      existingMark?.id,
      parseFloat(score),
      parseFloat(maxScore)
    );

    setSaving(false);

    if (error) {
      setError(error);
      return;
    }

    onSaved();
  }

  async function handleUpdateAssessment(e) {
    e.preventDefault();
    setEditSaving(true);
    setEditError("");

    const { error } = await updateAssessment(
      assessment.id,
      courseId,
      editName,
      editType,
      parseFloat(editWeight)
    );

    setEditSaving(false);

    if (error) {
      setEditError(error);
      return;
    }

    setEditing(false);
    onSaved();
  }

  async function handleDelete() {
    if (!window.confirm(`Delete "${assessment.name}"? This can't be undone.`)) {
      return;
    }

    setDeleting(true);
    const { error } = await deleteAssessment(assessment.id);
    setDeleting(false);

    if (error) {
      setError(error);
      return;
    }

    onSaved();
  }

  if (editing) {
    return (
      <form
        onSubmit={handleUpdateAssessment}
        className="flex flex-wrap items-end gap-3 rounded-lg border border-slate-300 bg-slate-50 p-4"
      >
        <div className="flex-1 min-w-[140px]">
          <label className="text-sm font-medium text-gray-700">Name</label>
          <input
            type="text"
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
            required
            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-slate-900"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700">Type</label>
          <select
            value={editType}
            onChange={(e) => setEditType(e.target.value)}
            className="mt-1 rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-slate-900 bg-white"
          >
            <option value="assignment">Assignment</option>
            <option value="quiz">Quiz</option>
            <option value="test">Test</option>
            <option value="exam">Exam</option>
          </select>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700">Weight</label>
          <input
            type="number"
            value={editWeight}
            onChange={(e) => setEditWeight(e.target.value)}
            required
            className="mt-1 w-24 rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-slate-900"
          />
        </div>

        <button
          type="submit"
          disabled={editSaving}
          className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700 disabled:opacity-50"
        >
          {editSaving ? "Saving..." : "Save"}
        </button>

        <button
          type="button"
          onClick={() => setEditing(false)}
          className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
        >
          Cancel
        </button>

        {editError && <p className="w-full text-sm text-red-600">{editError}</p>}
      </form>
    );
  }

  return (
    <div className="flex flex-wrap items-center gap-3 rounded-lg border border-gray-200 p-4">
      <div className="min-w-[140px] flex-1">
        <p className="font-medium text-gray-900">{assessment.name}</p>
        <p className="text-sm text-gray-500">
          {assessment.type} · weight {assessment.weight}
        </p>
      </div>

      <input
        type="number"
        value={score}
        onChange={(e) => setScore(e.target.value)}
        placeholder="Score"
        className="w-24 rounded-lg border border-gray-300 px-3 py-1.5 outline-none focus:border-slate-900"
      />
      <span className="text-gray-400">/</span>
      <input
        type="number"
        value={maxScore}
        onChange={(e) => setMaxScore(e.target.value)}
        placeholder="Max"
        className="w-24 rounded-lg border border-gray-300 px-3 py-1.5 outline-none focus:border-slate-900"
      />

      <button
        onClick={handleSaveMark}
        disabled={saving || score === "" || maxScore === ""}
        className="rounded-lg bg-slate-900 px-4 py-1.5 text-sm font-medium text-white hover:bg-slate-700 disabled:opacity-50"
      >
        {saving ? "Saving..." : "Save"}
      </button>

      <button
        onClick={() => setEditing(true)}
        className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-100"
      >
        Edit
      </button>

      <button
        onClick={handleDelete}
        disabled={deleting}
        className="rounded-lg border border-red-300 px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-50 disabled:opacity-50"
      >
        {deleting ? "Deleting..." : "Delete"}
      </button>

      {error && <p className="w-full text-sm text-red-600">{error}</p>}
    </div>
  );
}

function WhatIfCalculator({ assessments }) {
  const [target, setTarget] = useState("70");
  const [result, setResult] = useState(null);

  function handleCalculate(e) {
    e.preventDefault();
    const targetNum = parseFloat(target);
    if (isNaN(targetNum)) return;
    setResult(calculateWhatIf(assessments, targetNum));
  }

  const remaining = assessments.filter((a) => !a.marks[0]);

  return (
    <div className="mt-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-gray-900">
        What-If Calculator
      </h2>
      <p className="mt-1 text-sm text-gray-500">
        See what you need on the remaining assessments to hit a target mark.
      </p>

      <form onSubmit={handleCalculate} className="mt-4 flex items-end gap-3">
        <div>
          <label className="text-sm font-medium text-gray-700">
            Target overall mark (%)
          </label>
          <input
            type="number"
            value={target}
            onChange={(e) => setTarget(e.target.value)}
            className="mt-1 w-32 rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-slate-900"
          />
        </div>

        <button
          type="submit"
          className="rounded-lg bg-slate-900 px-5 py-2 text-white hover:bg-slate-700"
        >
          Calculate
        </button>
      </form>

      {result && (
        <div className="mt-4 rounded-lg bg-gray-50 p-4">
          {!result.possible ? (
            <p className="text-sm text-gray-600">{result.reason}</p>
          ) : result.neededAverage > 100 ? (
            <p className="text-sm text-red-600">
              You'd need {result.neededAverage}% on the remaining assessments —
              that's not achievable. This target may be out of reach.
            </p>
          ) : result.neededAverage < 0 ? (
            <p className="text-sm text-green-600">
              You've already secured this target regardless of remaining
              assessments.
            </p>
          ) : (
            <p className="text-sm text-gray-800">
              You need an average of{" "}
              <span className="font-bold">{result.neededAverage}%</span> across
              the remaining assessment{remaining.length !== 1 ? "s" : ""}{" "}
              ({remaining.map((a) => a.name).join(", ")}) to reach{" "}
              {target}% overall.
            </p>
          )}
        </div>
      )}
    </div>
  );
}

function CourseDetail() {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [newName, setNewName] = useState("");
  const [newType, setNewType] = useState("assignment");
  const [newWeight, setNewWeight] = useState("");
  const [addingError, setAddingError] = useState("");
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    loadCourse();
  }, [id]);

  async function loadCourse() {
    setLoading(true);
    const { course, error } = await fetchCourseDetail(id);

    if (error) {
      setError(error);
      setLoading(false);
      return;
    }

    setCourse(course);
    setLoading(false);
  }

  async function handleAddAssessment(e) {
    e.preventDefault();
    setAdding(true);
    setAddingError("");

    const { error } = await addAssessment(
      id,
      newName,
      newType,
      parseFloat(newWeight)
    );

    setAdding(false);

    if (error) {
      setAddingError(error);
      return;
    }

    setNewName("");
    setNewType("assignment");
    setNewWeight("");
    loadCourse();
  }

  if (loading) {
    return (
      <main className="p-8">
        <p className="text-gray-600">Loading...</p>
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
      <Link to="/courses" className="text-sm text-slate-600 underline">
        ← Back to courses
      </Link>

      <div className="mt-4 mb-8">
        <p className="text-sm font-medium text-gray-500">{course.code}</p>
        <h1 className="text-3xl font-bold text-gray-900">{course.name}</h1>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900">Assessments</h2>

        <div className="mt-4 space-y-3">
          {course.assessments.length === 0 ? (
            <p className="text-sm text-gray-500">No assessments added yet.</p>
          ) : (
            course.assessments.map((assessment) => (
              <AssessmentRow
                key={assessment.id}
                assessment={assessment}
                courseId={id}
                onSaved={loadCourse}
              />
            ))
          )}
        </div>

        <form
          onSubmit={handleAddAssessment}
          className="mt-6 flex flex-wrap items-end gap-3 border-t border-gray-200 pt-6"
        >
          <div className="flex-1 min-w-[160px]">
            <label className="text-sm font-medium text-gray-700">
              Assessment name
            </label>
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              required
              placeholder="e.g. Midterm"
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-slate-900"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">Type</label>
            <select
              value={newType}
              onChange={(e) => setNewType(e.target.value)}
              className="mt-1 rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-slate-900 bg-white"
            >
              <option value="assignment">Assignment</option>
              <option value="quiz">Quiz</option>
              <option value="test">Test</option>
              <option value="exam">Exam</option>
            </select>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">Weight</label>
            <input
              type="number"
              value={newWeight}
              onChange={(e) => setNewWeight(e.target.value)}
              required
              placeholder="e.g. 20"
              className="mt-1 w-24 rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-slate-900"
            />
          </div>

          <button
            type="submit"
            disabled={adding}
            className="rounded-lg bg-slate-900 px-5 py-2 text-white hover:bg-slate-700 disabled:opacity-50"
          >
            {adding ? "Adding..." : "Add Assessment"}
          </button>

          {addingError && (
            <p className="w-full text-sm text-red-600">{addingError}</p>
          )}
        </form>
      </div>

      <WhatIfCalculator assessments={course.assessments} />
    </main>
  );
}

export default CourseDetail;