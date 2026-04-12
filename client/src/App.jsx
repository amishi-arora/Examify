import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import FileUpload from "./components/FileUpload";
import Exam from "./components/Exam";

function App() {
  const [questions, setQuestions] = useState(null);
  console.log(questions);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={
          <div className="flex flex-col min-h-screen bg-stone-50 p-15">
            <Header title="AI Powered Exam Generator" subtitle="Study for your next exam with ease" />
            <FileUpload setQuestions={setQuestions} />
          </div>
        } />
        <Route path="/exam" element={
          <Exam examQuestions={questions} />
        } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
