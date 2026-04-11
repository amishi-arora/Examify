import Header from "./components/Header";
import FileUpload from "./components/FileUpload";

function App() {
  return (
    <div className="flex flex-col min-h-screen bg-stone-50 p-15"> 
      <Header />
      <FileUpload/>
    </div>
  );
}

export default App;