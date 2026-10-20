import { AddShoppingCart } from "@mui/icons-material";
import { Link } from "react-router-dom";
import { serverApi } from "../../../lib/config";
import { Product } from "../../../lib/types/product";
import { CartItem } from "../../../lib/types/search";

export default function CatalogVehicleCard({ product, onAdd }: { product: Product; onAdd: (item: CartItem) => void }) {
  const detail = `/products/${product._id}`;
  const fallback = "/assets/luxavto/car-placeholder.svg";
  return <article className="lux-catalog-card">
    <Link to={detail} className="lux-catalog-card-image" aria-label={`${product.productName} — batafsil`}>
      <img src={product.productImages?.[0] ? `${serverApi}/${product.productImages[0]}` : fallback} width="600" height="540" alt={product.productName} loading="lazy" onError={event => { if (event.currentTarget.getAttribute("src") !== fallback) event.currentTarget.src = fallback; }} />
    </Link>
    <div className="lux-catalog-card-copy">
      <h2><Link to={detail}>{product.productName}</Link></h2>
      <p className="lux-catalog-card-meta">{product.productYear > 0 && <span>{product.productYear}</span>}{Number.isFinite(product.productMileage) && <span>{product.productMileage.toLocaleString("uz-UZ")} km</span>}</p>
      <p className="lux-catalog-price">{new Intl.NumberFormat("uz-UZ", { style: "currency", currency: "USD", maximumFractionDigits: 2 }).format(product.productPrice)}</p>
      <div className="lux-catalog-card-actions"><Link to={detail} aria-label={`${product.productName} haqida batafsil`}>Batafsil <span aria-hidden="true">→</span></Link><button type="button" aria-label={`${product.productName} — savatga qo‘shish`} onClick={() => onAdd({ _id: product._id, name: product.productName, price: product.productPrice, quantity: 1, image: product.productImages?.[0] || "" })}><AddShoppingCart aria-hidden="true" /></button></div>
    </div>
  </article>;
}
