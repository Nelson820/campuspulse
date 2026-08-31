import { supabase } from "./supabase";

// Given a course's assessments (with marks), calculate what average score
// is needed on the remaining (ungraded) assessments to hit a target overall %.
export function calculateWhatIf(assessments, targetPercent) {
  let completedWeightedSum = 0;
  let totalWeight = 0;
  let remainingWeight = 0;

  assessments.forEach((assessment) => {
    totalWeight += assessment.weight;

    const mark = assessment.marks[0];

    if (mark && mark.max_score > 0) {
      const percentage = (mark.score / mark.max_score) * 100;
      completedWeightedSum += percentage * assessment.weight;
    } else {
      remainingWeight += assessment.weight;
    }
  });

  if (remainingWeight === 0) {
    return {
      possible: false,
      reason:
        totalWeight === 0
          ? "No assessments added yet."
          : "All assessments are already graded — nothing left to calculate.",
    };
  }

  const neededAverage =
    (targetPercent * totalWeight - completedWeightedSum) / remainingWeight;

  return {
    possible: true,
    neededAverage: Math.round(neededAverage * 10) / 10,
    remainingWeight,
    totalWeight,
  };
}

export function getCourseRisk(mark) {
  if (mark === null) return "No Data";
  if (mark < 50) return "High";
  if (mark < 65) return "Medium";
  return "Low";
}

// Builds a chronological list of graded assessments (by when the mark was
// recorded) with a running cumulative weighted average at each point.
export function getPerformanceHistory(assessments) {
  const graded = [];

  assessments.forEach((assessment) => {
    const mark = assessment.marks[0];
    if (mark && mark.max_score > 0) {
      graded.push({
        name: assessment.name,
        weight: assessment.weight,
        percentage: (mark.score / mark.max_score) * 100,
        date: mark.created_at,
      });
    }
  });

  graded.sort((a, b) => new Date(a.date) - new Date(b.date));

  let weightedSum = 0;
  let totalWeight = 0;

  return graded.map((item) => {
    weightedSum += item.percentage * item.weight;
    totalWeight += item.weight;
    return {
      name: item.name,
      cumulativeAverage: Math.round((weightedSum / totalWeight) * 10) / 10,
    };
  });
}

// Simple trend: compares the most recent graded assessment's percentage
// against the average of everything before it.
export function getTrend(assessments) {
  const graded = [];

  assessments.forEach((assessment) => {
    const mark = assessment.marks[0];
    if (mark && mark.max_score > 0) {
      graded.push({
        percentage: (mark.score / mark.max_score) * 100,
        date: mark.created_at,
      });
    }
  });

  if (graded.length < 2) return "Not enough data";

  graded.sort((a, b) => new Date(a.date) - new Date(b.date));

  const latest = graded[graded.length - 1].percentage;
  const previous = graded.slice(0, -1);
  const previousAverage =
    previous.reduce((sum, g) => sum + g.percentage, 0) / previous.length;

  const diff = latest - previousAverage;

  if (diff > 3) return "Improving";
  if (diff < -3) return "Declining";
  return "Stable";
}

export async function fetchCourseAverages() {
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { courses: [], error: "No logged-in user found." };
  }

  const { data, error } = await supabase
    .from("courses")
    .select(`
      id,
      name,
      code,
      assessments (
        id,
        name,
        weight,
        marks ( score, max_score, created_at )
      )
    `)
    .eq("user_id", user.id);

  if (error) {
    return { courses: [], error: error.message };
  }

  const courses = data.map((course) => {
    let weightedSum = 0;
    let totalWeight = 0;

    course.assessments.forEach((assessment) => {
      assessment.marks.forEach((mark) => {
        if (mark.max_score > 0) {
          const percentage = (mark.score / mark.max_score) * 100;
          weightedSum += percentage * assessment.weight;
          totalWeight += assessment.weight;
        }
      });
    });

    const mark = totalWeight > 0
      ? Math.round(weightedSum / totalWeight)
      : null;

    return {
      id: course.id,
      name: course.name,
      code: course.code,
      mark,
      risk: getCourseRisk(mark),
      assessments: course.assessments,
      trend: getTrend(course.assessments),
    };
  });

  return { courses, error: null };
}

// Overall risk = the worst risk level among courses that have marks.
// This means one struggling course can't hide behind good grades elsewhere.
export function getOverallRisk(courses) {
  const withMarks = courses.filter((c) => c.mark !== null);

  if (withMarks.length === 0) return "N/A";

  if (withMarks.some((c) => c.risk === "High")) return "High";
  if (withMarks.some((c) => c.risk === "Medium")) return "Medium";
  return "Low";
}

export async function addCourse(name, code) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "No logged-in user found." };

  const { error } = await supabase
    .from("courses")
    .insert({ user_id: user.id, name, code });

  return { error: error?.message || null };
}

export async function fetchCourseDetail(courseId) {
  const { data, error } = await supabase
    .from("courses")
    .select(`
      id,
      name,
      code,
      assessments (
        id,
        name,
        type,
        weight,
        marks ( id, score, max_score, created_at )
      )
    `)
    .eq("id", courseId)
    .single();

  if (error) return { course: null, error: error.message };

  return { course: data, error: null };
}

export async function addAssessment(courseId, name, type, weight) {
  const { data: existing, error: fetchError } = await supabase
    .from("assessments")
    .select("weight")
    .eq("course_id", courseId);

  if (fetchError) {
    return { error: fetchError.message };
  }

  const currentTotal = existing.reduce((sum, a) => sum + a.weight, 0);

  if (currentTotal + weight > 100) {
    const remaining = 100 - currentTotal;
    return {
      error:
        remaining <= 0
          ? "This course's assessments already total 100% weight. You can't add more."
          : `Adding this would exceed 100% total weight. You have ${remaining}% remaining.`,
    };
  }

  const { error } = await supabase
    .from("assessments")
    .insert({ course_id: courseId, name, type, weight });

  return { error: error?.message || null };
}

export async function updateAssessment(assessmentId, courseId, name, type, weight) {
  const { data: existing, error: fetchError } = await supabase
    .from("assessments")
    .select("id, weight")
    .eq("course_id", courseId);

  if (fetchError) {
    return { error: fetchError.message };
  }

  const otherTotal = existing
    .filter((a) => a.id !== assessmentId)
    .reduce((sum, a) => sum + a.weight, 0);

  if (otherTotal + weight > 100) {
    const remaining = 100 - otherTotal;
    return {
      error: `That weight would exceed 100% total. Max allowed here is ${remaining}%.`,
    };
  }

  const { error } = await supabase
    .from("assessments")
    .update({ name, type, weight })
    .eq("id", assessmentId);

  return { error: error?.message || null };
}

export async function deleteAssessment(assessmentId) {
  const { error: marksError } = await supabase
    .from("marks")
    .delete()
    .eq("assessment_id", assessmentId);

  if (marksError) {
    return { error: marksError.message };
  }

  const { error } = await supabase
    .from("assessments")
    .delete()
    .eq("id", assessmentId);

  return { error: error?.message || null };
}

export async function saveMark(assessmentId, existingMarkId, score, maxScore) {
  if (existingMarkId) {
    const { error } = await supabase
      .from("marks")
      .update({ score, max_score: maxScore })
      .eq("id", existingMarkId);
    return { error: error?.message || null };
  } else {
    const { error } = await supabase
      .from("marks")
      .insert({ assessment_id: assessmentId, score, max_score: maxScore });
    return { error: error?.message || null };
  }
}