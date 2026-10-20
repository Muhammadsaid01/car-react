import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Modal from "@material-ui/core/Modal";
import Backdrop from "@material-ui/core/Backdrop";
import Fade from "@material-ui/core/Fade";
import { Button, Fab, Stack, TextField, Typography } from "@mui/material";
import LoginIcon from "@mui/icons-material/Login";
import { Messages } from "../../../lib/config";
import MemberService from "../../services/MemberService";
import { useGlobals } from "../../hooks/useGlobal";

const useStyles = makeStyles(theme => ({
  modal: { display: "flex", alignItems: "center", justifyContent: "center" },
  paper: { backgroundColor: theme.palette.background.paper, border: "2px solid #000", boxShadow: theme.shadows[5], padding: theme.spacing(2) },
}));
interface AuthenticationModalProps {
  signupOpen: boolean; loginOpen: boolean;
  handleSignupClose: () => void; handleLoginClose: () => void;
  onSignupRequest: () => void; onLoginRequest: () => void;
}
export default function AuthenticationModal(props: AuthenticationModalProps) {
  const { signupOpen, loginOpen, handleSignupClose, handleLoginClose } = props;
  const classes = useStyles();
  const { setAuthMember } = useGlobals();
  const [memberNick, setMemberNick] = useState("");
  const [memberPhone, setMemberPhone] = useState("");
  const [memberPassword, setMemberPassword] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  useEffect(() => {
    setMemberNick(""); setMemberPhone(""); setMemberPassword(""); setError("");
  }, [signupOpen, loginOpen]);

  const submit = async (event: React.FormEvent, signup: boolean) => {
    event.preventDefault();
    if (pending) return;
    if (!memberNick.trim() || !memberPassword || (signup && !memberPhone.trim())) { setError("Barcha maydonlarni to‘ldiring!"); return; }
    setPending(true); setError("");
    try {
      const service = new MemberService();
      const member = signup
        ? await service.signUp({ memberNick: memberNick.trim(), memberPhone: memberPhone.trim(), memberPassword })
        : await service.login({ memberNick: memberNick.trim(), memberPassword });
      setAuthMember(member);
      signup ? handleSignupClose() : handleLoginClose();
    } catch (err: any) {
      setError(err.response?.data?.message || Messages.error1);
    } finally { setPending(false); }
  };

  const renderModal = (signup: boolean) => {
    const open = signup ? signupOpen : loginOpen;
    const prefix = signup ? "signup" : "login";
    const title = signup ? "Ro‘yxatdan o‘tish" : "Kirish";
    return <Modal aria-labelledby={`${prefix}-title`} className={classes.modal} open={open}
      onClose={pending ? undefined : signup ? handleSignupClose : handleLoginClose}
      closeAfterTransition BackdropComponent={Backdrop} BackdropProps={{ timeout: 500 }}>
      <Fade in={open}>
        <Stack className={classes.paper} direction="row" sx={{ width: signup ? 800 : 700, maxWidth: "calc(100vw - 32px)", maxHeight: "calc(100vh - 32px)", overflowY: "auto" }}>
          <Stack component="img" src="/assets/luxavto/hero.jpg" alt="" sx={{ width: "55%", objectFit: "cover", borderRadius: "10px", display: { xs: "none", sm: "block" } }} />
          <Stack component="form" noValidate onSubmit={event => submit(event, signup)} sx={{ ml: { xs: 0, sm: 3 }, flex: 1, minWidth: 0, alignItems: "center", gap: 2 }}>
            <h2 id={`${prefix}-title`}>{title}</h2>
            <TextField fullWidth id={`${prefix}-username`} label="Foydalanuvchi nomi" autoComplete="username" value={memberNick} onChange={event => setMemberNick(event.target.value)} />
            {signup && <TextField fullWidth id="signup-phone" label="Telefon" autoComplete="tel" value={memberPhone} onChange={event => setMemberPhone(event.target.value)} />}
            <TextField fullWidth id={`${prefix}-password`} label="Parol" type="password" autoComplete={signup ? "new-password" : "current-password"} value={memberPassword} onChange={event => setMemberPassword(event.target.value)} />
            {error && <Typography role="alert" color="error">{error}</Typography>}
            <Fab type="submit" disabled={pending} sx={{ mt: 1, minWidth: 120, width: "auto", px: 2, flexShrink: 0 }} variant="extended" color="primary"><LoginIcon sx={{ mr: 1 }} />{title}</Fab>
            <Button type="button" disabled={pending} onClick={signup ? props.onLoginRequest : props.onSignupRequest}>{signup ? "Hisobingiz bormi? Kirish" : "Hisobingiz yo‘qmi? Ro‘yxatdan o‘tish"}</Button>
          </Stack>
        </Stack>
      </Fade>
    </Modal>;
  };
  return <>{renderModal(true)}{renderModal(false)}</>;
}
