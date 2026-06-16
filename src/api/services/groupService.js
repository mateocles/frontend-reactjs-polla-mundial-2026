import api from "../axiosConfig";

export const GroupService = {
  list: () => api.get("/groups").then((r) => r.data),
  create: (name, isPublic = false) =>
    api.post("/groups", { name, isPublic }).then((r) => r.data),
  join: (inviteCode) => api.post("/groups/join", { inviteCode }).then((r) => r.data),
  update: (groupId, data) => api.patch(`/groups/${groupId}`, data).then((r) => r.data),
  listPublic: () => api.get("/groups/public").then((r) => r.data),
  joinPublic: (groupId) => api.post(`/groups/${groupId}/join`).then((r) => r.data),
};
