import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { catalogUrl } from "../../../lib/catalogSearch";
import { ProductCollection } from "../../../lib/enums/product.enum";
import { retrieveNewCars } from "./selector";
import SectionState, { LoadState } from "./SectionState";
import VehicleCard from "./VehicleCard";
export default function NewCars({ state, retry }: { state: LoadState; retry: () => void }) {
  const products = useSelector(retrieveNewCars);
  return <section className="lux-container lux-section lux-arrivals" aria-labelledby="arrivals-heading">
    <div className="lux-section-heading"><h2 id="arrivals-heading">Yangi kelganlar</h2><Link className="lux-inline-link" to={catalogUrl({ collection: ProductCollection.SEDAN })}>Barcha yangilarini ko‘rish <span aria-hidden="true">→</span></Link></div>
    {state === "ready" && products.length ? <div className="lux-arrival-grid">{products.map(product => <VehicleCard key={product._id} product={product} arrival />)}</div> : <SectionState state={state} empty="Yangi avtomobillar hozircha mavjud emas." retry={retry} />}
  </section>;
}
