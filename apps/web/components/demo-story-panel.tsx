"use client";

const STORY_STEPS = [
  {
    title: "Ikora Corridor Spike",
    detail: "Scout reports flag an unusual trade spike along the Ikora corridor.",
    callout: "Report submission awards credits and raises trust."
  },
  {
    title: "Advisor Snapshot",
    detail: "GIN auto-builds an Advisor snapshot that captures the spike plus supporting intel.",
    callout: "Snapshot publishing is locked to Advisor tier for verified contributors."
  },
  {
    title: "Faction Posture",
    detail: "Faction intel shows allied packs re-routing convoys to avoid the corridor for the next cycle.",
    callout: "Pack Access view lets you broadcast guidance to your fleet."
  }
];

export function DemoStoryPanel() {
  return (
    <article className="panel panel-wide story-panel">
      <p className="panel-label">Demo Narrative</p>
      <h2>Show How GIN Saves Fleets</h2>
      <p className="lede-tight">
        Use this suggested storyline when you demo inside the Frontier client. Each step maps to a live panel so
        viewers understand why the credits economy and advisor unlocks matter.
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
