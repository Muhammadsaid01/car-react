import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowForward, HeadsetMicOutlined, RemoveRedEyeOutlined, ShoppingCartOutlined } from "@mui/icons-material";
import { ProductStatus } from "../../../lib/enums/product.enum";
import { Product } from "../../../lib/types/product";
import { CartItem } from "../../../lib/types/search";
import { validVehicleId, vehicleBody, vehicleFuel, vehicleNumber, vehiclePrice, vehicleSpecs } from "../../../lib/vehiclePresentation";
import ProductService from "../../services/ProductService";
import VehicleCard from "../homePage/VehicleCard";
import VehicleGallery from "./VehicleGallery";
import "../../../css/vehicle-detail.css";

type DetailState = "loading" | "ready" | "invalid" | "missing" | "error";
interface ChosenProductsProps { onAdd: (item: CartItem) => void; cartItems: CartItem[]; }

export default function ChosenProduct(props: ChosenProductsProps) {
  const { productId } = useParams<{ productId: string }>();
  // A route change discards its gallery, requests, feedback and previously loaded product together.
  return <VehicleDetail key={productId} productId={productId} {...props} />;
}

function VehicleDetail({ productId, onAdd, cartItems }: ChosenProductsProps & { productId: string }) {
  const [state, setState] = useState<DetailState>(validVehicleId(productId) ? "loading" : "invalid");
  const [product, setProduct] = useState<Product>();
  const [retry, setRetry] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [cartError, setCartError] = useState("");
  const [cooldown, setCooldown] = useState(false);
  const adding = useRef(false);
  const timer = useRef<ReturnType<typeof setTimeout>>();
  const request = useRef<{ attempt: number; promise: Promise<Product> }>();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
    return () => { if (timer.current) clearTimeout(timer.current); };
  }, []);
  useEffect(() => {
    if (!validVehicleId(productId)) return;
    let active = true;
    setState("loading"); setProduct(undefined);
    // Reuse the in-flight GET during React StrictMode's effect replay; ordinary renders do not track another view.
    if (!request.current || request.current.attempt !== retry) request.current = { attempt: retry, promise: new ProductService().getProduct(productId) };
    request.current.promise.then(data => {
      if (!active) return;
      if (!data) { setState("missing"); return; }
      if (typeof data._id !== "string" || data._id.toLowerCase() !== productId.toLowerCase() || typeof data.productName !== "string" || !data.productName.trim()) throw new Error("Invalid vehicle response");
      setProduct(data); setState("ready");
    }).catch((failure: unknown) => {
      if (!active) return;
      const status = (failure as { response?: { status?: number } })?.response?.status;
      setState(status === 404 ? "missing" : "error");
    });
    return () => { active = false; };
  }, [productId, retry]);
  useEffect(() => {
    const previous = document.title;
    document.title = product ? `${product.productName} | LuxAvto` : "Avtomobil tafsilotlari | LuxAvto";
    return () => { document.title = previous; };
  }, [product]);

  const quantity = product ? cartItems.find(item => item._id === product._id)?.quantity ?? 0 : 0;
  const priceCents = product ? Math.round(product.productPrice * 100) : NaN;
  const available = product?.productStatus === ProductStatus.ACTIVE;
  const validPrice = Number.isSafeInteger(priceCents) && priceCents > 0 && Number.isSafeInteger(priceCents + 500);
  const add = () => {
    if (!product || state !== "ready" || !available || !validPrice || quantity >= 100 || adding.current) return;
    adding.current = true; setCooldown(true); setCartError("");
    try {
      onAdd({ _id: product._id, quantity: 1, name: product.productName, price: product.productPrice, image: Array.isArray(product.productImages) ? product.productImages.find(path => typeof path === "string" && Boolean(path.trim())) ?? "" : "" });
      setFeedback("Avtomobil savatga qo‘shildi.");
      timer.current = setTimeout(() => { adding.current = false; setCooldown(false); }, 750);
    } catch {
      adding.current = false; setCooldown(false); setFeedback(""); setCartError("Savatni yangilab bo‘lmadi. Qayta urinib ko‘ring.");
    }
  };
  const specs = product ? vehicleSpecs(product) : [];
  const metadata = product ? [vehicleBody(product.productCollection), vehicleFuel(product.productCategory)].filter(Boolean).join(" • ") : "";
  const names: Record<Exclude<DetailState, "loading" | "ready">, { title: string; text: string }> = {
    invalid: { title: "Avtomobil havolasi noto‘g‘ri.", text: "Katalogdan avtomobilni qayta tanlang." },
    missing: { title: "Avtomobil topilmadi.", text: "Bu avtomobil mavjud emas yoki hozir sotuvda emas." },
    error: { title: "Avtomobilni yuklab bo‘lmadi.", text: "Ulanishni tekshiring va qayta urinib ko‘ring." },
  };
  return <main className="lux-detail">
    <div className="lux-container">
      <nav className="lux-detail-breadcrumb" aria-label="Sahifa yo‘li"><Link to="/">Bosh sahifa</Link><span aria-hidden="true">/</span><Link to="/products">Avtomobillar</Link><span aria-hidden="true">/</span><span aria-current="page">{product?.productName ?? "Avtomobil tafsilotlari"}</span></nav>
      {state === "loading" ? <section className="lux-detail-loading" aria-busy="true" aria-label="Avtomobil yuklanmoqda"><p className="lux-detail-sr" role="status">Avtomobil ma’lumotlari yuklanmoqda…</p><div className="lux-detail-overview" aria-hidden="true"><div><div className="lux-detail-skeleton lux-detail-skeleton-image" /><div className="lux-detail-skeleton-thumbs">{[0, 1, 2, 3].map(key => <div className="lux-detail-skeleton" key={key} />)}</div></div><div className="lux-detail-skeleton-copy"><div className="lux-detail-skeleton" /><div className="lux-detail-skeleton" /><div className="lux-detail-skeleton" /><div className="lux-detail-skeleton" /><div className="lux-detail-skeleton" /></div></div></section> : state !== "ready" || !product ? <section className="lux-detail-state" role="alert"><h1>{names[state as keyof typeof names]?.title ?? names.error.title}</h1><p>{names[state as keyof typeof names]?.text ?? names.error.text}</p><div>{state === "error" && <button className="lux-detail-button lux-detail-gold" type="button" onClick={() => setRetry(value => value + 1)}>Qayta urinish</button>}<Link className="lux-detail-button lux-detail-outline" to="/products">Katalogga qaytish</Link></div></section> : <>
        <section className="lux-detail-overview" aria-labelledby="vehicle-name">
          <VehicleGallery key={product._id} name={product.productName} paths={Array.isArray(product.productImages) ? product.productImages : []} />
          <div className="lux-detail-info"><p className="lux-detail-eyebrow">AVTOMOBIL TAFSILOTLARI</p><h1 id="vehicle-name">{product.productName}</h1>
            <div className="lux-detail-meta">{metadata && <p>{metadata}</p>}{Number.isSafeInteger(product.productViews) && product.productViews >= 0 && <p className="lux-detail-views"><RemoveRedEyeOutlined aria-hidden="true" />Ko‘rishlar: {vehicleNumber(product.productViews)}</p>}</div>
            <div className="lux-detail-price"><p>Narxi</p><strong>{vehiclePrice(product.productPrice)}</strong></div>
            {specs.some(spec => spec.key) && <dl className="lux-detail-highlights">{specs.filter(spec => spec.key).map(spec => <div key={spec.label}><dt>{spec.label}</dt><dd>{spec.value}</dd></div>)}</dl>}
            <div className="lux-detail-actions"><button className="lux-detail-button lux-detail-gold" type="button" onClick={add} disabled={!available || !validPrice || cooldown || quantity >= 100}><ShoppingCartOutlined aria-hidden="true" />{cooldown ? "Savatga qo‘shildi" : "Savatga qo‘shish"}</button><Link className="lux-detail-button lux-detail-outline" to="/products">Katalogga qaytish</Link></div>
            {!available && <p className="lux-detail-availability">Bu avtomobil hozir sotuvda emas.</p>}{available && !validPrice && <p className="lux-detail-availability">Bu avtomobil uchun buyurtma narxi tasdiqlanmagan.</p>}{quantity > 0 && <p className="lux-detail-cart-quantity">Savatda: {quantity} ta{quantity >= 100 ? " (maksimal miqdor)" : ""}.</p>}<p className="lux-detail-feedback" role="status" aria-live="polite">{feedback}</p>{cartError && <p className="lux-detail-cart-error" role="alert">{cartError}</p>}
          </div>
        </section>
        <section className="lux-detail-description" aria-label="Avtomobil ma’lumotlari"><div><h2>Avtomobil haqida</h2><p className="lux-detail-description-intro">Avtomobilning tafsilotlari va texnik ma’lumotlari bilan tanishing.</p><p className="lux-detail-description-text">{typeof product.productDesc === "string" && product.productDesc.trim() ? product.productDesc : "Bu avtomobil uchun tavsif hali kiritilmagan."}</p></div><div className="lux-detail-technical"><h2>Texnik ma’lumotlar</h2>{specs.length ? <dl>{specs.map(spec => <div key={spec.label}><dt>{spec.label}</dt><dd>{spec.value}</dd></div>)}</dl> : <p>Texnik ma’lumotlar hali kiritilmagan.</p>}</div></section>
      </>}
    </div>
    {state === "ready" && product && <><section className="lux-detail-help"><div className="lux-container"><div className="lux-detail-help-icon"><HeadsetMicOutlined aria-hidden="true" /></div><div><h2>Savolingiz bormi?</h2><p>Avtomobil haqida qo‘shimcha ma’lumot oling.</p></div><Link className="lux-detail-button lux-detail-outline" to="/help">Yordam markazi <ArrowForward aria-hidden="true" /></Link></div></section><OtherVehicles key={product._id} currentId={product._id} /></>}
  </main>;
}

