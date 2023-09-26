"use client"
import { CircularProgressbar , buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import ProgressLine from './ProgressLine';
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
     <CardContent className="flex flex-col gap-4 align-top">
          <ProgressLine percentage={SIFT.toFixed(2)} info="SIFT" og></ProgressLine>
          <ProgressLine percentage={SSIM.toFixed(2)} info="SSIM" og></ProgressLine>
          <ProgressLine percentage={Hash.toFixed(2)} info="Hash" og></ProgressLine>
          <ProgressLine percentage={Color.toFixed(2)} info="Color" og></ProgressLine>
      </CardContent>
     
    </Card>
    </div>
}
export default Result