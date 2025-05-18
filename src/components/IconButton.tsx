import React, { type ReactNode } from 'react'
import { Button } from './ui/button'
interface ButtonInterface {
  onClick?() : void,
  text : string,
  Icon : ReactNode
  variant?: "link" | "default" | "destructive" | "outline" | "secondary" | "ghost" | null | undefined,
  className?: any
}
const IconButton : React.FC<ButtonInterface> = ({Icon,onClick,text,variant,className}) => {
  return (
    <Button className={className}  onClick={onClick} variant={variant} >
      {Icon}
      <span className='truncate'>{text}</span>
    </Button>
  )
}

export default IconButton