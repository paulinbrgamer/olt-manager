import React from 'react'

interface TabBarI {
    children?: React.ReactNode
}
const TabBar : React.FC<TabBarI>= ({children}) => {
  return (
    <div className='p-4 border-border border-r-1 min-w-[80px] flex flex-col justify-start items-center gap-5'>
        {children}
    </div>
  )
}

export default TabBar