import * as constants from "../client/src/constants.js"

export const generateExam = (text, examSettings) => `You are an exam generator. Based on the following study material, generate an exam with exactly ${examSettings.multipleChoice} multiple choice questions and ${examSettings.shortAnswer} short answer questions.
Make the exam of ${examSettings.difficulty} difficulty level. If mixed, distribute questions evenly across easy, medium, and hard. 
${examSettings.additionalInstructions ? `Additional instructions: ${examSettings.additionalInstructions}.` : ""}
Return ONLY a JSON object in this exact format, no markdown, no backticks, no explanation. List all multiple choice questions first, followed by short answer questions:
{
  "title": "Short exam title (max 5 words) that describes the main topic of the study material",
  "difficulty": "${examSettings.difficulty}",
  "questions": [
    {
      "id": 1,
      "type": "${constants.QUESTION_TYPES.MC}",
      "questionText": "question here",
      "options": ["A. option1", "B. option2", "C. option3", "D. option4"],
      "answer": "A. option1"
    },
    {
      "id": 2,
      "type": "${constants.QUESTION_TYPES.SHORT}",
      "questionText": "question here",
      "answer": "brief sample correct answer here, only 1-2 lines"
    }
  ]
} 
Guidelines: 
- Generate questions athat test the concepts and learning objectives from the material. Include information a student would reasonly be expected to know for an exam.
- Do not generate questions about copyright or licensing material, publisher details, author names, aknowledgements, or metadata of the document
- Generate questions evenly amongst the study material

Study material:
${text}`

export const generateInsights = (examQuestions, examResults, examAnswers) => `You are an AI tutor analyzing a student's exam performance. 

Given the exam questions, student answers, and exam results, generate personalized feedback describing the studen't understanding of the material.

Return ONLY a JSON object in this exact format, no markdown, no backticks, no explanation: 

{
  "feedback": "3-5 sentences describing the students overall understanding.
  Mention specific topics they excelled in and specific topics they should review",

  "strongTopics": ["specific topic 1", "specific topics 2"], 

  "weakTopics": ["specific topic 1", "specific topic 2"]
}

Guidelines: 
- Topics should be specific concepts (e.g. "mitosis, "ATP production"), not broad subjects. Each topic should consist of a maximum of 3 words. 
- A score of 1 indicates the student understood that topic well
- A score of 0.5 indicates partial understanding
- A score of 0 indicates the student struggled with that topic
- Leave strongTopics as an empty array if the student got nothing correct
- Leave weakTopics as an empty array if the student got everything correct
- The weakTopics and strongTopics array should contain a maximum of 5 topics each 
- Base topics on the actual subject matter of each question 

exam questions: ${JSON.stringify(examQuestions)}
students answers (mapped to the question id): ${JSON.stringify(examAnswers)} 
exam results, including score and feedback per question (mapped to question id): ${JSON.stringify(examResults)} 
`

export const gradeShortAnswers = (questions, studentAnswers) => `You are an exam grader.

Grade each of the following short answer questions and return ONLY a JSON array in this exact format, no markdown, no backticks, no explanation:
[
  {"id": 1, "score": 0 | 0.5 | 1, "feedback": "brief explanation, 1-2 lines."}
]

Questions:
${questions.map(q => `
ID: ${q.id}
Question: ${q.questionText}
Students answer: ${studentAnswers[q.id] || "No answer provided"}
Sample answer: ${q.answer}
`).join('\n')}

Scoring criteria:
1: Correct and demonstrates clear understanding. Does not need to match sample answer exactly.
0.5: Partially correct, missing key details.
0: Incorrect, irrelevant, or blank`