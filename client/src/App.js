import "./App.scss";
import { useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom"; // <== เพิ่ม useNavigate
import LoginRegisterForm from "./components/LoginRegisterContainer/LoginRegisterContainer";
import AdminCustomerContainer from "./components/AdminCustomerContainer/AdminCustomerContainer";
import EmployeeContainer from "./components/Employee/EmployeeContainer"; // <== Import EmployeeContainer

function App() {
  const navigate = useNavigate(); // <== ใช้ useNavigate
  let [isUserAuthenticated, setUserAuthorization] = useState(
    sessionStorage.getItem("isUserAuthenticated") === "true" || false
  );
  let [isAdmin, setAdmin] = useState(
    Number(sessionStorage.getItem("isAdmin")) || 0
  );
  let [customerId, setCustomerId] = useState(
    sessionStorage.getItem("customerId") || undefined
  );

  const setUserAuthenticatedStatus = (adminLevel, customerId) => {
    setUserAuthorization(true);
    setAdmin(adminLevel);
    setCustomerId(customerId);

    // **เปลี่ยนเส้นทางตามระดับสิทธิ์**
    if (adminLevel === 1) {
      navigate("/admin");
    } else if (adminLevel === 3) {
      navigate("/employee");
    } else {
      navigate("/customer");
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem("isUserAuthenticated");
    sessionStorage.removeItem("isAdmin");
    sessionStorage.removeItem("customerId");
    sessionStorage.removeItem("jwt_token");
    sessionStorage.removeItem("jwt_refresh_token");
    setUserAuthorization(false);
    setAdmin(0);
    setCustomerId(undefined);
    navigate("/"); // <== กลับไปหน้า Login
  };

  return (
    <div>
      {!isUserAuthenticated ? (
        <LoginRegisterForm setUserAuthenticatedStatus={setUserAuthenticatedStatus} />
      ) : (
        <>
          <div className="login-button-container">
            <button onClick={handleLogout} className="login-button">
              Logout
            </button>
          </div>

          <Routes>
            <Route path="/admin" element={<AdminCustomerContainer isAdmin={isAdmin} customerId={customerId} />} />
            <Route path="/employee" element={<EmployeeContainer isAdmin={isAdmin} customerId={customerId} />} />
            <Route path="/customer" element={<AdminCustomerContainer isAdmin={isAdmin} customerId={customerId} />} />
          </Routes>
        </>
      )}
    </div>
  );
}

export default App;
