// ===============================
// GLOBAL STATE
let isSignup = false;
let currentUser = null;

const items = ['meds', 'water', 'food', 'sleep'];

// CLOCK LOGIC
function updateClock() {
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });
    document.getElementById('live-clock').textContent = timeStr;
}

setInterval(updateClock, 1000);
updateClock();

// AUTH TOGGLE
function toggleAuth() {
    isSignup = !isSignup;

    document.getElementById('auth-title').innerText =
        isSignup ? "Create Account" : "Welcome Back";

    document.getElementById('auth-btn').innerText =
        isSignup ? "Sign Up" : "Login";

    document.getElementById('toggle-text').innerText =
        isSignup
            ? "Already have an account? Login"
            : "Don't have an account? Sign up";

    document.getElementById('signup-extra').style.display =
        isSignup ? "block" : "none";
}

// AUTH HANDLER

function handleAuth() {
    const user = document.getElementById('username').value.trim();
    const pass = document.getElementById('password').value.trim();
    const contact = document.getElementById('emergency-contact').value.trim();

    if (!user || !pass) {
        alert("Please fill all fields");
        return;
    }

    if (isSignup) {
        const userData = {
            username: user,
            password: pass,
            contact: contact || "Family Member"
        };

        localStorage.setItem(`user_${user}`, JSON.stringify(userData));
        alert("Account created successfully! Please login.");
        toggleAuth();
    } else {
        const stored = localStorage.getItem(`user_${user}`);

        if (!stored) {
            alert("User not found");
            return;
        }

        const parsed = JSON.parse(stored);

        if (parsed.password === pass) {
            currentUser = parsed;
            localStorage.setItem("loggedInUser", user);
            loginSuccess();
        } else {
            alert("Wrong password");
        }
    }
}

// LOGIN SUCCESS
function loginSuccess() {
    document.getElementById('auth-container').style.display = 'none';
    document.getElementById('app-container').style.display = 'block';

    document.getElementById('welcome-msg').innerText =
        `Hello, ${currentUser.username}!`;

    document.getElementById('display-contact').innerText =
        currentUser.contact;

    loadChecklist();
    updateProgress();
}

// AUTO LOGIN (Session Restore)
window.onload = function () {
    const savedUser = localStorage.getItem("loggedInUser");

    if (savedUser) {
        const stored = localStorage.getItem(`user_${savedUser}`);
        if (stored) {
            currentUser = JSON.parse(stored);
            loginSuccess();
        }
    }
};

// LOGOUT
function logout() {
    localStorage.removeItem("loggedInUser");
    location.reload();
}

// CHECKLIST LOGIC
items.forEach(id => {
    document.getElementById(id).addEventListener('change', () => {
        saveChecklist();
        updateProgress();
    });
});

function saveChecklist() {
    if (!currentUser) return;

    const state = {};
    items.forEach(id => {
        state[id] = document.getElementById(id).checked;
    });

    localStorage.setItem(
        `check_${currentUser.username}`,
        JSON.stringify(state)
    );
}

function loadChecklist() {
    const saved = localStorage.getItem(
        `check_${currentUser.username}`
    );

    if (!saved) return;

    const state = JSON.parse(saved);

    items.forEach(id => {
        document.getElementById(id).checked = state[id] || false;
    });
}

// PROGRESS TRACKING
function updateProgress() {
    const total = items.length;
    const completed = items.filter(
        id => document.getElementById(id).checked
    ).length;

    const percent = Math.round((completed / total) * 100);

    console.log(`Checklist completion: ${percent}%`);
}

// MODAL LOGIC
function showModal(id) {
    document.getElementById(id).style.display = 'flex';
}

function closeModal(id) {
    document.getElementById(id).style.display = 'none';
}

// Close when clicking outside modal content
window.addEventListener('click', function (event) {
    if (event.target.classList.contains('modal')) {
        event.target.style.display = "none";
    }
});
