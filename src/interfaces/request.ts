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
const guardRequestPon = (obj: any): boolean => {
        return obj && typeof obj.slot === 'number' && typeof obj.pon === 'number';
      }
export default guardRequestPon