import React, { useContext,createContext, type ReactNode, useState, useEffect } from "react"
import {type abaInterface } from "@/interfaces/abas"
import generateId from "@/utils/generateId"
import type { Request } from "@/interfaces/request"
import type oltInterface from "@/interfaces/olt-interface"
import OltDashboard from "@/components/OltDashboard"
import type { filter } from "@/interfaces/filter"

interface  Props {
  children: ReactNode
}
//interface para o context
interface AbasContextInterface {
  abaslist: abaInterface[] ,
  removeAba(id:string):void,
  createAba(oltObj:oltInterface): string,
  currentAbaInfo : string | null,
  setcurrentAbaInfo(abaInfo : string | null):void,
  updateAba(abaInfo : abaInterface): void

}
//criação do contexto
const AbasContext = createContext<AbasContextInterface | null>(null)

const AbasProvider : React.FC<Props> = ({children}) => {
  const [currentAbaInfo, setcurrentAbaInfo] = useState<string | null>(null) //id da tab atual

  const [abaslist, setAbasList] = useState<abaInterface[] >([])   //listagem das abas
  
  //update aba
  const updateAba = (AbaUpdate: abaInterface) => {
    setAbasList(prev => {
      const index = prev.findIndex(aba => aba.id === AbaUpdate.id);
      if (index === -1) return prev; // segurança extra
      const updated = [...prev]; // faz cópia segura do array
      updated[index] = { ...updated[index], ...AbaUpdate }; // merge dos dados
      return updated;
    });
  };
  
  //função para remover aba passando o id da mesma
  const removeAba = (id: string) => {
    setAbasList(prev => prev.filter(aba => aba.id !== id));
  

  };
  
  //função para crair aba passando o id da OLT , retorna o id criado 
  const createAba = (oltObj:oltInterface)=>{
    const idG = generateId()
    const newAbba : abaInterface = {
      id: idG,
      request: {olt:oltObj} as Request,
      OnuList : [],
      filter : {search:'',state:null} as filter,
      incident : [],
      dashboard : <OltDashboard key={idG} abaInfoId={idG}/>

    }
    setAbasList(prev=>[...prev,newAbba])
    return idG
  }
  useEffect(() => {
    console.log(abaslist);
    
  }, [abaslist])
  useEffect(() => {
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
    throw new Error("useAbas must be used within a AbasProvider")
  }
  return context
}
export default AbasProvider