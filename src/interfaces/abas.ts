import type { OnuInfo } from "./onu-interface"
import type {Request} from "./request"

export interface abaInterface {
    id : string,
    request : Request,
    OnuList : OnuInfo[] | []
    filter : string,
    incident : string[] | []

}
