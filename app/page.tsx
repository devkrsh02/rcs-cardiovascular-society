import { ActivityBrowser } from "./components/activity-browser";
import { getSemester } from "@/lib/semester";

const boardSeats = Array.from({ length: 6 }, (_, index) => index + 1);

export default function Home() {
  const semester = getSemester();

  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <header className="site-header">
        <a className="brand" href="#top" aria-label="RCS home">
          <img src="/rcs-logo.jpeg" alt="" />
          <span>
            <strong>RCS</strong>
            <small>RSU Cardiovascular Society</small>
          </span>
        </a>
        <nav aria-label="Main navigation">
          <a href="#activities">Activities</a>
          <a href="#about">About</a>
          <a href="#board">Board</a>
          <a href="#resources">Resources</a>
          <a className="nav-login" href="/members">
            Member area
          </a>
        </nav>
      </header>

      <main id="main">
        <section className="hero" id="top">
          <div className="hero-copy">
            <div className="semester-pill">
              <span aria-hidden="true" />
              Current programme · {semester.name}
            </div>
            <p className="eyebrow">Riga Stradiņš University</p>
            <h1>
              Cardiovascular learning,
              <em> built around students.</em>
            </h1>
            <p className="hero-intro">
              A student-led academic society connecting clinical reasoning, practical
              skills, research and cardiovascular education.
            </p>
            <div className="hero-actions">
              <a className="button button-primary" href="#activities">
                View semester plan <span aria-hidden="true">↓</span>
              </a>
              <a className="button button-quiet" href="/members">
                Active member login
              </a>
            </div>
            <p className="semester-rule">
              Spring runs 1 February–31 August. Autumn runs 1 September–31 January.
              The site changes semester automatically on those dates.
            </p>
          </div>
          <div className="hero-heart-art" aria-hidden="true">
            <img
              src="/rcs-anatomical-heart.png"
              alt=""
            />
          </div>
        </section>

        <section className="programme-section" id="activities">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Semester activities</p>
              <h2>Plans, dates and what comes next.</h2>
            </div>
            <p>
              Browse the {semester.name} programme by month or activity type. Sessions
              without approved dates remain clearly marked as TBC.
            </p>
          </div>
          <ActivityBrowser semester={semester.name} />
        </section>

        <section className="about-section" id="about">
          <div className="about-statement">
            <p className="eyebrow">About RCS</p>
            <h2>More clinical. More hands-on. More connected.</h2>
          </div>
          <div className="about-copy">
            <p>
              The RSU Cardiovascular Society is a student-led academic organisation
              working with healthcare professionals and faculty to bring members closer
              to real-world cardiovascular medicine.
            </p>
            <p>
              Our programme combines expert-led learning, clinical case discussion,
              peer revision, practical workshops and support for student research.
            </p>
            <div className="principles" aria-label="RCS programme focus">
              <span>Clinical reasoning</span>
              <span>Practical skills</span>
              <span>Research</span>
              <span>Student leadership</span>
            </div>
          </div>
        </section>

        <section className="board-section" id="board">
          <div className="section-heading compact">
            <div>
              <p className="eyebrow">Current board</p>
              <h2>Six people guiding the society.</h2>
            </div>
            <p>
              Board names, roles and introductions will be added when the confirmed
              profiles are supplied.
            </p>
          </div>
          <div className="board-grid">
            {boardSeats.map((seat) => (
              <article className="board-card" key={seat}>
                <div className="board-number">{String(seat).padStart(2, "0")}</div>
                <div className="board-portrait" aria-hidden="true">
                  <span>RCS</span>
                </div>
                <p className="board-role">Board profile</p>
                <h3>Name to be confirmed</h3>
                <p>Role and short introduction pending.</p>
              </article>
            ))}
          </div>
        </section>

        <section className="resources-section" id="resources">
          <div className="resource-intro">
            <p className="eyebrow">Member resources</p>
            <h2>Society documents, kept in one private library.</h2>
            <p>
              Active members can access rules, regulations and other approved documents
              for their current semester. Board administrators can upload and manage the
              library from the same protected area.
            </p>
            <a className="button button-light" href="/members">
              Open member library <span aria-hidden="true">→</span>
            </a>
          </div>
          <div className="resource-types" aria-label="Resource categories">
            <article>
              <span>01</span>
              <h3>Rules &amp; regulations</h3>
              <p>Current governance and participation documents.</p>
            </article>
            <article>
              <span>02</span>
              <h3>Revision materials</h3>
              <p>Approved learning resources linked to RCS sessions.</p>
            </article>
            <article>
              <span>03</span>
              <h3>Research support</h3>
              <p>Documents supporting the Start Your Own Research programme.</p>
            </article>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="brand footer-brand">
          <img src="/rcs-logo.jpeg" alt="" />
          <span>
            <strong>RCS</strong>
            <small>RSU Cardiovascular Society</small>
          </span>
        </div>
        <div className="footer-center">
          <p>{semester.name} · Private society hub</p>
          <nav className="footer-contacts" aria-label="RCS contact details">
            <a href="mailto:cardiovascularsociety@gmail.com">
              <span>Email</span>
              cardiovascularsociety@gmail.com
            </a>
            <a href="https://www.instagram.com/rcs.rsu/" target="_blank" rel="noreferrer">
              <span>Instagram</span>
              @rcs.rsu
            </a>
            <a
              href="https://chat.whatsapp.com/DHfgBzbYKO59aPfO6v15FW?mode=gi_t"
              target="_blank"
              rel="noreferrer"
            >
              <span>WhatsApp</span>
              Join our newsletter
            </a>
          </nav>
        </div>
        <a href="#top">Back to top ↑</a>
      </footer>
    </>
  );
}
