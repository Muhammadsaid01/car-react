import { useEffect, useRef, useState } from "react";
import { Menu, MenuItem } from "@mui/material";
import { NavLink, useLocation } from "react-router-dom";
import { serverApi } from "../../../lib/config";
import { CartItem } from "../../../lib/types/search";
import { useGlobals } from "../../hooks/useGlobal";
import Basket from "./Basket";

export interface HomeNavbarProps {
  cartItems: CartItem[];
  onAdd: (item: CartItem) => void;
  onRemove: (item: CartItem) => void;
  onDelete: (item: CartItem) => void;
  onDeleteAll: () => void;
  setSignupOpen: (open: boolean) => void;
  setLoginOpen: (open: boolean) => void;
  handleLogoutClick: (e: React.MouseEvent<HTMLElement>) => void;
  anchorEl: HTMLElement | null;
  handleCloseLogout: () => void;
  handleLogoutRequest: () => void;
}

export default function HomeNavbar(props: HomeNavbarProps) {
  const { authMember } = useGlobals();
  const [menuOpen, setMenuOpen] = useState(false);
  const toggle = useRef<HTMLButtonElement>(null);
  const location = useLocation();
  useEffect(() => { setMenuOpen(false); }, [location.pathname, location.search]);
  return <header className="lux-header" onKeyDown={event => {
    if (event.key === "Escape" && menuOpen) { setMenuOpen(false); toggle.current?.focus(); }
  }}>
    <div className="lux-container lux-header-inner">
      <NavLink exact to="/" className="lux-wordmark" aria-label="LuxAvto — bosh sahifa">LUXAVTO</NavLink>
      <nav id="lux-navigation" className={`lux-navigation${menuOpen ? " is-open" : ""}`} aria-label="Asosiy navigatsiya">
        <NavLink exact to="/" activeClassName="is-current">Bosh sahifa</NavLink>
        <NavLink to="/products" activeClassName="is-current">Avtomobillar</NavLink>
        <NavLink to="/help" activeClassName="is-current">Yordam</NavLink>
        {authMember && <><NavLink to="/orders" activeClassName="is-current">Buyurtmalar</NavLink><NavLink to="/member-page" activeClassName="is-current">Profilim</NavLink></>}
      </nav>
      <div className="lux-header-actions">
        <Basket cartItems={props.cartItems} onAdd={props.onAdd} onRemove={props.onRemove} onDelete={props.onDelete} onDeleteAll={props.onDeleteAll} />
        {authMember ? <button className="lux-account" aria-label="Hisob menyusi" aria-haspopup="menu" aria-expanded={Boolean(props.anchorEl)} onClick={props.handleLogoutClick}>
          <img width="36" height="36" src={authMember.memberImage ? `${serverApi}/${authMember.memberImage}` : "/icons/default-user.svg"} alt="user avatar" onError={e => { e.currentTarget.onerror = null; e.currentTarget.src = "/icons/default-user.svg"; }} />
        </button> : <button className="lux-login" onClick={() => props.setLoginOpen(true)}>Kirish</button>}
        <button ref={toggle} className="lux-menu-toggle" aria-label={menuOpen ? "Menyuni yopish" : "Menyuni ochish"} aria-expanded={menuOpen} aria-controls="lux-navigation" onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? "×" : "☰"}</button>
      </div>
    </div>
    <Menu anchorEl={props.anchorEl} open={Boolean(props.anchorEl)} onClose={props.handleCloseLogout} onClick={props.handleCloseLogout}>
      <MenuItem component={NavLink} to="/member-page">Profilim</MenuItem>
      <MenuItem component={NavLink} to="/orders">Buyurtmalar</MenuItem>
      <MenuItem onClick={props.handleLogoutRequest}>Chiqish</MenuItem>
    </Menu>
  </header>;
}
