import type { abaInterface } from "@/interfaces/abas"

export  const getAbaFromList = (id : string,abaslist:abaInterface[]): abaInterface => {
        return abaslist[abaslist.findIndex((abas) => abas.id == id)] //função que retorna a aba utilizando o id
    }