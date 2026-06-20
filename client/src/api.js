import { BASE_URL } from "./constants";

export async function uploadFiles(files) {
  const formData = new FormData();
  files.forEach(f => formData.append("files", f));
  const res = await fetch("http://localhost:3001/api/upload", {
    method: "POST",
    headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` },
    body: formData
  });
  if (!res.ok) {
    if (res.status === 401 || res.status === 403) {
      localStorage.removeItem("token");
      localStorage.removeItem("name");
      window.location.href = '/'
    }
    const data = await res.json();
    throw new Error(data.error);
  }
  return res.json();
}

export async function generateExam(text, examSettings) {
  const res = await fetch(`${BASE_URL}/api/generate-exam`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${localStorage.getItem("token")}`
    },
    body: JSON.stringify({ text, examSettings })
  });
  if (!res.ok) {
    if (res.status === 401 || res.status === 403) {
      localStorage.removeItem("token");
      localStorage.removeItem("name");
      window.location.href = '/'
    }
    const data = await res.json();
    throw new Error(data.error);
  }
  return res.json();
}

export async function gradeExam(studentAnswers, examQuestions) {
  const res = await fetch(`${BASE_URL}/api/grade-exam`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${localStorage.getItem("token")}`
    },
    body: JSON.stringify({ studentAnswers, examQuestions })
  });
  if (!res.ok) {
    if (res.status === 401 || res.status === 403) {
      localStorage.removeItem("token");
      localStorage.removeItem("name");
      window.location.href = '/'
    }
    const data = await res.json();
    throw new Error(data.error);
  }
  return res.json();
}

export async function login(email, password) {
  const res = await fetch(`${BASE_URL}/api/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password })
  });
  if (!res.ok) {
    if (res.status === 401 || res.status === 403) {
      localStorage.removeItem("token");
      localStorage.removeItem("name");
      window.location.href = '/'
    }
    const data = await res.json();
    throw new Error(data.error);
  }
  return res.json();
}

export async function register(name, email, password) {
  const res = await fetch(`${BASE_URL}/api/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password })
  });
  if (!res.ok) {
    if (res.status === 401 || res.status === 403) {
      localStorage.removeItem("token");
      localStorage.removeItem("name");
      window.location.href = '/'
    }
    const data = await res.json();
    throw new Error(data.error);
  }
  return res.json();
}

export async function saveExam(title, questions, difficulty, results, studentAnswers, insights) {
  const res = await fetch(`${BASE_URL}/api/save-exam`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${localStorage.getItem("token")}`
    },
    body: JSON.stringify({ title, questions, difficulty, results, studentAnswers, insights })
  });
  if (!res.ok) {
    if (res.status === 401 || res.status === 403) {
      localStorage.removeItem("token");
      localStorage.removeItem("name");
      window.location.href = '/'
    }
    const data = await res.json();
    throw new Error(data.error);
  }
  return res.json();

}

export async function getExams() {
  const res = await fetch(`${BASE_URL}/api/get-exams`, {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${localStorage.getItem("token")}`
    },
  })
  if (!res.ok) {
    if (res.status === 401 || res.status === 403) {
      localStorage.removeItem("token");
      localStorage.removeItem("name");
      window.location.href = '/'
    }
    const data = await res.json();
    throw new Error(data.error);
  }
  return res.json();
}

export async function generateInsights(examQuestions, studentAnswers, examResults) {
  const res = await fetch(`${BASE_URL}/api/generate-insights`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${localStorage.getItem("token")}`
    },
    body: JSON.stringify({ examQuestions, studentAnswers, examResults })
  })
  if (!res.ok) {
    if (res.status === 401 || res.status === 403) {
      localStorage.removeItem("token");
      localStorage.removeItem("name");
      window.location.href = '/'
    }
    const data = await res.json();
    throw new Error(data.error);
  }
  return res.json();
}

export async function getExam(examId) {
  const res = await fetch(`${BASE_URL}/api/get-exam?examId=${examId}`, {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${localStorage.getItem("token")}`
    },
  })
  if (!res.ok) {
    if (res.status === 401 || res.status === 403) {
      localStorage.removeItem("token");
      localStorage.removeItem("name");
      window.location.href = '/'
    }
    const data = await res.json();
    throw new Error(data.error);
  }
  return res.json();
}
