 const $ = id => document.getElementById(id);

const EVENTS_KEY = "eventora_fest_events_v3";
const REGS_KEY = "eventora_fest_regs_v3";

const dateAfter = days => {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
};

const initialEvents = [
  {
    id: "dance1", name: "Solo & Group Dance Battle",
    category: "Dance", date: dateAfter(4), time: "10:00",
    venue: "Main Stage", organizer: "Dance Club",
    prize: "Winner ₹5,000 + trophy; Runner-up ₹2,500",
    description: "Bring your best moves to the solo and group dance competition. All dance styles are welcome."
  },
  {
    id: "music1", name: "Solo Singing Showdown",
    category: "Music", date: dateAfter(5), time: "11:30",
    venue: "Auditorium", organizer: "Music Club",
    prize: "Winner ₹3,000 + trophy; Runner-up ₹1,500",
    description: "Show your vocal talent with your favourite song and own the stage."
  },
  {
    id: "flash1", name: "Campus Flashmob",
    category: "Flashmob", date: dateAfter(6), time: "13:00",
    venue: "Central Quadrangle", organizer: "Dance Club",
    prize: "Best Team: trophies + certificates",
    description: "Join a high-energy group performance and surprise the whole campus with a coordinated flashmob."
  },
  {
    id: "band1", name: "Battle of the Bands",
    category: "Music Band", date: dateAfter(7), time: "15:00",
    venue: "Open Air Stage", organizer: "Music Society",
    prize: "Winning band ₹10,000; Runner-up ₹5,000",
    description: "Bring your band, instruments and original energy for an unforgettable live music showdown."
  },
  {
    id: "ramp1", name: "Campus Rampwalk & Fashion Show",
    category: "Rampwalk", date: dateAfter(8), time: "16:00",
    venue: "Main Auditorium", organizer: "Fashion & Arts Club",
    prize: "Best Rampwalk ₹4,000 + sash; Runner-up ₹2,000",
    description: "Walk with confidence, creativity and style in the college rampwalk competition."
  },
  {
    id: "prize1", name: "Grand Winner Prize Ceremony",
    category: "Prize Ceremony", date: dateAfter(9), time: "17:30",
    venue: "Main Stage", organizer: "Fest Committee",
    prize: "Trophies, certificates and announced cash prizes",
    description: "Celebrate the winners, runners-up and outstanding performances from all fest competitions."
  },
  {
    id: "tech1", name: "InnovateX Tech Challenge",
    category: "Technical", date: dateAfter(10), time: "09:30",
    venue: "Innovation Lab", organizer: "AIML & Coding Club",
    prize: "Winner ₹5,000 + certificates",
    description: "Solve creative challenges, collaborate with peers and showcase your technology skills."
  },
  {
    id: "culture1", name: "Art & Cultural Carnival",
    category: "Cultural", date: dateAfter(11), time: "12:00",
    venue: "Student Activity Centre", organizer: "Cultural Committee",
    prize: "Gifts and certificates for top performers",
    description: "A colourful campus celebration filled with art, creativity and cultural performances."
  },
  {
    id: "sports1", name: "Campus Sports League",
    category: "Sports", date: dateAfter(12), time: "08:00",
    venue: "Sports Ground", organizer: "Sports Club",
    prize: "Trophies and medals for winning teams",
    description: "Compete in friendly matches, cheer for your team and celebrate campus sportsmanship."
  },
  {
    id: "work1", name: "Creative Skills Workshop",
    category: "Workshop", date: dateAfter(14), time: "11:00",
    venue: "Seminar Hall", organizer: "Student Development Cell",
    prize: "Participation certificates",
    description: "Learn new skills, meet fellow students and take part in hands-on activities."
  }
];

function readStorage(key, fallback) {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback.map(x => ({ ...x }));
  } catch {
    return fallback.map(x => ({ ...x }));
  }
}

let events = readStorage(EVENTS_KEY, initialEvents);
let registrations = readStorage(REGS_KEY, []);
let isAdmin = false;

function saveData() {
  localStorage.setItem(EVENTS_KEY, JSON.stringify(events));
  localStorage.setItem(REGS_KEY, JSON.stringify(registrations));
}

function safe(value) {
  return String(value ?? "").replace(/[&<>"']/g, char => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  }[char]));
}

function dateText(date) {
  if (!date) return "Date not set";

  return new Date(date + "T12:00:00").toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric"
  });
}

