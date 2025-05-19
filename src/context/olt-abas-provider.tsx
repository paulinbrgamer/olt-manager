import React, { useContext,createContext, type ReactNode, useState, useEffect } from "react"
import {type abaInterface } from "@/interfaces/abas"
import generateId from "@/utils/generateId"
import type { Request } from "@/interfaces/request"
import type oltInterface from "@/interfaces/olt-interface"
import OltDashboard from "@/components/OltDashboard"

interface  Props {
  children: ReactNode
}
//interface para o context
interface AbasContextInterface {
  abaslist: abaInterface[] ,
  removeAba(id:string):void,
  createAba(oltObj:oltInterface): abaInterface,
  currentAbaInfo : abaInterface | null,
  setcurrentAbaInfo(abaInfo : abaInterface | null):void,
  updateAba(abaInfo : abaInterface): void

}
//criação do contexto
const AbasContext = createContext<AbasContextInterface | null>(null)

const AbasProvider : React.FC<Props> = ({children}) => {
  const [currentAbaInfo, setcurrentAbaInfo] = useState<abaInterface | null>(null)
  
  //listagem das abas
  const [abaslist, setAbasList] = useState<abaInterface[] >([])
  //update aba
  const updateAba = (AbaUpdate:abaInterface)=>{
    const newstate = abaslist.findIndex((abas)=>abas.id==AbaUpdate.id)
    setAbasList(prev=>{
      const prevObj = prev[newstate]
      prev[newstate] = {...prevObj,...AbaUpdate}
      return prev
    })
  }
  //função para remover aba passando o id da mesma
  const removeAba = (id:string)=>{
    setAbasList(prev=>prev.filter((aba)=>aba.id!=id))
  }
  //função para crair aba passando o id da OLT , retorna o id criado
  const createAba = (oltObj:oltInterface)=>{
    const idG = generateId()
    const newAbba : abaInterface = {
      id: idG,
      request: {olt:oltObj} as Request,
      OnuList : [],
      filter : "",
      incident : [],
      dashboard : <OltDashboard key={idG} abaInfo={{id:idG,request:{olt:oltObj},OnuList:[],filter:'',incident:[]}}/>

    }
    setAbasList(prev=>[...prev,newAbba])
    return newAbba
  }
  useEffect(() => {
    console.log(abaslist);
    
  }, [abaslist])
  useEffect(() => {
    console.log("Selected");
    
    console.log(currentAbaInfo);
    
  }, [currentAbaInfo])
  return (
    <AbasContext.Provider value={{abaslist,removeAba,createAba,currentAbaInfo,setcurrentAbaInfo,updateAba}}>
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