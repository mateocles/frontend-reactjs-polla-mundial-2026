import api from "../axiosConfig";

export const GroupService = {
  list: () => api.get("/groups").then((r) => r.data),
  create: (name) => api.post("/groups", { name }).then((r) => r.data),
  join: (inviteCode) => api.post("/groups/join", { inviteCode }).then((r) => r.data),
  update: (groupId, data) => api.patch(`/groups/${groupId}`, data).then((r) => r.data),
};
