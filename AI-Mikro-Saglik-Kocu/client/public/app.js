const API_BASE = "/api";
const tokenKey = "healthCoachToken";
const userKey = "healthCoachUser";

const views = {
  auth: document.getElementById("authView"),
  dashboard: document.getElementById("dashboardView"),
  "health-form": document.getElementById("healthFormView"),
  history: document.getElementById("historyView"),
  recommendations: document.getElementById("recommendationsView")
};

const authForm = document.getElementById("authForm");
const authTitle = document.getElementById("authTitle");
const authSubmitBtn = document.getElementById("authSubmitBtn");
const authMessage = document.getElementById("authMessage");
const authToggleText = document.getElementById("authToggleText");
const toggleAuthMode = document.getElementById("toggleAuthMode");
const nameGroup = document.getElementById("nameGroup");
const userLabel = document.getElementById("userLabel");

const logoutBtn = document.getElementById("logoutBtn");
const healthForm = document.getElementById("healthForm");
const healthMessage = document.getElementById("healthMessage");
const sidebar = document.getElementById("sidebar");
const mobileMenuBtn = document.getElementById("mobileMenuBtn");

let isRegisterMode = false;

function getToken() {
  return localStorage.getItem(tokenKey);
}

function getSavedUser() {
  const raw = localStorage.getItem(userKey);
  return raw ? JSON.parse(raw) : null;
}

function setAuthData(token, user) {
  localStorage.setItem(tokenKey, token);
  localStorage.setItem(userKey, JSON.stringify(user));
}

function clearAuthData() {
  localStorage.removeItem(tokenKey);
  localStorage.removeItem(userKey);
}

async function apiRequest(path, options = {}) {
  const token = getToken();
  const headers = { "Content-Type": "application/json", ...(options.headers || {}) };
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${API_BASE}${path}`, { ...options, headers });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || "Istek basarisiz.");
  return data;
}

function toggleAuthUi() {
  authForm.reset();
  authMessage.textContent = "";
  if (isRegisterMode) {
    authTitle.textContent = "Kayit Ol";
    authSubmitBtn.textContent = "Kayit Ol";
    nameGroup.classList.remove("hidden");
    authToggleText.innerHTML = 'Hesabin var mi? <a href="#" id="toggleAuthMode">Giris Yap</a>';
  } else {
    authTitle.textContent = "Giris Yap";
    authSubmitBtn.textContent = "Giris Yap";
    nameGroup.classList.add("hidden");
    authToggleText.innerHTML = 'Hesabin yok mu? <a href="#" id="toggleAuthMode">Kayit Ol</a>';
  }
  bindToggleLink();
}

function bindToggleLink() {
  const link = document.getElementById("toggleAuthMode");
  link.addEventListener("click", (e) => {
    e.preventDefault();
    isRegisterMode = !isRegisterMode;
    toggleAuthUi();
  });
}

function showAppLayout(isLoggedIn) {
  document.querySelector(".sidebar").classList.toggle("hidden", !isLoggedIn);
  document.querySelector(".topbar").classList.toggle("hidden", !isLoggedIn);
  views.auth.classList.toggle("hidden", isLoggedIn);
}

function activateView(viewName) {
  Object.entries(views).forEach(([name, el]) => {
    if (name === "auth") return;
    el.classList.toggle("hidden", name !== viewName);
  });
  document.querySelectorAll(".menu-btn").forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.view === viewName);
  });
}

function fmtDate(isoDate) {
  return new Date(isoDate).toLocaleString("tr-TR");
}

async function loadDashboard() {
  const [summary, recommendations, notifications] = await Promise.all([
    apiRequest("/health/summary").catch(() => null),
    apiRequest("/recommendations"),
    apiRequest("/notifications")
  ]);

  document.getElementById("sleepValue").textContent = summary ? summary.sleep_hours : "-";
  document.getElementById("stepValue").textContent = summary ? summary.step_count : "-";
  document.getElementById("waterValue").textContent = summary ? summary.water_amount : "-";
  document.getElementById("stressValue").textContent = summary ? summary.stress_level : "-";

  const dailyRecommendations = document.getElementById("dailyRecommendations");
  dailyRecommendations.innerHTML = "";
  recommendations.slice(0, 5).forEach((item) => {
    const li = document.createElement("li");
    li.textContent = item.recommendation_text;
    dailyRecommendations.appendChild(li);
  });

  const notificationList = document.getElementById("notificationList");
  notificationList.innerHTML = "";
  notifications.slice(0, 5).forEach((item) => {
    const li = document.createElement("li");
    li.textContent = `${item.notification_text} (${fmtDate(item.created_at)})`;
    notificationList.appendChild(li);
  });
}

async function loadHistory() {
  const history = await apiRequest("/health/history");
  const tbody = document.getElementById("historyTableBody");
  tbody.innerHTML = "";
  history.forEach((item) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${fmtDate(item.created_at)}</td>
      <td>${item.sleep_hours}</td>
      <td>${item.step_count}</td>
      <td>${item.water_amount}</td>
      <td>${item.stress_level}</td>
    `;
    tbody.appendChild(tr);
  });
}

