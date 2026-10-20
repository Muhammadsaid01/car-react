import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { collectionOptions } from "../../../lib/catalogSearch";
import { retrieveBrandCars } from "./selector";
import SectionState, { LoadState } from "./SectionState";
import VehicleCard from "./VehicleCard";
export default function BrandCars({ state, collection, onCollection, retry }: { state: LoadState; collection: string; onCollection: (value: string) => void; retry: () => void }) {
  const products = useSelector(retrieveBrandCars);
  return <section className="lux-container lux-section lux-featured" aria-labelledby="featured-heading">
    <div className="lux-section-heading"><h2 id="featured-heading">Mukammal tanlov shu yerda.</h2><Link className="lux-inline-link" to="/products">Barcha avtomobillarni ko‘rish <span aria-hidden="true">→</span></Link></div>
    <div className="lux-chips" aria-label="Mashhur avtomobillar kuzovi">{collectionOptions.slice(0, 5).map(option => <button key={option.value} type="button" aria-pressed={collection === option.value} onClick={() => onCollection(option.value)}>{option.label}</button>)}</div>
    {state === "ready" && products.length ? <div className="lux-vehicle-grid">{products.map(product => <VehicleCard key={product._id} product={product} />)}</div> : <SectionState state={state} empty="Bu turdagi avtomobillar hozircha mavjud emas." retry={retry} />}
  </section>;
}
