import "./styles.css";

const activities = [
  {
    id: "perioperative-simulation",
    type: "Workshop",
    status: "In planning",
    timing: "Date to be confirmed",
    title: "Perioperative cardiac emergency simulation",
    description:
      "A proposed joint practical session with the Intensive Care & Anaesthesiology Society, built around recognising hypotension, myocardial ischaemia and the four forms of shock in theatre.",
    tags: ["Practical", "Acute care", "Team-based"],
    note: "Programme and facilitator details have not yet been published.",
  },
  {
    id: "arrhythmia-session",
    type: "Event",
    status: "Planned",
    timing: "Date to be confirmed",
    title: "RCS arrhythmia session",
    description:
      "A dedicated RCS activity on arrhythmias. The programme is being kept separate from the proposed perioperative collaboration.",
    tags: ["Cardiology", "ECG", "RCS-led"],
    note: "Format, venue and registration details are still to be confirmed.",
  },
  {
    id: "social-media-election",
    type: "Election",
    status: "Completed",
    timing: "5 September 2026 · 17:00–18:00 Riga time",
    title: "Social Media Manager election",
    description:
      "Candidates delivered three-minute presentations, followed by an anonymous vote open to RSU students and staff.",
    tags: ["Online", "Governance", "Member voice"],
    note: "This listing is retained as a transparent record of society activity.",
  },
];

const filters = ["All", "Event", "Workshop", "Election"];

document.querySelector("#app").innerHTML = `
  <header class="site-header" data-header>
    <a class="brand" href="#overview" aria-label="RCS home">
      <span class="brand-mark" aria-hidden="true">
        <svg viewBox="0 0 48 48" role="img">
          <path d="M8 25h8l3-10 6 22 4-15 3 3h8" />
        </svg>
      </span>
      <span class="brand-copy"><strong>RCS</strong><small>RSU Cardiovascular Society</small></span>
    </a>
    <button class="menu-toggle" type="button" aria-expanded="false" aria-controls="site-nav">
      <span></span><span></span><span></span><span class="sr-only">Open navigation</span>
    </button>
    <nav id="site-nav" class="site-nav" aria-label="Main navigation">
      <a href="#overview">About</a>
      <a href="#activities">Activities</a>
      <a href="#resources">Resources</a>
    </nav>
  </header>

  <main id="main">
    <section id="overview" class="hero section-shell" aria-labelledby="hero-heading">
      <div class="hero-copy">
        <p class="eyebrow">Member hub · Riga Stradiņš University</p>
        <h1 id="hero-heading">Learn the heart.<br /><em>Practise together.</em></h1>
        <p class="hero-intro">RCS brings students together around cardiovascular medicine through practical learning, focused discussion and student-led activity.</p>
        <div class="hero-actions">
          <a class="button button-primary" href="#activities">Browse activities <span aria-hidden="true">↘</span></a>
          <a class="text-link" href="#resources">Open member resources <span aria-hidden="true">→</span></a>
        </div>
      </div>
      <div class="hero-panel" aria-label="Society focus areas">
        <div class="pulse-orbit" aria-hidden="true">
          <span class="orbit orbit-one"></span>
          <span class="orbit orbit-two"></span>
          <svg viewBox="0 0 180 180">
            <path class="heart-line" d="M90 142C75 128 39 106 39 73c0-22 27-34 51-8 24-26 51-14 51 8 0 33-36 55-51 69Z" />
            <path class="ecg-line" d="M24 91h33l7-15 12 38 14-62 13 39h53" />
          </svg>
        </div>
        <div class="focus-grid">
          <span><strong>Clinical</strong><small>reasoning</small></span>
          <span><strong>Practical</strong><small>skills</small></span>
          <span><strong>Student</strong><small>leadership</small></span>
        </div>
      </div>
    </section>

    <section id="activities" class="activities section-shell" aria-labelledby="activities-heading">
      <div class="section-heading">
        <div>
          <p class="eyebrow">Find your next activity</p>
          <h2 id="activities-heading">Events, workshops<br />& elections</h2>
        </div>
        <p>Filter by activity type. Items without an approved schedule are clearly marked, so this hub stays useful without guessing.</p>
      </div>

      <div class="activity-toolbar" aria-label="Filter activities">
        <div class="filter-group" role="group" aria-label="Activity type">
          ${filters.map((filter, index) => `<button class="filter-button ${index === 0 ? "is-active" : ""}" type="button" data-filter="${filter}" aria-pressed="${index === 0}">${filter}</button>`).join("")}
        </div>
        <p class="result-count" aria-live="polite"><strong>${activities.length}</strong> activities shown</p>
      </div>

      <div class="activity-grid" data-activity-grid>
        ${activities.map((activity) => `
          <article class="activity-card" data-type="${activity.type}">
            <div class="card-meta">
              <span class="type-badge">${activity.type}</span>
              <span class="status status-${activity.status.toLowerCase().replaceAll(" ", "-")}">${activity.status}</span>
            </div>
            <p class="timing">${activity.timing}</p>
            <h3>${activity.title}</h3>
            <p>${activity.description}</p>
            <ul class="tag-list" aria-label="Activity topics">
              ${activity.tags.map((tag) => `<li>${tag}</li>`).join("")}
            </ul>
            <button class="card-link" type="button" data-detail="${activity.id}">View details <span aria-hidden="true">→</span></button>
          </article>
        `).join("")}
      </div>
      <div class="empty-state" data-empty hidden>
        <h3>No activities match this filter yet.</h3>
        <p>Try another activity type.</p>
      </div>
    </section>

    <section id="resources" class="resources section-shell" aria-labelledby="resources-heading">
      <div class="section-heading resource-heading">
        <div>
          <p class="eyebrow">Member resources</p>
          <h2 id="resources-heading">A focused place<br />to keep learning</h2>
        </div>
        <p>Current RCS learning projects are shown with honest availability labels. Published files can be connected here when approved.</p>
      </div>

      <div class="resource-grid">
        <article class="resource-feature">
          <div class="resource-index">01</div>
          <div>
            <span class="resource-state">In development</span>
            <h3>Introduction to Cardiology</h3>
            <p>A 32-page member booklet for second- and third-year medical students, covering heart anatomy and ECG foundations.</p>
            <button type="button" class="resource-action" data-resource="cardiology">See planned contents <span aria-hidden="true">→</span></button>
          </div>
        </article>
        <article class="resource-feature">
          <div class="resource-index">02</div>
          <div>
            <span class="resource-state">Programme material</span>
            <h3>Mind After Heart</h3>
            <p>Learning material on psychological and cognitive recovery after myocardial infarction and cardiac surgery.</p>
            <button type="button" class="resource-action" data-resource="mind-after-heart">Explore topics <span aria-hidden="true">→</span></button>
          </div>
        </article>
      </div>

      <footer class="site-footer">
        <a class="brand footer-brand" href="#overview" aria-label="Return to top">
          <span class="brand-copy"><strong>RCS</strong><small>RSU Cardiovascular Society</small></span>
        </a>
        <p>Private member site · Activity information is published only when confirmed.</p>
        <a href="#overview" class="back-to-top">Back to top ↑</a>
      </footer>
    </section>
  </main>

  <dialog class="detail-dialog" data-dialog aria-labelledby="dialog-title">
    <button class="dialog-close" type="button" data-dialog-close aria-label="Close details">×</button>
    <p class="eyebrow" data-dialog-kicker>Activity details</p>
    <h2 id="dialog-title" data-dialog-title></h2>
    <div data-dialog-body></div>
  </dialog>
`;

