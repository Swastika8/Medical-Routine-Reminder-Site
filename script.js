let isSignup = false;
let currentUser = null;
const checklistItems = ['meds', 'water', 'food', 'sleep'];

// --- Initialization ---
document.addEventListener('DOMContentLoaded', () => {
    updateClock();
    setInterval(updateClock, 1000);
    
    // Setup checklist listeners
    checklistItems.forEach(id => {
        document.getElementById(id).addEventListener('change', saveChecklist);
    });
});

// --- Clock Logic ---
function updateClock() {
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { 
        hour: '2-digit', 
        minute: '2-digit', 
        second: '2-digit',
        hour12: true 
    });
    const clockEl = document.getElementById('live-clock');
    if (clockEl) clockEl.textContent = timeStr;
}

// --- Auth Logic ---
function toggleAuth() {
    isSignup = !isSignup;
    document.getElementById('auth-title').innerText = isSignup ? "Create Account" : "Welcome Back";
    document.getElementById('auth-btn').innerText = isSignup ? "Sign Up" : "Login";
    document.getElementById('toggle-text').innerText = isSignup ? "Already have an account? Login" : "Don't have an account? Sign up";
    document.getElementById('signup-extra').style.display = isSignup ? "block" : "none";
}

function handleAuth() {
    const user = document.getElementById('username').value.trim();
    const pass = document.getElementById('password').value.trim();
    const contact = document.getElementById('emergency-contact').value.trim();

    if (!user || !pass) {
        alert("Please fill in your username and password");
        return;
    }

    if (isSignup) {
        const userData = { 
            username: user, 
            password: pass, 
            contact: contact || "Family Member" 
        };
        localStorage.setItem(`user_${user}`, JSON.stringify(userData));
        alert("Account created successfully! You can now login.");
        toggleAuth();
    } else {
        const stored = localStorage.getItem(`user_${user}`);
        if (stored) {
            const parsed = JSON.parse(stored);
            if (parsed.password === pass) {
                currentUser = parsed;
                loginSuccess();
            } else {
                alert("Incorrect password. Please try again.");
            }
        } else {
            alert("User not found. Would you like to sign up?");
        }
    }
}

function loginSuccess() {
    document.getElementById('auth-container').style.display = 'none';
    document.getElementById('app-container').style.display = 'block';
    document.getElementById('welcome-msg').innerText = `Hello, ${currentUser.username}!`;
    document.getElementById('display-contact').innerText = currentUser.contact;
    loadChecklist();
}

function logout() {
    if(confirm("Are you sure you want to logout?")) {
        location.reload();
    }
}

// --- Checklist Logic ---
function saveChecklist() {
    if (!currentUser) return;
    const state = {};
    checklistItems.forEach(id => {
        state[id] = document.getElementById(id).checked;
    });
    localStorage.setItem(`check_${currentUser.username}`, JSON.stringify(state));
}

function loadChecklist() {
    const saved = localStorage.getItem(`check_${currentUser.username}`);
    if (saved) {
        const state = JSON.parse(saved);
        checklistItems.forEach(id => {
            document.getElementById(id).checked = state[id] || false;
        });
    }
}

// --- Modal Logic ---
function showModal(id) {
    document.getElementById(id).style.display = 'flex';
}

function closeModal(id) {
    document.getElementById(id).style.display = 'none';
}

// Close modal when clicking outside the content box
window.onclick = function(event) {
    if (event.target.classList.contains('modal')) {
        event.target.style.display = "none";
    }
}
