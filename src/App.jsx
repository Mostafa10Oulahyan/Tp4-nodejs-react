import React, { useState } from "react";
import axios from "axios";
import "./App.css";

const API_URL = "https://tp4-nodejs-rest-api-cvs8.vercel.app"; // Modifier si l'API est déployée

function App() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [profile, setProfile] = useState(null);
  const [message, setMessage] = useState("");

  // 📌 Inscription
  const register = async () => {
    try {
      await axios.post(`${API_URL}/register`, { username, email, password });
      setMessage("Inscription réussie !");
    } catch (err) {
      setMessage(err.response?.data?.error || "Erreur lors de l'inscription");
    }
  };

  // 📌 Connexion
  const login = async () => {
    try {
      const res = await axios.post(`${API_URL}/login`, { email, password });
      const token = res.data.token;
      setToken(token);
      localStorage.setItem("token", token);
      setMessage("Connexion réussie !");
    } catch (err) {
      setMessage("Email ou mot de passe incorrect");
    }
  };

  // 📌 Récupérer le profil
  const getProfile = async () => {
    try {
      const res = await axios.get(`${API_URL}/profile`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProfile(res.data);
    } catch (err) {
      setMessage("Accès refusé !");
    }
  };

  // 📌 Déconnexion
  const logout = () => {
    setToken("");
    localStorage.removeItem("token");
    setProfile(null);
    setMessage("Déconnecté !");
  };

  return (
    <div className="container">
      <h2>Authentification JWT</h2>
      {!token ? (
        <>
          <div className="form-container">
            <h3>Inscription</h3>
            <input
              type="text"
              placeholder="Nom d'utilisateur"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="password"
              placeholder="Mot de passe"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button onClick={register}>S'inscrire</button>
            <h3>Ou</h3>
            <button onClick={login}>Se connecter</button>
          </div>
        </>
      ) : (
        <>
          <button onClick={logout} className="logout-btn">
            Se déconnecter
          </button>
          <button onClick={getProfile} className="profile-btn">
            Voir mon profil
          </button>
          {profile && (
            <div className="profile">
              <h3>Profil :</h3>
              <p>Nom : {profile.username}</p>
              <p>Email : {profile.email}</p>
            </div>
          )}
        </>
      )}

      {message && <p className="message">{message}</p>}
    </div>
  );
}

export default App;
