import type oltInterface from "./olt-interface"

interface request {
    olt : oltInterface
}
export interface serialRequest extends request{
    serialOnu : string
}
export interface ponRequest extends request{
    slot:number,
    pon:number,
}
export type Request = ponRequest | serialRequest | request|null
