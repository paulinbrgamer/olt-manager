import React, { type ReactNode } from 'react'
import { Button } from './ui/button'
interface ButtonInterface {
  onClick?() : void,
  text : string,
  Icon : ReactNode
}
const IconButton : React.FC<ButtonInterface> = ({Icon,onClick,text}) => {
  return (
    <Button className='w-full justify-start' onClick={onClick} variant={'ghost'} >
      {Icon}
      <span className='truncate'>{text}</span>
    </Button>
  )
}

export default IconButton