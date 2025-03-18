function setCookie(name, value, days) {
  const date = new Date();
  date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
  const expires = `expires=${date.toUTCString()}`;
  document.cookie = `${name}=${value}; ${expires}; path=/; Secure; HttpOnly`;
}

function getCookie(name) {
  const cookieName = `${name}=`;
  const cookies = document.cookie.split(";");
  for (let cookie of cookies) {
    cookie = cookie.trim();
    if (cookie.indexOf(cookieName) === 0) {
      return cookie.substring(cookieName.length, cookie.length);
    }
  }
  return null;
}

function deleteCookie(name) {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/`;
}

function handleLogin(event) {
  event.preventDefault();

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  if (email && password) {
    setCookie("authToken", btoa(email), 7);
    setCookie("userEmail", email, 7);

    document.body.classList.add("is-logged-in");
    document.getElementById("userDisplay").textContent = email.split("@")[0];
    document.getElementById("loginForm").reset();
  }

  return false;
}

function handleLogout() {
  deleteCookie("authToken");
  deleteCookie("userEmail");

  document.body.classList.remove("is-logged-in");
}

window.onload = function () {
  const authToken = getCookie("authToken");
  const userEmail = getCookie("userEmail");

  if (authToken && userEmail) {
    document.body.classList.add("is-logged-in");
    document.getElementById("userDisplay").textContent =
      userEmail.split("@")[0];
  }
};

const defaultSettings = {
  theme: 'dark',
  fontSize: 16,
  language: 'en'
};

function saveSettings(settings) {
  localStorage.setItem('userSettings', JSON.stringify(settings));
}

function loadSettings() {
  const savedSettings = localStorage.getItem('userSettings');
  return savedSettings ? JSON.parse(savedSettings) : defaultSettings;
}

function applyTheme(theme) {
  if (theme === 'light') {
      document.body.classList.add('light-theme');
  } else {
      document.body.classList.remove('light-theme');
  }
}

function toggleTheme() {
  const settings = loadSettings();
  settings.theme = settings.theme === 'light' ? 'dark' : 'light';
  saveSettings(settings);
  applyTheme(settings.theme);
}

document.addEventListener('DOMContentLoaded', () => {
  const settings = loadSettings();
  applyTheme(settings.theme);

  const themeToggle = document.getElementById('themeToggle');
  if (themeToggle) {
      themeToggle.addEventListener('click', toggleTheme);
  }
});

window.onload = function() {
  const authToken = getCookie('authToken');
  const userEmail = getCookie('userEmail');
  
  if (authToken && userEmail) {
      document.body.classList.add('is-logged-in');
      document.getElementById('userDisplay').textContent = userEmail.split('@')[0];
  }

  const settings = loadSettings();
  applyTheme(settings.theme);
  document.documentElement.style.fontSize = `${settings.fontSize}px`;
};

function updateSettings(updates) {
  const currentSettings = loadSettings();
  const newSettings = { ...currentSettings, ...updates };
  saveSettings(newSettings);
  
  applyTheme(newSettings.theme);
  document.documentElement.style.fontSize = `${newSettings.fontSize}px`;
}
