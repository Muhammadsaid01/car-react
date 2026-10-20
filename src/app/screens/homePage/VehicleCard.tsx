import { Link } from "react-router-dom";
import { vehicleImageUrl } from "../../../lib/vehiclePresentation";
import { ProductCondition } from "../../../lib/enums/product.enum";
import { Product } from "../../../lib/types/product";
export default function VehicleCard({ product, arrival = false, metadata, showPrice = true }: { product: Product; arrival?: boolean; metadata?: string[]; showPrice?: boolean }) {
  const fallback = "/assets/luxavto/car-placeholder.svg";
  const image = typeof product.productImages?.[0] === "string" ? vehicleImageUrl(product.productImages[0]) : undefined;
  return <article className={`lux-vehicle-card${arrival ? " lux-arrival-card" : ""}`}>
    <Link to={`/products/${product._id}`} className="lux-vehicle-image" aria-label={`${product.productName} — batafsil`}>
      <img width="720" height="440" loading="lazy" src={image || fallback} alt={product.productName} onError={event => { if (event.currentTarget.getAttribute("src") !== fallback) event.currentTarget.src = fallback; }} />
      {arrival && product.productCondition === ProductCondition.NEW && <span className="lux-new-badge">Yangi</span>}
    </Link>
    <div className="lux-vehicle-copy"><h3><Link to={`/products/${product._id}`}>{product.productName}</Link></h3>
      <p className="lux-vehicle-meta">{metadata ? metadata.map((value, index) => <span key={`${index}-${value}`}>{value}</span>) : <>{product.productYear > 0 && <span>{product.productYear}</span>}{Number.isFinite(product.productMileage) && <span>{product.productMileage.toLocaleString("uz-UZ")} km</span>}</>}</p>
      <div className="lux-vehicle-bottom">{showPrice && <strong>{new Intl.NumberFormat("uz-UZ", { style: "currency", currency: "USD", maximumFractionDigits: 2 }).format(product.productPrice)}</strong>}<Link to={`/products/${product._id}`} aria-label={`${product.productName} haqida batafsil`}>Batafsil <span aria-hidden="true">→</span></Link></div>
    </div>
  </article>;
}
