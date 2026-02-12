document.addEventListener("DOMContentLoaded", () => {

  // ================= BLOCK REPORT (NO CHANGE) =================
  const goBtn = document.getElementById("goBtn");
  if (goBtn) {

    const examDateInput = document.getElementById("examDate");
    const sessionSelect = document.getElementById("sessionSelect");

    const reportActions = document.getElementById("reportActions");
    const reportSection = document.getElementById("blockReportSection");
    const tableBody = document.getElementById("blockTableBody");

    const showDate = document.getElementById("showDate");
    const showSession = document.getElementById("showSession");

    goBtn.addEventListener("click", () => {

      const date = examDateInput?.value;
      const session = sessionSelect?.value;

      if (!date) {
        alert("Please select Date");
        return;
      }

      if (sessionSelect && !session) {
        alert("Please select Session");
        return;
      }

      if (showDate) showDate.textContent = date;
      if (showSession) showSession.textContent = session;

      if (reportActions) reportActions.style.display = "block";
      if (reportSection) reportSection.style.display = "block";

      if (tableBody) tableBody.innerHTML = "";

      console.log("Report ready for:", { date, session });
    });
  }

  // ================= GATE CHART =================
  const gateGoBtn = document.getElementById("gateGoBtn");
  if (!gateGoBtn) return;

  gateGoBtn.addEventListener("click", async () => {

    const date = document.getElementById("gateDate").value;
    const session = document.getElementById("gateSession").value;

    if (!date) {
      alert("Please select Date");
      return;
    }

    // Show header values
    document.getElementById("printGateDate").textContent = date;
    document.getElementById("printGateSession").textContent = session;

    // Show report + print button
    document.getElementById("gateChartPrint").style.display = "block";
    document.getElementById("printGateBtn").style.display = "inline-block";

    try {
      // Fetch block names from blocks1 table
      const res = await fetch("http://localhost:3000/api/blocks");
      if (!res.ok) throw new Error("API error");

      const blocks = await res.json();
      renderGateChart(blocks);

    } catch (err) {
      console.error(err);
      alert("Failed to load gate chart");
    }
  });

});

// ================= GATE CHART RENDER =================
function renderGateChart(data) {
  const tbody = document.getElementById("gateChartBody");
  tbody.innerHTML = "";

  if (!data || data.length === 0) {
    tbody.innerHTML = `<tr><td colspan="9">No data found</td></tr>`;
    return;
  }

  data.forEach((row, i) => {
    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td>${row.name}</td> <!-- Block Name -->
      <td>&nbsp;</td>      <!-- Inst Code -->
      <td>&nbsp;</td>      <!-- Course -->
      <td>&nbsp;</td>      <!-- Subject -->
      <td>&nbsp;</td>      <!-- Subject Code -->
      <td>02:00 PM - 05:00 PM</td> <!-- Time -->
      <td>&nbsp;</td>      <!-- Exam Seat Numbers -->
      <td>&nbsp;</td>      <!-- Total -->
      <td>&nbsp;</td>      <!-- Grand Total -->
    `;

    tbody.appendChild(tr);
  });
}
