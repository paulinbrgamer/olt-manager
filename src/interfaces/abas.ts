import type { OnuInfo } from "./onu-interface"
import type {Request} from "./request"
import type { filter } from "./filter"

export interface abaInterface {
    id : string,
    request : Request,
    OnuList : OnuInfo[] | []
    filter : filter,
    incident : string[] | []
}
export function isAbaInterface(obj: unknown): obj is abaInterface {
    if (typeof obj !== "object" || obj === null) return false
  
    const aba = obj as Record<string, unknown>
  
    return (
      typeof aba.id === "string" &&
      typeof aba.request === "object" && aba.request !== null &&
      Array.isArray(aba.OnuList) &&
      typeof aba.filter === "object" && aba.filter !== null &&
      Array.isArray(aba.incident)
      // dashboard é opcional, então não precisa validar aqui
    )
  }