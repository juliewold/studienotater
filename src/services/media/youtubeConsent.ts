// The visitor's answer to the question of whether YouTube may set cookies and load
// videos on this site. Stored only in this browser, under one key. Removing the key
// asks the visitor again the next time they open a video page.
const YOUTUBE_CONSENT_KEY = "youtube-consent";

export type YoutubeChoice = "granted" | "declined";

export const getYoutubeChoice = (): YoutubeChoice | null => {
  try {
    const value = localStorage.getItem(YOUTUBE_CONSENT_KEY);
    return value === "granted" || value === "declined" ? value : null;
  } catch {
    return null;
  }
};

export const setYoutubeChoice = (choice: YoutubeChoice) => {
  try {
    localStorage.setItem(YOUTUBE_CONSENT_KEY, choice);
  } catch {
    // Without storage the question is asked again next time, which is safe.
  }
};

export const clearYoutubeChoice = () => {
  try {
    localStorage.removeItem(YOUTUBE_CONSENT_KEY);
  } catch {
    // Nothing stored, nothing to clear.
  }
};
