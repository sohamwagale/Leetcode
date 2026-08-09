import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import './index.css'
import App from './app/App.tsx'
import QueryProvider from "./app/providers/QueryProvider.tsx";
import { Toaster } from "sonner";

ReactDOM.createRoot(document.getElementById('root')!).render(
  <>
    <QueryProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </QueryProvider>
    <Toaster richColors position="top-right"/>
  </>
)
