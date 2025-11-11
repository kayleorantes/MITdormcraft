import { Requesting, RoomTemplate, Session, UserAccount } from "@concepts";
import { actions, Sync, Vars } from "@engine";
import { isTemplateAdmin, sanitizeUser } from "./helpers.ts";
import type { RoomTemplate as RoomTemplateDoc } from "@concepts/room-template.ts";

export const AddTemplateRequest: Sync = ({
  request,
  session,
  dormName,
  roomType,
  userID,
}: Vars) => ({
  when: actions([
    Requesting.request,
    { path: "/RoomTemplate/addTemplate", session, dormName, roomType },
    { request },
  ]),
  then: actions(
    [Session.getSessionUser, { session }, { userID }],
  ),
});

export const AddTemplateAuthorize: Sync = ({
  request,
  userID,
  user,
}: Vars) => ({
  when: actions(
    [Requesting.request, { path: "/RoomTemplate/addTemplate" }, { request }],
    [Session.getSessionUser, {}, { userID }],
  ),
  where: (frames) =>
    frames.filter((frame) => typeof frame[userID] === "string"),
  then: actions(
    [UserAccount.getUser, { userID }, { user }],
  ),
});

export const AddTemplateExecute: Sync = ({
  request,
  user,
  dormName,
  roomType,
  templateID,
}: Vars) => ({
  when: actions(
    [Requesting.request, { path: "/RoomTemplate/addTemplate" }, { request }],
    [UserAccount.getUser, {}, { user }],
  ),
  where: (frames) =>
    frames.filter((frame) => {
      const account = frame[user];
      return account && typeof account === "object" &&
        isTemplateAdmin(
          sanitizeUser(account as Parameters<typeof sanitizeUser>[0]),
        );
    }),
  then: actions(
    [RoomTemplate.addTemplate, { dormName, roomType }, { templateID }],
  ),
});

export const AddTemplateRespond: Sync = ({
  request,
  templateID,
}: Vars) => ({
  when: actions(
    [Requesting.request, { path: "/RoomTemplate/addTemplate" }, { request }],
    [RoomTemplate.addTemplate, {}, { templateID }],
  ),
  then: actions([
    Requesting.respond,
    { request, templateID },
  ]),
});

export const AddTemplateSessionRequired: Sync = ({
  request,
  userID,
  error,
}: Vars) => ({
  when: actions(
    [Requesting.request, { path: "/RoomTemplate/addTemplate" }, { request }],
    [Session.getSessionUser, {}, { userID }],
  ),
  where: (frames) =>
    frames
      .filter((frame) => typeof frame[userID] !== "string")
      .map((frame) => ({ ...frame, [error]: "Session required" })),
  then: actions([
    Requesting.respond,
    { request, error },
  ]),
});

export const AddTemplateForbidden: Sync = ({
  request,
  user,
  error,
}: Vars) => ({
  when: actions(
    [Requesting.request, { path: "/RoomTemplate/addTemplate" }, { request }],
    [UserAccount.getUser, {}, { user }],
  ),
  where: (frames) =>
    frames
      .filter((frame) => {
        const account = frame[user];
        return !account || typeof account !== "object" ||
          !isTemplateAdmin(
            sanitizeUser(account as Parameters<typeof sanitizeUser>[0]),
          );
      })
      .map((frame) => ({ ...frame, [error]: "Administrator access required" })),
  then: actions([
    Requesting.respond,
    { request, error },
  ]),
});

export const UpdateTemplateRequest: Sync = ({
  request,
  session,
  templateID,
  dormName,
  roomType,
  userID,
}: Vars) => ({
  when: actions([
    Requesting.request,
    {
      path: "/RoomTemplate/updateTemplate",
      session,
      templateID,
      dormName,
      roomType,
    },
    { request },
  ]),
  then: actions(
    [Session.getSessionUser, { session }, { userID }],
  ),
});

export const UpdateTemplateAuthorize: Sync = ({
  request,
  userID,
  user,
}: Vars) => ({
  when: actions(
    [Requesting.request, { path: "/RoomTemplate/updateTemplate" }, { request }],
    [Session.getSessionUser, {}, { userID }],
  ),
  where: (frames) =>
    frames.filter((frame) => typeof frame[userID] === "string"),
  then: actions(
    [UserAccount.getUser, { userID }, { user }],
  ),
});

export const UpdateTemplateExecute: Sync = ({
  request,
  user,
  templateID,
  dormName,
  roomType,
  updated,
  template,
}: Vars) => ({
  when: actions(
    [Requesting.request, { path: "/RoomTemplate/updateTemplate" }, { request }],
    [UserAccount.getUser, {}, { user }],
  ),
  where: (frames) =>
    frames.filter((frame) => {
      const account = frame[user];
      return account && typeof account === "object" &&
        isTemplateAdmin(
          sanitizeUser(account as Parameters<typeof sanitizeUser>[0]),
        );
    }),
  then: actions(
    [RoomTemplate.updateTemplate, { templateID, dormName, roomType }, {
      updated,
    }],
    [RoomTemplate.getTemplate, { templateID }, { template }],
  ),
});

export const UpdateTemplateRespond: Sync = ({
  request,
  updated,
  template,
}: Vars) => ({
  when: actions(
    [Requesting.request, { path: "/RoomTemplate/updateTemplate" }, { request }],
    [RoomTemplate.updateTemplate, {}, { updated }],
    [RoomTemplate.getTemplate, {}, { template }],
  ),
  where: (frames) =>
    frames
      .filter((frame) => frame[updated] === true)
      .map((frame) => {
        const doc = frame[template] as RoomTemplateDoc | null | undefined;
        if (!doc) {
          return { ...frame, [template]: null };
        }
        return {
          ...frame,
          [template]: {
            templateID: doc._id.toHexString(),
            dormName: doc.dormName,
            roomType: doc.roomType,
          },
        };
      }),
  then: actions([
    Requesting.respond,
    { request, success: true, template },
  ]),
});

