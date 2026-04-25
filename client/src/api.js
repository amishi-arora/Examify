export async function uploadFiles(files) {
    const formData = new FormData();
    files.forEach(f => formData.append("files", f));
    const res = await fetch("http://localhost:3001/api/upload", {
        method: "POST",
        body: formData
    });
    if (!res.ok) throw new Error("Failed to upload files"); 
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
    if (!res.ok) throw new Error("Failed to generate exam,"); 
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
    if (!res.ok) throw new Error("Failed to grade exam."); 
    return res.json();
}