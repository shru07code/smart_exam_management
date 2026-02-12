document.addEventListener("DOMContentLoaded", () => {

  // ================= BLOCK SETTING LOGIC =================
  const blockForm = document.getElementById("blockSettingForm");
  const blockTable = document.getElementById("blockTable");
  let editId = null;

  // 1. RENDER BLOCKS (Load from DB)
  async function renderBlocks() {
    if (!blockTable) return; // Stop if we are not on the Block Setting page

    try {
      // FIX: Use the correct API URL (/api/blocks)
      const res = await fetch(`${API_BASE_URL}/api/blocks`);
      const blocks = await res.json();

      blockTable.innerHTML = "";

      blocks.forEach(b => {
        // Handle column breaks (default to 0 if null)
        const cols = [
          b.col1, b.col2, b.col3, b.col4, b.col5,
          b.col6, b.col7, b.col8, b.col9, b.col10
        ].map(v => v || 0);

        const total = cols.reduce((a, c) => parseInt(a) + parseInt(c), 0);

        blockTable.innerHTML += `
          <tr>
            <td>${b.name}</td>
            <td>${b.location || ""}</td>
            ${cols.map(c => `<td>${c}</td>`).join("")}
            <td>${total}</td>
            <td>
              <button class="editBtn" onclick="editBlock(${b.id})">Edit</button>
              <button class="deleteBtn" onclick="deleteBlock(${b.id})">Delete</button>
            </td>
          </tr>
        `;
      });
    } catch (err) {
      console.error("Error loading blocks:", err);
    }
  }

  // 2. ADD / UPDATE BLOCK
  if (blockForm) {
    blockForm.addEventListener("submit", async e => {
      e.preventDefault();

      const name = document.getElementById("blockName").value.trim();
      const location = document.getElementById("blockLocation").value.trim();

      if (!name) return alert("Block name required");
      if (!location) return alert("Block location required");

      const column_breaks = [...document.querySelectorAll(".columnInput")]
        .map(i => parseInt(i.value) || 0);

      // FIX: Use Correct API URLs
      const method = editId ? "PUT" : "POST";
      const url = editId
        ? `${API_BASE_URL}/api/blocks/${editId}`
        : `${API_BASE_URL}/api/blocks`;

      try {
        await fetch(url, {
          method,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name,
            location,
            column_breaks
          })
        });

        editId = null;
        blockForm.reset();
        document.querySelector("button[type='submit']").innerText = "Set Block"; // Reset button text
        renderBlocks();
        alert("Saved successfully!");
      } catch (err) {
        console.error(err);
        alert("Error saving block");
      }
    });
  }

  // 3. EDIT BLOCK FUNCTION (Global)
  window.editBlock = async id => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/block/${id}`);
      const b = await res.json();

      document.getElementById("blockName").value = b.name;
      document.getElementById("blockLocation").value = b.location || "";

      // Fill the 10 column inputs
      document.querySelectorAll(".columnInput").forEach((el, i) => {
        el.value = b[`col${i + 1}`] || 0;
      });

      editId = id;
      document.querySelector("button[type='submit']").innerText = "Update Block"; // Change button text
    } catch (err) {
      console.error(err);
    }
  };

  // 4. DELETE BLOCK FUNCTION (Global)
  window.deleteBlock = async id => {
    if (!confirm("Delete this block?")) return;

    try {
      await fetch(`${API_BASE_URL}/api/blocks/${id}`, {
        method: "DELETE"
      });
      renderBlocks();
    } catch (err) {
      console.error(err);
      alert("Error deleting block");
    }
  };

  // Load blocks immediately if table exists
  renderBlocks();

});