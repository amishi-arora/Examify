export const generateExam = (text) => `You are an exam generator. Based on the following study material, generate an exam with exactly 5 multiple choice questions and 5 short answer questions.

Return ONLY a JSON object in this exact format, no markdown, no backticks, no explanation:
{
  "questions": [
    {
      "id": 1,
      "type": "Multiple choice",
      "questionText": "question here",
      "options": ["A. option1", "B. option2", "C. option3", "D. option4"],
      "answer": "A. option1"
    },
    {
      "id": 4,
      "type": "Short answer",
      "questionText": "question here",
      "answer": "brief sample correct answer here, only 1-2 lines"
    }
  ]
} 
Study material:
${text}`

export const gradeShortAnswers = (questions, studentAnswers) => `You are an exam grader.

    Grade each of the following short answer questions and return ONLY a JSON array in this exact format, no markdown, no backticks, no explanation:
    [
      {"id": 1, "score": 0 | 0.5 | 1, "feedback": "brief explanation, 1-2 lines."}
    ]

    Questions:
    ${questions.map(q => `
    ID: ${q.id}
    Question: ${q.questionText}
    Student's answer: ${studentAnswers[q.id] || "No answer provided"}
    Sample answer: ${q.answer}
    `).join('\n')}

    Scoring criteria:
    1: Correct and demonstrates clear understanding. Does not need to match sample answer exactly.
    0.5: Partially correct, missing key details.
    0: Incorrect, irrelevant, or blank`