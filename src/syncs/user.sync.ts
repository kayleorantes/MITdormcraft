import { Requesting, Session, UserAccount } from "@concepts";
import { actions, Sync, Vars } from "@engine";
import { sanitizeUser } from "./helpers.ts";

export const UpdateProfileRequest: Sync = ({
  request,
  session,
  bio,
  userID,
}: Vars) => ({
  when: actions([
    Requesting.request,
    { path: "/UserAccount/updateUserProfile", session, bio },
    { request },
  ]),
  then: actions(
    [Session.getSessionUser, { session }, { userID }],
  ),
});

export const UpdateProfileAuthorize: Sync = ({
  request,
  userID,
  bio,
  success,
  user,
}: Vars) => ({
  when: actions(
    [Requesting.request, { path: "/UserAccount/updateUserProfile" }, {
      request,
    }],
    [Session.getSessionUser, {}, { userID }],
  ),
  where: (frames) =>
    frames.filter((frame) => typeof frame[userID] === "string"),
  then: actions(
    [UserAccount.updateUserProfile, { userID, bio }, { success }],
    [UserAccount.getUser, { userID }, { user }],
  ),
});

export const UpdateProfileRespond: Sync = ({
  request,
  success,
  user,
}: Vars) => ({
  when: actions(
    [Requesting.request, { path: "/UserAccount/updateUserProfile" }, {
      request,
    }],
    [UserAccount.updateUserProfile, {}, { success }],
    [UserAccount.getUser, {}, { user }],
  ),
  where: (frames) =>
    frames.filter((frame) => frame[success] === true).map((frame) => ({
      ...frame,
      [user]: sanitizeUser(frame[user] as Parameters<typeof sanitizeUser>[0]),
    })),
  then: actions([
    Requesting.respond,
    { request, success: true, user },
  ]),
});

export const UpdateProfileFailure: Sync = ({
  request,
  success,
  error,
}: Vars) => ({
  when: actions(
    [Requesting.request, { path: "/UserAccount/updateUserProfile" }, {
      request,
    }],
    [UserAccount.updateUserProfile, {}, { success }],
  ),
  where: (frames) =>
    frames
      .filter((frame) => frame[success] !== true)
      .map((frame) => ({ ...frame, [error]: "Failed to update profile" })),
  then: actions([
    Requesting.respond,
    { request, success: false, error },
  ]),
});

export const UpdateProfileUnauthorized: Sync = ({
  request,
  userID,
  error,
}: Vars) => ({
  when: actions(
    [Requesting.request, { path: "/UserAccount/updateUserProfile" }, {
      request,
    }],
    [Session.getSessionUser, {}, { userID }],
  ),
  where: (frames) =>
    frames
      .filter((frame) => !frame[userID])
      .map((frame) => ({ ...frame, [error]: "Session required" })),
  then: actions([
    Requesting.respond,
    { request, success: false, error },
  ]),
});
