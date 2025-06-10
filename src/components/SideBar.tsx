import React from 'react'

interface SideBarI {
    children?: React.ReactNode
    className?: any
}
const SideBar : React.FC<SideBarI>= ({children,className}) => {
  return (
    <aside className={'p-4 resize-x overflow border-border border-r-1 flex flex-col justify-start items-center gap-5 h-screen '+className} >
        {children}
    </aside>
  )
}

export default SideBar