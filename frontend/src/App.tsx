import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Auth } from "@/components/auth/Auth";
import { Callback } from "@/components/auth/Callback";
import { Layout } from "@/components/Layout";
import { AuthContextProvider } from "@/auth";
import { Guest } from "@/components/auth/Guest";
import { RequiresAuth } from "@/components/auth/RequiresAuth";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers";

const App: React.FC = () => {
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <AuthContextProvider>
        <BrowserRouter>
          <Routes>
            <Route
              path="/auth"
              element={
                <Guest>
                  <Auth />
                </Guest>
              }
            />
            <Route
              path="/callback"
              element={
                <Guest>
                  <Callback />
                </Guest>
              }
            />
            <Route
              path="/"
              element={
                <RequiresAuth>
                  <Layout />
                </RequiresAuth>
              }
            />
          </Routes>
        </BrowserRouter>
      </AuthContextProvider>
    </LocalizationProvider>
  );
};

export default App;
