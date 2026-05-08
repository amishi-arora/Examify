import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { uploadFiles, generateExam } from "../api.js";
import ErrorMessage from "./ErrorMessage.jsx";

export default function FileUpload({ setExamQuestions }) {
  const navigate = useNavigate();
  const [files, setFiles] = useState([]);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState(null);

  async function handleGenerate() {
    if (files.length === 0) return;
    setGenerating(true);
    setError(null);
    try {
      const { text } = await uploadFiles(files);
      const examData = await generateExam(text);
      setExamQuestions(examData);
      navigate("/exam");
    } catch (err) {
      console.log(err);
      setError("Failed to generate exam. Please try again.");
    } finally {
      setGenerating(false);
    }
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
            key={files.length}
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
          onClick={handleGenerate}
          disabled={files.length === 0 || generating}
          className="cursor-pointer mt-4 w-full bg-blue-500 text-white py-2 rounded-xl hover:bg-blue-600 transition disabled:bg-gray-300 disabled:cursor-default">
          {generating ? "Generating..." : "Generate Practice Exam"}
        </button>

        {/* Error message in case exam generation fails */}
        {error && <ErrorMessage message={error} />}
      </div>
    </div>
  );
}
