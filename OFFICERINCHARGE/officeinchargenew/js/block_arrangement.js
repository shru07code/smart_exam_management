document.addEventListener("DOMContentLoaded", async () => {

  // --- 1. GET DOM ELEMENTS ---
  const blockSelect = document.getElementById("blockSelect");
  const instSelect = document.getElementById("instSelect");
  const schemeSelect = document.getElementById("schemeSelect");
  const subjectSelect = document.getElementById("subjectSelect");

  const step2Box = document.getElementById("step2Box");
  const selectedInfo = document.getElementById("selectedInfo");
  const confirmBtn = document.getElementById("confirmBtn");
  const historyTable = document.getElementById("historyTable"); 

  let fullData = []; // Store the raw marksheet data here

  // --- 2. LOAD BLOCKS (On Page Load) ---
  try {
    const blockRes = await fetch(`${API_BASE_URL}/api/blocks`);
    const blocks = await blockRes.json();
    blockSelect.innerHTML = `<option value="">Select Block</option>`;
    blocks.forEach(b => {
      blockSelect.innerHTML += `<option value="${b.id}">${b.name} (${b.location})</option>`;
    });
  } catch (err) {
    console.error("Error loading blocks:", err);
  }

  // --- 3. SHOW STEP 2 & LOAD DROPDOWNS ---
  window.showStep2 = async () => {
    const selectedDate = document.getElementById("examDate").value;
    const selectedSession = document.getElementById("sessionSelect").value;

    if (!selectedDate) return alert("Please select a date first.");

    step2Box.style.display = "block";
    selectedInfo.innerText = `Date: ${selectedDate} | Session: ${selectedSession}`;

    // ✅ FETCH FROM MARKSHEET (Your Requested Change)
    try {
        const res = await fetch(`${API_BASE_URL}/api/setup-options`);
        fullData = await res.json();
        
        console.log("Marksheet Data Loaded:", fullData);

        // A. Populate Institutes (Unique)
        const uniqueInsts = [...new Set(fullData.map(item => item.institute_code))];
        instSelect.innerHTML = `<option value="">Select Institute</option>`;
        uniqueInsts.forEach(inst => {
            // Clean up quotes if they exist in DB (e.g. "1644" -> 1644)
            const cleanInst = inst.replace(/['"]+/g, ''); 
            instSelect.innerHTML += `<option value="${cleanInst}">${cleanInst}</option>`;
        });

        // B. Populate Schemes (Unique)
        const uniqueSchemes = [...new Set(fullData.map(item => item.course))];
        schemeSelect.innerHTML = `<option value="">Select Scheme</option>`;
        uniqueSchemes.forEach(sch => {
            schemeSelect.innerHTML += `<option value="${sch}">${sch}</option>`;
        });

        // Reset Subject
        subjectSelect.innerHTML = `<option value="">Select Subject</option>`;

    } catch(e) { 
        console.error("Error loading dropdowns:", e);
        alert("Failed to load dropdown data. Check console.");
    }
  };

  // --- 4. ON SCHEME CHANGE -> LOAD SUBJECTS ---
  if(schemeSelect) {
      schemeSelect.addEventListener("change", () => {
        const selectedScheme = schemeSelect.value;
        const selectedInst = instSelect.value; // Optional: Filter by Institute too?

        // Filter data: Show subjects belonging to this Scheme
        const relevantItems = fullData.filter(item => item.course === selectedScheme);

        // Extract Unique Subjects for this Scheme
        // We use a Map to ensure we don't show duplicate Subject Codes
        const uniqueSubjects = new Map();
        relevantItems.forEach(item => {
            if(!uniqueSubjects.has(item.subject_code)){
                uniqueSubjects.set(item.subject_code, item.subject_abb);
            }
        });

        subjectSelect.innerHTML = `<option value="">Select Subject</option>`;
        
        uniqueSubjects.forEach((name, code) => {
            subjectSelect.innerHTML += `<option value="${code}">${name} (${code})</option>`;
        });
      });
  }


  // --- 5. SAVE ARRANGEMENT (The "Confirm" Button) ---
  confirmBtn.addEventListener("click", async () => {
    
    // 1. Get Values from HTML Inputs
    const date = document.getElementById("examDate").value;
    const session = document.getElementById("sessionSelect").value;
    const blockId = blockSelect.value;
    
    // Get Institute Name/Code
    // (If using settings, value is 1644, text is SGI)
    const instCode = instSelect.value || ""; 
    
    const schemeVal = schemeSelect.value || "";
    const subjectCode = subjectSelect.value || "";
    
    const start = document.getElementById("startIndex").value;
    const end = document.getElementById("endIndex").value;

    // 2. Validate Inputs
    if (!date || !blockId || !instCode || !schemeVal || !subjectCode) {
      return alert("Please select all fields (Date, Block, Institute, Scheme, Subject).");
    }

    // 3. SPECIAL STEP: Get the Subject NAME (Text) 
    // The dropdown value is "22101", but the text is "English (22101)"
    let subjectName = "";
    if (subjectSelect.selectedIndex >= 0) {
        // We split by '(' to get just "English" and remove extra spaces
        const text = subjectSelect.options[subjectSelect.selectedIndex].text;
        subjectName = text.split('(')[0].trim(); 
    }

    const total = (parseInt(end) - parseInt(start)) + 1;

    try {
      // 4. Send Data to Server
      const response = await fetch(`${API_BASE_URL}/api/save-arrangement`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          date: date, 
          session: session, 
          blockId: blockId, 
          institute: instCode, 
          course: schemeVal, 
          subject: subjectCode,     // The Code (e.g., 22101)
          subjectName: subjectName, // ✅ The Name (e.g., English)
          startSeat: start, 
          endSeat: end, 
          total: total
        })
      });

      if (!response.ok) {
        // Try to get the error message from server
        const errData = await response.json();
        throw new Error(errData.details || "Server failed to save");
      }
      
      const result = await response.json();

      // 5. Update the History Table on Screen
      // First, fetch block details to show the name (e.g., "Block A") instead of ID
      const blockRes = await fetch(`${API_BASE_URL}/api/block/${blockId}`);
      const blockData = await blockRes.json();
      
      const row = document.createElement("tr");
      
      // Format the Subject Display: "English (22101)"
      const displaySubject = `${subjectName} (${subjectCode})`;

      row.innerHTML = `
        <td>${date}</td>
        <td>${session}</td>
        <td>${blockData.name || "Block"}</td>
        <td>${blockData.location || ""}</td>
        <td>${instCode}</td>
        <td>${schemeVal}</td>
        <td>${displaySubject}</td> <td>${start}</td>
        <td>${end}</td>
        <td>${total}</td>
        <td><button class="deleteBtn" onclick="deleteAllocation(${result.id})">Delete</button></td>
      `;
      
      // Add new row to the table
      if(historyTable) historyTable.appendChild(row);

      alert("✅ Allocation Saved Successfully!");

    } catch (err) {
      console.error(err);
      alert("❌ Error Saving: " + err.message);
    }
  });

});

// Global Delete
window.deleteAllocation = async (id) => {
    if(!confirm("Delete this?")) return;
    try {
        await fetch(`${API_BASE_URL}/api/allocations/${id}`, { method: "DELETE" });
        location.reload(); 
    } catch(e) { alert("Failed"); }
};

