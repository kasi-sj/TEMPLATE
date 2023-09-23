"use client"
import { CircularProgressbar , buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"

const ProgressBar = ({percentage , info}) => {
    return (
        <div className='flex flex-col gap-3 items-center tracking-tighter'>
            <CircularProgressbar styles={{path:{transition: 'stroke-dashoffset 0.5s ease 0s'}}} value={ parseFloat(percentage)} text={`${percentage}%`} />
            <h4 className='text-sm font-semibold'>{info}</h4>
        </div>
    )
}

const Result = ({percentage_obj }) => {
    const {SIFT , SSIM , Hash , Color} = percentage_obj ;
    
    return <div className='w-[300px]'>
      <Card>
        <CardHeader className="flex items-center">
        <CardTitle>
          Template Matching
        </CardTitle>
      </CardHeader>
     <CardContent className="flex gap-4 align-top">
          <ProgressBar percentage={SIFT.toFixed(2)} info="SIFT"></ProgressBar>
          <ProgressBar percentage={SSIM.toFixed(2)} info="SSIM"></ProgressBar>
          <ProgressBar percentage={Hash.toFixed(2)} info="Hash"></ProgressBar>
          <ProgressBar percentage={Color.toFixed(2)} info="Color"></ProgressBar>
      </CardContent>
     
    </Card>
    </div>
}
export default Result