function emoji(category) {
  return ({
    "Dance": "💃",
    "Music": "🎤",
    "Flashmob": "⚡",
    "Music Band": "🎸",
    "Rampwalk": "👠",
    "Prize Ceremony": "🏆",
    "Technical": "💻",
    "Cultural": "🎨",
    "Sports": "🏆",
    "Workshop": "🚀"
  })[category] || "✨";
}

function slug(category) {
  return category.toLowerCase().replace(/\s+/g, "-");
}

function renderEvents() {
  const query = $("search").value.trim().toLowerCase();
  const category = $("category").value;
  const sort = $("sort").value;

  let list = events.filter(event =>
    (category === "All" || event.category === category) &&
    [
      event.name,
      event.venue,
      event.organizer,
      event.description,
      event.category,
      event.prize || ""
    ].join(" ").toLowerCase().includes(query)
  );

  list.sort(sort === "name"
    ? (a, b) => a.name.localeCompare(b.name)
    : (a, b) => a.date.localeCompare(b.date)
  );

  $("eventList").innerHTML = list.map(event => `
    <article class="event-card">
      <div class="cover ${slug(event.category)}">
        ${emoji(event.category)}
        <span class="pill">${safe(event.category)}</span>
      </div>

      <div class="event-content">
        <h3>${safe(event.name)}</h3>
        <p>${safe(event.description)}</p>

        <div class="event-meta">
          <span>📅 ${dateText(event.date)} · ${safe(event.time)}</span>
          <span>📍 ${safe(event.venue)}</span>
          <span>👥 ${safe(event.organizer)}</span>
        </div>

        ${event.prize
          ? `<div class="prize-line">🏆 ${safe(event.prize)}</div>`
          : ""}

        <div class="event-bottom">
          <small>
            ${registrations.filter(r => r.eventId === event.id).length}
            registered
          </small>

          <button class="small-btn register-btn" data-id="${safe(event.id)}">
            Register ↗
          </button>

          ${isAdmin ? `
            <button class="table-btn edit-btn" data-edit="${safe(event.id)}">
              Edit
            </button>
            <button class="table-btn delete-btn" data-delete="${safe(event.id)}">
              Delete
            </button>
          ` : ""}
        </div>
      </div>
    </article>
  `).join("");

  $("noEvents").classList.toggle("hidden", list.length > 0);

  $("totalEvents").textContent = events.length;
  $("totalRegs").textContent = registrations.length;
  $("prizeEvents").textContent =
    events.filter(event => Boolean(event.prize)).length;
  $("upcoming").textContent =
    events.filter(event => event.date >= dateAfter(0)).length;

  $("eventChoice").innerHTML =
    '<option value="">Choose an event</option>' +
    events
      .slice()
      .sort((a, b) => a.date.localeCompare(b.date))
      .map(event => `
        <option value="${safe(event.id)}">
          ${safe(event.name)} — ${dateText(event.date)}
        </option>
      `).join("");
}

function renderParticipants() {
  $("participants").innerHTML = registrations.length
    ? registrations.map(registration => `
        <tr>
          <td>
            ${safe(registration.name)}<br>
            <small>${safe(registration.email)}</small>
          </td>
          <td>${safe(registration.roll)}</td>
          <td>
            ${safe(events.find(event => event.id === registration.eventId)?.name
              || "Event removed")}
          </td>
          <td>
            <button class="table-btn delete-btn"
              data-remove="${safe(registration.id)}">
              Remove
            </button>
          </td>
        </tr>
      `).join("")
    : '<tr><td colspan="4">No registrations yet.</td></tr>';

  $("regCount").textContent =
    "Total registrations: " + registrations.length;
}

function updateAdmin() {
  $("locked").classList.toggle("hidden", isAdmin);
  $("adminPanel").classList.toggle("hidden", !isAdmin);
  renderEvents();

  if (isAdmin) renderParticipants();
}

function clearForm() {
  $("eventForm").reset();
  $("editId").value = "";
  $("formTitle").textContent = "Add a New Event";
  $("saveEvent").textContent = "Add Event";
  $("cancelEdit").classList.add("hidden");
}

$("search").addEventListener("input", renderEvents);
$("category").addEventListener("change", renderEvents);
$("sort").addEventListener("change", renderEvents);

