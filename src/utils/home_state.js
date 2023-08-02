import {create} from "zustand";

const useStoreTab = create((set) => ({
    activeMenu: "Dashboard",
    setActiveMenu: (value) => set({ activeMenu: value }),
    listTab: ['Dashboard'],
    setNewTab: (value) => set(state => {
        if (!state.listTab.includes(value)) {
            return {
                listTab: [...state.listTab, value],
                activeMenu: value
            };
        } else {
            return {
                ...state,
                activeMenu: value
            };
        }
    }),
    setCloseTab: (value) => set((state) => (
        {
            listTab: state.listTab.filter((tab) => tab !== value),
        }
    )),
}));

export default useStoreTab