import React from 'react'

interface TabBarI {
    children?: React.ReactNode
}
const TabBar : React.FC<TabBarI>= ({children}) => {
  return (
    <aside className='p-4 resize-x overflow border-border border-r-1 min-w-[80px] flex flex-col justify-start items-center gap-5 h-screen max-w-[350px]'>
        {children}
    </aside>
  )
}

export default TabBar