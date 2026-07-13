import "./ProfilePage.css";
import {
  useContext,
  useEffect,
  useState,
  type SyntheticEvent,
} from "react";
import { AuthContext } from "../../context/AuthContext/AuthContext";
import { supabase } from "../../lib/supabase";

type Profile = {
  username: string;
  full_name: string;
  role: string;
};

export const ProfilePage = () => {
  const { user } = useContext(AuthContext);

  const [username, setUsername] = useState("");
  const [fullName, setFullName] = useState("");
  const [role, setRole] = useState("user");

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    const loadProfile = async () => {
      if (!user) {
        return;
      }

      try {
        const { data, error } = await supabase
          .from("profiles")
          .select("username, full_name, role")
          .eq("id", user.id)
          .single();

        if (error) {
          throw error;
        }

        const profile = data as Profile;

        setUsername(profile.username ?? "");
        setFullName(profile.full_name ?? "");
        setRole(profile.role ?? "user");
      } catch (error) {
        console.error("Kunne ikke hente profil:", error);
        setErrorMessage("Kunne ikke hente profilen.");
      } finally {
        setIsLoading(false);
      }
    };

    loadProfile();
  }, [user]);

  const handleSubmit = async (
    event: SyntheticEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    if (!user) {
      return;
    }

    setErrorMessage("");
    setSuccessMessage("");
    setIsSaving(true);

    const normalizedUsername = username.trim().toLowerCase();

    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          username: normalizedUsername,
          full_name: fullName.trim(),
        })
        .eq("id", user.id);

      if (error) {
        throw error;
      }

      setUsername(normalizedUsername);
      setSuccessMessage("Profilen ble oppdatert.");
    } catch (error) {
      console.error("Kunne ikke oppdatere profil:", error);
      setErrorMessage(
        "Kunne ikke oppdatere profilen. Brukernavnet kan allerede være i bruk.",
      );
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <main className="profile-page">
        <p>Laster profil...</p>
      </main>
    );
  }

  return (
    <main className="profile-page">
      <section className="profile-card">
        <p className="profile-label">Min konto</p>
        <h1>Min profil</h1>

        <div className="profile-summary">
          <div className="profile-avatar">
            {(fullName || username || user?.email || "?")
              .charAt(0)
              .toUpperCase()}
          </div>

          <div>
            <h2>{fullName || username}</h2>
            <p>{user?.email}</p>
            <span>{role === "admin" ? "Administrator" : "Vanlig bruker"}</span>
          </div>
        </div>

        <form className="profile-form" onSubmit={handleSubmit}>
          <label htmlFor="username">Brukernavn</label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            minLength={3}
            maxLength={30}
            pattern="[A-Za-z0-9_-]+"
            title="Bruk bare bokstaver, tall, bindestrek og understrek."
            required
          />

          <p className="profile-help">
            Bruk bare bokstaver, tall, bindestrek og understrek.
          </p>

          <label htmlFor="fullName">Fullt navn</label>
          <input
            id="fullName"
            type="text"
            value={fullName}
            onChange={(event) => setFullName(event.target.value)}
            required
          />

          <label htmlFor="email">E-post</label>
          <input
            id="email"
            type="email"
            value={user?.email ?? ""}
            disabled
          />

          {errorMessage && (
            <p className="profile-message profile-message-error">
              {errorMessage}
            </p>
          )}

          {successMessage && (
            <p className="profile-message profile-message-success">
              {successMessage}
            </p>
          )}

          <button type="submit" disabled={isSaving}>
            {isSaving ? "Lagrer..." : "Lagre endringer"}
          </button>
        </form>
      </section>
    </main>
  );
};