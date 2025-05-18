import React, { useContext,createContext, type ReactNode, useState } from "react"
import {type abaInterface } from "@/interfaces/abas"
import generateId from "@/utils/generateId"
import type { Request } from "@/interfaces/request"
import type oltInterface from "@/interfaces/olt-interface"

interface  Props {
  children: ReactNode
}
//interface para o context
interface AbasContextInterface {
  abaslist: abaInterface[] | null,
  removeAba(id:string):void,
  createAba(oltObj:oltInterface): void,
}
//criação do contexto
const AbasContext = createContext<AbasContextInterface | null>(null)

const AbasProvider : React.FC<Props> = ({children}) => {
  //listagem das abas
  const [abaslist, setAbasList] = useState<abaInterface[] >([])
  //função para remover aba passando o id da mesma
  const removeAba = (id:string)=>{
    setAbasList(prev=>prev.filter((aba)=>aba.id!=id))
  }
  //função para crair aba passando o id da OLT 
  const createAba = (oltObj:oltInterface)=>{
    const newAbba : abaInterface = {
      id: generateId(),
      request: {olt:oltObj} as Request,
      OnuList : [],
      filter : "",
      incident : []

    }
    setAbasList(prev=>[...prev,newAbba])
  }
  return (
    <AbasContext.Provider value={{abaslist,removeAba,createAba}}>
    {children}
    </AbasContext.Provider>
  )
}

//custon hook para uasr o contexto
export const useAbas  = () =>{
  const context = useContext(AbasContext)
  if(context===null){
    throw new Error("useAbas must be used within a ThemeProvider")
  }
  return context
}
export default AbasProvider