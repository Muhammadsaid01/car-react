import { useSelector } from "react-redux";
import { serverApi } from "../../../lib/config";
import { retrieveTopUsers } from "./selector";
import SectionState, { LoadState } from "./SectionState";
export default function ActiveUsers({ state, retry }: { state: LoadState; retry: () => void }) {
  const members = useSelector(retrieveTopUsers);
  return <section className="lux-container lux-section lux-community" aria-labelledby="community-heading">
    <div><h2 id="community-heading">Avtomobilga mehr<br />bizni birlashtiradi.</h2><p>Bir xil qiziqishlar, yangi tanishuvlar va yo‘lga bo‘lgan mehr.</p></div>
    <div className="lux-community-members">{state === "ready" && members.length ? members.slice(0, 3).map(member => <figure key={member._id}><img width="140" height="140" loading="lazy" src={member.memberImage ? `${serverApi}/${member.memberImage}` : "/icons/default-user.svg"} alt={member.memberNick} onError={e => { e.currentTarget.onerror = null; e.currentTarget.src = "/icons/default-user.svg"; }} /><figcaption>{member.memberNick}</figcaption></figure>) : <SectionState state={state} empty="Hozircha faol a’zolar yo‘q. Hamjamiyatimiz sizni kutmoqda." retry={retry} />}</div>
  </section>;
}
