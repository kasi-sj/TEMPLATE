import Popover from "./Popover"
import Result from "./Result"
import Popovertext from "@/components/Popovertext"
import Resulttext from "@/components/Resulttext"
import Button from "@/components/ui/button"
import Similar from "./Similar"

const TemplateCard = ({og_image , og_template , ext_text , temp_score , text_score , index , upload , onUpload , similarResult , similarityScore , finalScore}) => {
  return (
    <div className="">
    <div className="max-md:w-[1253px] gap-3 flex p-2 m-5 flex-wrap md:justify-evenly max-md:gap-3 w-[1499px] bg-slate-200">
        {og_image && <Popover img={og_image}></Popover>}
        {og_template && <Popover img={og_template}></Popover>}
        {ext_text && <Popovertext text={ext_text}></Popovertext>}
        {temp_score && <Result percentage_obj={temp_score}></Result>}
        {similarResult &&
          similarResult.map((item,index) => {
            return <Similar item={item} index={index} similarityScore={similarityScore} />
            // <div className="border-solid border-2">
            // <Popover key={index} img={item.id}></Popover>
            // {item.score}
            // {similarityScore.length > index && <Resulttext key={index} text_score={similarityScore[index]*100}></Resulttext>}
            // </div>
          })
        }        
        {/* {similarityScore && <Result percentage_obj={similarityScore}></Result>} */}
        {finalScore}
        <div className="flex justify-center items-center">
          <button className="px-4 py-2 bg-white " disabled={upload} onClick={()=>{onUpload(og_image,index)}}> upload </button>
        </div>
    </div>
    </div>
  )
}

export default TemplateCard