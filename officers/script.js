// --- Dummy login details ---
const officers = [
    { username: "officer_north", password: "north123", area: "North Zone" },
    { username: "officer_south", password: "south123", area: "South Zone" }
];

// --- Login function ---
function login() {
    const user = document.getElementById("username").value.trim();
    const pass = document.getElementById("password").value.trim();
    const officer = officers.find(o => o.username === user && o.password === pass);

    if (officer) {
        localStorage.setItem("officerArea", officer.area);
        window.location.href = "dashboard.html";
    } else {
        document.getElementById("errorMsg").style.display = "block";
    }
}

// --- Dashboard page logic ---
window.onload = async function () {
    const area = localStorage.getItem("officerArea");
    const areaLabel = document.getElementById("areaLabel");
    const voterListDiv = document.getElementById("voterList");

    if (areaLabel && !area) {
        // Not logged in, redirect to login
        window.location.href = "index.html";
        return;
    }

    if (areaLabel) {
        areaLabel.textContent = "Area Assigned: " + area;
        try {
            const res = await fetch("voters.json");
            const data = await res.json();
            const voters = data[area] || [];
            renderVoters(voters);
        } catch (err) {
            voterListDiv.innerHTML = "<p>Error loading voter data</p>";
        }
    }
};

// --- Render voter cards ---
function renderVoters(voters) {
    const div = document.getElementById("voterList");
    div.innerHTML = "";

    if (voters.length === 0) {
        div.innerHTML = "<p>No voters found for this area.</p>";
        return;
    }

    voters.forEach(voter => {
        const decisionKey = "voter_" + voter.id;
        const savedDecision = localStorage.getItem(decisionKey);

        const card = document.createElement("div");
        card.className = "voter-card";
        card.innerHTML = `
            <p><strong>Name:</strong> ${voter.name}</p>
            <p><strong>Age:</strong> ${voter.age}</p>
            <p><strong>ID Card:</strong> ${voter.idCard}</p>
            <p><strong>Status:</strong> ${savedDecision ? savedDecision : "Pending"}</p>
        `;

        const approveBtn = document.createElement("button");
        approveBtn.textContent = "Approve";
        approveBtn.className = "approve";
        approveBtn.disabled = !!savedDecision;
        approveBtn.onclick = () => verifyVoter(voter.id, "Approved");

        const rejectBtn = document.createElement("button");
        rejectBtn.textContent = "Reject";
        rejectBtn.className = "reject";
        rejectBtn.disabled = !!savedDecision;
        rejectBtn.onclick = () => verifyVoter(voter.id, "Rejected");

        card.appendChild(approveBtn);
        card.appendChild(rejectBtn);
        div.appendChild(card);
    });
}

// --- Approve/Reject voter ---
function verifyVoter(id, status) {
    const key = "voter_" + id;
    if (!localStorage.getItem(key)) {
        localStorage.setItem(key, status);
        alert(`Voter ID ${id} marked as ${status}`);
        location.reload();
    } else {
        alert("You have already verified this voter!");
    }
}

// --- Logout ---
function logout() {
    localStorage.removeItem("officerArea");
    window.location.href = "index.html";
}
