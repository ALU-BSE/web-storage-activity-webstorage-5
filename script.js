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
  const csrfToken = document.getElementById("csrfToken").value;

  if (!validateCSRFToken(csrfToken)) {
    showToast('Invalid security token. Please try again.');
    return false;
}

  if (email && password) {
    setCookie("authToken", btoa(email), 7);
    setCookie("userEmail", email, 7);

    document.body.classList.add("is-logged-in");
    document.getElementById("userDisplay").textContent = decodeURIComponent(email).split("@")[0];
    updateCartDisplay();
    initializeTheme();
    document.getElementById("loginForm").reset();
  }

  return false;
}
function initializeTheme() {
  const settings = loadSettings();
  applyTheme(settings.theme);
}

function handleLogout() {
  deleteCookie("authToken");
  deleteCookie("userEmail");

  document.body.classList.remove("is-logged-in");
}


  const authToken = getCookie("authToken");
  const userEmail = getCookie("userEmail");

  if (authToken && userEmail) {
    document.body.classList.add("is-logged-in");
    document.getElementById("userDisplay").textContent =
      userEmail.split("@")[0];
      updateCartDisplay();
  }


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
  const loginForm = document.getElementById('loginForm');
  if(loginForm) {
    loginForm.addEventListener("submit", handleLogin)
  }
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

function initializeCart() {
  return JSON.parse(sessionStorage.getItem('cart')) || [];
}

function saveCart(cart) {
  sessionStorage.setItem('cart', JSON.stringify(cart));
  updateCartDisplay();
}

function addToCart(product, price) {
  const sanitizedProduct = sanitizeInput(product);
  const cart = initializeCart();
  const existingItem = cart.find(item => item.product === product);
  
  if (existingItem) {
      existingItem.quantity += 1;
  } else {
      cart.push({
          product:sanitizedProduct,
          price: parseFloat(price),
          quantity: 1
      });
  }
  
  saveCart(cart);
  showToast(`Added ${decodeURIComponent(sanitizedProduct)} to cart!`);
}

function updateCartDisplay() {
  const cart = initializeCart();
  const cartItems = document.getElementById('cartItems');
  const cartCount = document.getElementById('cartCount');
  const cartTotal = document.getElementById('cartTotal');
  
  cartItems.innerHTML = '';
  let total = 0;
  
  cart.forEach(item => {
      const itemTotal = item.price * item.quantity;
      total += itemTotal;
      
      cartItems.innerHTML += `
          <div class="cart-item">
              <div>
                  <h6 class="mb-0">${item.product}</h6>
                  <small class="text-muted">$${item.price} × ${item.quantity}</small>
              </div>
              <div class="d-flex align-items-center gap-2">
                  <span>$${itemTotal.toFixed(2)}</span>
                  <button onclick="removeFromCart('${item.product}')" class="btn btn-sm btn-danger">
                      <i class="fas fa-trash"></i>
                  </button>
              </div>
          </div>
      `;
  });
  
  cartCount.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);
  cartTotal.textContent = `$${total.toFixed(2)}`;
}

function clearCart() {
  sessionStorage.removeItem('cart');
  updateCartDisplay();
  showToast('Cart cleared!');
}

function removeFromCart(product) {
  const cart = initializeCart();
  const index = cart.findIndex(item => item.product === product);
  if (index > -1) {
      cart.splice(index, 1);
      saveCart(cart);
      showToast(`Removed ${product} from cart!`);
  }
}

function showToast(message) {
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = message;
  document.body.appendChild(toast);
  
  setTimeout(() => {
      toast.remove();
  }, 3000);
}
function generateCSRFToken() {
  return Math.random().toString(36).substr(2);
}

function sanitizeInput(input) {
  return encodeURIComponent(input);
}

function validateCSRFToken(token) {
  return token === sessionStorage.getItem('csrfToken');
}

function updateCartDisplay() {
  const cart = initializeCart();
  const cartItems = document.getElementById('cartItems');
  const cartCount = document.getElementById('cartCount');
  const cartTotal = document.getElementById('cartTotal');
  
  cartItems.innerHTML = '';
  let total = 0;
  
  cart.forEach(item => {
      const itemTotal = item.price * item.quantity;
      total += itemTotal;
      
      cartItems.innerHTML += `
          <div class="cart-item">
              <div>
                  <h6 class="mb-0">${decodeURIComponent(item.product)}</h6>
                  <small class="text-muted">$${parseFloat(item.price).toFixed(2)} × ${parseInt(item.quantity)}</small>
              </div>
              <div class="d-flex align-items-center gap-2">
                  <span>$${itemTotal.toFixed(2)}</span>
                  <button onclick="removeFromCart('${item.product}')" class="btn btn-sm btn-danger">
                      <i class="fas fa-trash"></i>
                  </button>
              </div>
          </div>
      `;
  });
  
  cartCount.textContent = cart.reduce((sum, item) => sum + parseInt(item.quantity), 0);
  cartTotal.textContent = `$${total.toFixed(2)}`;
}

document.addEventListener('DOMContentLoaded', () => {
  const csrfToken = generateCSRFToken();
  sessionStorage.setItem('csrfToken', csrfToken);

  const loginForm = document.getElementById('loginForm');
  if (loginForm) {
      loginForm.innerHTML += `
          <input type="hidden" name="csrfToken" id="csrfToken" value="${csrfToken}">
      `;
      loginForm.addEventListener('submit', handleLogin);
  }

});
