import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { Provider } from "react-redux";
import store from "./store.js";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { LoadingProvider } from "./context/LoadingContext.jsx";
import "./i18n";

createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <BrowserRouter>
      <LoadingProvider>
        <Toaster />
        <App />
      </LoadingProvider>
    </BrowserRouter>
  </Provider>
);
