// — STORAGE HELPERS —
function getData(key) {
  return JSON.parse(localStorage.getItem(key)) || [];
}
function setData(key, val) {
  localStorage.setItem(key, JSON.stringify(val));
}
function deleteEvent(index) {
  const events = getEvents();
  events.splice(index, 1);
  localStorage.setItem("events", JSON.stringify(events));
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
  const all = JSON.parse(localStorage.getItem("comments") || "{}");
  return all[eventId] || [];
}

// Add a comment under the raw eventId
function addComment(eventId, text) {
  const all = JSON.parse(localStorage.getItem("comments") || "{}");
  const list = all[eventId] || [];
  list.push({
    user: currentUser(),
    text,
    timestamp: Date.now(),
  });
  all[eventId] = list;
  localStorage.setItem("comments", JSON.stringify(all));
}
// Remove the comment at commentIdx for the given eventId
function deleteComment(eventId, commentIdx) {
  const allComments = JSON.parse(localStorage.getItem("comments") || "{}");
  if (!allComments[eventId]) return;
  allComments[eventId].splice(commentIdx, 1);
  localStorage.setItem("comments", JSON.stringify(allComments));
}
// — NAVBAR STATE —
document.addEventListener("DOMContentLoaded", () => {
  const user = currentUser();
  if (user) {
    const loginLink = document.getElementById("nav-login");
    const signupLink = document.getElementById("nav-signup");
    if (loginLink) loginLink.classList.add("d-none");
    if (signupLink) signupLink.classList.add("d-none");
    const navUser = document.getElementById("nav-user");
    if (navUser) {
      navUser.querySelector("a").textContent = user;
      navUser.classList.remove("d-none");
    }
  }
});

// — TIMELINE & DETAIL CARD —
document.addEventListener("DOMContentLoaded", () => {
  // 1️⃣ Build the data for each year (1930–2019)
  const yearData = {};
  for (let y = 1930; y <= 2019; y++) {
    yearData[y] = {
      title: `Title for ${y}`,
      img: `https://via.placeholder.com/300x200?text=${y}`,
      desc: `Description of what happened in ${y}.`,
    };
  }
  // ─── Override specific years with real content ────────────
  yearData[1934] = {
    title: "Telex messaging network comes on line",
    img: "https://images.computerhistory.org/timeline/timeline_networking.web_1933_telex.jpg",
    desc: "Like the Volkswagen Beetle and modern freeway systems, the Telex messaging network comes out of the early period of Germany’s Third Reich. Telex starts as a way to distribute military messages, but soon becomes a world-wide network of both official and commercial text messaging that",
  };
  yearData[1945] = {
    title: "End of World War II",
    img: "/assets/1945-ww2.jpg",
    desc: "Victory in Europe Day marked the official end of WWII in Europe on May 8, 1945.",
  };

  // ▶️ **SEED** localStorage “events” if it’s empty
  if (!getData("events") || getData("events").length === 0) {
    const evts = [];
    for (let y = 1930; y <= 2019; y++) {
      evts.push({
        title: yearData[y].title,
        date: String(y), // or use a more precise date field
        description: yearData[y].desc,
        img: yearData[y].img,
      });
    }
    setData("events", evts);
  }
  // 2️⃣ Which years are disabled, and which one starts active?
  const disabledYears = [1930, 1931, 1932, 1935, 1936, 1938 /* …etc… */];
  const initialActiveYear = 1934;

  // 3️⃣ Define the decades (1930s–2010s)
  const decades = Array.from({ length: 9 }, (_, i) => 1930 + i * 10);

  // 4️⃣ Grab the indicator & inner containers
  const indicatorsEl = document.querySelector(
    "#decadeCarousel .carousel-indicators"
  );
  const innerEl = document.querySelector("#decadeCarousel .carousel-inner");

  // 5️⃣ Build indicators & slides
  decades.forEach((startYear, idx) => {
    // • Indicator
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
    wrapper.classList.add("years-wrapper", "d-flex", "gap-4", "flex-wrap");

    // • Ten year-pills
    for (let y = startYear; y < startYear + 10; y++) {
      const yearEl = document.createElement("span");
      yearEl.textContent = y;
      yearEl.dataset.year = y;
      if (disabledYears.includes(y)) {
        yearEl.className = "year-item disabled";
      } else {
        yearEl.className = "year-item year-link";
      }
      if (y === initialActiveYear) {
        yearEl.classList.add("active");
      }
      wrapper.appendChild(yearEl);
    }

    slide.appendChild(wrapper);
    innerEl.appendChild(slide);
  });

  // 6️⃣ Grab carousel + detail-card elements
  const carouselEl = document.getElementById("decadeCarousel");
  const carousel = bootstrap.Carousel.getOrCreateInstance(carouselEl);
  const detailCard = document.getElementById("yearDetailCard");
  const detailImg = document.getElementById("yearDetailImg");
  const detailTitle = document.getElementById("yearDetailTitle");
  const detailDesc = document.getElementById("yearDetailDesc");

  // 7️⃣ Helper to center an element in the scroll container
  function centerYear(el) {
    const wrap = el.closest(".years-wrapper");
    const offset = el.offsetLeft - wrap.clientWidth / 2 + el.clientWidth / 2;
    wrap.scrollTo({ left: offset, behavior: "smooth" });
  }

  // 8️⃣ After sliding decades, re-center the active pill
  carouselEl.addEventListener("slid.bs.carousel", () => {
    const active = carouselEl.querySelector(".year-link.active");
    if (active) centerYear(active);
  });

  // 9️⃣ Delegate clicks on years → highlight, center & populate card
  carouselEl.addEventListener("click", (e) => {
    const link = e.target.closest(".year-link");
    if (!link) return;
    e.preventDefault();

    carouselEl
      .querySelectorAll(".year-link.active")
      .forEach((el) => el.classList.remove("active"));
    link.classList.add("active");

    centerYear(link);

    const yr = link.dataset.year;
    const entry = yearData[yr];
    if (entry) {
      detailImg.src = entry.img;
      detailImg.alt = entry.title;
      detailTitle.textContent = `${yr}: ${entry.title}`;
      detailDesc.textContent = entry.desc;
      detailCard.style.display = "block";
      // wire up the "more details" link:
      document
        .getElementById("moreDetailsLink")
        .setAttribute("href", `event.html?id=${yr}`);
    } else {
      detailCard.style.display = "none";
    }
  });

  // 🔟 On load → center & populate initialActiveYear without requiring a click
  const initialEl = carouselEl.querySelector(
    `.year-item[data-year="${initialActiveYear}"]`
  );
  if (initialEl) {
    centerYear(initialEl);
    const entry = yearData[initialActiveYear];
    if (entry) {
      detailImg.src = entry.img;
      detailImg.alt = entry.title;
      detailTitle.textContent = `${initialActiveYear}: ${entry.title}`;
      detailDesc.textContent = entry.desc;
      detailCard.style.display = "block";
      document
        .getElementById("moreDetailsLink")
        .setAttribute("href", `event.html?id=${initialActiveYear}`);
    }
  }
});
