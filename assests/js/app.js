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

  const loginLink = document.getElementById("nav-login");
  const signupLink = document.getElementById("nav-signup");
  const navUser = document.getElementById("nav-user");

  if (user) {
    loginLink?.classList.add("d-none");
    signupLink?.classList.add("d-none");

    navUser.innerHTML = `
        <a class="nav-link d-flex align-items-center" href="profile.html">
          <i class="fa fa-user-circle fa-2x me-2" aria-hidden="true"></i>
          <span class="fs-6">${user}</span>
        </a>
      `;
    navUser.classList.remove("d-none");
  } else {
    loginLink?.classList.remove("d-none");
    signupLink?.classList.remove("d-none");
    navUser?.classList.add("d-none");
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
  yearData[1970] = {
    title: "First IBM computer to use semiconductor memory",
    img: "https://images.computerhistory.org/timeline/timeline_memorystorage_1970.ibm370memory.jpg",
    desc: "In a departure from using magnetic core memory technology, IBM introduces the System 370 Model 145 mainframe computer, the company's first all-semiconductor memory computer. The Model 145 could store an equivalent amount of data in half the space, compared to a computer using core memory.",
    shortDesc:
      "In a departure from using magnetic core memory technology, IBM introduces the System 370 Model 145 mainframe computer, the company's first all-semiconductor memory computer.",
  };
  yearData[1973] = {
    title: "Birth of modern mobile networks",
    img: "https://images.computerhistory.org/timeline/timeline_networking.web_1973_sri.van.jpg",
    desc: "In 1973, ARPA funds the outfitting of a packet radio research van at SRI to develop standards for a Packet Radio Network (PRNET). As the unmarked van drives through the San Francisco Bay Area, stuffed full of hackers and sometimes uniformed generals, it is pioneering wireless, packet-switched digital networks, including the kind your mobile phone uses today. A related set of experiments test out Voice Over IP (like the later Skype). The van will also play a huge role in 1977 as a major birthplace of the Internet.",
    shortDesc:
      "In 1973, ARPA funds the outfitting of a packet radio research van at SRI to develop standards for a Packet Radio Network (PRNET). As the unmarked van drives through the San Francisco Bay Area.",
  };
  yearData[1976] = {
    title: "Japanese manufactured dynamic random-access memory (DRAM)",
    img: "https://images.computerhistory.org/timeline/timeline_memorystorage_1976.hitachi.dram_1985.jpg",
    desc: "The Japanese Trade Ministry sees a chance to make Japan a leader in the dynamic random-access memory (DRAM) chip industry, as sales soared when DRAMs entered commercial production in the early 1970s. With customer demand in the millions, DRAMs became the first “mass market” chips, sparking fierce international competition. In 1976, the Japanese Trade Ministry funded Fujitsu, Hitachi, Mitsubishi, NEC, and Toshiba to develop 64K DRAMs. The consortium triumphed, decimating American memory suppliers and provoking the U.S. government to threaten trade sanctions. Although tensions eased between Japanese and American manufacturers, Korea soon overtook them both.",
    shortDesc:
      "The Japanese Trade Ministry sees a chance to make Japan a leader in the dynamic random-access memory (DRAM) chip industry, as sales soared when DRAMs entered commercial production in the early 1970s. With customer demand in the millions.",
  };
  yearData[1979] = {
    title: "Computing for One: Personal computers vs. Networks",
    img: "https://images.computerhistory.org/timeline/timeline_networking.web_1979_pcs_networking.jpg",
    desc: "Intel introduces its 4 Mbit bubble memory array. A few magnetic bubble memories reached the market in the 1970s and 1980s and were used in niche markets like video games and machine tool controllers. The introduction of cheaper, faster and higher density memory solutions rendered bubble memory obsolete. Each silver square, or 'bubble,' on this board stored 1 Mbit.",
    shortDesc:
      "intel introduces its 4 Mbit bubble memory array. A few magnetic bubble memories reached the market in the 1970s and 1980s and were used in niche markets like video games and machine tool controllers.",
  };
  yearData[1980] = {
    title: "Seagate ST506 hard disk drive",
    img: "https://images.computerhistory.org/timeline/timeline_memorystorage_1980.st506_hdd.jpg",
    desc: "Seagate Technology creates the first hard disk drive for microcomputers, the ST506. The disk held 5 megabytes of data, five times as much as a standard floppy disk, and fit in the space of a floppy disk drive. The hard disk drive itself was a rigid metallic platter coated on both sides with a thin layer of magnetic material that stores digital data. Seagate Technology grew out of a 1979 conversation between Alan Shugart and Finis Conner, who had worked together at Memorex. The two men decided to found the company after developing the idea of scaling down a hard disk drive to the same size as the then-standard 5 ¼-inch floppies. Upon releasing its first product, Seagate quickly drew such big-name customers as Apple Computer and IBM. Within a few years, it sold 4 million units.",
    shortDesc:
      "Seagate Technology creates the first hard disk drive for microcomputers, the ST506. The disk held 5 megabytes of data, five times as much as a standard floppy disk, and fit in the space of a floppy disk drive. The hard disk drive itself was a rigid metallic platter coated on both sides with a thin layer of magnetic material that stores digital data.",
  };
  yearData[1983] = {
    title: "CD-ROM",
    img: "https://images.computerhistory.org/timeline/timeline_memorystorage_1983.cdrom.jpg",
    desc: "Able to hold 550 megabytes of pre-recorded data, CD-ROMs grow out of music Compact Disks (CDs). The CD was developed by Sony and Philips in 1982 for distributing music. The first general-interest CD-ROM product released after Philips and Sony announced the CD-ROM format in 1984 was Grolier´s Electronic Encyclopedia, which came out in 1985. The 9 million words in the encyclopedia only took up 12 percent of the available space. The same year, computer and electronics companies worked together to set a standard for the disks so any computer would be able to access the information.",
    shortDesc:
      "Able to hold 550 megabytes of pre-recorded data, CD-ROMs grow out of music Compact Disks (CDs). The CD was developed by Sony and Philips in 1982 for distributing music. The first general-interest CD-ROM product released after Philips and Sony announced the CD-ROM format in 1984.",
  };
  yearData[1986] = {
    title: "Compaq introduces the Deskpro 386 system",
    img: "https://images.computerhistory.org/timeline/timeline_computers_1986.compaq-deskpro-386.jpg",
    desc: "Compaq beats IBM to the market when it announces the Deskpro 386, the first computer on the market to use Intel´s new 80386 chip, a 32-bit microprocessor with 275,000 transistors on each chip. At 4 million operations per second and 4 kilobytes of memory, the 80386 gave PCs as much speed and power as older mainframes and minicomputers. The 386 chip brought with it the introduction of a 32-bit architecture, a significant improvement over the 16-bit architecture of previous microprocessors. It had two operating modes, one that mirrored the segmented memory of older x86 chips, allowing full backward compatibility, and one that took full advantage of its more advanced technology. The new chip made graphical operating environments for IBM PC and PC-compatible computers practical. The architecture that allowed Windows and IBM OS/2 has remained in subsequent chips.",
    shortDesc:
      "Compaq beats IBM to the market when it announces the Deskpro 386, the first computer on the market to use Intel´s new 80386 chip, a 32-bit microprocessor with 275,000 transistors on each chip. At 4 million operations per second and 4 kilobytes of memory, the 80386 gave PCs as much speed and power as older mainframes and minicomputers.",
  };
  yearData[1989] = {
    title: "Nintendo releases the Game Boy handheld game console",
    img: "https://images.computerhistory.org/timeline/timeline_graphics.games_1989.gameboy.jpg",
    desc: "Handheld electronic games had been popular for more than a decade by the time Nintendo introduces the Game Boy. The system used removable game cartridges to play on its 2.9-inch black and white screen. Game Boy's popularity was helped by its major release title, the puzzle game Tetris. Over nearly twenty years, more than one hundred million Game Boys were sold, making it one of the all-time, top-selling game systems.",
    shortDesc:
      "Handheld electronic games had been popular for more than a decade by the time Nintendo introduces the Game Boy. The system used removable game cartridges to play on its 2.9-inch black and white screen.",
  };
  yearData[1990] = {
    title: "Photoshop is released",
    img: "https://images.computerhistory.org/timeline/timeline_sw.languages_1990.photoshop.jpg",
    desc: "Photoshop is released. Created by brothers John and Thomas Knoll, Photoshop was an image editing program and the most popular software program published by Adobe Systems. Thomas, while earning a PhD at the University of Michigan, had created an early version of the program in 1987, and John saw a practical use for it as a special effects staff member at Industrial Light & Magic. It was then used for image editing in the “pseudopod” scene in the movie The Abyss. When Adobe saw potential in the project they bought a license for distribution in 1989 and released the product on February 19, 1990.",
    shortDesc:
      "Photoshop is released. Created by brothers John and Thomas Knoll, Photoshop was an image editing program and the most popular software program published by Adobe Systems. Thomas, while earning a PhD at the University of Michigan, had created an early version of the program in 1987, and John saw a practical use for it as a special effects staff member at Industrial Light & Magic.",
  };
  yearData[1993] = {
    title: "Doom is released",
    img: "https://images.computerhistory.org/timeline/timeline_graphics.games_1993.Doom.jpg",
    desc: "An immersive first-person shooter-style game, Doom becomes popular on many different platforms. Initially distributed via USENET newsgroups, Doom attracted a massive following. Doom players were also among the first to customize the game’s levels and appearance though ‘modding.’ Some criticized the level of violence portrayed in Doom, and it was cited as a prime reason for US Congressional hearings on video game violence in 1995. Doom spawned several sequels and a 2005 film. and Jurassic Park released Director Steven Spielberg's story of resurrected dinosaurs, Jurassic Park, becomes the highest-grossing film to date. Based on a novel by Michael Crichton, Jurassic Park told the story of a group of visitors to an island where dinosaurs are unleashed to run amok in an uncompleted amusement park. To create realistic-looking dinosaurs, Spielberg's team combined animatronics, puppetry, and cutting-edge computer animation.",
    shortDesc:
      "An immersive first-person shooter-style game, Doom becomes popular on many different platforms. Initially distributed via USENET newsgroups, Doom attracted a massive following. Doom players were also among the first to customize the game’s levels and appearance though ‘modding.’.",
  };
  yearData[1996] = {
    title: "3dfx begins selling Voodoo Graphics chips",
    img: "https://images.computerhistory.org/timeline/timeline_graphics.games_1996.voodoo.jpg",
    desc: "The demand for high-quality video cards for personal computers grows throughout the 1990s as game companies create games with more complex audio-visual requirements. Founded by three former Silicon Graphics employees, 3dfx designed chipsets to be used in graphics cards. Early success came in the form of arcade games using the Voodoo system, including hits like San Francisco Rush and Wayne Gretzky's 3D Ice Hockey. A failed attempted partnership with Sega to provide graphics cards for their Dreamcast game console, along with improved 3D graphics cards, led to the decline of 3dfx, which eventually sold all its intellectual property to Nvidia.",
    shortDesc:
      "The demand for high-quality video cards for personal computers grows throughout the 1990s as game companies create games with more complex audio-visual requirements. Founded by three former Silicon Graphics employees, 3dfx designed chipsets to be used in graphics cards.",
  };
  yearData[1999] = {
    title: "The Matrix released",
    img: "https://images.computerhistory.org/timeline/timeline_popularculture_1999.matrix.jpg",
    desc: "Telling the story of Neo, a programmer who becomes a cyberspace messiah, The Matrix combines a cyberpunk setting, dystopian philosophy, and hyper-fast cinematic action. The Matrix also featured cutting edge computer-generated visual effects, and popularized 'bullet-time' - a multi-camera technique where the camera appears to move at normal speed while the action filmed appears slowed. The Matrix was added to the U.S. National Film Registry in 2012.",
    shortDesc:
      "Telling the story of Neo, a programmer who becomes a cyberspace messiah, The Matrix combines a cyberpunk setting, dystopian philosophy, and hyper-fast cinematic action. The Matrix also featured cutting edge computer-generated visual effects, and popularized 'bullet-time'.",
  };
  yearData[2000] = {
    title: "Sony releases the PlayStation 2",
    img: "https://images.computerhistory.org/timeline/timeline_graphics.games_2000.ps2.jpg",
    desc: "The PlayStation 2 (PS2) represents a significant change in the concept of game consoles. The PS2 allowed for DVDs to be played as well as game disks, making it more of an entertainment console than a game console. Many consumers bought the PS2 for its DVD player alone, since the PS2 was cheaper than stand-alone DVD players. In turn, this greatly increased consumer adoption of the DVD format. Over more than ten years in active production, the PlayStation 2 has sold more than a hundred and fifty million units, making it one of the most successful game systems ever released. and USB Flash drive USB Flash drives are introduced. Sometimes referred to as jump drives or memory sticks, these drives consisted of flash memory encased in a small form factor container with a USB interface. They could be used for data storage and in the backing up and transferring of files between various devices. They were faster and had greater data capacity than earlier storage media. Also, they could not be scratched like optical discs and were resilient to magnetic erasure, unlike floppy disks. Drives for floppy disks and optical discs faded in popularity for desktop PCs and laptops in favor of USB ports after flash drives were introduced.",
    shortDesc:
      "The PlayStation 2 (PS2) represents a significant change in the concept of game consoles. The PS2 allowed for DVDs to be played as well as game disks, making it more of an entertainment console than a game console. Many consumers bought the PS2 for its DVD player alone.",
  };
  yearData[2003] = {
    title: "Blu-ray optical disc",
    img: "https://images.computerhistory.org/timeline/timeline_memorystorage_2003.blu-ray.jpg",
    desc: "Developed by a technology industry consortium, the Blu-ray optical disc is released. It was intended to be the successor to the DVD, and was designed to store high definition video at 1080p, while older DVDs were only capable of 480p resolution. The disc was named for the relatively short wavelength blue laser that reads the data on the disc, which was capable of reading data stored at a higher density compared to the red laser used for reading DVDs. A brief storage format battle ensued between Blu-ray and HD DVD, a format that was being supported in an effort spearheaded by Toshiba. Blu-ray ultimately prevailed.",
    shortDesc:
      "Developed by a technology industry consortium, the Blu-ray optical disc is released. It was intended to be the successor to the DVD, and was designed to store high definition video at 1080p, while older DVDs were only capable of 480p resolution.",
  };
  yearData[2006] = {
    title: "Amazon Web Services Launches Cloud-Based Services",
    img: "https://images.computerhistory.org/timeline/timeline_memorystorage_2006.amazoncloud.jpg",
    desc: "Amazon Web Services is launched. It introduced a number of web services, including Amazon Elastic Cloud 2 (EC2) and Amazon Simple Storage Service (S3). EC2 allowed users to rent virtual time on the cloud to scale server capacity quickly and efficiently while only paying for what was used. Use of the cloud eliminates the need for a company to maintain a complex computing infrastructure on their own. Additionally, it saved space and hassle in the form of less onsite server room square footage. S3 was a cloud-based file hosting service that charged users monthly for the amount of data stored and for the bandwidth of transferring data. Similar services, like Google Drive, followed suit and created their own proprietary services.",
    shortDesc:
      "Amazon Web Services is launched. It introduced a number of web services, including Amazon Elastic Cloud 2 (EC2) and Amazon Simple Storage Service (S3). EC2 allowed users to rent virtual time on the cloud to scale server capacity quickly and efficiently while only paying for what was used.",
  };
  yearData[2008] = {
    title: "Bitcoin",
    img: "https://images.computerhistory.org/timeline/timeline_popularculture_2009_bitcoin.jpg",
    desc: "In 2008, “Satoshi Nakamoto,” likely a pseudonym, publishes Bitcoin: A Peer-to-Peer Electronic Cash System, describing the use of peer-to-peer networks to generate a “crypto-currency.” In the Bitcoin system, users run software that searches for blocks of data, the discovery of which reward the users with Bitcoins. The transaction is recorded on the system though user information is private. These can then be used online much like cash in the real world. Nakamoto 'mines' the first Bitcoins in January 2009 and a year later a user used them to order two pizzas. Bitcoins’ value exploded in November 2013 before a gradual devaluation. Bitcoin's anonymous nature, along with the electronic nature of the currency, has led to its adoption by some criminal organizations.",
    shortDesc:
      "In 2008, “Satoshi Nakamoto,” likely a pseudonym, publishes Bitcoin: A Peer-to-Peer Electronic Cash System, describing the use of peer-to-peer networks to generate a “crypto-currency.” In the Bitcoin system, users run software that searches for blocks of data, the discovery of which reward the users with Bitcoins. The transaction is recorded on the system though user information is private.",
  };
  yearData[2009] = {
    title: "Minecraft is introduced",
    img: "https://images.computerhistory.org/timeline/timeline_graphics.games_2009.minecraft.jpg",
    desc: "Initially developed by Swedish game designer Markus “Notch” Persson, Minecraft allows players to build towers and play challenges. The game, which could be played in either survival or creative mode, has received many awards from the international gaming press. An enormous variety of physical systems and machines can also be built in the Minecraft environment, taking the game far beyond its intended use as a simple entertainment platform into a flexible and creative building system for modeling real-world processes or things. Users have built entire computers, cities, and even planets out of Minecraft components.",
    shortDesc:
      "Initially developed by Swedish game designer Markus “Notch” Persson, Minecraft allows players to build towers and play challenges. The game, which could be played in either survival or creative mode, has received many awards from the international gaming press.",
  };
  yearData[2010] = {
    title: "Apple Retina Display",
    img: "https://images.computerhistory.org/timeline/timeline_computers_2012_appleretina.jpg",
    desc: "Since the release of the Macintosh in 1984, Apple has placed emphasis on high-resolution graphics and display technologies. In 2012, Apple introduced the Retina display for the MacBook Pro laptop and iPad tablet. With a screen resolution of up to 400 pixels-per-inch (PPI), Retina displays approached the limit of pixel visibility to the human eye. The display also used In Plane Switching (IPS) technology, which allowed for a wider viewing angle and improved color accuracy. The Retina display became standard on most of the iPad, iPhone, MacBook, and Apple Watch product lines. and the Apple iPad is released Since the release of the Macintosh in 1984, Apple has placed emphasis on high-resolution graphics and display technologies. In 2012, Apple introduced the Retina display for the MacBook Pro laptop and iPad tablet. With a screen resolution of up to 400 pixels-per-inch (PPI), Retina displays approached the limit of pixel visibility to the human eye. The display also used In Plane Switching (IPS) technology, which allowed for a wider viewing angle and improved color accuracy. The Retina display became standard on most of the iPad, iPhone, MacBook, and Apple Watch product lines.",
    shortDesc:
      "Since the release of the Macintosh in 1984, Apple has placed emphasis on high-resolution graphics and display technologies. In 2012, Apple introduced the Retina display for the MacBook Pro laptop and iPad tablet. With a screen resolution of up to 400 pixels-per-inch (PPI), Retina displays approached the limit of pixel visibility to the human eye. The display also used In Plane Switching (IPS) technology, which allowed for a wider viewing angle and improved color accuracy.",
  };
  yearData[2013] = {
    title: "The Stable Release of Microsoft Office 365 is Unveiled",
    img: "https://images.computerhistory.org/timeline/timeline_sw.languages_2013_office365.jpg",
    desc: "An updated Microsoft Office 365 is announced. It was a subscription-based software product. Microsoft’s Word, Excel, OneNote, PowerPoint, Outlook, Access, and Publisher were all available in packages for a monthly or annual subscription. Also included with a subscription was 1 TB of cloud storage on Microsoft’s One Drive (formerly Skydrive). Home, personal, university, business, and enterprise subscription plans were made available for a wide range of users. Microsoft’s change to a subscription model was not unique: Apple, Adobe, IBM and many other large software and technology companies adopted this model as well.",
    shortDesc:
      "An updated Microsoft Office 365 is announced. It was a subscription-based software product. Microsoft’s Word, Excel, OneNote, PowerPoint, Outlook, Access, and Publisher were all available in packages for a monthly or annual subscription.",
  };
  yearData[2015] = {
    title: "Gates Joins Musk, Hawking in Expressing Fear of AI",
    img: "https://images.computerhistory.org/timeline/timeline_ai.robotics_2015_gates.jpg",
    desc: "Microsoft co-founder Bill Gates joins a number of prominent tech gurus and scientists in revealing his thoughts on the potentially dangerous effects and unintended consequences of artificial intelligence on human civilization. Previously, Elon Musk, Stephen Hawking, and others had expressed similar sentiments. Those on the other side of the debate felt artificial intelligence would usher in an era of unprecedented human achievement, aided by the “minds” of humanity’s artificial brethren. While Gates and others felt that in the short-term intelligent machines would benefit mankind, they foresaw a future where more advanced super-intelligent machines could pose a grave threat to human existence.",
    shortDesc:
      "Microsoft co-founder Bill Gates joins a number of prominent tech gurus and scientists in revealing his thoughts on the potentially dangerous effects and unintended consequences of artificial intelligence on human civilization. Previously, Elon Musk, Stephen Hawking, and others had expressed similar sentiments.",
  };
  yearData[2018] = {
    title: "RockStar Released Red Dead Redemtion 2",
    img: "https://image.api.playstation.com/cdn/UP1004/CUSA03041_00/Hpl5MtwQgOVF9vJqlfui6SDB5Jl4oBSq.png?w=440",
    desc: "Red Dead Redemption 2 (RDR2) is celebrated not just as an immersive gaming experience, but also as a technological masterpiece. Developed by Rockstar Games and released in 2018, RDR2 sets a high benchmark in the gaming industry due to its advanced technical accomplishments. The game leverages the powerful Rockstar Advanced Game Engine (RAGE), which enables the rendering of vast open worlds filled with intricate details. This technology allows for realistic lighting, dynamic weather systems, and breathtakingly detailed environments, creating one of the most authentic open-world experiences available in gaming today. From a graphical standpoint, RDR2 utilizes advanced techniques such as volumetric lighting, which creates realistic sunlight filtering through clouds and trees, enhancing the visual depth and realism. High-resolution textures and detailed character models further contribute to the game's lifelike visuals. One standout feature is the impressive animation system powered by motion capture technology, resulting in fluid character movements and realistic interactions with the environment. Characters move and react naturally, significantly elevating immersion.",
    shortDesc:
      "Red Dead Redemption 2 (RDR2) is celebrated not just as an immersive gaming experience, but also as a technological masterpiece. Developed by Rockstar Games and released in 2018, RDR2 sets a high benchmark in the gaming industry due to its advanced technical accomplishments.",
  };
  yearData[2019] = {
    title: "5G Rollout Begins",
    img: "https://sg-media.apjonlinecdn.com/magefan_blog/What_is_5G_A_Guide_to_The_Future_of_Mobile_Connectivity.png",
    desc: "On April 3, 2019, South Korea became the first country to launch a nationwide 5G network. Major telecom operators—SK Telecom, KT Corporation, and LG Uplus—initiated services, marking a significant milestone in global telecommunications . The launch was strategically advanced by a few hours to precede Verizon's U.S. rollout, underscoring the competitive nature of 5G deployment . ABC News+1The Guardian+1 The Guardian+2Lifewire+2ABC News+2 South Korea's early adoption was bolstered by substantial investments in infrastructure and a collaborative approach among carriers. By 2020, KT Corporation had extended 5G coverage to over 80 cities, aiming to provide 90% of mobile users with access by 2026",
    shortDesc:
      "On April 3, 2019, South Korea became the first country to launch a nationwide 5G network. Major telecom operators—SK Telecom, KT Corporation, and LG Uplus—initiated services, marking a significant milestone in global telecommunications . The launch was strategically advanced by a few hours to precede Verizon's U.S. rollout, underscoring the competitive nature of 5G deployment .",
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
  const disabledYears = [
    1930, 1931, 1932, 1935, 1936, 1938, 1944, 1945, 1946, 1948, 1949, 1951,
    1953, 1955, 1957, 1959, 1961, 1963, 1964, 1965, 1967, 1968, 1971, 1972,
    1974, 1975, 1977, 1978, 1981, 1982, 1984, 1985, 1987, 1988, 1991, 1992,
    1993, 1994, 1995, 1997, 1998, 2001, 2002, 2004, 2005, 2007, 2011, 2012,
    2014, 2016, 2017,
  ];
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
    wrapper.classList.add(
      "years-wrapper",
      "d-flex",
      "gap-2",
      "flex-wrap",
      "justify-content-center"
    );

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
