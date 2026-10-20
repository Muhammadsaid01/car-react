import { useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import "../../../css/userPage.css";
import { useGlobals } from "../../hooks/useGlobal";
import { Settings } from "./Settings";

export default function UserPage() {
  const history = useHistory();
  const { authMember, authReady } = useGlobals();
  useEffect(() => {
    if (authReady && !authMember) history.replace("/");
  }, [authReady, authMember, history]);
  if (!authReady || !authMember) return null;
  return (
    <main className="lux-profile">
      <div className="lux-container">
        <nav className="lux-profile-breadcrumb" aria-label="Sahifa yo‘li"><Link to="/">Bosh sahifa</Link><span aria-hidden="true">/</span><span aria-current="page">Profilim</span></nav>
        <header className="lux-profile-intro"><h1>Shaxsiy profil</h1><p>Ma’lumotlaringizni yangilang va profilingizni boshqaring.</p></header>
        <Settings key={authMember._id} member={authMember} />
      </div>
    </main>
  );
}
