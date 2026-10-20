import { FormEvent, useState } from "react";
import { useHistory } from "react-router-dom";
import { DirectionsCarOutlined, Search, Tune } from "@mui/icons-material";
import { catalogUrl, collectionOptions, sortOptions } from "../../../lib/catalogSearch";
export default function SearchPanel() {
  const history = useHistory();
  const [search, setSearch] = useState("");
  const [collection, setCollection] = useState("");
  const [order, setOrder] = useState("createdAt");
  function submit(event: FormEvent) { event.preventDefault(); history.push(catalogUrl({ search, collection, order })); }
  return <div className="lux-container lux-search-wrap"><form className="lux-search-panel" onSubmit={submit} aria-label="Avtomobil qidiruvi">
    <div className="lux-search-field"><Search aria-hidden="true" /><div><label htmlFor="home-search">Qidiruv</label><input id="home-search" type="search" placeholder="Model, marka yoki kalit so‘z..." value={search} onChange={e => setSearch(e.target.value)} /></div></div>
    <div className="lux-search-field"><DirectionsCarOutlined aria-hidden="true" /><div><label htmlFor="home-collection">Kuzov turi</label><select id="home-collection" value={collection} onChange={e => setCollection(e.target.value)}>{collectionOptions.map(option => <option key={option.value} value={option.value}>{option.label}</option>)}</select></div></div>
    <div className="lux-search-field"><Tune aria-hidden="true" /><div><label htmlFor="home-order">Saralash</label><select id="home-order" value={order} onChange={e => setOrder(e.target.value)}>{sortOptions.map(option => <option key={option.value} value={option.value}>{option.label}</option>)}</select></div></div>
    <button type="submit" className="lux-button lux-button-dark"><Search aria-hidden="true" />Qidirish</button>
  </form></div>;
}
