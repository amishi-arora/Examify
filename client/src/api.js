export async function uploadFiles(files) {
  const formData = new FormData();
  files.forEach(f => formData.append("files", f));
  const res = await fetch("http://localhost:3001/api/upload", {
    method: "POST",
    headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` },
    body: formData
  });
  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.error);
  }
  return res.json();
}

export async function generateExam(text, examSettings) {
  const res = await fetch("http://localhost:3001/api/generate-exam", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${localStorage.getItem("token")}`
    },
    body: JSON.stringify({ text, examSettings })
  });
  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.error);
  }
  return res.json();
}

export async function gradeExam(studentAnswers, examQuestions) {
  const res = await fetch("http://localhost:3001/api/grade-exam", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${localStorage.getItem("token")}`
    },
    body: JSON.stringify({ studentAnswers, examQuestions })
  });
  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.error);
  }
  return res.json();
}

export async function login(email, password) {
  const res = await fetch("http://localhost:3001/api/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password })
  });
  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.error);
  }
  return res.json();
}

export async function register(name, email, password) {
  const res = await fetch("http://localhost:3001/api/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password })
  });
  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.error);
  }
  return res.json();
}

export async function saveExam(title, questions, difficulty, results, studentAnswers, insights) {
  const res = await fetch("http://localhost:3001/api/save-exam", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${localStorage.getItem("token")}`
    },
    body: JSON.stringify({ title, questions, difficulty, results, studentAnswers, insights })
  });
  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.error);
  }
  return res.json();

}

export async function getExams() {
  const res = await fetch("http://localhost:3001/api/get-exams", {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${localStorage.getItem("token")}`
    },
  })
  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.error);
  }
  return res.json();
}

export async function generateInsights(examQuestions, studentAnswers, examResults) {
  const res = await fetch("http://localhost:3001/api/generate-insights", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${localStorage.getItem("token")}`
    },
    body: JSON.stringify({ examQuestions, studentAnswers, examResults })
  })
  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.error);
  }
  return res.json();
}
