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

document.addEventListener("DOMContentLoaded", () => {
  // 1️⃣ Build the data for each year (1930–2019) with placeholder content
  const yearData = {};
  for (let y = 1930; y <= 2019; y++) {
    yearData[y] = {
      title: `Title for ${y}`,
      img: `https://via.placeholder.com/300x200?text=${y}`,
      desc: `Description of what happened in ${y}.`,
    };
  }
  // ─── Override any specific years with your real content: ────────────
  yearData[1933] = {
    title: "First Technicolor Feature",
    img: "/assets/1933-film.jpg",
    desc: '"The Wizard of Oz" premiered, first major Hollywood film shot in full Technicolor.',
  };
  yearData[1945] = {
    title: "End of World War II",
    img: "/assets/1945-ww2.jpg",
    desc: "Victory in Europe Day marked the official end of WWII in Europe on May 8, 1945.",
  };

  // 2️⃣ Configure which years are disabled, and which one starts active
  const disabledYears = [
    1930, 1931, 1932, 1935, 1936, 1938 /* …other years without data… */,
  ];
  const initialActiveYear = 1934;

  // 3️⃣ Define the decades array (1930s, 1940s, … up to 2010s)
  const decades = Array.from({ length: 9 }, (_, i) => 1930 + i * 10);

  // 4️⃣ Grab the indicator container and the carousel-inner container
  const indicatorsEl = document.querySelector(
    "#decadeCarousel .carousel-indicators"
  );
  const innerEl = document.querySelector("#decadeCarousel .carousel-inner");

  // 5️⃣ Programmatically build indicators and slides
  decades.forEach((startYear, idx) => {
    // • Indicator button
    const btn = document.createElement("button");
    btn.type = "button";
    btn.dataset.bsTarget = "#decadeCarousel";
    btn.dataset.bsSlideTo = idx;
    btn.ariaLabel = `${startYear}s`;
    if (idx === 0) btn.classList.add("active");
    indicatorsEl.appendChild(btn);

    // • Slide
    const slide = document.createElement("div");
    slide.classList.add("carousel-item");
    if (idx === 0) slide.classList.add("active");

    const wrapper = document.createElement("div");
    wrapper.className = "years-wrapper";

    // • Ten years per decade
    for (let y = startYear; y < startYear + 10; y++) {
      const yearEl = document.createElement("span");
      yearEl.textContent = y;
      yearEl.dataset.year = y;

      // decide disabled vs. clickable
      if (disabledYears.includes(y)) {
        yearEl.className = "year-item disabled";
      } else {
        yearEl.className = "year-item year-link";
      }

      // mark the initial active year
      if (y === initialActiveYear) {
        yearEl.classList.add("active");
      }

      wrapper.appendChild(yearEl);
    }

    slide.appendChild(wrapper);
    innerEl.appendChild(slide);
  });

  // 6️⃣ Grab carousel instance and detail‐card elements
  const carouselEl = document.getElementById("decadeCarousel");
  const carousel = bootstrap.Carousel.getOrCreateInstance(carouselEl);
  const detailCard = document.getElementById("yearDetailCard");
  const detailImg = document.getElementById("yearDetailImg");
  const detailTitle = document.getElementById("yearDetailTitle");
  const detailDesc = document.getElementById("yearDetailDesc");

  // 7️⃣ Helper to center a year-pill in its scroll container
  function centerYear(el) {
    const wrap = el.closest(".years-wrapper");
    const offset = el.offsetLeft - wrap.clientWidth / 2 + el.clientWidth / 2;
    wrap.scrollTo({ left: offset, behavior: "smooth" });
  }

  // 8️⃣ After each carousel slide, re-center the active year
  carouselEl.addEventListener("slid.bs.carousel", () => {
    const active = carouselEl.querySelector(".year-link.active");
    if (active) centerYear(active);
  });

  // 9️⃣ Delegate clicks on years to highlight, center & show detail
  carouselEl.addEventListener("click", (e) => {
    const link = e.target.closest(".year-link");
    if (!link) return;
    e.preventDefault();

    // • Highlight
    carouselEl
      .querySelectorAll(".year-link.active")
      .forEach((el) => el.classList.remove("active"));
    link.classList.add("active");

    // • Center it
    centerYear(link);

    // • Populate detail card
    const yr = link.dataset.year;
    const entry = yearData[yr];
    if (entry) {
      detailImg.src = entry.img;
      detailImg.alt = entry.title;
      detailTitle.textContent = `${yr}: ${entry.title}`;
      detailDesc.textContent = entry.desc;
      detailCard.style.display = "block";
    } else {
      detailCard.style.display = "none";
    }
  });

  // ⓾ On load, center the initialActiveYear pill
  const initialEl = carouselEl.querySelector(".year-item.active");
  if (initialEl) centerYear(initialEl);
});