const filterButtons = [...document.querySelectorAll("[data-filter]")];
const cards = [...document.querySelectorAll(".activity-card")];
const resultCount = document.querySelector(".result-count");
const emptyState = document.querySelector("[data-empty]");

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const selected = button.dataset.filter;
    filterButtons.forEach((item) => {
      const active = item === button;
      item.classList.toggle("is-active", active);
      item.setAttribute("aria-pressed", String(active));
    });

    let visible = 0;
    cards.forEach((card) => {
      const show = selected === "All" || card.dataset.type === selected;
      card.hidden = !show;
      if (show) visible += 1;
    });
    resultCount.innerHTML = `<strong>${visible}</strong> ${visible === 1 ? "activity" : "activities"} shown`;
    emptyState.hidden = visible !== 0;
  });
});

const dialog = document.querySelector("[data-dialog]");
const dialogTitle = document.querySelector("[data-dialog-title]");
const dialogBody = document.querySelector("[data-dialog-body]");
const dialogKicker = document.querySelector("[data-dialog-kicker]");

const resourceDetails = {
  cardiology: {
    kicker: "Resource plan",
    title: "Introduction to Cardiology",
    body: `<p>The planned booklet is designed for active RCS members in years two and three.</p><ul><li>Heart anatomy</li><li>ECG basics: foundations through interpretation</li><li>Combined advanced ECG sections</li><li>Visual explanations and referenced learning</li></ul><p class="dialog-note">The booklet itself is not yet published on this site.</p>`,
  },
  "mind-after-heart": {
    kicker: "Programme material",
    title: "Mind After Heart",
    body: `<p>The programme connects cardiac recovery with psychological and cognitive care.</p><ul><li>Depression, anxiety and post-traumatic stress after MI</li><li>Delirium and cognitive change after cardiac surgery</li><li>Screening, red flags and referral</li><li>Rehabilitation and coordinated management</li></ul><p class="dialog-note">No downloadable file has been attached to this private hub yet.</p>`,
  },
};

function openDialog({ kicker, title, body }) {
  dialogKicker.textContent = kicker;
  dialogTitle.textContent = title;
  dialogBody.innerHTML = body;
  dialog.showModal();
}

document.querySelectorAll("[data-detail]").forEach((button) => {
  button.addEventListener("click", () => {
    const activity = activities.find((item) => item.id === button.dataset.detail);
    openDialog({
      kicker: `${activity.type} · ${activity.status}`,
      title: activity.title,
      body: `<p class="dialog-timing">${activity.timing}</p><p>${activity.description}</p><p class="dialog-note">${activity.note}</p>`,
    });
  });
});

document.querySelectorAll("[data-resource]").forEach((button) => {
  button.addEventListener("click", () => openDialog(resourceDetails[button.dataset.resource]));
});

document.querySelector("[data-dialog-close]").addEventListener("click", () => dialog.close());
dialog.addEventListener("click", (event) => {
  if (event.target === dialog) dialog.close();
});

const menuToggle = document.querySelector(".menu-toggle");
const nav = document.querySelector("#site-nav");
menuToggle.addEventListener("click", () => {
  const open = menuToggle.getAttribute("aria-expanded") === "true";
  menuToggle.setAttribute("aria-expanded", String(!open));
  nav.classList.toggle("is-open", !open);
});

nav.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    menuToggle.setAttribute("aria-expanded", "false");
    nav.classList.remove("is-open");
  });
});

const header = document.querySelector("[data-header]");
window.addEventListener("scroll", () => header.classList.toggle("is-scrolled", window.scrollY > 20), { passive: true });
