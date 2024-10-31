import { StrictMode } from "react";
import ReactDOM from "react-dom/client"; // Changed import
import { HMSRoomProvider } from "@100mslive/react-sdk";
import App from "./App.jsx";

const rootElement = document.getElementById("root");
const root = ReactDOM.createRoot(rootElement); // Use createRoot
root.render(
  <StrictMode>
    <HMSRoomProvider>
      <App />
    </HMSRoomProvider>
  </StrictMode>
);
