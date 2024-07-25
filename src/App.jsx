import { useEffect } from "react";
import "./App.scss";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import BaseLayout from "./layout/BaseLayout";
import { PageNotFound, MindMapApp } from "./screens";
import { PageTitleProvider } from "./context/PageTitleContext";

function AppContent() {
  return (
    <>
      <Routes>
        <Route element={<BaseLayout />}>
          <Route path="/" element={<Navigate to="/mindmap" />} />
          <Route path="/mindmap" element={<MindMapApp />} />
          <Route path="*" element={<PageNotFound />} />
        </Route>
      </Routes>
    </>
  );
}

function App() {
  return (
    <PageTitleProvider>
      <Router>
        <AppContent />
      </Router>
    </PageTitleProvider>
  );
}

export default App;
