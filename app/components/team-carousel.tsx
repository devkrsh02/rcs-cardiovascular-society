"use client";

import { useState } from "react";

const boardMembers = [
  {
    name: "G R Devesh Krishnan",
    role: "Representative",
    image: "/gr-devesh-krishnan.jpeg",
    introduction:
      "Hello everyone! My name is G R Devesh Krishnan, an 8th-semester medical student here at RSU and a representative for the RSU Cardiovascular Society. Having spent the last few years navigating clinical rotations, my passion for cardiovascular medicine has only grown stronger. What draws me to this field is its perfect blend of high-stakes visual diagnostics, dynamic haemodynamics and immediate clinical impact—where rapid, evidence-based intervention directly saves lives. I’m thrilled to represent RCS and look forward to fostering a collaborative environment for all of us fascinated by the heart.",
  },
  ...Array.from({ length: 5 }, () => ({
    name: "Name to be confirmed",
    role: "Board profile",
    image: null,
    introduction: "Role and short introduction pending.",
  })),
];

const slideCount = boardMembers.length + 1;

export function TeamCarousel() {
  const [activeSlide, setActiveSlide] = useState(0);

  function move(direction: number) {
    setActiveSlide((current) => (current + direction + slideCount) % slideCount);
  }

  return (
    <div
      className="team-carousel"
      role="region"
      aria-roledescription="carousel"
      aria-label="Meet the RCS board"
      tabIndex={0}
      onKeyDown={(event) => {
        if (event.key === "ArrowLeft") move(-1);
        if (event.key === "ArrowRight") move(1);
      }}
    >
      <div className="team-carousel-window">
        <div
          className="team-carousel-track"
          style={{ transform: `translateX(-${activeSlide * 100}%)` }}
        >
          <article
            className="team-slide team-cover-slide"
            aria-hidden={activeSlide !== 0}
          >
            <div className="team-cover-side-label" aria-hidden="true">THE PEOPLE BEHIND RCS</div>
            <div className="team-cover-paper">
              <div className="team-cover-heart-art" aria-hidden="true">
                <img src="/rcs-anatomical-heart.png" alt="" />
              </div>
              <div className="team-cover-copy">
                <p>RSU CARDIOVASCULAR SOCIETY · BOARD 2026/27</p>
                <h3>Meet<br />the Team</h3>
                <span>Six students. One shared commitment to cardiovascular education.</span>
              </div>
              <div className="team-cover-photo-frame">
                <img src="/rcs-board-2026-27.png" alt="The RCS board together outdoors" />
              </div>
              <div className="team-cover-swipe" aria-hidden="true">SWIPE TO MEET THE BOARD <b>→</b></div>
            </div>
          </article>

          {boardMembers.map((member, index) => (
            <article
              className="team-slide team-member-slide"
              key={`${member.name}-${index}`}
              aria-hidden={activeSlide !== index + 1}
            >
              <div className="team-member-heart-art" aria-hidden="true">
                <img src="/rcs-anatomical-heart.png" alt="" />
              </div>
              <div className={`team-member-photo${member.image ? " has-photo" : ""}`}>
                {member.image ? (
                  <img src={member.image} alt={`Portrait of ${member.name}`} />
                ) : (
                  <span aria-hidden="true">RCS</span>
                )}
              </div>
              <div className="team-member-copy">
                <div className="team-member-index">{String(index + 1).padStart(2, "0")}</div>
                <p className="board-role">{member.role}</p>
                <h3>{member.name}</h3>
                <p>{member.introduction}</p>
              </div>
            </article>
          ))}
        </div>
      </div>

      <button
        className="team-arrow team-arrow-left"
        type="button"
        onClick={() => move(-1)}
        aria-label="Previous team slide"
      >
        <span aria-hidden="true">←</span>
      </button>
      <button
        className="team-arrow team-arrow-right"
        type="button"
        onClick={() => move(1)}
        aria-label="Next team slide"
      >
        <span aria-hidden="true">→</span>
      </button>

      <div className="team-carousel-status" aria-live="polite">
        <span>{String(activeSlide + 1).padStart(2, "0")}</span>
        <i aria-hidden="true" />
        <span>{String(slideCount).padStart(2, "0")}</span>
      </div>
    </div>
  );
}
