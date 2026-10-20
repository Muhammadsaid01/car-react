import { Link } from "react-router-dom";
import { plans } from "../../../lib/data/plans";
export default function Events() {
  return <section className="lux-container lux-section lux-editorial" aria-labelledby="news-heading">
    <div className="lux-section-heading"><h2 id="news-heading">LuxAvto olamidan</h2><span className="lux-editorial-note">Tanlov va foydalanish bo‘yicha</span></div>
    <div className="lux-editorial-grid">{plans.map(plan => <article key={plan.title}><Link to={plan.to}><img src={plan.img} width="600" height="280" alt="" loading="lazy" /><div><h3>{plan.title}</h3><span aria-hidden="true">→</span></div><p>{plan.desc}</p></Link></article>)}</div>
  </section>;
}
