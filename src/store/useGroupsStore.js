import { create } from "zustand";
import { GroupService } from "../api/services/groupService";

export const useGroupsStore = create((set) => ({
  groups: [],
  loading: false,
  error: false,

  fetchGroups: async () => {
    set({ loading: true, error: false });
    try {
      const groups = await GroupService.list();
      set({ groups, error: false });
    } catch (e) {
      set({ error: true });
      throw e;
    } finally {
      set({ loading: false });
    }
  },

  publicGroups: [],

  createGroup: async (name, isPublic = false) => {
    await GroupService.create(name, isPublic);
    set({ groups: await GroupService.list() });
  },

  fetchPublicGroups: async () => {
    set({ publicGroups: await GroupService.listPublic() });
  },

  joinPublicGroup: async (groupId) => {
    await GroupService.joinPublic(groupId);
    const [groups, publicGroups] = await Promise.all([
      GroupService.list(),
      GroupService.listPublic(),
    ]);
    set({ groups, publicGroups });
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