async function loadRecommendations() {
  const recommendations = await apiRequest("/recommendations");
  const list = document.getElementById("recommendationList");
  list.innerHTML = "";
  recommendations.forEach((item) => {
    const li = document.createElement("li");
    li.textContent = `${item.recommendation_text} (${fmtDate(item.created_at)})`;
    list.appendChild(li);
  });
}

async function initializeLoggedInState() {
  showAppLayout(true);
  activateView("dashboard");
  const user = getSavedUser();
  userLabel.textContent = user ? user.name : "Kullanici";
  await Promise.all([loadDashboard(), loadHistory(), loadRecommendations()]);
}

authForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  authMessage.textContent = "";

  const payload = {
    email: document.getElementById("email").value.trim(),
    password: document.getElementById("password").value
  };
  if (isRegisterMode) {
    payload.name = document.getElementById("name").value.trim();
  }

  try {
    const endpoint = isRegisterMode ? "/register" : "/login";
    const response = await apiRequest(endpoint, {
      method: "POST",
      body: JSON.stringify(payload)
    });
    setAuthData(response.token, response.user);
    await initializeLoggedInState();
  } catch (error) {
    authMessage.textContent = error.message;
  }
});

healthForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  healthMessage.textContent = "";
  const payload = {
    sleep_hours: Number(document.getElementById("sleepHours").value),
    step_count: Number(document.getElementById("stepCount").value),
    water_amount: Number(document.getElementById("waterAmount").value),
    stress_level: Number(document.getElementById("stressLevel").value)
  };

  try {
    await apiRequest("/health", { method: "POST", body: JSON.stringify(payload) });
    healthForm.reset();
    healthMessage.style.color = "#2d8a4c";
    healthMessage.textContent = "Saglik verisi basariyla kaydedildi.";
    await Promise.all([loadDashboard(), loadHistory(), loadRecommendations()]);
  } catch (error) {
    healthMessage.style.color = "#d9534f";
    healthMessage.textContent = error.message;
  }
});

document.querySelectorAll(".menu-btn").forEach((btn) => {
  btn.addEventListener("click", async () => {
    const view = btn.dataset.view;
    activateView(view);
    if (view === "dashboard") await loadDashboard();
    if (view === "history") await loadHistory();
    if (view === "recommendations") await loadRecommendations();
    sidebar.classList.remove("open");
  });
});

logoutBtn.addEventListener("click", () => {
  clearAuthData();
  showAppLayout(false);
  Object.values(views).forEach((view, idx) => {
    if (idx > 0) view.classList.add("hidden");
  });
  views.auth.classList.remove("hidden");
  isRegisterMode = false;
  toggleAuthUi();
});

mobileMenuBtn.addEventListener("click", () => {
  sidebar.classList.toggle("open");
});

async function init() {
  bindToggleLink();
  const token = getToken();
  if (!token) {
    showAppLayout(false);
    return;
  }
  try {
    await initializeLoggedInState();
  } catch (error) {
    clearAuthData();
    showAppLayout(false);
  }
}

init();
