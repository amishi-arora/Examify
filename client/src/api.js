export async function uploadFiles(files) {
    const formData = new FormData();
    files.forEach(f => formData.append("files", f));
    const res = await fetch("http://localhost:3001/api/upload", {
        method: "POST",
        body: formData
    });
    return res.json();
}

export async function generateExam(text) {
    const res = await fetch("http://localhost:3001/api/generate-exam", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ text })
    });
    return res.json();
}

export async function gradeExam(studentAnswers, examQuestions) {
    const res = await fetch("http://localhost:3001/api/grade-exam", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ studentAnswers, examQuestions })
    });
    return res.json();
}