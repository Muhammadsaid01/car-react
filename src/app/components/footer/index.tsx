import { Link } from "react-router-dom";
import { AccessTimeOutlined, LocationOnOutlined, MailOutline, PhoneOutlined } from "@mui/icons-material";
import { siteContact } from "../../../lib/data/siteContent";

export default function Footer() {
  return <footer className="lux-footer" id="boglanish" tabIndex={-1}>
    <div className="lux-container">
      <div className="lux-footer-grid">
        <div className="lux-footer-about">
          <Link to="/" className="lux-wordmark">LUXAVTO</Link>
          <p>Premium avtomobillar va zamonaviy haydash madaniyati. O‘zingizga mos avtomobil bilan tanishing.</p>
          {siteContact.socials.length > 0 && <nav aria-label="Ijtimoiy tarmoqlar" className="lux-socials">{siteContact.socials.map(social => <a key={social.url} href={social.url} target="_blank" rel="noreferrer">{social.label}</a>)}</nav>}
        </div>
        <nav aria-label="Footer sahifalari"><h2>Sahifalar</h2><Link to="/">Bosh sahifa</Link><Link to="/products">Avtomobillar</Link><Link to="/help">Yordam</Link></nav>
        <div className="lux-footer-contact"><h2>Bog‘lanish</h2>
          <p><LocationOnOutlined aria-hidden="true" /><span>{siteContact.address || "Manzil hali kiritilmagan"}</span></p>
          <p><PhoneOutlined aria-hidden="true" />{siteContact.phone ? <a href={`tel:${siteContact.phone}`}>{siteContact.phone}</a> : <span>Telefon hali kiritilmagan</span>}</p>
          <p><MailOutline aria-hidden="true" />{siteContact.email ? <a href={`mailto:${siteContact.email}`}>{siteContact.email}</a> : <span>Email hali kiritilmagan</span>}</p>
          <p><AccessTimeOutlined aria-hidden="true" /><span>{siteContact.hours || "Ish vaqti hali kiritilmagan"}</span></p>
        </div>
      </div>
      <div className="lux-footer-bottom"><span>© {new Date().getFullYear()} LuxAvto. Barcha huquqlar himoyalangan.</span><Link to="/help#terms">Foydalanish shartlari</Link></div>
    </div>
  </footer>;
}
