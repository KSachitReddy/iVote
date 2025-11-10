// --- Registration + Login ---
function register() {
    const user = document.getElementById("newUser").value.trim();
    const pass = document.getElementById("newPass").value.trim();

    if (!user || !pass) return alert("Enter username and password!");

    let voters = JSON.parse(localStorage.getItem("voters") || "[]");
    if (voters.find(v => v.username === user)) {
        alert("User already exists!");
        return;
    }

    voters.push({ username: user, password: pass, hasVoted: false });
    localStorage.setItem("voters", JSON.stringify(voters));
    document.getElementById("regMsg").style.display = "block";
}

function login() {
    const user = document.getElementById("username").value.trim();
    const pass = document.getElementById("password").value.trim();
    const voters = JSON.parse(localStorage.getItem("voters") || "[]");
    const voter = voters.find(v => v.username === user && v.password === pass);

    if (voter) {
        localStorage.setItem("currentVoter", user);
        window.location.href = "dashboard.html";
    } else {
        document.getElementById("errorMsg").style.display = "block";
    }
}

// --- Voting dashboard ---
window.onload = async function () {
    const voter = localStorage.getItem("currentVoter");
    const nameSpan = document.getElementById("voterName");
    const candidatesDiv = document.getElementById("candidates");

    if (nameSpan && !voter) {
        // Not logged in
        window.location.href = "index.html";
        return;
    }

    if (nameSpan) {
        nameSpan.textContent = voter;

        // Load election data
        const res = await fetch("elections.json");
        const election = await res.json();

        const allVoters = JSON.parse(localStorage.getItem("voters") || "[]");
        const current = allVoters.find(v => v.username === voter);

        candidatesDiv.innerHTML = `<h3>${election.electionName}</h3>`;

        election.candidates.forEach(c => {
            const div = document.createElement("div");
            div.className = "candidate-card";
            div.innerHTML = `
                <p><strong>${c.name}</strong> (${c.party})</p>
            `;
            const btn = document.createElement("button");
            btn.textContent = "Vote";
            btn.disabled = current.hasVoted;
            btn.onclick = () => voteFor(c.id, election);
            div.appendChild(btn);
            candidatesDiv.appendChild(div);
        });
    }

    const resultsDiv = document.getElementById("results");
    if (resultsDiv) loadResults(resultsDiv);
};

function voteFor(id, election) {
    const voterName = localStorage.getItem("currentVoter");
    let voters = JSON.parse(localStorage.getItem("voters"));
    let current = voters.find(v => v.username === voterName);

    if (current.hasVoted) {
        alert("You already voted!");
        return;
    }

    let votes = JSON.parse(localStorage.getItem("votes") || "{}");
    votes[id] = (votes[id] || 0) + 1;
    localStorage.setItem("votes", JSON.stringify(votes));

    current.hasVoted = true;
    localStorage.setItem("voters", JSON.stringify(voters));

    alert("✅ Your vote has been cast!");
    window.location.reload();
}

// --- Results page ---
function loadResults(div) {
    const votes = JSON.parse(localStorage.getItem("votes") || "{}");
    fetch("elections.json")
        .then(res => res.json())
        .then(election => {
            div.innerHTML = `<h3>${election.electionName}</h3>`;
            election.candidates.forEach(c => {
                const count = votes[c.id] || 0;
                div.innerHTML += `<p><strong>${c.name}</strong> (${c.party}) — ${count} votes</p>`;
            });
        });
}

// --- Navigation + Logout ---
function goTo(page) {
    window.location.href = page;
}

function logout() {
    localStorage.removeItem("currentVoter");
    window.location.href = "index.html";
}
