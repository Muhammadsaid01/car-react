/* eslint-disable jsx-a11y/alt-text */
import { useEffect } from "react";
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import TelegramIcon from "@mui/icons-material/Telegram";
import YouTubeIcon from "@mui/icons-material/YouTube";
import { Box, Container, Stack } from "@mui/material";
import { useHistory } from "react-router-dom";
import "../../../css/userPage.css";
import { serverApi } from "../../../lib/config";
import { MemberType } from "../../../lib/enums/member.enum";
import { useGlobals } from "../../hooks/useGlobal";
import { Settings } from "./Settings";

export default function UserPage() {
  const history = useHistory();
  const {authMember, authReady} = useGlobals();

  useEffect(() => {
    if (authReady && !authMember) history.replace("/");
  }, [authReady, authMember, history]);
  if (!authReady || !authMember) return null;
  return (
    <div className={"user-page"}>
      <Container>
        <Stack className={"my-page-frame"}>
          <Stack className={"my-page-left"}>
            <Box display={"flex"} flexDirection={"column"}>
              <Box className={"menu-name"}>Modify Member Details</Box>
              <Box className={"menu-content"}>
                <Settings />
              </Box>
            </Box>
          </Stack>

          <Stack className={"my-page-right"}>
            <Box className={"order-info-box"}>
              <Box
                display={"flex"}
                flexDirection={"column"}
                alignItems={"center"}
              >
                <div className={"order-user-img"}>
                  <img
                    src={authMember?.memberImage ? `${serverApi}/${authMember.memberImage}`: "/icons/default-user.svg"}
                    className={"order-user-avatar"}
                  />
                  <div className={"order-user-icon-box"}>
                    <img src={
                      authMember?.memberType === MemberType.ADMIN
                       ? "/icons/restaurant.svg"
                        :"/icons/user-badge.svg"
                        } />
                  </div>
                </div>
                <span className={"order-user-name"}>{authMember?.memberNick}</span>
                <span className={"order-user-prof"}>{authMember?.memberType}</span>
                <span className={"order-user-prof"}>{authMember?.memberAddress ?authMember.memberAddress:"no address"}</span>
              </Box>
              <Box className={"user-media-box"}>
                <FacebookIcon />
                <InstagramIcon />
                <TelegramIcon />
                <YouTubeIcon />
              </Box>
              <p className={"user-desc"}>{authMember?.memberDesc ? authMember.memberDesc : " no description"} </p>
            </Box>
          </Stack>
        </Stack>
      </Container>
    </div>
  );
}
