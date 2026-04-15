import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import ExamPage from "./pages/ExamPage";

function App() {
  const [questions, setQuestions] = useState({questions: []});
  
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={
          <HomePage setQuestions={setQuestions} />
        } />
        <Route path="/exam" element={
          <ExamPage examQuestions={questions} />
        } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
