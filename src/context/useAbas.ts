import { create } from 'zustand'
import type { abaInterface } from '@/interfaces/abas'
import type { filter } from '@/interfaces/filter'
import type oltInterface from '@/interfaces/olt-interface'
import type { ponRequest, Request } from '@/interfaces/request'
import generateId from '@/utils/generateId'
import onuListTest from '../constants/onuListTest'
export interface AbasContextInterface {
  abaslist: abaInterface[],
  currentAbaInfo: string | null,
  setAbasList(newAbalist: abaInterface[]): void,
  removeAba(id: string): void,
  createAba(oltObj: oltInterface): string,
  setcurrentAbaInfo(abaInfoIdSelect: string | null): void,
  updateAba(abaInfo: abaInterface): void,
  reset(): void
}

const createInitialState = (set: any): Omit<AbasContextInterface, 'reset'> => ({
  abaslist: [],
  currentAbaInfo: null,
  setAbasList: (newAbaList) =>
    set(() => ({ abaslist: newAbaList })),

  removeAba: (id) => {
    if (!id) throw new Error("ID inválido para remoção.")
    set((state: AbasContextInterface) => {
      const exists = state.abaslist.some(aba => aba.id === id)
      return exists
        ? { abaslist: state.abaslist.filter(aba => aba.id !== id) }
        : { abaslist: state.abaslist }
    })
  },

  updateAba: (AbaUpdate) =>
    set((state: AbasContextInterface) => {
      const index = state.abaslist.findIndex(aba => aba.id === AbaUpdate.id)
      if (index === -1) return { abaslist: state.abaslist }
      const updated = [...state.abaslist]
      updated[index] = { ...updated[index], ...AbaUpdate }
      return { abaslist: updated }
    }),

  createAba: (oltObj) => {
    const idG = generateId()
    const newAba: abaInterface = {
      id: idG,
      request: { olt: oltObj } as Request,
      OnuList: [],
      filter: { search: "", state: "" } as filter,
      incident: [],
    }
    const DemoAba : abaInterface = {
      id: idG,
      request: { olt: oltObj,slot:1,pon:3 } as ponRequest,
      OnuList: onuListTest,
      filter: { search: "", state: "" } as filter,
      incident: [],
    }
    if(oltObj.location !="Demo"){
      set((state: AbasContextInterface) => ({
        abaslist: [...state.abaslist, newAba],
        currentAbaInfo: idG,
      }))
    }else{
      set((state: AbasContextInterface) => ({
        abaslist: [...state.abaslist, DemoAba],
        currentAbaInfo: idG,
      }))
    }
    
    return idG
  },

  setcurrentAbaInfo: (abaInfoIdSelect) =>
    set(() => ({ currentAbaInfo: abaInfoIdSelect })),
})

const useAbas = create<AbasContextInterface>((set) => ({
  ...createInitialState(set),
  reset: () => set(() => createInitialState(set)),
}))

export default useAbas
