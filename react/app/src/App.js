import { HashRouter, Routes, Route } from "react-router-dom";

// import ResultDownload if needed
import ResultDownload from "./ResultDownload";

// Correct import for your DataEntry component
import DataEntry from "./Frontend/DataEntry.jsx";

// import SuperAdminDashboard if needed
// import SuperAdminDashboard from "./Pages/SuperAdminDashboard";

function App() {
  return (
    <HashRouter>
      <Routes>
        {/* Example route for home */}
        <Route path="/" element={<ResultDownload />} />
        
        {/* Route for DataEntry */}
        <Route path="/data-entry" element={<DataEntry />} />

        {/* Example route for super admin */}
        {/* <Route path="/super-admin" element={<SuperAdminDashboard />} /> */}
      </Routes>
    </HashRouter>
  );
}

export default App;
