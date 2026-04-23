import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function FileUpload({ setExamQuestions }) {
  const navigate = useNavigate();
  const [files, setFiles] = useState([]);
  const [generating, setGenerating] = useState(false);

  async function uploadFiles() {
    const formData = new FormData();
    files.forEach(f => formData.append("files", f));
    const res = await fetch("http://localhost:3001/api/upload", {
      method: "POST",
      body: formData
    });
    return res.json();
  }

  async function generateExam(text) {
    const res = await fetch("http://localhost:3001/api/generate-exam", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ text })
    });
    return res.json();
  }

  async function handleUpload() {
    if (files.length === 0) return;
    setGenerating(true);
    const { text } = await uploadFiles();
    const examData = await generateExam(text);
    setExamQuestions(examData);
    navigate("/exam");
    setGenerating(false);
  };

  function handleDelete(fileName) {
    setFiles(currFiles => currFiles.filter(f => f.name !== fileName));
  }

  function handleUploadFiles(newFiles) {
    setFiles(currFiles => [...currFiles, ...Array.from(newFiles)]);
  }

  return (
    <div className="flex-1 flex items-center justify-center">
      <div className="bg-white shadow-md rounded-2xl p-6 w-full max-w-xl">

        <h2 className="text-2xl font-semibold mb-4 text-gray-800">
          Upload Study Material
        </h2>

        {/* File Input */}
        <label className="block border-2 border-dashed border-gray-300 rounded-xl p-6 text-center cursor-pointer hover:border-blue-400 transition">
          <input
            type="file"
            name="files"
            accept=".pdf, .txt"
            className="hidden"
            multiple
            onChange={(e) => handleUploadFiles(e.target.files)}
          />
          <p className="text-gray-600">
            Click to upload PDF or Text File
          </p>
        </label>

        {/* Uploaded Files */}
        <div className="flex flex-col gap-1 mt-2">
          {files.map(f =>
            <span key={f.name} className='flex justify-between items-center text-sm text-gray-700 p-1'>
              {f.name}
              <button onClick={() => handleDelete(f.name)} className="text-red-500 hover:text-red-800 cursor-pointer">X</button>
            </span>)}
        </div>

        {/* Generate Button */}
        <button
          onClick={handleUpload}
          disabled={files.length === 0 || generating}
          className="mt-4 w-full bg-blue-500 text-white py-2 rounded-xl hover:bg-blue-600 transition disabled:bg-gray-300">
          {generating ? "Generating..." : "Generate Practice Exam"}
        </button>

      </div>
    </div>
  );
}
