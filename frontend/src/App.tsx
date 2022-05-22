import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Auth } from "@/components/auth/Auth";
import { Callback } from "@/components/auth/Callback";
import { Layout } from "@/components/Layout";

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/auth" element={<Auth />} />
        <Route path="/callback" element={<Callback />} />
        <Route path="/" element={<Layout />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
