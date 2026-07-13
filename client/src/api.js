import { BASE_URL } from "./constants";

export async function generateExam(files, examSettings) {
  const res = await fetch(`${BASE_URL}/api/generate-exam`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    body: JSON.stringify({
      files,
      examSettings,
    }),
  });

  if (!res.ok) {
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

export async function saveExam(title, questions, settings, results, studentAnswers, insights, documentKeys) {
  const res = await fetch(`${BASE_URL}/api/save-exam`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${localStorage.getItem("token")}`
    },
    body: JSON.stringify({ title, questions, settings, results, studentAnswers, insights, documentKeys })
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

export async function getUploadUrl(file) {
  const res = await fetch(`${BASE_URL}/api/s3-upload-url`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`
    },
    body: JSON.stringify({
      fileName: file.name,
      fileType: file.type,
    }),
  });

  return res.json();
}

export async function indexDocument(file) {
  const res = await fetch(`${BASE_URL}/api/index-document`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`
    },
    body: JSON.stringify({
      file: {
        key: file.key,
        fileType: file.fileType
      }
    }),
  });

  if (!res.ok) {
    throw new Error("Failed to index document");
  }

  return res.json();
}

export async function uploadToS3(file, uploadUrl) {
  await fetch(uploadUrl, {
    method: "PUT",
    body: file,
  })
}


export async function regenerateExam(
  documentKeys,
  weakTopics,
  examSettings
) {
  console.log(documentKeys);
  const res = await fetch(`${BASE_URL}/api/regenerate-exam`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`
    },
    body: JSON.stringify({
      documentKeys,
      weakTopics,
      examSettings
    })
  });

  if (!res.ok) {
    throw new Error("Failed to regenerate exam");
  }

  return res.json();
}