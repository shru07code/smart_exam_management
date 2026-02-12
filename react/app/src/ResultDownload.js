import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ResultDownload.css";

export default function ResultDownload() {
  const [activeForm, setActiveForm] = useState("student");
  const navigate = useNavigate();


  const generateCaptcha = () =>
    Math.random().toString(36).substring(2, 8).toUpperCase();
  const [captcha, setCaptcha] = useState(generateCaptcha());
  const refreshCaptcha = () => setCaptcha(generateCaptcha());

  const validateMobile = (mob) => /^\d{10}$/.test(mob);

  // Student state
  const [student, setStudent] = useState({
    enrollment: "",
    mobile: "",
    validationInput: "",
  });

  // Office, Data Entry, Billing, Super Admin states
  const [office, setOffice] = useState({
    instituteCode: "",
    instituteName: "",
    officeMobile: "",
    validationInput: "",
  });

  const [dataEntry, setDataEntry] = useState({
    instituteCode: "",
    instituteName: "",
    officeMobile: "",
    validationInput: "",
  });

  const [billing, setBilling] = useState({
    instituteCode: "",
    instituteName: "",
    officeMobile: "",
    validationInput: "",
  });

  const [superAdmin, setSuperAdmin] = useState({
    instituteCode: "",
    instituteName: "",
    officeMobile: "",
    validationInput: "",
  });

  // Handlers
  const onStudentChange = (e) =>
    setStudent({ ...student, [e.target.name]: e.target.value });

  const onOfficeChange = (e) =>
    setOffice({ ...office, [e.target.name]: e.target.value });

  const onDataEntryChange = (e) =>
    setDataEntry({ ...dataEntry, [e.target.name]: e.target.value });

  const onBillingChange = (e) =>
    setBilling({ ...billing, [e.target.name]: e.target.value });

  const onSuperAdminChange = (e) =>
    setSuperAdmin({ ...superAdmin, [e.target.name]: e.target.value });

  // SUBMIT handlers (same validation logic)
  const handleStudentSubmit = (e) => {
    e.preventDefault();
    if (!student.enrollment.trim()) {
      alert("Please enter Enrollment Number.");
      return;
    }
    if (!validateMobile(student.mobile)) {
      alert("Enter valid 10 digit mobile number.");
      return;
    }
    if (student.validationInput.toUpperCase() !== captcha) {
      alert("Invalid Validation Code. Refresh & try again.");
      return;
    }
    alert(`Student form submitted!\nEnrollment: ${student.enrollment}`);
    setStudent({ ...student, validationInput: "" });
    refreshCaptcha();
  };

  const handleCommonSubmit = (e, formData, roleName, setForm) => {
    e.preventDefault();
    if (!formData.instituteCode.trim()) {
      alert("Please enter Institute Code.");
      return;
    }
    if (!formData.instituteName.trim()) {
      alert("Please enter Institute Name.");
      return;
    }
    if (!validateMobile(formData.officeMobile)) {
      alert("Enter valid 10 digit mobile number.");
      return;
    }
    if (formData.validationInput.toUpperCase() !== captcha) {
      alert("Invalid Validation Code. Refresh & try again.");
      return;
    }
alert(`${roleName} form submitted!\nInstitute: ${formData.instituteName}`);

if (roleName === "Data Entry") {
    navigate("/data-entry");
}    setForm({ ...formData, validationInput: "" });
    refreshCaptcha();
  };

  return (
    <div className="main-container">
      <header className="header">
        <div className="logo">SGI</div>
        <div className="title">
          <h2>Sanjay Ghodawat Polytechnic Exam Web Application</h2>
          <p>Version Updated on: OCT 2025</p>
        </div>
        <div className="contact">
          <p>Tech Support: sanjayghodawat@polyexamsoft.com</p>
        </div>
      </header>

      {/* NAVIGATION BUTTONS */}
      <nav className="navbar">
        {["student", "office", "data", "billing", "admin"].map((form) => (
          <button
            key={form}
            className={`nav-btn ${activeForm === form ? "active" : ""}`}
            onClick={() => setActiveForm(form)}
          >
            {form === "student"
              ? "Student"
              : form === "office"
              ? "Office Incharge"
              : form === "data"
              ? "Data Entry"
              : form === "billing"
              ? "Billing"
              : "Super Admin"}
          </button>
        ))}
      </nav>

      <section className="content">
        <h3 className="result-title">Result of Winter/Summer Examination</h3>

        {/* STUDENT FORM */}
        {activeForm === "student" && (
          <div className="form-container">
            <h4 className="download-heading">Student — LOGIN</h4>
            <form onSubmit={handleStudentSubmit}>
              <label>Enrollment Number</label>
              <input
                type="text"
                name="enrollment"
                value={student.enrollment}
                onChange={onStudentChange}
                placeholder="Enter Enrollment Number"
                required
              />

              <label>Student Mobile Number</label>
              <input
                type="text"
                name="mobile"
                value={student.mobile}
                onChange={onStudentChange}
                placeholder="Enter 10 digit Mobile Number"
                required
              />

              <div className="captcha-section">
                <div className="captcha-box">{captcha}</div>
                <button
                  type="button"
                  className="refresh"
                  onClick={refreshCaptcha}
                >
                  Refresh
                </button>
              </div>

              <input
                type="text"
                name="validationInput"
                value={student.validationInput}
                onChange={onStudentChange}
                placeholder="Enter Validation Code here"
                required
              />

              <button type="submit" className="download-btn">
                LOGIN
              </button>
            </form>
          </div>
        )}

        {/* COMMON FORM TEMPLATE FUNCTION */}
        {activeForm !== "student" && (
          <div className="form-container">
            <h4 className="download-heading">
              {activeForm === "office"
                ? "Office Incharge"
                : activeForm === "data"
                ? "Data Entry"
                : activeForm === "billing"
                ? "Billing Section"
                : "Super Admin"}{" "}
              — LOGIN
            </h4>
            <form
              onSubmit={(e) =>
                handleCommonSubmit(
                  e,
                  activeForm === "office"
                    ? office
                    : activeForm === "data"
                    ? dataEntry
                    : activeForm === "billing"
                    ? billing
                    : superAdmin,
                  activeForm === "office"
                    ? "Office Incharge"
                    : activeForm === "data"
                    ? "Data Entry"
                    : activeForm === "billing"
                    ? "Billing Section"
                    : "Super Admin",
                  activeForm === "office"
                    ? setOffice
                    : activeForm === "data"
                    ? setDataEntry
                    : activeForm === "billing"
                    ? setBilling
                    : setSuperAdmin
                )
              }
            >
              <label>Institute Code</label>
              <input
                type="text"
                name="instituteCode"
                value={
                  activeForm === "office"
                    ? office.instituteCode
                    : activeForm === "data"
                    ? dataEntry.instituteCode
                    : activeForm === "billing"
                    ? billing.instituteCode
                    : superAdmin.instituteCode
                }
                onChange={
                  activeForm === "office"
                    ? onOfficeChange
                    : activeForm === "data"
                    ? onDataEntryChange
                    : activeForm === "billing"
                    ? onBillingChange
                    : onSuperAdminChange
                }
                placeholder="Enter Four Digit Institute Code"
                required
              />

              <label>Institute Name</label>
              <input
                type="text"
                name="instituteName"
                value={
                  activeForm === "office"
                    ? office.instituteName
                    : activeForm === "data"
                    ? dataEntry.instituteName
                    : activeForm === "billing"
                    ? billing.instituteName
                    : superAdmin.instituteName
                }
                onChange={
                  activeForm === "office"
                    ? onOfficeChange
                    : activeForm === "data"
                    ? onDataEntryChange
                    : activeForm === "billing"
                    ? onBillingChange
                    : onSuperAdminChange
                }
                placeholder="Enter Institute Name"
                required
              />

              <label>Mobile Number</label>
              <input
                type="text"
                name="officeMobile"
                value={
                  activeForm === "office"
                    ? office.officeMobile
                    : activeForm === "data"
                    ? dataEntry.officeMobile
                    : activeForm === "billing"
                    ? billing.officeMobile
                    : superAdmin.officeMobile
                }
                onChange={
                  activeForm === "office"
                    ? onOfficeChange
                    : activeForm === "data"
                    ? onDataEntryChange
                    : activeForm === "billing"
                    ? onBillingChange
                    : onSuperAdminChange
                }
                placeholder="Enter 10 digit Mobile Number"
                required
              />

              <div className="captcha-section">
                <div className="captcha-box">{captcha}</div>
                <button
                  type="button"
                  className="refresh"
                  onClick={refreshCaptcha}
                >
                  Refresh
                </button>
              </div>

              <input
                type="text"
                name="validationInput"
                value={
                  activeForm === "office"
                    ? office.validationInput
                    : activeForm === "data"
                    ? dataEntry.validationInput
                    : activeForm === "billing"
                    ? billing.validationInput
                    : superAdmin.validationInput
                }
                onChange={
                  activeForm === "office"
                    ? onOfficeChange
                    : activeForm === "data"
                    ? onDataEntryChange
                    : activeForm === "billing"
                    ? onBillingChange
                    : onSuperAdminChange
                }
                placeholder="Enter Validation Code here"
                required
              />

              <button type="submit" className="download-btn">
                LOGIN
              </button>
            </form>
          </div>
        )}
      </section>
    </div>
  );
}

