import type { KnowledgeArticle } from "@gin/shared";

export function KnowledgePanel({ articles }: { articles: KnowledgeArticle[] }) {
  if (!articles.length) {
    return (
      <article className="panel panel-wide">
        <p className="panel-label">Knowledge Briefings</p>
        <h2>GIN Advisor</h2>
        <p className="status">No field guides yet. Seed knowledge articles through the API to brief pilots.</p>
      </article>
    );
  }

  const [feature, ...supporting] = articles;

  return (
    <article className="panel panel-wide">
      <p className="panel-label">Knowledge Briefings</p>
      <h2>GIN Advisor</h2>
      <div className="knowledge-feature">
        <div className="knowledge-feature-header">
          <div>
            <strong>{feature.title}</strong>
            <p className="status">{feature.summary}</p>
          </div>
          <span className={`badge-${feature.difficulty === "critical" ? "danger" : feature.difficulty === "advanced" ? "warning" : "info"}`}>
            {formatDifficulty(feature.difficulty)}
          </span>
        </div>
        {feature.steps.length ? (
          <ol className="knowledge-steps">
            {feature.steps.slice(0, 4).map((step, index) => (
              <li key={step}>
                <span>{index + 1}</span>
                <p>{step}</p>
              </li>
            ))}
          </ol>
        ) : null}
        {feature.relatedLocations.length ? (
          <p className="status-small">Focus sectors: {feature.relatedLocations.join(", ")}</p>
        ) : null}
      </div>

      {supporting.length ? (
        <ul className="knowledge-list">
          {supporting.map((article) => (
            <li key={article.id}>
              <div>
                <strong>{article.title}</strong>
                <span className="status-small">{formatDifficulty(article.difficulty)}</span>
              </div>
              <p className="status">{article.summary}</p>
              {article.tags.length ? <p className="status-small">Tags: {article.tags.join(", ")}</p> : null}
            </li>
          ))}
        </ul>
      ) : null}
    </article>
  );
}

function formatDifficulty(value: KnowledgeArticle["difficulty"]) {
  switch (value) {
    case "advanced":
      return "Advanced";
    case "critical":
      return "Critical";
    default:
      return "Standard";
  }
}
