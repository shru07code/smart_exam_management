const API_URL = `${API_BASE_URL}/api`;

function showSection(id) {
    document.querySelectorAll('.section').forEach(el => el.style.display = 'none');
    document.getElementById(id).style.display = 'block';

    if(id === 'timetable') loadTimetable();
    if(id === 'inventory') loadInventory();
    if(id === 'seating') loadSeating();
    if(id === 'marksheet') loadMarksheet();
    if(id === 'extrapaper') loadExtraPaper();
    if(id === 'detained') loadDetained();
    if(id === 'subjects') loadSubjectSections();
    if(id === 'reports') loadReport();
}

function logout() {
    if(confirm("Logout?")) {
        window.location.href = "../login.html";
    }
}

// --- GENERIC UPLOAD ---
async function uploadCSV(endpoint, inputId) {
    const fileInput = document.getElementById(inputId);
    if(fileInput.files.length === 0) {
        alert("Please select a CSV file");
        return;
    }

    const formData = new FormData();
    formData.append("file", fileInput.files[0]);

    try {
        const res = await fetch(`${API_URL}/${endpoint}`, {
            method: 'POST',
            body: formData
        });
        const data = await res.json();
        if(data.error) throw new Error(data.error);
        
        // Save current section to maintain state after reload
        const currentSectionId = document.querySelector('.section[style*="block"]').id;
        localStorage.setItem('activeSection', currentSectionId);

        alert("Upload Successful! Rows added: " + data.count);
        window.location.reload(); 
    } catch(e) {
        alert("Upload Failed: " + e.message);
    }
}

// --- LOAD DATA ---
document.addEventListener('DOMContentLoaded', () => {
    const activeSection = localStorage.getItem('activeSection');
    if (activeSection) {
        showSection(activeSection);
        localStorage.removeItem('activeSection'); 
    } else {
        showSection('home');
    }
});

async function loadTimetable() {
    try {
        const res = await fetch(`${API_URL}/timetable`);
        const data = await res.json();
        const tbody = document.querySelector('#tableTimetable tbody');
        tbody.innerHTML = data.map(row => `
            <tr>
                <td>${(row.exam_date ? String(row.exam_date).split('T')[0] : '')}</td>
                <td>${row.session}</td>
                <td>${row.subject_name} (${row.subject_code})</td>
            </tr>`).join('');
    } catch(e) { console.error(e); }
}

async function loadInventory() {
    try {
        const res = await fetch(`${API_URL}/inventory`);
        const data = await res.json();
        const tbody = document.querySelector('#tableInventory tbody');
        tbody.innerHTML = data.map(row => `
            <tr>
                <td>${row.subject_code}</td>
                <td>${row.qp_code || '-'}</td>
                <td>${row.subject_name}</td>
                <td>${row.quantity}</td>
            </tr>`).join('');
    } catch(e) { console.error(e); }
}

async function loadSeating() {
    try {
        const res = await fetch(`${API_URL}/seating-chart`);
        const data = await res.json();
        const tbody = document.querySelector('#tableSeating tbody');
        tbody.innerHTML = data.map(row => `
            <tr>
                <td>${row.seat_no}</td>
                <td>${row.course}</td>
                <td>${row.subject_code}</td>
            </tr>`).join('');
    } catch(e) { console.error(e); }
}

async function loadMarksheet() {
    try {
        const res = await fetch(`${API_URL}/marksheet`);
        const data = await res.json();
        const tbody = document.querySelector('#tableMarksheet tbody');
        tbody.innerHTML = data.map(row => `
            <tr>
                <td>${row.marksheet_no}</td>
                <td>${row.subject_abb}</td>
                <td>${row.subject_code}</td>
            </tr>`).join('');
    } catch(e) { console.error(e); }
}

// --- EXTRA PAPER ---
async function addExtraPaper() {
    const body = {
        date: document.getElementById('epDate').value,
        session: document.getElementById('epSession').value,
        subject_code: document.getElementById('epSubject').value,
        extra: document.getElementById('epExtra').value || 0,
        less: document.getElementById('epLess').value || 0,
        reason: document.getElementById('epReason').value
    };

    try {
        await fetch(`${API_URL}/extra-paper`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(body)
        });
        alert("Saved!");
        loadExtraPaper();
    } catch(e) { alert("Error"); }
}

