export const generateExam = (text) => `You are an exam generator. Based on the following study material, generate an exam with exactly 3 multiple choice questions and 2 short answer questions.

Return ONLY a JSON object in this exact format, no markdown, no backticks, no explanation:
{
  "questions": [
    {
      "id": 1,
      "type": "Multiple choice",
      "questionTitle": "question here",
      "options": ["A. option1", "B. option2", "C. option3", "D. option4"],
      "answer": "A. option1"
    },
    {
      "id": 4,
      "type": "Short answer",
      "questionTitle": "question here",
      "answer": "sample correct answer here"
    }
  ]
} 
Study material:
${text}`


export const gradeExam = (question, answer, sampleAnswer) => `You are an exam grader grading a short answer question
        question: ${question} answer: ${answer} sampleAnswer: ${sampleAnswer}
        
        Grade the students answer and return ONLY a JSON object in this exact format, no markdown, no backticks, no explanation:
        {"score": 0 | 0.5 | 1,
        "feedback": "brief explanation of why this score was given"}
        Scoring criteria: 
        1: Student's answer is correct and demonstrates clear understanding. The students answer does NOT need to match the sample answer exactly. 
        0.5 Student's answer is partially correct or shows some understanding but is missing key details
        0: Students answer is incorrect, irrelevant, or blank`