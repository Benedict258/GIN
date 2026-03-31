"use client";

const STORY_STEPS = [
  {
    title: "Ikora Corridor Shift",
    detail: "Scout activity indicates a short-term trade spike along Ikora.",
    callout: "GIN raises corridor risk and pushes route adjustments."
  },
  {
    title: "Advisor Brief",
    detail: "Verified signals are condensed into a tactical update for operators.",
    callout: "Briefing highlights confidence and supporting evidence."
  },
  {
    title: "Pack Posture",
    detail: "Shared pack guidance updates convoy routes for the next cycle.",
    callout: "Coordinated response keeps exposure low."
  }
];

export function DemoStoryPanel() {
  return (
    <article className="panel panel-wide story-panel">
      <p className="panel-label">Intel Updates</p>
      <h2>Current Operational Brief</h2>
      <p className="lede-tight">
        Live updates summarize how verified intel is shifting route safety and pack posture.
      </p>
      <ol className="story-timeline">
        {STORY_STEPS.map((step) => (
          <li key={step.title}>
            <div>
              <strong>{step.title}</strong>
              <p>{step.detail}</p>
            </div>
            <p className="status-small">{step.callout}</p>
          </li>
        ))}
      </ol>
    </article>
  );
}