async function loadExtraPaper() {
    try {
        const res = await fetch(`${API_URL}/extra-paper`);
        const data = await res.json();
        document.querySelector('#tableExtraPaper tbody').innerHTML = data.map(r => `
            <tr>
                <td>${r.date ? r.date.split('T')[0] : ''}</td>
                <td>${r.subject_code}</td>
                <td>${r.extra}</td>
                <td>${r.less}</td>
                <td>${r.reason}</td>
                <td><button onclick="deleteExtraPaper(${r.id})" style="background:red;">Delete</button></td>
            </tr>
        `).join('');
    } catch(e) {}
}

async function deleteExtraPaper(id) {
    if(confirm("Delete this entry?")) {
        await fetch(`${API_URL}/extra-paper/${id}`, { method: 'DELETE' });
        loadExtraPaper();
    }
}

// --- DETAINED ---
async function addDetained() {
    const body = {
        seat_no: document.getElementById('dtSeat').value,
        subject_code: document.getElementById('dtSubject').value,
        reason: document.getElementById('dtReason').value
    };
    try {
        await fetch(`${API_URL}/detained`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(body)
        });
        alert("Added!");
        loadDetained();
    } catch(e) { alert("Error"); }
}

async function loadDetained() {
    const res = await fetch(`${API_URL}/detained`);
    const data = await res.json();
    document.querySelector('#tableDetained tbody').innerHTML = data.map(r => `
        <tr>
            <td>${r.seat_no}</td>
            <td>${r.subject_code}</td>
            <td>${r.reason}</td>
            <td><button onclick="deleteDetained(${r.id})" style="background:red;">Delete</button></td>
        </tr>
    `).join('');
}

// --- CHANGE PASSWORD ---
async function changePassword() {
    const currPass = document.getElementById('currPass').value;
    const newPass = document.getElementById('newPass').value;
    
    // We need the username from session storage. 
    // In login.html we saved it as 'loggedInUser'
    const username = sessionStorage.getItem('loggedInUser');
    
    if(!username) {
        alert("Session expired. Please login again.");
        window.location.href = "../login.html";
        return;
    }

    try {
        const res = await fetch(`${API_URL}/change-password-dataentry`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ username, currentPassword: currPass, newPassword: newPass })
        });
        const data = await res.json();
        if(data.error) throw new Error(data.error);
        
        alert("Password updated successfully!");
        document.getElementById('currPass').value = '';
        document.getElementById('newPass').value = '';
    } catch(e) {
        alert("Failed: " + e.message);
    }
}

async function deleteDetained(id) {
    if(confirm("Delete?")) {
        await fetch(`${API_URL}/detained/${id}`, { method: 'DELETE' });
        loadDetained();
    }
}

// --- SUBJECT SECTIONS ---
async function addSubjectSection() {
    const body = {
        subject_code: document.getElementById('subCode').value,
        subject_name: document.getElementById('subName').value,
        section: document.getElementById('subSection').value
    };
    try {
        await fetch(`${API_URL}/subject-codes`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(body)
        });
        alert("Added!");
        loadSubjectSections();
    } catch(e) { alert("Error"); }
}

async function loadSubjectSections() {
    const res = await fetch(`${API_URL}/subject-codes`);
    const data = await res.json();
    document.querySelector('#tableSubjects tbody').innerHTML = data.map(r => `
        <tr>
            <td>${r.subject_code}</td>
            <td>${r.subject_name}</td>
            <td>${r.section}</td>
            <td><button onclick="deleteSubjectSection(${r.id})" style="background:red;">Delete</button></td>
        </tr>
    `).join('');
}

async function deleteSubjectSection(id) {
    if(confirm("Delete?")) {
        await fetch(`${API_URL}/subject-codes/${id}`, { method: 'DELETE' });
        loadSubjectSections();
    }
}

// --- REPORTS ---
async function loadReport() {
    const res = await fetch(`${API_URL}/student-count-report`);
    const data = await res.json();
    document.querySelector('#tableReport tbody').innerHTML = data.map(r => `
        <tr>
            <td>${r.subject_name} (${r.subject_code})</td>
            <td>${r.msbte_count}</td>
            <td>${r.seating_count}</td>
            <td>${r.difference}</td>
            <td class="${r.status === 'Matched' ? 'status-match' : 'status-mismatch'}">${r.status}</td>
        </tr>
    `).join('');
}
