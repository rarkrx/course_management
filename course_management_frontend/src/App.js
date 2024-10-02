import { BrowserRouter, Route, Routes } from "react-router-dom";
import PageHome from "./views/FileUpload";
import './App.css';

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
