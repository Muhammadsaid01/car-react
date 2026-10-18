import React, { ReactNode, useCallback, useEffect, useRef, useState } from "react";
import { GlobalContext } from "../hooks/useGlobal";
import { Member } from "../../lib/types/member";
import MemberService from "../services/MemberService";

const ContextProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [authMember, updateAuthMember] = useState<Member | null>(null);
  const [authReady, setAuthReady] = useState(false);
  const [orderBuilder, setOrderBuilder] = useState<Date>(new Date());

  const authRevision = useRef(0);
  const setAuthMember = useCallback((member: Member | null) => {
    authRevision.current += 1;
    updateAuthMember(member);
    setAuthReady(true);
    if (member) localStorage.setItem("memberData", JSON.stringify(member));
    else localStorage.removeItem("memberData");
  }, []);

  useEffect(() => {
    let active = true;
    const revision = authRevision.current;
    new MemberService().getMemberDetail().then(member => {
      if (!active || revision !== authRevision.current) return;
      localStorage.setItem("memberData", JSON.stringify(member));
      updateAuthMember(member);
    }).catch(() => {
      if (!active || revision !== authRevision.current) return;
      localStorage.removeItem("memberData");
      updateAuthMember(null);
    }).finally(() => { if (active && revision === authRevision.current) setAuthReady(true); });
    return () => { active = false; };
  }, []);

  return (
    <GlobalContext.Provider value={{ authMember, setAuthMember, authReady, orderBuilder, setOrderBuilder }}>
      {children}
    </GlobalContext.Provider>
  );
};
export default ContextProvider;
