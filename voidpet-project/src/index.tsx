import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx"; // Import your main App component
import "./index.css"; // Import your global CSS file

// Find the root DOM element (usually a div with id="root" in your index.html)
const rootElement = document.getElementById("root");

if (rootElement) {
  // Create a root for concurrent mode and render the App component
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
} else {
  console.error(
    "Failed to find the root element. Make sure you have a <div id='root'></div> in your index.html."
  );
}
