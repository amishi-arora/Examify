import Header from "./components/Header";
import FileUpload from "./components/FileUpload";
import Exam from "./components/Exam";

function App() {
  const examQuestions = {
    "questions": [
      {
        "id": 1,
        "type": "Multiple choice",
        "questionTitle": "Question 1",
        "options": ["A. option1", "B. option2", "C. option3", "D. option4"],
        "answer": "A. option1"
      },
      {
        "id": 2,
        "type": "Short answer",
        "questionTitle": "Question 2",
        "options": ["A. option1", "B. option2", "C. option3", "D. option4"],
        "answer": "short answer"
      }
    ]
  }
  return (
    <div>
      <div className="flex flex-col min-h-screen bg-stone-50 p-15">
        <Header title="AI Powered Exam Generator" subtitle="Study for your next exam with ease" />
        <FileUpload />
      </div>
      <Exam examQuestions={examQuestions} />
    </div>
  );
}

export default App;