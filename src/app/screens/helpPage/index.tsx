import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { ArrowForward, ChatBubbleOutline, ExpandMore, MailOutline, RuleOutlined } from "@mui/icons-material";
import "../../../css/help.css";
import { faq } from "../../../lib/data/faq";
import { terms } from "../../../lib/data/terms";
import { siteContact } from "../../../lib/data/siteContent";

const destinations = [
  { id: "faq", title: "Ko‘p so‘raladigan savollar", description: "Eng kerakli javoblarni toping", Icon: ChatBubbleOutline },
  { id: "terms", title: "Foydalanish qoidalari", description: "Platforma bilan tanishing", Icon: RuleOutlined },
  { id: "contact", title: "Biz bilan bog‘lanish", description: "Aloqa imkoniyatlarini ko‘ring", Icon: MailOutline },
];

export default function HelpPage() {
  const [expanded, setExpanded] = useState<string | null>(faq[0].id);
  const location = useLocation();
  useEffect(() => {
    const id = location.hash.slice(1);
    if (!destinations.some(destination => destination.id === id)) return;
    const section = document.getElementById(id);
    section?.focus({ preventScroll: true });
    section?.scrollIntoView({ block: "start", behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
  }, [location.hash, location.key]);

  return <main className="lux-help">
    <div className="lux-container">
      <header className="lux-help-intro">
        <nav aria-label="Sahifa yo‘li"><Link to="/">Bosh sahifa</Link><span aria-hidden="true"> / </span><span aria-current="page">Yordam</span></nav>
        <p className="lux-help-eyebrow">YORDAM MARKAZI</p>
        <h1>Sizga qanday yordam bera olamiz?</h1>
        <p>Savollaringizga javob va kerakli ma’lumotlar bir joyda.</p>
      </header>
      <nav className="lux-help-quick" aria-label="Yordam bo‘limlari">
        {destinations.map(({ id, title, description, Icon }) => <Link key={id} to={`/help#${id}`}>
          <Icon className="lux-help-quick-icon" aria-hidden="true" />
          <span><strong>{title}</strong><span>{description}</span></span>
          <ArrowForward className="lux-help-arrow" aria-hidden="true" />
        </Link>)}
      </nav>
      <section id="faq" tabIndex={-1} aria-labelledby="help-faq-title" className="lux-help-faq lux-help-section">
        <div className="lux-help-section-intro">
          <p className="lux-help-eyebrow">SAVOL VA JAVOBLAR</p>
          <h2 id="help-faq-title">Savolingiz bormi?</h2>
          <p>Hisobingiz, avtomobillar va buyurtmalar haqida kerakli javoblarni shu yerdan toping.</p>
          <Link className="lux-help-text-link" to="/help#contact">Aloqa bo‘limiga o‘tish <ArrowForward aria-hidden="true" /></Link>
        </div>
        <div className="lux-help-accordion">
          {faq.map(item => {
            const open = expanded === item.id;
            return <div className={`lux-help-question${open ? " is-open" : ""}`} key={item.id}>
              <h3><button id={`faq-heading-${item.id}`} aria-expanded={open} aria-controls={`faq-panel-${item.id}`} onClick={() => setExpanded(open ? null : item.id)}>
                {item.question}<ExpandMore aria-hidden="true" />
              </button></h3>
              <div id={`faq-panel-${item.id}`} role="region" aria-labelledby={`faq-heading-${item.id}`} hidden={!open}><p>{item.answer}</p></div>
            </div>;
          })}
        </div>
      </section>
      <section id="terms" tabIndex={-1} aria-labelledby="help-terms-title" className="lux-help-rules lux-help-section">
        <div className="lux-help-rules-heading"><p className="lux-help-eyebrow">FOYDALI MA’LUMOTLAR</p><h2 id="help-terms-title">Foydalanish qoidalari</h2><p>Platformadagi mavjud imkoniyatlardan foydalanish bo‘yicha yo‘riqnoma.</p></div>
        <ol>{terms.map((term, index) => <li key={term.title}><span className="lux-help-rule-number" aria-hidden="true">{String(index + 1).padStart(2, "0")}</span><h3>{term.title}</h3><p>{term.text}</p></li>)}</ol>
      </section>
      <section id="contact" tabIndex={-1} aria-labelledby="help-contact-title" className="lux-help-contact lux-help-section">
        <div className="lux-help-contact-panel">
          <MailOutline className="lux-help-contact-icon" aria-hidden="true" />
          <p className="lux-help-eyebrow">ALOQA</p>
          <h2 id="help-contact-title">Biz bilan bog‘lanish</h2>
          <p>Savollaringiz biz uchun muhim. Hozircha yuqoridagi javoblar va foydalanish yo‘riqnomasidan foydalanishingiz mumkin.</p>
          {(siteContact.phone || siteContact.email) && <div className="lux-help-contact-methods">
            {siteContact.phone && <a href={`tel:${siteContact.phone}`}>{siteContact.phone}</a>}
            {siteContact.email && <a href={`mailto:${siteContact.email}`}>{siteContact.email}</a>}
          </div>}
          <span className="lux-help-panel-line" aria-hidden="true" />
          <p className="lux-help-contact-note">Avtomobil tanlashdan shaxsiy profilingizgacha — ma’lumotlar bir joyda.</p>
        </div>
        <form className="lux-help-contact-form" aria-label="Aloqa formasi" aria-describedby="help-contact-status" onSubmit={event => event.preventDefault()}>
          <div id="help-contact-status" className="lux-help-unavailable" role="status"><strong>Xabar yuborish hozircha mavjud emas.</strong><p>Aloqa formasi vaqtincha o‘chirilgan.</p></div>
          <fieldset disabled>
            <legend className="lux-help-sr-only">Xabar yuborish — hozircha mavjud emas</legend>
            <div className="lux-help-fields">
              <div><label htmlFor="help-name">Ismingiz</label><input id="help-name" name="name" autoComplete="name" type="text" placeholder="Ismingizni kiriting" /></div>
              <div><label htmlFor="help-email">Email</label><input id="help-email" name="email" autoComplete="email" type="email" placeholder="Email manzilingiz" /></div>
              <div className="lux-help-field-wide"><label htmlFor="help-subject">Mavzu</label><input id="help-subject" name="subject" type="text" placeholder="Xabaringiz mavzusi" /></div>
              <div className="lux-help-field-wide"><label htmlFor="help-message">Xabaringiz</label><textarea id="help-message" name="message" rows={4} placeholder="Xabaringizni yozing" /></div>
            </div>
            <button type="submit" disabled>Xabar yuborish <ArrowForward aria-hidden="true" /></button>
          </fieldset>
        </form>
      </section>
    </div>
  </main>;
}
