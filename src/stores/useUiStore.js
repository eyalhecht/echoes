import { create } from 'zustand';

const useUiStore = create((set) => ({
    activeSidebarItem: 'Home',
    setActiveSidebarItem: (item) => set({ activeSidebarItem: item }),
}));

export default useUiStore;