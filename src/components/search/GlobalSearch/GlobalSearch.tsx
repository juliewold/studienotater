import "./GlobalSearch.css";

import { useContext, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import {
  getGlobalSearchItems,
  searchGlobalItems,
  type GlobalSearchResult,
} from "../../../services/search/globalSearchService.ts";

import { AuthContext } from "../../../context/AuthContext/AuthContext";
import { NOTES_CHANGED } from "../../../services/notes/notesNavigationEvents";
import { createSearchCache } from "../../../services/search/searchCache";

type Props = {
  onNavigate: () => void;
};

export const GlobalSearch = (props: Props) => {
  const { user, role } = useContext(AuthContext);
  // Remount clears results, query and in-flight consumers on account/role changes.
  return <SessionGlobalSearch key={JSON.stringify([user?.id ?? null, role])} {...props} />;
};

const SessionGlobalSearch = ({ onNavigate }: Props) => {
  const [query, setQuery] = useState("");
  const [focused, setFocused] = useState(false);

  const [items, setItems] = useState<GlobalSearchResult[]>([]);

  const [loading, setLoading] = useState(true);

  const [cache] = useState(() => createSearchCache(getGlobalSearchItems));
  const [revision, setRevision] = useState(0);

  useEffect(() => {
    const invalidate = () => {
      cache.invalidate();
      setItems([]);
      setLoading(true);
      setRevision(value => value + 1);
    };
    window.addEventListener(NOTES_CHANGED, invalidate);
    return () => window.removeEventListener(NOTES_CHANGED, invalidate);
  }, [cache]);

  useEffect(() => {
    if (!focused) return;
    let active = true;
    void cache.get().then(results => {
      if (active) setItems(results);
    }).catch(() => {
      if (active) setItems([]);
    }).finally(() => {
      if (active) setLoading(false);
    });
    return () => { active = false; };
  }, [cache, focused, revision]);

  const results = useMemo(() => {
    return searchGlobalItems(items, query);
  }, [items, query]);

  return (
    <div className="global-search" onFocus={() => setFocused(true)} onBlur={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) setFocused(false); }}>
      <input
        type="search"
        aria-label="Søk i alle ressurser"
        onKeyDown={(event) => { if (event.key === "Escape") setQuery(""); }}
        placeholder="Hva leter du etter?"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
      />

      {focused && query.length >= 2 && (
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
                onClick={() => { setQuery(""); onNavigate(); }}
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

                  {result.snippet && (
                    <div className="search-snippet">{result.snippet}</div>
                  )}
                </div>
              </Link>
            ))
          )}
        </div>
      )}
    </div>
  );
};
