import { useEffect, useState } from "react";
import Header from "./components/Header";
import FileUpload from "./components/FileUpload";

function App() {
  const [message, setMessage] = useState("Loading...");

  useEffect(() => {
    fetch("http://localhost:3001/")
      .then((res) => res.text())
      .then((data) => setMessage(data))
      .catch((err) => setMessage("Error fetching backend"));
  }, []);

  return (
    <div className="flex flex-col justify-center gap-20 items-center min-h-screen bg-stone-50 p-15"> 
      <Header />
      <FileUpload/>
    </div>
  );
}

export default App;