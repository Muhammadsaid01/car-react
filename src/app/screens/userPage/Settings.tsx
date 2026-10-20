import { ChangeEvent, FormEvent, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import UploadOutlinedIcon from "@mui/icons-material/UploadOutlined";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import HeadsetMicOutlinedIcon from "@mui/icons-material/HeadsetMicOutlined";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { serverApi } from "../../../lib/config";
import { Member } from "../../../lib/types/member";
import { useGlobals } from "../../hooks/useGlobal";
import MemberService from "../../services/MemberService";
import { imageError, ProfileErrors, ProfileField, profileDraft, profileFields, profileRequestError, PROFILE_TEXT_LIMIT, validateProfile } from "./profileValidation";

function Avatar({ name, src, alt }: { name: string; src?: string; alt: string }) {
  const [broken, setBroken] = useState(false);
  useEffect(() => { setBroken(false); }, [src]);
  const words = name.trim().split(/\s+/).filter(Boolean);
  const initials = (words.length > 1 ? words[0][0] + words[words.length - 1][0] : (words[0] ?? "?").slice(0, 2)).toLocaleUpperCase();
  return <div className="lux-profile-avatar">{src && !broken ? <img src={src} alt={alt} onError={() => setBroken(true)} /> : <span role="img" aria-label={`${alt}: ${initials}`}>{initials}</span>}</div>;
}

export function Settings({ member }: { member: Member }) {
  const { setAuthMember } = useGlobals();
  const saved = useRef(member);
  const [savedImage, setSavedImage] = useState(member.memberImage);
  const [draft, setDraft] = useState(() => profileDraft(member));
  const [file, setFile] = useState<File>();
  const [preview, setPreview] = useState<string>();
  const [errors, setErrors] = useState<ProfileErrors>({});
  const [uploadError, setUploadError] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [pending, setPending] = useState(false);
  const dirty = useRef(false), busy = useRef(false), mounted = useRef(true);
  const form = useRef<HTMLFormElement>(null);
  dirty.current = Boolean(file) || profileFields.some(key => draft[key] !== profileDraft(saved.current)[key]);
  useEffect(() => { mounted.current = true; return () => { mounted.current = false; }; }, []);
  useEffect(() => () => { if (preview) URL.revokeObjectURL(preview); }, [preview]);
  useEffect(() => {
    // Context refreshes may change points or the saved profile while a draft is being edited.
    const keepDraft = dirty.current;
    saved.current = member;
    setSavedImage(member.memberImage);
    if (!keepDraft) setDraft(profileDraft(member));
  }, [member]);
  const avatar = preview || (savedImage ? `${serverApi}/${savedImage}` : undefined);
  const reset = () => {
    if (busy.current) return;
    setDraft(profileDraft(saved.current)); setFile(undefined); setPreview(undefined);
    setErrors({}); setUploadError(""); setError(""); setSuccess("");
  };
  const change = (key: ProfileField, value: string) => {
    setDraft(current => ({ ...current, [key]: value }));
    setErrors(current => ({ ...current, [key]: undefined })); setError(""); setSuccess("");
  };
  const selectImage = (event: ChangeEvent<HTMLInputElement>) => {
    const selected = event.target.files?.[0]; event.target.value = "";
    if (!selected || busy.current) return;
    const invalid = imageError(selected);
    setUploadError(invalid ?? ""); setError(""); setSuccess("");
    setFile(invalid ? undefined : selected);
    setPreview(invalid ? undefined : URL.createObjectURL(selected));
  };
  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (busy.current) return;
    const invalid = validateProfile(draft); setErrors(invalid); setError(""); setSuccess("");
    const first = profileFields.find(key => invalid[key]);
    if (first) { form.current?.querySelector<HTMLInputElement>(`[name="${first}"]`)?.focus(); return; }
    busy.current = true; setPending(true);
    try {
      const result = await new MemberService().updateMember({ ...draft, ...(file ? { memberImage: file } : {}) });
      if (!mounted.current) return;
      saved.current = result; setDraft(profileDraft(result)); setSavedImage(result.memberImage);
      setFile(undefined); setPreview(undefined); setUploadError("");
      setAuthMember(result); setSuccess("O‘zgarishlar saqlandi.");
    } catch (failure) {
      if (!mounted.current) return;
      // Keep text edits, but discard an unsuccessful upload and return to the saved avatar.
      setFile(undefined); setPreview(undefined); setError(profileRequestError(failure));
    } finally {
      busy.current = false; if (mounted.current) setPending(false);
    }
  };
  const field = (key: ProfileField, label: string, placeholder: string, type = "text") => <div className="lux-profile-field">
    <label htmlFor={`profile-${key}`}>{label}</label>
    <input id={`profile-${key}`} name={key} type={type} autoComplete={key === "memberNick" ? "username" : key === "memberPhone" ? "tel" : "street-address"} value={draft[key]} maxLength={PROFILE_TEXT_LIMIT} required={key === "memberNick" || key === "memberPhone"} placeholder={placeholder} onChange={event => change(key, event.target.value)} aria-invalid={Boolean(errors[key])} aria-describedby={errors[key] ? `error-${key}` : undefined} />
    {errors[key] && <p id={`error-${key}`} className="lux-profile-field-error" role="alert">{errors[key]}</p>}
  </div>;
  return <>
    <div className="lux-profile-grid">
      <section className="lux-profile-card lux-profile-editor" aria-labelledby="profile-form-title">
        <h2 id="profile-form-title">Profil ma’lumotlari</h2>
        <form ref={form} onSubmit={submit} noValidate aria-busy={pending}>
          <fieldset disabled={pending}>
            <legend className="lux-profile-sr">Profilni tahrirlash</legend>
            <div className="lux-profile-upload">
              <Avatar name={draft.memberNick} src={avatar} alt="Profil rasmi" />
              <div><h3>Profil rasmi</h3><p id="profile-image-hint">JPG, JPEG yoki PNG. Maksimal hajm: 5 MiB.</p>
                <label className="lux-profile-upload-button"><UploadOutlinedIcon aria-hidden="true" />Rasm yuklash<input type="file" accept=".jpg,.jpeg,.png,image/jpeg,image/png" aria-label="Profil rasmini tanlash" aria-describedby={`profile-image-hint${uploadError ? " profile-image-error" : ""}`} aria-invalid={Boolean(uploadError)} onChange={selectImage} /></label>
                {uploadError && <p id="profile-image-error" className="lux-profile-field-error" role="alert">{uploadError}</p>}
              </div>
            </div>
            <div className="lux-profile-fields">
              {field("memberNick", "Foydalanuvchi nomi", "Foydalanuvchi nomingiz")}
              <div className="lux-profile-field-row">{field("memberPhone", "Telefon raqami", "Telefon raqamingizni kiriting", "tel")}{field("memberAddress", "Manzil", "Manzilingizni kiriting")}</div>
              <div className="lux-profile-field"><label htmlFor="profile-memberDesc">O‘zingiz haqingizda</label><textarea id="profile-memberDesc" name="memberDesc" value={draft.memberDesc} maxLength={PROFILE_TEXT_LIMIT} placeholder="Qisqacha ma’lumot yozing..." onChange={event => change("memberDesc", event.target.value)} aria-invalid={Boolean(errors.memberDesc)} aria-describedby={`profile-desc-count${errors.memberDesc ? " error-memberDesc" : ""}`} />{errors.memberDesc && <p id="error-memberDesc" className="lux-profile-field-error" role="alert">{errors.memberDesc}</p>}<span id="profile-desc-count" className="lux-profile-count">{draft.memberDesc.length} / {PROFILE_TEXT_LIMIT}</span></div>
            </div>
            <div className="lux-profile-actions"><p>O‘zgarishlarni saqlashni unutmang.</p><div><button disabled={pending} className="lux-profile-outline" type="button" onClick={reset}>Bekor qilish</button><button disabled={pending} className="lux-profile-save" type="submit">{pending ? "Saqlanmoqda…" : "O‘zgarishlarni saqlash"}</button></div></div>
          </fieldset>
          {error && <p className="lux-profile-message lux-profile-error" role="alert">{error}</p>}
          <p className="lux-profile-message lux-profile-success" role="status">{success || (pending ? "Ma’lumotlar saqlanmoqda…" : "")}</p>
        </form>
      </section>
      <aside className="lux-profile-sidebar">
        <section className="lux-profile-card lux-profile-preview" aria-labelledby="profile-preview-title"><h2 id="profile-preview-title">Profil ko‘rinishi</h2><div className="lux-profile-identity"><Avatar name={draft.memberNick} src={avatar} alt="Profil ko‘rinishidagi rasm" /><h3>{draft.memberNick.trim() || "Foydalanuvchi nomi"}</h3><p>Shaxsiy hisob</p></div><div className="lux-profile-preview-details"><p><LocationOnOutlinedIcon aria-hidden="true" /><span>{draft.memberAddress.trim() || "Manzil kiritilmagan"}</span></p><p><DescriptionOutlinedIcon aria-hidden="true" /><span>{draft.memberDesc.trim() || "Tavsif kiritilmagan"}</span></p></div></section>
        <section className="lux-profile-helper" style={{ backgroundImage: "linear-gradient(100deg,#191d1cfa,#191d1cc9),url(/assets/luxavto/video-poster.jpg)" }}><InfoOutlinedIcon aria-hidden="true" /><h2>Profilingizni yangilang</h2><p>Dolzarb ma’lumotlar buyurtmalarni boshqarishni osonlashtiradi.</p><Link to="/orders">Buyurtmalarim <ArrowForwardIcon aria-hidden="true" /></Link></section>
      </aside>
    </div>
    <section className="lux-profile-help"><div className="lux-profile-help-icon"><HeadsetMicOutlinedIcon aria-hidden="true" /></div><div><h2>Savolingiz bormi?</h2><p>Hisobingiz, buyurtmalar yoki boshqa savollar bo‘yicha yordam markazimizga murojaat qiling.</p></div><Link className="lux-profile-outline" to="/help">Yordam markazi <ArrowForwardIcon aria-hidden="true" /></Link></section>
  </>;
}
