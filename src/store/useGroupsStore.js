import { create } from "zustand";
import { GroupService } from "../api/services/groupService";

export const useGroupsStore = create((set) => ({
  groups: [],
  loading: false,

  fetchGroups: async () => {
    set({ loading: true });
    try {
      const groups = await GroupService.list();
      set({ groups });
    } finally {
      set({ loading: false });
    }
  },

  createGroup: async (name) => {
    await GroupService.create(name);
    set({ groups: await GroupService.list() });
  },

  joinGroup: async (inviteCode) => {
    await GroupService.join(inviteCode);
    set({ groups: await GroupService.list() });
  },

  updateGroup: async (groupId, data) => {
    const updated = await GroupService.update(groupId, data);
    set({ groups: await GroupService.list() });
    return updated;
  },
}));
