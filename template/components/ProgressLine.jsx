"use client"
 
import * as React from "react"
 
import { Progress } from "@/components/ui/progress"

import { TextProgress } from "@/components/TextProgress"
import { TemplateProgress } from "./TemplateProgress"
 
export default function ProgressLine({percentage , info , text , template , og}) {
  const [progress, setProgress] = React.useState(0)
 
  React.useEffect(() => {
    const timer = setTimeout(() => setProgress(percentage), 500)
    return () => clearTimeout(timer)
  }, [])
 
  return(<div>
    <h3 className="text-sm font-semibold">{info}</h3>
    {og && <TemplateProgress value={progress} className=" w-[100%]" /> }
    { template &&  <Progress value={progress} className=" w-[100%]" /> }
    { text &&  <TextProgress value={progress} className=" w-[100%]" /> }
  </div>)  
}