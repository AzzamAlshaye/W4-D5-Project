// — STORAGE HELPERS —
function getData(key) {
  return JSON.parse(localStorage.getItem(key)) || [];
}
function setData(key, val) {
  localStorage.setItem(key, JSON.stringify(val));
}

// — INITIAL EVENTS (built-in, no fetch) —
const initialEvents = [
  {
    title: "Invention of the Printing Press",
    date: "1440-01-01",
    description: "Gutenberg invents movable type.",
  },
  {
    title: "First Programmable Computer",
    date: "1936-08-01",
    description: "Turing’s machine concept.",
  },
  {
    title: "Birth of the Internet",
    date: "1969-10-29",
    description: "ARPANET packet switch test.",
  },
  // …add as many as you like
];
if (!localStorage.getItem("events")) {
  setData("events", initialEvents);
}

// — AUTH —
function register(username, password) {
  const users = getData("users");
  if (username.length <= 4) throw "Username must be >4 characters";
  if (password.length <= 3) throw "Password must be >3 characters";
  if (users.some((u) => u.username === username))
    throw "Username already taken";
  users.push({ username, password });
  setData("users", users);
  localStorage.setItem("currentUser", username);
}
function login(username, password) {
  const users = getData("users");
  if (!users.find((u) => u.username === username && u.password === password)) {
    throw "Invalid credentials";
  }
  localStorage.setItem("currentUser", username);
}
function logout() {
  localStorage.removeItem("currentUser");
}
function currentUser() {
  return localStorage.getItem("currentUser");
}

// — EVENTS & COMMENTS —
function getEvents() {
  return getData("events");
}
function addEvent(evt) {
  const evts = getEvents();
  evts.push(evt);
  setData("events", evts);
}
function getComments(eventId) {
  return getData("comments").filter((c) => c.eventId === eventId);
}
function addComment(eventId, text) {
  const comments = getData("comments");
  comments.push({
    eventId,
    user: currentUser(),
    text,
    timestamp: Date.now(),
  });
  setData("comments", comments);
}

// — UI INIT —
// Timeline on index.html
if (document.getElementById("timeline")) {
  const items = getEvents().map((e, i) => ({
    id: i,
    content: `<a href="event.html?id=${i}">${e.title}</a>`,
    start: e.date,
  }));
  // Using vis.js for timeline display (no data fetch)
  new vis.Timeline(document.getElementById("timeline"), items, {});
}

// — NAVBAR STATE —
document.addEventListener("DOMContentLoaded", () => {
  const user = currentUser();
  if (user) {
    document.getElementById("nav-login").classList.add("d-none");
    document.getElementById("nav-signup").classList.add("d-none");
    const navUser = document.getElementById("nav-user");
    navUser.querySelector("a").textContent = user;
    navUser.classList.remove("d-none");
  }
});
