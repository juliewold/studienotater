// The visitor's choice to let YouTube set cookies and load videos on this site.
// Stored only in this browser, under one key, and removed when the visitor withdraws it.
const YOUTUBE_CONSENT_KEY = "youtube-consent";

export const hasYoutubeConsent = (): boolean => {
  try {
    return localStorage.getItem(YOUTUBE_CONSENT_KEY) === "granted";
  } catch {
    return false;
  }
};

export const giveYoutubeConsent = () => {
  try {
    localStorage.setItem(YOUTUBE_CONSENT_KEY, "granted");
  } catch {
    // Without storage the visitor is asked again next time, which is safe.
  }
};

export const withdrawYoutubeConsent = () => {
  try {
    localStorage.removeItem(YOUTUBE_CONSENT_KEY);
  } catch {
    // Nothing stored, nothing to withdraw.
  }
};
