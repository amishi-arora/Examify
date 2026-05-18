export const generateExam = (text, examSettings) => `You are an exam generator. Based on the following study material, generate an exam with exactly ${examSettings.multipleChoice} multiple choice questions and ${examSettings.shortAnswer} short answer questions.
Make the exam of ${examSettings.difficulty} difficulty level. If mixed, distribute questions evenly across easy, medium, and hard. 
${examSettings.focusTopics ? `Focus on these topics if they are relevant to the study material: ${examSettings.focusTopics}.` : ""}
${examSettings.additionalInstructions ? `Additional instructions: ${examSettings.additionalInstructions}.` : ""}
Return ONLY a JSON object in this exact format, no markdown, no backticks, no explanation. List all multiple choice questions first, followed by short answer questions:
{
  "title": "Short exam title (max 5 words) that describes the main topic of the study material",
  "questions": [
    {
      "id": 1,
      "type": "Multiple choice",
      "questionText": "question here",
      "options": ["A. option1", "B. option2", "C. option3", "D. option4"],
      "answer": "A. option1"
    },
    {
      "id": 2,
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
      {"id": 1, "score": 0 | 0.5 | 1, "feedback": "brief explanation, 1-2 lines. If no answer was provided, return, 'No answer was provided'"}
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