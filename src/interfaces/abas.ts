import type { ReactNode } from "react"
import type { OnuInfo } from "./onu-interface"
import type {Request} from "./request"
import type { filter } from "./filter"

export interface abaInterface {
    id : string,
    request : Request,
    OnuList : OnuInfo[] | []
    filter : filter,
    incident : string[] | []
    dashboard?: ReactNode
}
