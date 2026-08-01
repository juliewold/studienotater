import "./GlobalSearch.css";

import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import {
  getGlobalSearchItems,
  searchGlobalItems,
  type GlobalSearchResult,
} from "../../services/globalSearchService.ts";

type Props = {
  onNavigate: () => void;
};

export const GlobalSearch = ({ onNavigate }: Props) => {
  const [query, setQuery] = useState("");

  const [items, setItems] = useState<GlobalSearchResult[]>([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const results = await getGlobalSearchItems();

        setItems(results);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const results = useMemo(() => {
    return searchGlobalItems(items, query);
  }, [items, query]);

  return (
    <div className="global-search">
      <input
        type="text"
        placeholder="Hva leter du etter?"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
      />

      {query.length >= 2 && (
        <div className="search-results">
          {loading ? (
            <p className="search-message">Laster...</p>
          ) : results.length === 0 ? (
            <p className="search-message">Ingen treff.</p>
          ) : (
            results.map((result) => (
              <Link
                key={`${result.type}-${result.id}`}
                to={result.path}
                onClick={onNavigate}
                className="search-result"
              >
                <div className="search-icon">
                  {result.type === "note" && "📄"}

                  {result.type === "flashcard" && "🎴"}

                  {result.type === "video" && "🎥"}

                  {result.type === "pdf" && "📑"}
                </div>

                <div className="search-content">
                  <div className="search-title">{result.title}</div>

                  <div className="search-description">{result.description}</div>
                </div>
              </Link>
            ))
          )}
        </div>
      )}
    </div>
  );
};
