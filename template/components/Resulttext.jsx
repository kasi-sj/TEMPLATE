"use client"
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"
  import { useState,useEffect } from 'react';

const ProgressBar = ({percentage , info}) => {
    const [end,setEnd] = useState(0);
    useEffect(() => {
      setEnd(percentage);
    }, [end]);
  
    return (
        <div className='flex flex-col gap-3 items-center tracking-tighter'>
            <CircularProgressbar styles={{path:{stroke:""}}} value={end} text={`${end}%`} />
            <h4 className='text-sm font-semibold'>{info}</h4>
        </div>
    )
}


const Resulttext = ({text_score}) => {
  return (
   <div className='w-[150px] h-[105.84px]'>
      <Card>
        <CardHeader className="flex items-center p-[0.7rem]">
        <CardTitle>
          Text Matching
        </CardTitle>
      </CardHeader>
     <CardContent>
          <ProgressBar percentage={text_score.toFixed(2)} info="Text Matching"></ProgressBar>
      </CardContent>
     
    </Card>
    </div>
  )
}

export default Resulttext