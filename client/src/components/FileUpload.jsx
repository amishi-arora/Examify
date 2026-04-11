import { useState } from "react";

export default function FileUpload() {
  const [files, setFiles] = useState([]);

  const handleUpload = async () => {
    if (files.length === 0) return; 

    const formData = new FormData();
    files.forEach(f => formData.append("files", f)); 

    const res = await fetch("http://localhost:3001/api/upload", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    console.log(data.text)
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
          {files.map((f, i) => <span key={f.name} className='flex justify-between items-center text-sm text-gray-700 p-1'>{f.name}
            <button onClick={() => handleDelete(f.name)} className="text-red-500 hover:text-red-800 cursor-pointer">X</button></span>)}
        </div>

        {/* Generate Button */}
        <button
          onClick={handleUpload}
          disabled={files.length === 0}
          className="mt-4 w-full bg-blue-500 text-white py-2 rounded-xl hover:bg-blue-600 transition disabled:bg-gray-300"
        >
          Generate Practice Exam
        </button>
      </div>
    </div>
  );
}
