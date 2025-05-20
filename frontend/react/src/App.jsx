import { useState } from "react";
import "./App.css";
import PageLayout from "./components/PageLayout/PageLayout";
import Dashboard from "./components/Dashboard/Dashboard";
import Games from "./components/Games/Games";
import { BrowserRouter, Routes, Route } from "react-router";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<PageLayout />}>
          <Route index element={<Dashboard />}></Route>
          <Route path='games' element={<Games />}></Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
