import CloudDownloadIcon from "@mui/icons-material/CloudDownload";
import { Box } from "@mui/material";
import Button from "@mui/material/Button";
import { useEffect, useState } from "react";
import { Messages, serverApi } from "../../../lib/config";
import { sweetErrorHandling, sweetTopSmallSuccessAlert } from "../../../lib/sweetAlert";
import { T } from "../../../lib/types/common";
import { MemberUpdateInput } from "../../../lib/types/member";
import { useGlobals } from "../../hooks/useGlobal";
import MemberService from "../../services/MemberService";

export function Settings() {
  const {authMember , setAuthMember} = useGlobals();
  const [previewUrl, setPreviewUrl] = useState<string>();
  useEffect(() => () => { if (previewUrl) URL.revokeObjectURL(previewUrl); }, [previewUrl]);
  const [memberImage, setMemberImage] = useState<string> (
    authMember?.memberImage
    ? `${serverApi}/${authMember.memberImage}`
    : "/icons/default-user.svg"
  );

  const [memberUpdateInput, setMemberUpdateInput] =
  useState<MemberUpdateInput>({
     memberNick: authMember?.memberNick,
    memberPhone: authMember?.memberPhone,
    memberAddress: authMember?.memberAddress,
    memberDesc: authMember?.memberDesc,
    memberImage: authMember?.memberImage,
   


  });


const memberNickHandler = (e: T) => {
  memberUpdateInput.memberNick = e.target.value;
  setMemberUpdateInput({...memberUpdateInput});
};

const memberPhoneHandler = (e: T) => {
  memberUpdateInput.memberPhone = e.target.value;
  setMemberUpdateInput({...memberUpdateInput});
};

const memberAddressHandler = (e: T) => {
  memberUpdateInput.memberAddress = e.target.value;
  setMemberUpdateInput({...memberUpdateInput});
};

const memberDescriptionHandler = (e: T) => {
  memberUpdateInput.memberDesc = e.target.value;
  setMemberUpdateInput({...memberUpdateInput});
};


const handleSubmitButton = async () => {
  try {
    if (!authMember) throw new Error(Messages.error2);
    if (
      !memberUpdateInput.memberNick?.trim() ||
      !memberUpdateInput.memberPhone?.trim() ||
      memberUpdateInput.memberAddress === "" ||
      memberUpdateInput.memberDesc === "" 
    ) {
      throw new Error( Messages.error3);
    }

    const member = new MemberService();
    const  result = await member.updateMember(memberUpdateInput);
    setAuthMember(result);
    setMemberUpdateInput({ ...result });
    setMemberImage(result.memberImage ? `${serverApi}/${result.memberImage}` : "/icons/default-user.svg");
    setPreviewUrl(undefined);
    

    await sweetTopSmallSuccessAlert("Modified successfully!", 700);
    
  } catch (err) {
    setMemberImage(authMember?.memberImage ? `${serverApi}/${authMember.memberImage}` : "/icons/default-user.svg");
    setMemberUpdateInput(current => ({ ...current, memberImage: authMember?.memberImage }));
    setPreviewUrl(undefined);
    sweetErrorHandling(err).then();
  }
};

const handleImageViewer = (e: T) => {
 const file = e.target.files[0];
 e.target.value = "";
 if (!file) return;
 const fileType = file.type,
 validateImageTypes = ["image/jpg", "image/jpeg", "image/png"];

 if (!validateImageTypes.includes(fileType)) {
  sweetErrorHandling(new Error(Messages.error5)).then();
 } else if (file.size > 5 * 1024 * 1024) {
  sweetErrorHandling(new Error("Profile image must be 5 MiB or smaller.")).then();
 } else {
  if (file) {
    memberUpdateInput.memberImage = file;
    setMemberUpdateInput({...memberUpdateInput});
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    setMemberImage(url);
  }
 }
};
  return (
    <Box className={"settings"}>
      <Box className={"member-media-frame"}>
        <img src={memberImage} className={"mb-image"} alt="Member" />
        <div className={"media-change-box"}>
          <span>Upload image</span>
          <p>JPG, JPEG, PNG formats only! Maximum 5 MiB.</p>
          <div className={"up-del-box"}>
            <Button component="label" onChange={handleImageViewer}>
              <CloudDownloadIcon />
              <input type="file" accept="image/jpeg,image/png" aria-label="Profile image" hidden />
            </Button>
          </div>
        </div>
      </Box>
      <Box className={"input-frame"}>
        <div className={"long-input"}>
          <label className={"spec-label"} htmlFor="profile-nick">Username</label>
          <input
            className={"spec-input mb-nick"}
            type="text"
            placeholder={authMember?.memberNick}
            value={memberUpdateInput.memberNick ?? ""}
            id="profile-nick"
            name="memberNick"
            onChange={memberNickHandler}
          />
        </div>
      </Box>
      <Box className={"input-frame"}>
        <div className={"short-input"}>
          <label className={"spec-label"} htmlFor="profile-phone">Phone</label>
          <input
            className={"spec-input mb-phone"}
            type="text"
            placeholder={authMember?.memberPhone ?? "no phone" }
            value={memberUpdateInput.memberPhone ?? ""}
            id="profile-phone"
            name="memberPhone"
            onChange={memberPhoneHandler}
          />
        </div>
        <div className={"short-input"}>
          <label className={"spec-label"} htmlFor="profile-address">Address</label>
          <input
            className={"spec-input  mb-address"}
            type="text"
            placeholder={
              authMember?.memberAddress 
              ? authMember.memberAddress 
              : "no address"}

            value={memberUpdateInput.memberAddress ?? ""}
            id="profile-address"
            name="memberAddress"
            onChange={memberAddressHandler}
          />
        </div>
      </Box>
      <Box className={"input-frame"}>
        <div className={"long-input"}>
          <label className={"spec-label"} htmlFor="profile-desc">Description</label>
          <textarea
            className={"spec-textarea mb-description"}
            placeholder={authMember?.memberDesc ? authMember.memberDesc : "no description"}
            value={memberUpdateInput.memberDesc ?? ""}
            id="profile-desc"
            name="memberDesc"
            onChange={memberDescriptionHandler}
          />
        </div>
      </Box>
      <Box className={"save-box"}>
        <Button variant={"contained"} onClick={handleSubmitButton} className={"save-button"}>
          Save
        </Button>
      </Box>
    </Box>
  );
}
