import type { abaInterface } from "@/interfaces/abas"

export const getAbaFromList = (id: string, abaslist: abaInterface[]): abaInterface | undefined => {
    return abaslist.find((aba) => aba.id === id)
  }
  