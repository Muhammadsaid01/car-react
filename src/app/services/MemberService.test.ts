import axios from "axios";
import MemberService from "./MemberService";
import { Member, MemberUpdateInput } from "../../lib/types/member";
jest.mock("axios");
const request = axios as jest.MockedFunction<typeof axios>;
afterEach(() => { jest.resetAllMocks(); localStorage.clear(); });
test("profile multipart allowlists editable fields and uploads only actual files, never saved or preview paths", async () => {
  const response = { _id: "server-id", memberNick: "Server name", memberImage: "uploads/members/new.png" } as Member;
  request.mockResolvedValue({ data: response, status: 200, statusText: "OK", headers: {}, config: {} });
  for (const memberImage of ["blob:do-not-send", "uploads/members/saved.png", new File(["image"], "avatar.png", { type: "image/png" })]) {
    await new MemberService().updateMember({ memberNick: "Driver", memberPhone: "+1 555 0100", memberAddress: "", memberDesc: "", memberImage, _id: "attacker-id", memberType: "ADMIN", memberStatus: "ACTIVE", memberPoints: 999, memberPassword: "must-not-send" } as MemberUpdateInput);
    const config = request.mock.calls[request.mock.calls.length - 1][1]!;
    const body = config.data as FormData;
    expect(Array.from(body.keys()).sort()).toEqual(["memberNick", "memberPhone", "memberAddress", "memberDesc", ...(memberImage instanceof File ? ["memberImage"] : [])].sort());
    expect(config.withCredentials).toBe(true);
    expect(body.get("memberImage")).toBe(memberImage instanceof File ? memberImage : null);
    expect(JSON.parse(localStorage.getItem("memberData")!)).toEqual(response);
  }
});
