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
      desc: ` simple Description of what happened in ${y}.`,
      shortDesc: `Description of what happened in ${y}.`,
    };
  }
  // ─── Override specific years with real content ────────────
  yearData[1933] = {
    title: "Telex messaging network comes on line",
    img: "https://images.computerhistory.org/timeline/timeline_networking.web_1933_telex.jpg",
    desc: "Like the Volkswagen Beetle and modern freeway systems, the Telex messaging network comes out of the early period of Germany’s Third Reich. Telex starts as a way to distribute military messages, but soon becomes a world-wide network of both official and commercial text messaging that.",
    shortDesc:
      "Like the Volkswagen Beetle and modern freeway systems, the Telex messaging network comes out of the early period of Germany’s Third Reich.",
  };
  yearData[1934] = {
    title: "World Brains",
    img: "https://images.computerhistory.org/timeline/timeline_networking.web_1934_worldbrain.jpg",
    desc: "Belgian Paul Otlet has a modest goal: collect, organize, and share all the world’s knowledge. Otlet had co-created a massive “search engine” starting in the early 1900s. His Mundaneum now combines enhanced card catalogs with sixteen million entries, photos, documents, microfilm, and more. He is working on integrating telegraphy and multiple media, from sound recordings to television. In the 1930s British writer H.G. Wells and American scientist Vannevar Bush are advancing similar goals—Wells with his “World Brain” writings and Bush with the Memex, a sort of microfilm-based Web browser. These approaches to organizing information differ. But all share key features of today’s Web, including automated cross-references – which we call hyperlinks.",
    shortDesc:
      "Belgian Paul Otlet has a modest goal: collect, organize, and share all the world’s knowledge. Otlet had co-created a massive “search engine” starting in the early 1900s.",
  };
  yearData[1937] = {
    title:
      "Bell Laboratories scientist George Stibitz uses relays for a demonstration adder",
    img: "https://images.computerhistory.org/timeline/timeline_computers_1937.modelk.jpg",
    desc: "Called the “Model K” Adder because he built it on his “Kitchen” table, this simple demonstration circuit provides proof of concept for applying Boolean logic to the design of computers, resulting in construction of the relay-based Model I Complex Calculator in 1939. That same year in Germany, engineer Konrad Zuse built his Z2 computer, also using telephone company relays.",
    shortDesc:
      "Called the “Model K” Adder because he built it on his “Kitchen” table, this simple demonstration circuit provides proof of concept for applying Boolean logic to the design of computers.",
  };
  yearData[1939] = {
    title: "Hewlett-Packard is founded and Elektro at the World's Fair ",
    img: "https://images.computerhistory.org/timeline/timeline_ai.robotics_1939_elektro.jpg",
    desc: "David Packard and Bill Hewlett found their company in a Palo Alto, California garage. Their first product, the HP 200A Audio Oscillator, rapidly became a popular piece of test equipment for engineers. Walt Disney Pictures ordered eight of the 200B model to test recording equipment and speaker systems for the 12 specially equipped theatres that showed the movie “Fantasia” in 1940. Built by Westinghouse, the relay-based Elektro robot responds to the rhythm of voice commands and delivers wisecracks pre-recorded on 78 rpm records. It appeared at the World's Fair, and it could move its head and arms… and even 'smoked' cigarettes. ",
    shortDesc:
      "David Packard and Bill Hewlett found their company in a Palo Alto, California garage.",
  };
  yearData[1940] = {
    title: "The Complex Number Calculator (CNC) is completed",
    img: "https://images.computerhistory.org/timeline/timeline_computers_1940.cnc.jpg",
    desc: "In 1939, Bell Telephone Laboratories completes this calculator, designed by scientist George Stibitz. In 1940, Stibitz demonstrated the CNC at an American Mathematical Society conference held at Dartmouth College. Stibitz stunned the group by performing calculations remotely on the CNC (located in New York City) using a Teletype terminal connected to New York over special telephone lines. This is likely the first example of remote access computing.",
    shortDesc:
      "In 1939, Bell Telephone Laboratories completes this calculator, designed by scientist George Stibitz.",
  };
  yearData[1941] = {
    title: "The first Bombe is completed",
    img: "https://images.computerhistory.org/timeline/timeline_computers_1941.bombe.jpg",
    desc: "Built as an electro-mechanical means of decrypting Nazi ENIGMA-based military communications during World War II, the British Bombe is conceived of by computer pioneer Alan Turing and Harold Keen of the British Tabulating Machine Company. Hundreds of allied bombes were built in order to determine the daily rotor start positions of Enigma cipher machines, which in turn allowed the Allies to decrypt German messages. The basic idea for bombes came from Polish code-breaker Marian Rejewski's 1938 'Bomba'.",
    shortDesc:
      "After successfully demonstrating a proof-of-concept prototype in 1939, Professor John Vincent Atanasoff receives funds to build a full-scale machine at Iowa State College (now University).",
  };
  yearData[1942] = {
    title: "The Atanasoff-Berry Computer (ABC) is completed",
    img: "https://images.computerhistory.org/timeline/timeline_computers_1942.abc.jpg",
    desc: "After successfully demonstrating a proof-of-concept prototype in 1939, Professor John Vincent Atanasoff receives funds to build a full-scale machine at Iowa State College (now University). The machine was designed and built by Atanasoff and graduate student Clifford Berry between 1939 and 1942. The ABC was at the center of a patent dispute related to the invention of the computer, which was resolved in 1973 when it was shown that ENIAC co-designer John Mauchly had seen the ABC shortly after it became functional.The legal result was a landmark: Atanasoff was declared the originator of several basic computer ideas, but the computer as a concept was declared un-patentable and thus freely open to all. A full-scale working replica of the ABC was completed in 1997, proving that the ABC machine functioned as Atanasoff had claimed. The replica is currently on display at the Computer History Museum.",
    shortDesc:
      "Built as an electro-mechanical means of decrypting Nazi ENIGMA-based military communications during World War II, the British Bombe is conceived of by computer pioneer Alan Turing and Harold Keen.",
  };
  yearData[1943] = {
    title: "A Logical Calculus of the Ideas Immanent in Nervous Activity",
    img: "https://images.computerhistory.org/timeline/timeline_ai.robotics_1943.pitts.nervous.jpg",
    desc: "Two scientists, Warren S. McCulloch and Walter H. Pitts, publish the groundbreaking paper A Logical Calculus of the Ideas Immanent in Nervous Activity. The paper quickly became a foundational work in the study of artificial neural networks and has many applications in artificial intelligence research. In it McCulloch and Pitts described a simplified neural network architecture for intelligence, and while the neurons they described were greatly simplified compared to biological neurons, the model they proposed was enhanced and improved upon by subsequent generations of researchers.",
    shortDesc:
      "Two scientists, Warren S. McCulloch and Walter H. Pitts, publish the groundbreaking paper A Logical Calculus of the Ideas Immanent in Nervous Activity. The paper quickly became a foundational work in the study of artificial neural networks and has many applications in artificial intelligence research.",
  };
  yearData[1947] = {
    title: "First actual case of bug being found",
    img: "https://images.computerhistory.org/timeline/timeline_popularculture_1945.hopper.jpg",
    desc: "The word 'bug,' when applied to computers, means some form of error or failure. On September 9th, Grace Hopper records what she jokingly called the first actual computer bug - in this case, a moth stuck between relay contacts of the Harvard Mark II computer prior to its eventual installation at the Naval Weapons Laboratory at Dalhgren. VA. Hopper helped program the Mark II, and the earlier Harvard Mark I computer, while working for professor Howard Aiken. She worked tirelessly on developing these computers to the fullest through inventive programming. After Harvard, she worked for computer manufacturer Remington-Rand where she developed what is often considered the first compiler, A-0. She also served on the committee to develop COBOL, a standard and widely adopted programming language that transformed the way software was developed for business applications. COBOL is still in use today. Hopper was made a Fellow of the Computer History Museum in 1987.",
    shortDesc:
      "The word 'bug,' when applied to computers, means some form of error or failure. On September 9th, Grace Hopper records what she jokingly called the first actual computer bug - in this case, a moth stuck between relay contacts of the Harvard Mark II computer prior to its eventual installation at the Naval Weapons Laboratory at Dalhgren. VA.",
  };
  yearData[1950] = {
    title: "SEAC and SWAC completed",
    img: "https://images.computerhistory.org/timeline/timeline_computers_1950.seac-swac.jpg",
    desc: "The Standards Eastern Automatic Computer (SEAC) is among the first stored program computers completed in the United States. It was built in Washington DC as a test-bed for evaluating components and systems as well as for setting computer standards. It was also one of the first computers to use all-diode logic, a technology more reliable than vacuum tubes. The world's first scanned image was made on SEAC by engineer Russell Kirsch in 1957. The NBS also built the Standards Western Automatic Computer (SWAC) at the Institute for Numerical Analysis on the UCLA campus. Rather than testing components like the SEAC, the SWAC was built using already-developed technology. SWAC was used to solve problems in numerical analysis, including developing climate models and discovering five previously unknown Mersenne prime numbers.",
    shortDesc:
      "The Standards Eastern Automatic Computer (SEAC) is among the first stored program computers completed in the United States.",
  };
  yearData[1952] = {
    title: "UNIVAC computer predicts election",
    img: "https://images.computerhistory.org/timeline/timeline_popularculture_1952.univac.jpg",
    desc: "On election night, November 4, CBS News borrows a UNIVAC computer to predict the outcome of the race for the US presidency between Dwight D. Eisenhower and Adlai Stevenson. Opinion polls predicted strong support for Stevenson, but the UNIVAC´s analysis of early returns showed a clear victory for Eisenhower. This sharp divergence from public opinion made UNIVAC executives question the validity of the computer´s forecast, so announcers Walter Cronkite and Charles Collingwood postponed announcing UNIVAC´s correct prediction until very late in the broadcast.",
    shortDesc:
      "On election night, November 4, CBS News borrows a UNIVAC computer to predict the outcome of the race for the US presidency between Dwight D. Eisenhower and Adlai Stevenson.",
  };
  yearData[1954] = {
    title: "IBM 650 magnetic drum calculator introduced",
    img: "https://images.computerhistory.org/timeline/timeline_computers_1954.ibm650.jpg",
    desc: "IBM establishes the 650 as its first mass-produced computer, with the company selling 450 in just one year. Spinning at 12,500 rpm, the 650´s magnetic data-storage drum allowed much faster access to stored information than other drum-based machines. The Model 650 was also highly popular in universities, where a generation of students first learned programming.",
    shortDesc:
      "IBM establishes the 650 as its first mass-produced computer, with the company selling 450 in just one year.",
  };
  yearData[1956] = {
    title: "Direct keyboard input to computers",
    img: "https://images.computerhistory.org/timeline/timeline_sw.languages_1956.whirlwind.jpg",
    desc: "At MIT, researchers begin experimenting with direct keyboard input to computers, a precursor to today´s normal mode of operation. Typically, computer users of the time fed their programs into a computer using punched cards or paper tape. Doug Ross wrote a memo advocating direct access in February. Ross contended that a Flexowriter -- an electrically-controlled typewriter -- connected to an MIT computer could function as a keyboard input device due to its low cost and flexibility. An experiment conducted five months later on the MIT Whirlwind computer confirmed how useful and convenient a keyboard input device could be.",
    shortDesc:
      "At MIT, researchers begin experimenting with direct keyboard input to computers, a precursor to today´s normal mode of operation. Typically, computer users of the time fed their programs into a computer using punched cards or paper tape.",
  };
  yearData[1958] = {
    title: "Higinbotham develops Tennis-For-Two at Brookhaven National Labs",
    img: "https://images.computerhistory.org/timeline/timeline_graphics.games_1958.tennis.jpg",
    desc: "Brookhaven National Laboratory in Long Island, New York holds an annual “Visitor's Day” for families and area residents. William Higinbotham, looking for a way to entertain visitors, conceived of a simple electronic game that could be played using the lab's Donner Model 30 analog computer connected to an oscilloscope display. Working with David Potter, Higinbotham's creation allowed two players to play a game of 'tennis' on the oscilloscope screen, with simple physics for the ball, and even a sound whenever the ball was contacted. Tennis-for-Two was only used for two years before being salvaged for parts. It only became widely known following Higinbotham's testimony in a trial over the video game Pong.",
    shortDesc:
      "Brookhaven National Laboratory in Long Island, New York holds an annual “Visitor's Day” for families and area residents. William Higinbotham, looking for a way to entertain visitors, conceived of a simple electronic game.",
  };
  yearData[1960] = {
    title: "COBOL (Common Business-Oriented Language)",
    img: "https://images.computerhistory.org/timeline/timeline_sw.languages_1960.cobol.jpg",
    desc: "A team drawn from several computer manufacturers and the Pentagon develop COBOL—an acronym for Common Business-Oriented Language. Many of its specifications borrow heavily from the earlier FLOW-MATIC language. Designed for business use, early COBOL efforts aimed for easy readability of computer programs and as much machine independence as possible. Designers hoped a COBOL program would run on any computer for which a compiler existed with only minimal modifications. Howard Bromberg, an impatient member of the committee in charge of creating COBOL, had this tombstone made out of fear that the language had no future. However, COBOL survives to this day. A study in 1997 estimated that over 200 billion lines of COBOL code was still in existence, accounting for 80% of all business software code.",
    shortDesc:
      "A team drawn from several computer manufacturers and the Pentagon develop COBOL—an acronym for Common Business-Oriented Language. Many of its specifications borrow heavily from the earlier FLOW-MATIC language.",
  };
  yearData[1962] = {
    title: "COBOL (Common Business-Oriented Language)",
    img: "https://images.computerhistory.org/timeline/timeline_memorystorage_1962.ibm.1311_2.jpg",
    desc: "Card Random Access Memory (CRAM) is introduced. The NCR 315 and several later NCR mainframes used this mechanically complex magnetic CRAM for secondary storage. The mylar cards were suspended from rods that selected and dropped one at a time for processing. Each CRAM deck of 256 cards recorded about 5.5 MB. IBM 1311 Disk Storage Drive is announced. Announced on October 11, 1962, the IBM 1311 was the first disk drive IBM made with a removable disk pack. Each pack weighed about ten pounds, held six disks, and had a capacity of 2 million characters. The disks rotated at 1,500 RPM and were accessed by a hydraulic actuator with one head per disk. The 1311 offered some of the advantages of both tapes and disks.",
    shortDesc:
      "Card Random Access Memory (CRAM) is introduced. The NCR 315 and several later NCR mainframes used this mechanically complex magnetic CRAM for secondary storage. The mylar cards were suspended from rods that selected and dropped one at a time for processing. Each CRAM deck of 256 cards recorded about 5.5 MB.",
  };
  yearData[1966] = {
    title: "Signetics 8-bit RAM",
    img: "https://images.computerhistory.org/timeline/timeline_memorystorage_1966.electronicsmagazine.jpg",
    desc: "The April 4, 1966 issue of Electronics magazine features an 8-bit RAM designed by Signetics for the SDS Sigma 7 mainframe computer. The article was titled, “Integrated scratch pads sire new generation of computers.” This 8-bit RAM was one of the earliest uses of dedicated semiconductor memory devices in computer systems. In the summer of 1966, Sanders Associates’ television engineer Ralph Baer begins experimenting with using a television to play games. His first design, called the Brown Box, allowed users to play several different games on a standard television set, including table tennis game (presaging Atari’s Pong), without requiring a computer, microprocessor, or software. The Brown Box also had a light gun accessory for playing shooting games.",
    shortDesc:
      "The April 4, 1966 issue of Electronics magazine features an 8-bit RAM designed by Signetics for the SDS Sigma 7 mainframe computer.",
  };
  yearData[1969] = {
    title: "Apollo Guidance Computer read-only rope memory",
    img: "https://images.computerhistory.org/timeline/timeline_memorystorage_1969.agcmemory.jpg",
    desc: "Apollo Guidance Computer read-only rope memory is launched into space aboard the Apollo 11 mission, which carried American astronauts to the Moon and back. This rope memory was made by hand, and was equivalent to 72 KB of storage. Manufacturing rope memory was laborious and slow, and it could take months to weave a program into the rope memory. If a wire went through one of the circular cores it represented a binary one, and those that went around a core represented a binary zero.",
    shortDesc:
      "Apollo Guidance Computer read-only rope memory is launched into space aboard the Apollo 11 mission, which carried American astronauts to the Moon and back. This rope memory was made by hand, and was equivalent to 72 KB of storage.",
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
  const initialActiveYear = 1933;

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
      detailDesc.textContent = entry.shortDesc;
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
