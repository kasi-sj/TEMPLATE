import React from 'react'
import Popover from './Popover'
import ProgressLine from './ProgressLine'


const Similar = ({item,index,similarityScore}) => {
  // alert(JSON.stringify(item))
  return (
    <div className='h-full w-full border-solid border-2 border-xl'>
    <div className='flex flex-col '>
        <img className='h-[400px] w-[200px]' key={index} src={item.id}></img>
          <ProgressLine template info={"Template Similarity"} percentage={Math.floor(item.score*100)}/>
        {similarityScore.length > index && <ProgressLine text info={"Text Similarity"} percentage={Math.floor(similarityScore[index]*100)}/>}
    </div>
    </div>
  )
}

export default Similar