$("eventList").addEventListener("click", event => {
  const registerButton = event.target.closest(".register-btn");
  const editButton = event.target.closest("[data-edit]");
  const deleteButton = event.target.closest("[data-delete]");

  if (registerButton) {
    $("eventChoice").value = registerButton.dataset.id;
    $("register").scrollIntoView({ behavior: "smooth" });
    $("studentName").focus();
  }

  if (editButton && isAdmin) {
    const item = events.find(x => x.id === editButton.dataset.edit);
    if (!item) return;

    $("editId").value = item.id;
    $("eventName").value = item.name;
    $("eventCategory").value = item.category;
    $("eventDate").value = item.date;
    $("eventTime").value = item.time;
    $("eventVenue").value = item.venue;
    $("eventOrganizer").value = item.organizer;
    $("eventPrize").value = item.prize || "";
    $("eventDescription").value = item.description;

    $("formTitle").textContent = "Edit Event";
    $("saveEvent").textContent = "Save Changes";
    $("cancelEdit").classList.remove("hidden");
    $("admin").scrollIntoView({ behavior: "smooth" });
  }

  if (deleteButton && isAdmin &&
      confirm("Delete this event and its registrations?")) {
    const id = deleteButton.dataset.delete;

    events = events.filter(item => item.id !== id);
    registrations = registrations.filter(item => item.eventId !== id);

    saveData();
    renderEvents();
    renderParticipants();
  }
});

$("registrationForm").addEventListener("submit", event => {
  event.preventDefault();

  const name = $("studentName").value.trim();
  const email = $("studentEmail").value.trim().toLowerCase();
  const roll = $("rollNumber").value.trim();
  const eventId = $("eventChoice").value;

  if (!events.some(item => item.id === eventId)) {
    $("regMessage").textContent = "Please select an event.";
    return;
  }

  const duplicate = registrations.some(registration =>
    registration.eventId === eventId &&
    (registration.email === email ||
      registration.roll.toLowerCase() === roll.toLowerCase())
  );

  if (duplicate) {
    $("regMessage").textContent =
      "This email or roll number is already registered for this event.";
    return;
  }

  registrations.push({
    id: String(Date.now()),
    name,
    email,
    roll,
    eventId,
    registeredAt: new Date().toISOString()
  });

  saveData();
  $("registrationForm").reset();
  $("regMessage").textContent =
    "Registration successful! Get ready to shine 🎉";

  renderEvents();
  if (isAdmin) renderParticipants();
});

$("loginBtn").addEventListener("click", () => {
  $("loginMessage").textContent = "";
  $("loginModal").classList.remove("hidden");
});

$("closeModal").addEventListener("click", () => {
  $("loginModal").classList.add("hidden");
});

$("loginModal").addEventListener("click", event => {
  if (event.target === $("loginModal")) {
    $("loginModal").classList.add("hidden");
  }
});

$("loginForm").addEventListener("submit", event => {
  event.preventDefault();

  if (
    $("username").value.trim() === "admin" &&
    $("password").value === "admin123"
  ) {
    isAdmin = true;
    $("loginModal").classList.add("hidden");
    $("loginForm").reset();
    updateAdmin();
    $("admin").scrollIntoView({ behavior: "smooth" });
  } else {
    $("loginMessage").textContent =
      "Incorrect login. Use admin / admin123.";
  }
});

$("logoutBtn").addEventListener("click", () => {
  isAdmin = false;
  clearForm();
  updateAdmin();
});

$("eventForm").addEventListener("submit", event => {
  event.preventDefault();
  if (!isAdmin) return;

  const id = $("editId").value;

  const item = {
    id: id || String(Date.now()),
    name: $("eventName").value.trim(),
    category: $("eventCategory").value,
    date: $("eventDate").value,
    time: $("eventTime").value,
    venue: $("eventVenue").value.trim(),
    organizer: $("eventOrganizer").value.trim(),
    prize: $("eventPrize").value.trim(),
    description: $("eventDescription").value.trim()
  };

  if (!item.date || item.date < dateAfter(0)) {
    $("adminMessage").textContent = "Choose today or a future date.";
    return;
  }

  if (id) {
    events = events.map(oldItem => oldItem.id === id ? item : oldItem);
    $("adminMessage").textContent = "Event updated successfully!";
  } else {
    events.push(item);
    $("adminMessage").textContent = "Event added successfully!";
  }

  saveData();
  clearForm();
  renderEvents();
  renderParticipants();
});

$("cancelEdit").addEventListener("click", clearForm);

$("participants").addEventListener("click", event => {
  const button = event.target.closest("[data-remove]");
  if (!button || !isAdmin) return;

  registrations = registrations.filter(
    registration => registration.id !== button.dataset.remove
  );

  saveData();
  renderEvents();
  renderParticipants();
});

renderEvents();
updateAdmin();