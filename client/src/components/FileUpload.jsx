import { useState } from "react";

export default function FileUpload() {
  const [file, setFile] = useState(null);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);

  const handleUpload = async () => {
    if (!file) return;

    setLoading(true);

    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("http://localhost:3001/api/upload", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    setText(data.text);
    setLoading(false);
  };

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
            name = "file"
            className="hidden"
            onChange={(e) => setFile(e.target.files[0])}
          />
          <p className="text-gray-600">
            {file ? file.name : "Click to upload PDF or Text File"}
          </p>
        </label>

        {/* Generate Button */}
        <button
          onClick={handleUpload}
          disabled={!file}
          className="mt-4 w-full bg-blue-500 text-white py-2 rounded-xl hover:bg-blue-600 transition disabled:bg-gray-300"
        >
          {loading ? "Generating..." : "Generate Practice Exam"}
        </button>

        {/* Log Output for Debugging */}
        {text && console.log(text)}
      </div>
    </div>
  );
}
