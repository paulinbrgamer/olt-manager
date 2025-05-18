import React from 'react'

interface TabBarI {
    children?: React.ReactNode
    className?: any
}
const TabBar : React.FC<TabBarI>= ({children,className}) => {
  return (
    <aside className={'p-4 resize-x overflow border-border border-r-1 flex flex-col justify-start items-center gap-5 h-screen '+className} >
        {children}
    </aside>
  )
}

export default TabBar