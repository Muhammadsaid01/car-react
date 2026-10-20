import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useHistory, useLocation } from "react-router-dom";
import { Close, Search, Tune } from "@mui/icons-material";
import { Pagination, useMediaQuery } from "@mui/material";
import { catalogUrl, collectionOptions, readCatalogSearch, sortOptions } from "../../../lib/catalogSearch";
import { ProductCollection } from "../../../lib/enums/product.enum";
import { ProductInquiry } from "../../../lib/types/product";
import { CartItem } from "../../../lib/types/search";
import ProductService from "../../services/ProductService";
import { retrieveProducts } from "./selector";
import { setProducts } from "./slice";
import CatalogVehicleCard from "./CatalogVehicleCard";
import CatalogVideos from "./CatalogVideos";
import CatalogLocation from "./CatalogLocation";
import "../../../css/catalog.css";

type CatalogState = "loading" | "ready" | "error";
export default function Products({ onAdd }: { onAdd: (item: CartItem) => void }) {
  const history = useHistory();
  const location = useLocation();
  const dispatch = useDispatch();
  const products = useSelector(retrieveProducts);
  const inquiry = useMemo(() => readCatalogSearch(location.search), [location.search]);
  const [searchText, setSearchText] = useState(inquiry.search || "");
  const [state, setState] = useState<CatalogState>("loading");
  const [total, setTotal] = useState(0);
  const [retry, setRetry] = useState(0);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [draftCollection, setDraftCollection] = useState(inquiry.productCollection || "");
  const filterToggle = useRef<HTMLButtonElement>(null);
  const mobile = useMediaQuery("(max-width: 900px)");
  useEffect(() => { if (!mobile) setFiltersOpen(false); }, [mobile]);
  useEffect(() => {
    setSearchText(inquiry.search || "");
    setDraftCollection(inquiry.productCollection || "");
    setFiltersOpen(false);
  }, [inquiry]);

  function navigate(changes: Partial<ProductInquiry>, replace = false) {
    const next = { ...inquiry, ...changes };
    const url = catalogUrl({ search: next.search, collection: next.productCollection, order: next.order, page: next.page });
    if (replace) history.replace(url); else history.push(url);
  }
  useEffect(() => {
    let active = true;
    setState("loading");
    new ProductService().getProductPage(inquiry).then(data => {
      if (!active) return;
      const lastPage = Math.max(1, Math.ceil(data.total / inquiry.limit));
      if (inquiry.page > lastPage) {
        history.replace(catalogUrl({ search: inquiry.search, collection: inquiry.productCollection, order: inquiry.order, page: lastPage }));
        return;
      }
      dispatch(setProducts(data.products));
      setTotal(data.total);
      setState("ready");
    }).catch(() => {
      if (active) { dispatch(setProducts([])); setState("error"); }
    });
    return () => { active = false; };
  }, [dispatch, inquiry, retry, history]);

  function submit(event: FormEvent) { event.preventDefault(); navigate({ search: searchText.trim(), page: 1 }); }
  function clearSearch() { setSearchText(""); navigate({ search: "", page: 1 }); }
  function reset() {
    setSearchText(""); setDraftCollection(""); setFiltersOpen(false);
    history.push(catalogUrl());
  }
  function closeFilters() { setFiltersOpen(false); filterToggle.current?.focus(); }
  const pageCount = Math.ceil(total / inquiry.limit);
  const options = [collectionOptions[0], collectionOptions[1], collectionOptions[5], collectionOptions[2], collectionOptions[3], collectionOptions[4], collectionOptions[8], collectionOptions[6], collectionOptions[7], collectionOptions[9]];
  return <main className="lux-catalog" id="katalog">
    <section className="lux-catalog-intro lux-container" aria-labelledby="catalog-heading"><nav aria-label="Sahifa yo‘li"><Link to="/">Bosh sahifa</Link><span aria-hidden="true"> / </span><span aria-current="page">Avtomobillar</span></nav><h1 id="catalog-heading">Sizga mos avtomobilni toping.</h1><p>Tanlang. Solishtiring. Yangi yo‘lga chiqing.</p></section>
    <section className="lux-container lux-catalog-inventory" aria-label="Avtomobillar katalogi">
      <div className="lux-catalog-toolbar"><form onSubmit={submit} className="lux-catalog-search" role="search"><label htmlFor="catalog-search">Avtomobil qidirish</label><div><button type="submit" aria-label="Qidirish"><Search aria-hidden="true" /></button><input id="catalog-search" type="search" value={searchText} placeholder="Model, marka yoki kalit so‘z..." onChange={event => { setSearchText(event.target.value); if (!event.target.value) clearSearch(); }} />{searchText && <button type="button" aria-label="Qidiruvni tozalash" onClick={clearSearch}><Close aria-hidden="true" /></button>}</div></form>
      <div className="lux-catalog-sort"><label htmlFor="catalog-sort">Saralash</label><select id="catalog-sort" value={inquiry.order} onChange={event => navigate({ order: event.target.value, page: 1 })}>{sortOptions.map(option => <option key={option.value} value={option.value}>{option.label}</option>)}</select></div></div>
      <button ref={filterToggle} className="lux-catalog-filter-toggle" type="button" aria-label={filtersOpen ? "Filtrlarni yopish" : "Filtrlarni ochish"} aria-expanded={filtersOpen} aria-controls="catalog-filter-panel" onClick={() => { setDraftCollection(inquiry.productCollection || ""); setFiltersOpen(!filtersOpen); }}><Tune aria-hidden="true" />{filtersOpen ? "Filtrlarni yopish" : "Filtrlar"}{inquiry.productCollection && <span>1</span>}</button>
      <div className="lux-catalog-layout">
        <aside id="catalog-filter-panel" className={`lux-catalog-filters${filtersOpen ? " is-open" : ""}`} aria-label="Avtomobil filtrlari" onKeyDown={event => { if (event.key === "Escape" && filtersOpen) closeFilters(); }}><h2>Filtrlar</h2><fieldset><legend>Kuzov turi</legend>{options.map(option => <label key={option.value}><input type="radio" name="catalog-collection" value={option.value} checked={(filtersOpen ? draftCollection : inquiry.productCollection || "") === option.value} onChange={() => {
          if (filtersOpen) setDraftCollection(option.value);
          else navigate({ productCollection: option.value ? option.value as ProductCollection : undefined, page: 1 });
        }} /><span>{option.label}</span></label>)}</fieldset>
        <div className="lux-catalog-filter-actions"><button type="button" className="lux-catalog-apply" onClick={() => { navigate({ productCollection: draftCollection ? draftCollection as ProductCollection : undefined, page: 1 }); closeFilters(); }}>Filtrlarni qo‘llash</button><button type="button" className="lux-catalog-reset" onClick={() => { reset(); filterToggle.current?.focus(); }}>Tozalash</button></div></aside>
        <div className="lux-catalog-results" aria-busy={state === "loading"}>
          <div className="lux-catalog-results-bar"><p role="status" aria-live="polite">{state === "loading" ? "Avtomobillar yuklanmoqda…" : state === "ready" ? `${total} ta avtomobil` : "Natijalarni yuklab bo‘lmadi"}</p>{state === "ready" && pageCount > 1 && <Pagination count={pageCount} page={inquiry.page} onChange={(_event, page) => navigate({ page })} shape="rounded" siblingCount={1} aria-label="Katalog sahifalari" getItemAriaLabel={(type, page, selected) => type === "page" ? selected ? `Hozirgi sahifa: ${page}` : `${page}-sahifaga o‘tish` : type === "previous" ? "Oldingi sahifa" : type === "next" ? "Keyingi sahifa" : type === "first" ? "Birinchi sahifa" : "Oxirgi sahifa"} />}</div>
          {state === "loading" ? <div className="lux-catalog-grid lux-catalog-skeletons" aria-label="Avtomobillar yuklanmoqda">{Array.from({ length: inquiry.limit }, (_, index) => <div key={index} className="lux-catalog-skeleton" aria-hidden="true"><div /><span /><span /><span /></div>)}</div> : state === "error" ? <div className="lux-catalog-state" role="alert"><h2>Avtomobillarni yuklab bo‘lmadi.</h2><p>Ulanishni tekshiring va qayta urinib ko‘ring.</p><button type="button" className="lux-catalog-reset" onClick={() => setRetry(value => value + 1)}>Qayta urinish</button></div> : products.length === 0 ? <div className="lux-catalog-state"><h2>Avtomobillar topilmadi.</h2><p>Qidiruv yoki kuzov turini o‘zgartirib ko‘ring.</p><button type="button" className="lux-catalog-reset" onClick={reset}>Filtrlarni tozalash</button></div> : <div className="lux-catalog-grid">{products.map(product => <CatalogVehicleCard key={product._id} product={product} onAdd={onAdd} />)}</div>}
        </div>
      </div>
    </section>
    <CatalogVideos />
    <CatalogLocation />
  </main>;
}
