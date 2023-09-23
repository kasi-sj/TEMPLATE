"use client"
import { useState } from "react"

const Popover = ( img ) => {
  const [Big,setBig] = useState(false)
  return (
      <>
      {Big && 
        <div className="fixed inset-0 bg-black  bg-opacity-50 cursor-pointer z-[11]" onClick={()=>setBig((prev)=>!prev)}>  
          <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-[11]">
          <img src={img.img} alt="pop" className="z-[11]"  ></img>
          </div>
        </div>
      }
      <img src={img.img} alt="pop" className={`rounded-sm object-contain w-[200px] h-[196px] cursor-pointer z-10`} onClick={()=>setBig((prev)=>!prev)} ></img>
      </>
  )
}

export default Popover