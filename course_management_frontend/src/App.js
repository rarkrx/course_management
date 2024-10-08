import { BrowserRouter, Route, Routes } from "react-router-dom";
import PageHome from "./views/FileUpload";
import './App.css';
import "./assets/output.css";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<PageHome />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