function OtherVehicles({ currentId }: { currentId: string }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [state, setState] = useState<"loading" | "ready" | "error">("loading");
  const [retry, setRetry] = useState(0);
  const request = useRef<{ attempt: number; promise: Promise<Product[]> }>();
  useEffect(() => {
    let active = true; setState("loading");
    if (!request.current || request.current.attempt !== retry) request.current = { attempt: retry, promise: new ProductService().getProducts({ page: 1, limit: 4, order: "createdAt" }) };
    request.current.promise.then(data => {
      if (!active) return;
      const unique = new Set<string>();
      setProducts(data.filter(product => {
        if (!product || typeof product._id !== "string" || product._id.toLowerCase() === currentId.toLowerCase() || unique.has(product._id) || !validVehicleId(product._id) || !product.productName?.trim() || product.productStatus !== ProductStatus.ACTIVE) return false;
        unique.add(product._id); return true;
      }).slice(0, 3)); setState("ready");
    }).catch(() => { if (active) setState("error"); });
    return () => { active = false; };
  }, [currentId, retry]);
  if (state === "ready" && !products.length) return null;
  return <section className="lux-detail-related lux-container" aria-labelledby="other-vehicles-title"><div className="lux-detail-related-heading"><h2 id="other-vehicles-title">Boshqa avtomobillar</h2><Link to="/products">Barchasini ko‘rish <ArrowForward aria-hidden="true" /></Link></div>{state === "loading" ? <div className="lux-detail-related-loading" role="status">Boshqa avtomobillar yuklanmoqda…</div> : state === "error" ? <div className="lux-detail-related-error" role="alert"><p>Boshqa avtomobillarni yuklab bo‘lmadi.</p><button className="lux-detail-button lux-detail-outline" type="button" onClick={() => setRetry(value => value + 1)}>Yana urinib ko‘rish</button></div> : <div className="lux-detail-related-grid">{products.map(product => <VehicleCard key={product._id} product={product} metadata={[vehicleBody(product.productCollection), vehicleFuel(product.productCategory)].filter((value): value is string => Boolean(value))} showPrice={false} />)}</div>}</section>;
}
