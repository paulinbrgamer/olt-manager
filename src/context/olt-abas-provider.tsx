import React, { useContext,createContext, type ReactNode, useState } from "react"
import {type abaInterface } from "@/interfaces/abas"
import generateId from "@/utils/generateId"
import type { Request } from "@/interfaces/request"

interface  Props {
  children: ReactNode
}
interface AbasContextInterface {
  abaslist: abaInterface[] | null,
  removeAba(id:string):void,
  createAba(oltId:number): void,
}
const AbasContext = createContext<AbasContextInterface | null>(null)
const AbasProvider : React.FC<Props> = ({children}) => {
  const [abaslist, setAbasList] = useState<abaInterface[] >([])

  const removeAba = (id:string)=>{
    setAbasList(prev=>prev.filter((aba)=>aba.id!=id))
  }
  const createAba = (oltId:number)=>{
    const newAbba : abaInterface = {
      id: generateId(),
      request: {olt:oltId} as Request,
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
export const useAbas  = () =>{
  const context = useContext(AbasContext)
  if(context===null){
    throw new Error("useAbas must be used within a ThemeProvider")
  }
  return context
}
export default AbasProvider