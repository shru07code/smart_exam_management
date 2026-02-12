import React, { useState, useEffect } from "react";
import axios from "axios";
import "./DataEntry.css";

export default function DataEntryModule() {

  const menuData = [
    { title: "Exam Time Table", sub: ["Upload Timetable CSV"] },
    { title: "Seating Chart", sub: ["Upload Seating CSV", "View Seating"] },
    { title: "Theory Marksheet", sub: ["Upload Marksheet CSV"] },
    { title: "Q.Paper Inventory", sub: ["Upload Inventory CSV"] },
    { title: "Extra or less Q.Paper Received", sub: ["Upload Paper CSV"] },
    { title: "Reports-tap1", sub: ["Attendance Report", "Seating Report"] },
    { title: "Detained Student Count", sub: ["Total Students"] },
    { title: "Subject with Sections", sub: ["Add Subject Code"] }
  ];

  const [activeMain, setActiveMain] = useState("Exam Time Table");
  const [activeSub, setActiveSub]   = useState("Upload Timetable CSV");

  const [file, setFile] = useState(null);

  const [timetable, setTimetable]       = useState([]);
  const [seatingData, setSeatingData]   = useState([]);
  const [marksheetData, setMarksheetData] = useState([]);
  const [inventoryData, setInventoryData] = useState([]);
  const [extraCode, setExtraCode] = useState("");
  const [extraQty, setExtraQty] = useState("");
  const [extraData, setExtraData] = useState([]);
  const [detainedSeat, setDetainedSeat] = useState("");
   const [detainedList, setDetainedList] = useState([]);
   const [compareData, setCompareData] = useState([]);

   // ===== SUBJECT WITH SECTIONS =====
const [subjectCode, setSubjectCode] = useState("");
const [subjectList, setSubjectList] = useState([]);





  const [msg, setMsg] = useState("");
// ===== EDIT & DELETE HANDLERS =====

const handleEdit = (row) => {
  console.log("Editing:", row);
  alert("Edit feature coming soon 👀");
};

const handleDelete = async (id) => {
  if (!window.confirm("Are you sure you want to delete this record?")) return;

  try {
    await axios.delete(`http://localhost:3000/data_entries/${id}`);
    alert("Record deleted successfully");

    // reload all visible tables
    if (activeSub === "Upload Timetable CSV") loadTimetable();
    if (activeSub === "Upload Seating CSV" || activeSub === "View Seating") loadSeatingTable();
    if (activeSub === "Upload Marksheet CSV") loadMarksheet();
    if (activeSub === "Upload Inventory CSV") loadInventory();
  } catch (err) {
    console.error(err);
    alert("Delete failed");
  }
};

  // ================= TIMETABLE =================
  async function loadTimetable() {
    const res = await axios.get("http://localhost:3000/timetable");
    setTimetable(res.data);
  }

  async function uploadTimetable() {
    if (!file) return alert("CSV Select kara");

    const fd = new FormData();
    fd.append("file", file);

    const res = await axios.post(
      "http://localhost:3000/upload-timetable",
      fd,
      { headers: { "Content-Type": "multipart/form-data" } }
    );

    setMsg(`✅ ${res.data.message} (Inserted: ${res.data.inserted})`);
    loadTimetable();
    //  setActiveSub("View Seating");  
  }

  // ================= SEATING =================
  async function loadSeatingTable() {
    const res = await axios.get("http://localhost:3000/seating-chart");
    setSeatingData(res.data);
  }

 async function uploadSeatingCSV() {
  if (!file) return alert("CSV Select kara");

  const fd = new FormData();
  fd.append("file", file);

  const res = await axios.post(
    "http://localhost:3000/upload-seating",
    fd
  );

  alert(res.data.message);

  setActiveSub("View Seating");   // 🔥 FORCE VIEW
}


  // ================= MARKSHEET =================
  async function loadMarksheet() {
    const res = await axios.get("http://localhost:3000/marksheet");
    setMarksheetData(res.data);
  }

  async function uploadMarksheet() {
    if (!file) return alert("CSV select kara");

    const fd = new FormData();
    fd.append("file", file);

    await axios.post(
      "http://localhost:3000/upload-marksheet",
      fd,
      { headers: { "Content-Type": "multipart/form-data" } }
    );

    alert("✅ Marksheet Uploaded");
    loadMarksheet();
  }

  // ================= INVENTORY =================
  async function loadInventory() {
    const res = await axios.get("http://localhost:3000/inventory");
    setInventoryData(res.data);
  }

  async function uploadInventory() {
    if (!file) return alert("CSV select kara");

    const fd = new FormData();
    fd.append("file", file);

    await axios.post(
      "http://localhost:3000/upload-inventory",
      fd,
      { headers: { "Content-Type": "multipart/form-data" } }
    );

    alert("✅ Inventory Uploaded");
    loadInventory();
  }

  // LOAD EXTRA PAPER
async function loadExtraPaper() {
  const res = await axios.get("http://localhost:3000/extra-paper");
  setExtraData(res.data);
}

// ADD EXTRA PAPER
async function addExtraPaper() {

  if (!extraCode || !extraQty)
    return alert("Please fill all fields");

  await axios.post("http://localhost:3000/extra-paper", {
    subject_code: extraCode,
    quantity: extraQty
  });

  alert("✅ Record Added");

  setExtraCode("");
  setExtraQty("");

  loadExtraPaper();
}


// ================= DETAINED STUDENTS =================

// LOAD
async function loadDetained() {
  const res = await axios.get("http://localhost:3000/detained");
  setDetainedList(res.data);
}

// ADD
async function addDetained() {
  if (!detainedSeat)
    return alert("Seat Number tak");

  await axios.post("http://localhost:3000/detained", {
    seat_no: detainedSeat
  });

  setDetainedSeat("");
  loadDetained();
}


// DELETE SINGLE
async function deleteDetained(id) {
  await axios.delete(`http://localhost:3000/detained/${id}`);
  loadDetained();
}


// DELETE ALL
async function deleteAllDetained() {
  if (!window.confirm("Delete ALL detained seats?"))
    return;

  await axios.delete("http://localhost:3000/detained-all");
  loadDetained();
}


  async function loadStudentCountReport() {
  const res = await axios.get("http://localhost:3000/student-count-report");
  setCompareData(res.data);
}

 async function loadSubjectCodes() {
  const res = await axios.get("http://localhost:3000/subject-codes");
  setSubjectList(res.data);
}

async function addSubjectCode() {
  if (!subjectCode) return alert("Enter Subject Code");

  await axios.post("http://localhost:3000/subject-codes", {
    subject_code: subjectCode
  });

  setSubjectCode("");
  loadSubjectCodes();
}

async function deleteSubjectCode(id) {
  await axios.delete(`http://localhost:3000/subject-codes/${id}`);
  loadSubjectCodes();
}


  // ================= AUTO LOAD ==================
  useEffect(() => {

    if (activeMain === "Exam Time Table")
      loadTimetable();

    if (activeSub === "View Seating" || activeSub === "Upload Seating CSV")
  loadSeatingTable();


    if (activeSub === "Upload Marksheet CSV")
      loadMarksheet();

    if (activeSub === "Upload Inventory CSV")
      loadInventory();
    
    if (activeSub === "Upload Paper CSV")
      loadExtraPaper();
    if (activeSub === "Total Students")
  loadDetained();
         if (activeSub === "Student Count Comparison Report")
  loadStudentCountReport();

          if (activeSub === "Add Subject Code")
  loadSubjectCodes();



      }, [activeMain, activeSub]);

  // ================= UI ===================
  return (

    <div className="layout">

      {/* SIDEBAR */}
      <div className="sidebar">

        <h3 className="menu-title">Smart Exam Panel</h3>

        {menuData.map((menu, i) => (

          <div key={i} className="menu-block">

            <div
              className={`menu-main ${activeMain === menu.title ? "active" : ""}`}
              onClick={() => {
                setActiveMain(menu.title);
                setActiveSub(menu.sub[0]);
              }}
            >
              {menu.title}
            </div>

            {activeMain === menu.title && (

              <div className="submenu">

                {menu.sub.map((sub, j) => (

                  <div
                    key={j}
                    className={`submenu-item ${activeSub === sub ? "active-sub" : ""}`}
                    onClick={() => setActiveSub(sub)}
                  >
                    ➤ {sub}
                  </div>

                ))}

              </div>

            )}

          </div>

        ))}

      </div>

      {/* CONTENT */}
      <div className="content">

        <h2>{activeMain}</h2>

        <div className="work-card">

          <h4>{activeSub}</h4>

          <input type="file"
            accept=".csv"
            onChange={(e) => setFile(e.target.files[0])}
          />

          <br /><br />

          {/* ===== TIMETABLE ===== */}
          {activeSub === "Upload Timetable CSV" && (
            <>
              <button onClick={uploadTimetable}>Upload Timetable</button>

              <table className="seat-table">
                <thead>
                  <tr>
                    <th>Session Type</th>
                    <th>Day</th>
                    <th>Session</th>
                    <th>Time Slot</th>
                    <th>Subject Name</th>
                    <th>Subject Code</th>
                    <th>Scheme</th>
                    {/* <th>Action</th> */}
                    
                  </tr>
                </thead>

                <tbody>
                  {timetable.map((r, i) => (
                    <tr key={i}>
                      <td>{r.session_type}</td>
                      <td>{r.day}</td>
                      <td>{r.session}</td>
                      <td>{r.time_slot}</td>
                      <td>{r.subject_name}</td>
                      <td>{r.subject_code}</td>
                      <td>{r.scheme}</td>

                      {/* <td className="action-col">
        <button
          className="edit-btn"
          onClick={() => handleEdit(r)}
        >
          ✏️
        </button>

        <button
          className="delete-btn"
          onClick={() => handleDelete(r.id)}
        >
          ❌
        </button>
      </td> */}
                    </tr>
                  ))}
                </tbody>

              </table>
            </>
          )}

          {/* ===== SEATING UPLOAD ===== */}
{activeSub === "Upload Seating CSV" && (
  <>
    <button onClick={uploadSeatingCSV}>Upload Seating CSV</button>

    
    {seatingData.length > 0 && (
      <table className="seat-table">
        <thead>
          <tr>
            <th>Sr No</th>
            <th>Seat No.</th>
            <th>course</th>
            <th>subject code</th>
            <th>institute Code</th>
            {/* <th>Action</th> */}
            {/* <th>Master Code</th> */}
          </tr>
        </thead>
        <tbody>
          {seatingData.map((r, i) => (
            <tr key={i}>
              <td>{i + 1}</td>
              <td>{r.seat_no}</td>
              <td>{r.course}</td>
              <td>{r.subject_code}</td>
              <td>{r.institute_code}</td>
              {/* <td>{r.master_code}</td> */}

              {/* <td className="action-col">
        <button
          className="edit-btn"
          onClick={() => handleEdit(r)}
        >
          ✏️
        </button>

        <button
          className="delete-btn"
          onClick={() => handleDelete(r.id)}
        >
          ❌
        </button>
      </td> */}
            </tr>
          ))}
        </tbody>
      </table>
    )}
  </>
)}

          {/* ===== VIEW SEATING ===== */}
          {/* ===== VIEW SEATING ===== */}
{activeSub === "View Seating" && (
  <table className="seat-table">
    <thead>
      <tr>
        <th>Sr No</th>
        <th>Seat No</th>
        <th>course</th>
        <th>subject code</th>
        <th>institute Code</th>
        {/* <th>Master Code</th> */}
        {/* <th>Action</th> */}
      </tr>
    </thead>
    <tbody>
      {seatingData.map((r, i) => (
        <tr key={i}>
          <td>{i + 1}</td>
          <td>{r.seat_no}</td>
          <td>{r.course}</td>
          <td>{r.subject_code}</td>
          <td>{r.institute_code}</td>
          {/* <td>{r.master_code}</td> */}
          {/* <td className="action-col">
        <button
          className="edit-btn"
          onClick={() => handleEdit(r)}
        >
          ✏️
        </button>

        <button
          className="delete-btn"
          onClick={() => handleDelete(r.id)}
        >
          ❌
        </button>
      </td> */}
          
          

        </tr>
      ))}
    </tbody>
  </table>
)}


          {/* ===== MARKSHEET ===== */}
          {activeSub === "Upload Marksheet CSV" && (
            <>
              <button onClick={uploadMarksheet}>Upload Marksheet CSV</button>

              <table className="seat-table">
                <thead>
                  <tr>
                    <th>Sr</th>
                    <th>Marksheet No</th>
                    <th>subject abb</th>
                    <th>course</th>
                    <th>Subject code</th>
                    <th>institute Code</th>
                    {/* <th>Action</th> */}
                    {/* <th>File Name</th> */}
                  </tr>
                </thead>

                <tbody>

                  {marksheetData.map((r, i) => (
                    <tr key={i}>
                      <td>{i + 1}</td>
                      <td>{r.marksheet_no}</td>
                      <td>{r.subject_abb}</td>
                      <td>{r.course}</td>
                      <td>{r.subject_code}</td>
                      <td>{r.institute_code}</td>
                      {/* <td>{r.file_name}</td> */}

                      {/* <td className="action-col">
        <button
          className="edit-btn"
          onClick={() => handleEdit(r)}
        >
          ✏️
        </button>

        <button
          className="delete-btn"
          onClick={() => handleDelete(r.id)}
        >
          ❌
        </button>
      </td> */}
                    </tr>
                  ))}

                </tbody>
              </table>
            </>
          )}

          {/* ===== INVENTORY ===== */}
          {activeSub === "Upload Inventory CSV" && (
  <>
    <button onClick={uploadInventory}>
      Upload Inventory CSV
    </button>

    <br /><br />

    {inventoryData.length > 0 && (
      <table className="seat-table">
        <thead>
          <tr>
            <th>Sr</th>
            <th>subject Code</th>
            <th>Appearing students</th>
            <th>No. of Packets</th>
            <th>Institute Code</th>
            {/* <th>Action</th> */}
            {/* <th>Total Packets for the Day</th> */}
          </tr>
        </thead>

        <tbody>
          {inventoryData.map((r, i) => (
            <tr key={i}>
              <td>{i + 1}</td>
              
              <td>{r.subject_code}</td>
              <td>{r.appearing_students}</td>
              <td>{r.no_of_packets}</td>
              <td>{r.institute_code}</td>
              {/* <td>{r.total_packets_day}</td> */}
              {/* <td className="action-col">
        <button
          className="edit-btn"
          onClick={() => handleEdit(r)}
        >
          ✏️
        </button>

        <button
          className="delete-btn"
          onClick={() => handleDelete(r.id)}
        >
          ❌
        </button>
      </td> */}
            </tr>
          ))}
        </tbody>
      </table>
    )}
  </>
)}

          {/* ===== EXTRA / LESS PAPER ===== */}
{activeSub === "Upload Paper CSV" && (
<>
  <h4>Record Of Extra Or Less Q.Paper Received</h4>
  

  <div className="extra-input-row">

  <input
    className="small-input"
    type="text"
    placeholder="Subject Code"
    value={extraCode}
    onChange={(e) => setExtraCode(e.target.value)}
  />

  <input
    className="small-input"
    type="number"
    placeholder="Extra / Less Qty"
    value={extraQty}
    onChange={(e) => setExtraQty(e.target.value)}
  />

</div>

  <br /><br />

  <button onClick={addExtraPaper}>
    Add Record
  </button>

  <br /><br />

  <table className="seat-table">
    <thead>
      <tr>
        <th>Sr No</th>
        <th>Subject Code</th>
        <th>Extra / Less Qty</th>
      </tr>
    </thead>

    <tbody>
      {extraData.map((r, i) => (
        <tr key={i}>
          <td>{i + 1}</td>
          <td>{r.subject_code}</td>
          <td>{r.quantity}</td>
        </tr>
      ))}
    </tbody>
  </table>
</>
)}

{/* ====== DETAINED STUDENTS ====== */}
{activeSub === "Total Students" && (
<>
  <h4>Detained Student - Add Exam Seat Number</h4>

  <input
    className="small-input"
    type="text"
    placeholder="Exam Seat Number"
    value={detainedSeat}
    onChange={(e)=>setDetainedSeat(e.target.value)}
  />

  &nbsp;&nbsp;

  <button onClick={addDetained}>
    Add Record
  </button>

  <br /><br />

  <button
    style={{background:"#d11",color:"#fff"}}
    onClick={deleteAllDetained}
  >
    Delete All Detained Seat Numbers
  </button>

  <br /><br />

  <table className="seat-table">
    <thead>
      <tr>
        <th>Sr No</th>
        <th>Seat No</th>
        <th>Delete</th>
      </tr>
    </thead>

    <tbody>
      {detainedList.map((r,i)=>(
        <tr key={i}>
          <td>{i+1}</td>
          <td>{r.seat_no}</td>
          <td>
            <button
              style={{background:"#e33",color:"#fff"}}
              onClick={()=>deleteDetained(r.id)}
            >
              Delete
            </button>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
</>
)}

    {activeSub === "Student Count Comparison Report" && (
  <table className="seat-table">
    <thead>
      <tr>
        <th>Sr No</th>
        <th>Institute Code</th>
        <th>Subject Code</th>
        <th>MSBTE Count</th>
        <th>Seating Count</th>
        <th>Status</th>
      </tr>
    </thead>

    <tbody>
      {compareData.map((r, i) => (
        <tr key={i}>
          <td>{i + 1}</td>
          <td>{r.institute_code}</td>
          <td>{r.subject_code}</td>
          <td>{r.msbte_count}</td>
          <td>{r.seating_count}</td>
          <td style={{
            color: r.status === "Matched" ? "green" : "red",
            fontWeight: "bold"
          }}>
            {r.status}
          </td>
        </tr>
      ))}
    </tbody>
  </table>
)}

  {/* ===== SUBJECT WITH SECTIONS ===== */}
{activeSub === "Add Subject Code" && (
  <>
    <h4>Add Subject Code</h4>

    <input
      className="small-input"
      type="text"
      placeholder="Subject Code"
      value={subjectCode}
      onChange={(e)=>setSubjectCode(e.target.value)}
    />

    &nbsp;&nbsp;

    <button onClick={addSubjectCode}>
      Add Record
    </button>

    <br /><br />

    <table className="seat-table">
      <thead>
        <tr>
          <th>Sr.No.</th>
          <th>Subject Code</th>
          <th>Delete</th>
        </tr>
      </thead>

      <tbody>
        {subjectList.map((r,i)=>(
          <tr key={i}>
            <td>{i+1}</td>
            <td>{r.subject_code}</td>
            <td>
              <button
                style={{background:"#e33", color:"#fff"}}
                onClick={()=>deleteSubjectCode(r.id)}
              >
                Delete
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </>
)}


        </div>

      </div>

    </div>

  );

}
// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import "./DataEntry.css";

// export default function DataEntryModule() {
//   const menuData = [
//     { title: "Exam Time Table", sub: ["Upload Timetable CSV"] },
//     { title: "Seating Chart", sub: ["Upload Seating CSV", "View Seating"] },
//     { title: "Theory Marksheet", sub: ["Upload Marksheet CSV"] },
//     { title: "Q.Paper Inventory", sub: ["Upload Inventory CSV"] },
//     { title: "Extra or less Q.Paper Received", sub: ["Upload Paper CSV"] },
//     { title: "Reports-tap1", sub: ["Student Count Comparison Report"] },
//     { title: "Detained Student Count", sub: ["Total Students"] },
//     { title: "Subject with Sections", sub: ["Add Subject Code"] },
//   ];

//   const [activeMain, setActiveMain] = useState("Exam Time Table");
//   const [activeSub, setActiveSub] = useState("Upload Timetable CSV");

//   const [file, setFile] = useState(null);

//   const [timetable, setTimetable] = useState([]);
//   const [seatingData, setSeatingData] = useState([]);
//   const [marksheetData, setMarksheetData] = useState([]);
//   const [inventoryData, setInventoryData] = useState([]);
//   const [extraData, setExtraData] = useState([]);
//   const [extraCode, setExtraCode] = useState("");
//   const [extraQty, setExtraQty] = useState("");
//   const [detainedSeat, setDetainedSeat] = useState("");
//   const [detainedList, setDetainedList] = useState([]);
//   const [compareData, setCompareData] = useState([]);
//   const [subjectCode, setSubjectCode] = useState("");
//   const [subjectList, setSubjectList] = useState([]);
//   const [msg, setMsg] = useState("");

//   // ===== TIMETABLE =====
//   async function loadTimetable() {
//     try {
//       const res = await axios.get("http://localhost:3000/timetable");
//       setTimetable(res.data);
//     } catch (err) {
//       console.error(err);
//     }
//   }

//   async function uploadTimetable() {
//     if (!file) return alert("CSV Select kara");
//     const fd = new FormData();
//     fd.append("file", file);
//     const res = await axios.post("http://localhost:3000/upload-timetable", fd);
//     setMsg(`✅ ${res.data.message} (Inserted: ${res.data.inserted})`);
//     loadTimetable();
//   }

//   // ===== SEATING =====
//   async function loadSeatingTable() {
//     try {
//       const res = await axios.get("http://localhost:3000/seating-chart");
//       setSeatingData(res.data);
//     } catch (err) {
//       console.error(err);
//     }
//   }

//   async function uploadSeatingCSV() {
//     if (!file) return alert("CSV Select kara");
//     const fd = new FormData();
//     fd.append("file", file);
//     const res = await axios.post("http://localhost:3000/upload-seating", fd);
//     alert(res.data.message);
//     setActiveSub("View Seating"); // Force view
//     loadSeatingTable();
//   }

//   // ===== MARKSHEET =====
//   async function loadMarksheet() {
//     try {
//       const res = await axios.get("http://localhost:3000/marksheet");
//       setMarksheetData(res.data);
//     } catch (err) {
//       console.error(err);
//     }
//   }

//   async function uploadMarksheet() {
//     if (!file) return alert("CSV select kara");
//     const fd = new FormData();
//     fd.append("file", file);
//     await axios.post("http://localhost:3000/upload-marksheet", fd);
//     alert("✅ Marksheet Uploaded");
//     loadMarksheet();
//   }

//   // ===== INVENTORY =====
//   async function loadInventory() {
//     try {
//       const res = await axios.get("http://localhost:3000/inventory");
//       setInventoryData(res.data);
//     } catch (err) {
//       console.error(err);
//     }
//   }

//   async function uploadInventory() {
//     if (!file) return alert("CSV select kara");
//     const fd = new FormData();
//     fd.append("file", file);
//     await axios.post("http://localhost:3000/upload-inventory", fd);
//     alert("✅ Inventory Uploaded");
//     loadInventory();
//   }

//   // ===== EXTRA PAPER =====
//   async function loadExtraPaper() {
//     const res = await axios.get("http://localhost:3000/extra-paper");
//     setExtraData(res.data);
//   }

//   async function addExtraPaper() {
//     if (!extraCode || !extraQty) return alert("Please fill all fields");
//     await axios.post("http://localhost:3000/extra-paper", {
//       subject_code: extraCode,
//       quantity: extraQty,
//     });
//     setExtraCode("");
//     setExtraQty("");
//     loadExtraPaper();
//   }

//   // ===== DETAINED STUDENTS =====
//   async function loadDetained() {
//     const res = await axios.get("http://localhost:3000/detained");
//     setDetainedList(res.data);
//   }

//   async function addDetained() {
//     if (!detainedSeat) return alert("Seat Number tak");
//     await axios.post("http://localhost:3000/detained", { seat_no: detainedSeat });
//     setDetainedSeat("");
//     loadDetained();
//   }

//   async function deleteDetained(id) {
//     await axios.delete(`http://localhost:3000/detained/${id}`);
//     loadDetained();
//   }

//   async function deleteAllDetained() {
//     if (!window.confirm("Delete ALL detained seats?")) return;
//     await axios.delete("http://localhost:3000/detained-all");
//     loadDetained();
//   }

//   // ===== STUDENT COUNT REPORT =====
//   async function loadStudentCountReport() {
//     const res = await axios.get("http://localhost:3000/student-count-report");
//     setCompareData(res.data);
//   }

//   // ===== SUBJECT CODES =====
//   async function loadSubjectCodes() {
//     const res = await axios.get("http://localhost:3000/subject-codes");
//     setSubjectList(res.data);
//   }

//   async function addSubjectCode() {
//     if (!subjectCode) return alert("Enter Subject Code");
//     await axios.post("http://localhost:3000/subject-codes", { subject_code: subjectCode });
//     setSubjectCode("");
//     loadSubjectCodes();
//   }

//   async function deleteSubjectCode(id) {
//     await axios.delete(`http://localhost:3000/subject-codes/${id}`);
//     loadSubjectCodes();
//   }

//   // ===== AUTO LOAD =====
//   useEffect(() => {
//     switch (activeSub) {
//       case "Upload Timetable CSV":
//         loadTimetable();
//         break;
//       case "Upload Seating CSV":
//       case "View Seating":
//         loadSeatingTable();
//         break;
//       case "Upload Marksheet CSV":
//         loadMarksheet();
//         break;
//       case "Upload Inventory CSV":
//         loadInventory();
//         break;
//       case "Upload Paper CSV":
//         loadExtraPaper();
//         break;
//       case "Total Students":
//         loadDetained();
//         break;
//       case "Student Count Comparison Report":
//         loadStudentCountReport();
//         break;
//       case "Add Subject Code":
//         loadSubjectCodes();
//         break;
//       default:
//         break;
//     }
//   }, [activeSub]);

//   // ===== UI =====
//   return (
//     <div className="layout">
//       <div className="sidebar">
//         <h3 className="menu-title">Smart Exam Panel</h3>
//         {menuData.map((menu, i) => (
//           <div key={i} className="menu-block">
//             <div
//               className={`menu-main ${activeMain === menu.title ? "active" : ""}`}
//               onClick={() => {
//                 setActiveMain(menu.title);
//                 setActiveSub(menu.sub[0]);
//               }}
//             >
//               {menu.title}
//             </div>
//             {activeMain === menu.title && (
//               <div className="submenu">
//                 {menu.sub.map((sub, j) => (
//                   <div
//                     key={j}
//                     className={`submenu-item ${activeSub === sub ? "active-sub" : ""}`}
//                     onClick={() => setActiveSub(sub)}
//                   >
//                     ➤ {sub}
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>
//         ))}
//       </div>

//       <div className="content">
//         <h2>{activeMain}</h2>
//         <div className="work-card">
//           <h4>{activeSub}</h4>
//           <input type="file" accept=".csv" onChange={(e) => setFile(e.target.files[0])} />

//           <br /><br />
//           {/* ===== TIMETABLE TABLE ===== */}
//           {activeSub === "Upload Timetable CSV" && timetable.length > 0 && (
//             <table className="seat-table">
//               <thead>
//                 <tr>
//                   <th>Session Type</th>
//                   <th>Day</th>
//                   <th>Session</th>
//                   <th>Time Slot</th>
//                   <th>Subject Name</th>
//                   <th>Subject Code</th>
//                   <th>Scheme</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {timetable.map((r, i) => (
//                   <tr key={i}>
//                     <td>{r.session_type}</td>
//                     <td>{r.day}</td>
//                     <td>{r.session}</td>
//                     <td>{r.time_slot}</td>
//                     <td>{r.subject_name}</td>
//                     <td>{r.subject_code}</td>
//                     <td>{r.scheme}</td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           )}

//           {/* ===== SEATING TABLE ===== */}
//           {(activeSub === "Upload Seating CSV" || activeSub === "View Seating") &&
//             seatingData.length > 0 && (
//               <table className="seat-table">
//                 <thead>
//                   <tr>
//                     <th>Sr No</th>
//                     <th>Seat No</th>
//                     <th>Course</th>
//                     <th>Subject Code</th>
//                     <th>Institute Code</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {seatingData.map((r, i) => (
//                     <tr key={i}>
//                       <td>{i + 1}</td>
//                       <td>{r.seat_no}</td>
//                       <td>{r.course}</td>
//                       <td>{r.subject_code}</td>
//                       <td>{r.institute_code}</td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             )}

//           {/* ===== MARKSHEET TABLE ===== */}
//           {activeSub === "Upload Marksheet CSV" && marksheetData.length > 0 && (
//             <table className="seat-table">
//               <thead>
//                 <tr>
//                   <th>Sr</th>
//                   <th>Marksheet No</th>
//                   <th>Subject Abb</th>
//                   <th>Course</th>
//                   <th>Subject Code</th>
//                   <th>Institute Code</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {marksheetData.map((r, i) => (
//                   <tr key={i}>
//                     <td>{i + 1}</td>
//                     <td>{r.marksheet_no}</td>
//                     <td>{r.subject_abb}</td>
//                     <td>{r.course}</td>
//                     <td>{r.subject_code}</td>
//                     <td>{r.institute_code}</td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           )}

//           {/* ===== INVENTORY TABLE ===== */}
//           {activeSub === "Upload Inventory CSV" && inventoryData.length > 0 && (
//             <table className="seat-table">
//               <thead>
//                 <tr>
//                   <th>Sr</th>
//                   <th>Subject Code</th>
//                   <th>Appearing Students</th>
//                   <th>No. of Packets</th>
//                   <th>Institute Code</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {inventoryData.map((r, i) => (
//                   <tr key={i}>
//                     <td>{i + 1}</td>
//                     <td>{r.subject_code}</td>
//                     <td>{r.appearing_students}</td>
//                     <td>{r.no_of_packets}</td>
//                     <td>{r.institute_code}</td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           )}

//           {/* ===== EXTRA PAPER ===== */}
//           {activeSub === "Upload Paper CSV" && extraData.length > 0 && (
//             <table className="seat-table">
//               <thead>
//                 <tr>
//                   <th>Sr No</th>
//                   <th>Subject Code</th>
//                   <th>Extra / Less Qty</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {extraData.map((r, i) => (
//                   <tr key={i}>
//                     <td>{i + 1}</td>
//                     <td>{r.subject_code}</td>
//                     <td>{r.quantity}</td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           )}

//           {/* ===== DETAINED STUDENTS ===== */}
//           {activeSub === "Total Students" && detainedList.length > 0 && (
//             <table className="seat-table">
//               <thead>
//                 <tr>
//                   <th>Sr No</th>
//                   <th>Seat No</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {detainedList.map((r, i) => (
//                   <tr key={i}>
//                     <td>{i + 1}</td>
//                     <td>{r.seat_no}</td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           )}

//           {/* ===== STUDENT COUNT REPORT ===== */}
//           {activeSub === "Student Count Comparison Report" && compareData.length > 0 && (
//             <table className="seat-table">
//               <thead>
//                 <tr>
//                   <th>Sr No</th>
//                   <th>Institute Code</th>
//                   <th>Subject Code</th>
//                   <th>MSBTE Count</th>
//                   <th>Seating Count</th>
//                   <th>Status</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {compareData.map((r, i) => (
//                   <tr key={i}>
//                     <td>{i + 1}</td>
//                     <td>{r.institute_code}</td>
//                     <td>{r.subject_code}</td>
//                     <td>{r.msbte_count}</td>
//                     <td>{r.seating_count}</td>
//                     <td style={{ color: r.status === "Matched" ? "green" : "red", fontWeight: "bold" }}>
//                       {r.status}
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           )}

//           {/* ===== SUBJECT CODES ===== */}
//           {activeSub === "Add Subject Code" && subjectList.length > 0 && (
//             <table className="seat-table">
//               <thead>
//                 <tr>
//                   <th>Sr.No.</th>
//                   <th>Subject Code</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {subjectList.map((r, i) => (
//                   <tr key={i}>
//                     <td>{i + 1}</td>
//                     <td>{r.subject_code}</td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }
