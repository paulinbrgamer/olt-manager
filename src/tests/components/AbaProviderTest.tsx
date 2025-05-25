import { useAbas } from '@/context/olt-abas-provider'
import{ useEffect } from 'react'

const AbaProviderTest = ({callback} : {callback:any}) => {
    const context = useAbas()
    
    useEffect(() => {
      callback(context)
    }, [context.abaslist, context.currentAbaInfo])
    
  return null
}

export default AbaProviderTest