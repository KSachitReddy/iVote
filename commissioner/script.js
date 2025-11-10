const correctPassword = "admin123"; // change password here

function login() {
    const input = document.getElementById("password").value;
    const errorMsg = document.getElementById("errorMsg");

    if (input === correctPassword) {
        // Redirect to dashboard
        window.location.href = "dashboard.html";
    } else {
        errorMsg.style.display = "block";
    }
}

function goTo(page) {
    window.location.href = page;
}

function logout() {
    window.location.href = "index.html";
}