export const UpdateTemplateFailure: Sync = ({
  request,
  updated,
  error,
}: Vars) => ({
  when: actions(
    [Requesting.request, { path: "/RoomTemplate/updateTemplate" }, { request }],
    [RoomTemplate.updateTemplate, {}, { updated }],
  ),
  where: (frames) =>
    frames
      .filter((frame) => frame[updated] !== true)
      .map((frame) => ({ ...frame, [error]: "Template update failed" })),
  then: actions([
    Requesting.respond,
    { request, success: false, error },
  ]),
});

export const UpdateTemplateSessionRequired: Sync = ({
  request,
  userID,
  error,
}: Vars) => ({
  when: actions(
    [Requesting.request, { path: "/RoomTemplate/updateTemplate" }, { request }],
    [Session.getSessionUser, {}, { userID }],
  ),
  where: (frames) =>
    frames
      .filter((frame) => typeof frame[userID] !== "string")
      .map((frame) => ({ ...frame, [error]: "Session required" })),
  then: actions([
    Requesting.respond,
    { request, success: false, error },
  ]),
});

export const UpdateTemplateForbidden: Sync = ({
  request,
  user,
  error,
}: Vars) => ({
  when: actions(
    [Requesting.request, { path: "/RoomTemplate/updateTemplate" }, { request }],
    [UserAccount.getUser, {}, { user }],
  ),
  where: (frames) =>
    frames
      .filter((frame) => {
        const account = frame[user];
        return !account || typeof account !== "object" ||
          !isTemplateAdmin(
            sanitizeUser(account as Parameters<typeof sanitizeUser>[0]),
          );
      })
      .map((frame) => ({ ...frame, [error]: "Administrator access required" })),
  then: actions([
    Requesting.respond,
    { request, success: false, error },
  ]),
});

export const DeleteTemplateRequest: Sync = ({
  request,
  session,
  templateID,
  userID,
}: Vars) => ({
  when: actions([
    Requesting.request,
    { path: "/RoomTemplate/deleteTemplate", session, templateID },
    { request },
  ]),
  then: actions(
    [Session.getSessionUser, { session }, { userID }],
  ),
});

export const DeleteTemplateAuthorize: Sync = ({
  request,
  userID,
  user,
}: Vars) => ({
  when: actions(
    [Requesting.request, { path: "/RoomTemplate/deleteTemplate" }, { request }],
    [Session.getSessionUser, {}, { userID }],
  ),
  where: (frames) =>
    frames.filter((frame) => typeof frame[userID] === "string"),
  then: actions(
    [UserAccount.getUser, { userID }, { user }],
  ),
});

export const DeleteTemplateExecute: Sync = ({
  request,
  user,
  templateID,
  success,
}: Vars) => ({
  when: actions(
    [Requesting.request, { path: "/RoomTemplate/deleteTemplate" }, { request }],
    [UserAccount.getUser, {}, { user }],
  ),
  where: (frames) =>
    frames.filter((frame) => {
      const account = frame[user];
      return account && typeof account === "object" &&
        isTemplateAdmin(
          sanitizeUser(account as Parameters<typeof sanitizeUser>[0]),
        );
    }),
  then: actions(
    [RoomTemplate.deleteTemplate, { templateID }, { success }],
  ),
});

export const DeleteTemplateRespond: Sync = ({
  request,
  success,
}: Vars) => ({
  when: actions(
    [Requesting.request, { path: "/RoomTemplate/deleteTemplate" }, { request }],
    [RoomTemplate.deleteTemplate, {}, { success }],
  ),
  where: (frames) => frames.filter((frame) => frame[success] === true),
  then: actions([
    Requesting.respond,
    { request, success: true },
  ]),
});

export const DeleteTemplateFailure: Sync = ({
  request,
  success,
  error,
}: Vars) => ({
  when: actions(
    [Requesting.request, { path: "/RoomTemplate/deleteTemplate" }, { request }],
    [RoomTemplate.deleteTemplate, {}, { success }],
  ),
  where: (frames) =>
    frames
      .filter((frame) => frame[success] !== true)
      .map((frame) => ({ ...frame, [error]: "Template deletion failed" })),
  then: actions([
    Requesting.respond,
    { request, success: false, error },
  ]),
});

export const DeleteTemplateSessionRequired: Sync = ({
  request,
  userID,
  error,
}: Vars) => ({
  when: actions(
    [Requesting.request, { path: "/RoomTemplate/deleteTemplate" }, { request }],
    [Session.getSessionUser, {}, { userID }],
  ),
  where: (frames) =>
    frames
      .filter((frame) => typeof frame[userID] !== "string")
      .map((frame) => ({ ...frame, [error]: "Session required" })),
  then: actions([
    Requesting.respond,
    { request, success: false, error },
  ]),
});

export const DeleteTemplateForbidden: Sync = ({
  request,
  user,
  error,
}: Vars) => ({
  when: actions(
    [Requesting.request, { path: "/RoomTemplate/deleteTemplate" }, { request }],
    [UserAccount.getUser, {}, { user }],
  ),
  where: (frames) =>
    frames
      .filter((frame) => {
        const account = frame[user];
        return !account || typeof account !== "object" ||
          !isTemplateAdmin(
            sanitizeUser(account as Parameters<typeof sanitizeUser>[0]),
          );
      })
      .map((frame) => ({ ...frame, [error]: "Administrator access required" })),
  then: actions([
    Requesting.respond,
    { request, success: false, error },
  ]),
});
