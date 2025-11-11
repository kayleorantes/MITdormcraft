import { DesignPost, Requesting, Session } from "@concepts";
import { actions, Sync, Vars } from "@engine";
import { sanitizePost } from "./helpers.ts";

export const CreatePostRequest: Sync = ({
  request,
  session,
  templateID,
  title,
  description,
  imageURL,
  userID,
}: Vars) => ({
  when: actions([
    Requesting.request,
    {
      path: "/DesignPost/createPost",
      session,
      templateID,
      title,
      description,
      imageURL,
    },
    { request },
  ]),
  then: actions([
    Session.getSessionUser,
    { session },
    { userID },
  ]),
});

export const CreatePostExecute: Sync = ({
  request,
  userID,
  templateID,
  title,
  description,
  imageURL,
  postID,
  post,
}: Vars) => ({
  when: actions(
    [Requesting.request, { path: "/DesignPost/createPost" }, { request }],
    [Session.getSessionUser, {}, { userID }],
  ),
  where: (frames) =>
    frames.filter((frame) => typeof frame[userID] === "string"),
  then: actions(
    [DesignPost.createPost, {
      authorID: userID,
      templateID,
      title,
      description,
      imageURL,
    }, { postID }],
    [DesignPost.getPost, { postID }, { post }],
  ),
});

export const CreatePostRespond: Sync = ({
  request,
  post,
  postID,
}: Vars) => ({
  when: actions(
    [Requesting.request, { path: "/DesignPost/createPost" }, { request }],
    [DesignPost.getPost, {}, { post }],
  ),
  where: (frames) =>
    frames
      .filter((frame) => frame[post])
      .map((frame) => ({
        ...frame,
        [post]: sanitizePost(frame[post] as Parameters<typeof sanitizePost>[0]),
      })),
  then: actions([
    Requesting.respond,
    { request, postID, post },
  ]),
});

export const CreatePostUnauthorized: Sync = ({
  request,
  userID,
  error,
}: Vars) => ({
  when: actions(
    [Requesting.request, { path: "/DesignPost/createPost" }, { request }],
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

export const EditPostRequest: Sync = ({
  request,
  session,
  postID,
  title,
  description,
  imageURL,
  userID,
}: Vars) => ({
  when: actions([
    Requesting.request,
    {
      path: "/DesignPost/editPost",
      session,
      postID,
      title,
      description,
      imageURL,
    },
    { request },
  ]),
  then: actions([
    Session.getSessionUser,
    { session },
    { userID },
  ]),
});

export const EditPostExecute: Sync = ({
  request,
  userID,
  postID,
  title,
  description,
  imageURL,
  success,
  post,
}: Vars) => ({
  when: actions(
    [Requesting.request, { path: "/DesignPost/editPost" }, { request }],
    [Session.getSessionUser, {}, { userID }],
  ),
  where: (frames) =>
    frames.filter((frame) => typeof frame[userID] === "string"),
  then: actions(
    [DesignPost.editPost, { postID, userID, title, description, imageURL }, {
      success,
    }],
    [DesignPost.getPost, { postID }, { post }],
  ),
});

export const EditPostRespond: Sync = ({
  request,
  success,
  post,
}: Vars) => ({
  when: actions(
    [Requesting.request, { path: "/DesignPost/editPost" }, { request }],
    [DesignPost.editPost, {}, { success }],
    [DesignPost.getPost, {}, { post }],
  ),
  where: (frames) =>
    frames
      .filter((frame) => frame[success] === true && frame[post])
      .map((frame) => ({
        ...frame,
        [post]: sanitizePost(frame[post] as Parameters<typeof sanitizePost>[0]),
      })),
  then: actions([
    Requesting.respond,
    { request, success: true, post },
  ]),
});

export const EditPostFailure: Sync = ({
  request,
  success,
  error,
}: Vars) => ({
  when: actions(
    [Requesting.request, { path: "/DesignPost/editPost" }, { request }],
    [DesignPost.editPost, {}, { success }],
  ),
  where: (frames) =>
    frames
      .filter((frame) => frame[success] !== true)
      .map((frame) => ({ ...frame, [error]: "Edit not permitted" })),
  then: actions([
    Requesting.respond,
    { request, success: false, error },
  ]),
});

export const DeletePostRequest: Sync = ({
  request,
  session,
  postID,
  userID,
}: Vars) => ({
  when: actions([
    Requesting.request,
    { path: "/DesignPost/deletePost", session, postID },
    { request },
  ]),
  then: actions([
    Session.getSessionUser,
    { session },
    { userID },
  ]),
});

export const DeletePostExecute: Sync = ({
  request,
  userID,
  postID,
  success,
}: Vars) => ({
  when: actions(
    [Requesting.request, { path: "/DesignPost/deletePost" }, { request }],
    [Session.getSessionUser, {}, { userID }],
  ),
  where: (frames) =>
    frames.filter((frame) => typeof frame[userID] === "string"),
  then: actions(
    [DesignPost.deletePost, { postID, userID }, { success }],
  ),
});

export const DeletePostRespond: Sync = ({
  request,
  success,
}: Vars) => ({
  when: actions(
    [Requesting.request, { path: "/DesignPost/deletePost" }, { request }],
    [DesignPost.deletePost, {}, { success }],
  ),
  where: (frames) => frames.filter((frame) => frame[success] === true),
  then: actions([
    Requesting.respond,
    { request, success: true },
  ]),
});

export const DeletePostFailure: Sync = ({
  request,
  success,
  error,
}: Vars) => ({
  when: actions(
    [Requesting.request, { path: "/DesignPost/deletePost" }, { request }],
    [DesignPost.deletePost, {}, { success }],
  ),
  where: (frames) =>
    frames
      .filter((frame) => frame[success] !== true)
      .map((frame) => ({ ...frame, [error]: "Delete not permitted" })),
  then: actions([
    Requesting.respond,
    { request, success: false, error },
  ]),
});

export const PostSessionRequired: Sync = ({
  request,
  userID,
  error,
}: Vars) => ({
  when: actions(
    [Requesting.request, { path: "/DesignPost/editPost" }, { request }],
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

export const DeletePostSessionRequired: Sync = ({
  request,
  userID,
  error,
}: Vars) => ({
  when: actions(
    [Requesting.request, { path: "/DesignPost/deletePost" }, { request }],
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
