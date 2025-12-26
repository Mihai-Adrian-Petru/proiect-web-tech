import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "bootstrap/dist/css/bootstrap.min.css";
import App from "./components/App/App.tsx";
import { UserProvider } from "./context/UserContext.tsx";
import { CharacterProvider } from "./context/CharacterContext.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <UserProvider>
      <CharacterProvider>
        <App />
      </CharacterProvider>
    </UserProvider>
  </StrictMode>
);
