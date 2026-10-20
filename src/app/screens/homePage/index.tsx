import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import "../../../css/home.css";
import { ProductCollection } from "../../../lib/enums/product.enum";
import MemberService from "../../services/MemberService";
import ProductService from "../../services/ProductService";
import { setBrandCars, setNewCars, setTopUsers } from "./slice";
import BrandCars from "./BrandCars";
import NewCars from "./NewCars";
import ActiveUsers from "./ActiveUsers";
import Advertisement from "./Advertisement";
import Events from "./Events";
import SearchPanel from "./SearchPanel";
import { LoadState } from "./SectionState";

export default function HomePage() {
  const dispatch = useDispatch();
  const [collection, setCollection] = useState("");
  const [featuredState, setFeaturedState] = useState<LoadState>("loading");
  const [arrivalState, setArrivalState] = useState<LoadState>("loading");
  const [memberState, setMemberState] = useState<LoadState>("loading");
  const [featuredRetry, setFeaturedRetry] = useState(0);
  const [arrivalRetry, setArrivalRetry] = useState(0);
  const [memberRetry, setMemberRetry] = useState(0);
  useEffect(() => {
    let active = true;
    setFeaturedState("loading");
    new ProductService().getProducts({ page: 1, limit: 3, order: "productViews", productCollection: collection ? collection as ProductCollection : undefined })
      .then(data => { if (active) { dispatch(setBrandCars(data)); setFeaturedState("ready"); } })
      .catch(() => { if (active) { dispatch(setBrandCars([])); setFeaturedState("error"); } });
    return () => { active = false; };
  }, [dispatch, collection, featuredRetry]);
  useEffect(() => {
    let active = true;
    setArrivalState("loading");
    // Preserve the existing newest-sedan selection; the badge reflects NEW condition only.
    new ProductService().getProducts({ page: 1, limit: 2, order: "createdAt", productCollection: ProductCollection.SEDAN })
      .then(data => { if (active) { dispatch(setNewCars(data)); setArrivalState("ready"); } })
      .catch(() => { if (active) { dispatch(setNewCars([])); setArrivalState("error"); } });
    return () => { active = false; };
  }, [dispatch, arrivalRetry]);
  useEffect(() => {
    let active = true;
    setMemberState("loading");
    new MemberService().getTopUsers()
      .then(data => { if (active) { dispatch(setTopUsers(data)); setMemberState("ready"); } })
      .catch(() => { if (active) { dispatch(setTopUsers([])); setMemberState("error"); } });
    return () => { active = false; };
  }, [dispatch, memberRetry]);
  return <main className="lux-home" id="asosiy">
    <section className="lux-hero" aria-labelledby="hero-heading">
      <picture><source media="(max-width: 600px)" srcSet="/assets/luxavto/hero-mobile.jpg" /><img src="/assets/luxavto/hero.jpg" alt="Tog‘lar va ko‘l manzarasi oldidagi kumushrang sport avtomobili" width="2172" height="724" className="lux-hero-image" /></picture>
      <div className="lux-container lux-hero-copy"><h1 id="hero-heading">Orzuingizdagi<br />avtomobil.</h1><p>Tanlangan avtomobillar. Ishonchli tanlov.</p><div className="lux-hero-actions"><Link to="/products" className="lux-button lux-button-gold">Katalogni ko‘rish <span aria-hidden="true">→</span></Link><a href="#boglanish" className="lux-button lux-button-outline">Biz bilan bog‘lanish</a></div></div>
    </section>
    <SearchPanel />
    <BrandCars state={featuredState} collection={collection} onCollection={setCollection} retry={() => setFeaturedRetry(n => n + 1)} />
    <NewCars state={arrivalState} retry={() => setArrivalRetry(n => n + 1)} />
    <Advertisement />
    <ActiveUsers state={memberState} retry={() => setMemberRetry(n => n + 1)} />
    <Events />
    <section className="lux-contact-cta" aria-labelledby="contact-heading"><img src="/assets/luxavto/hero.jpg" width="2172" height="724" alt="" loading="lazy" /><div className="lux-container"><div><h2 id="contact-heading">Orzuingizga bir qadam yaqinroq.</h2><p>Savollaringiz bormi? Bog‘lanish ma’lumotlari bilan tanishing.</p></div><a href="#boglanish" className="lux-button lux-button-gold">Biz bilan bog‘lanish <span aria-hidden="true">→</span></a></div></section>
  </main>;
}
