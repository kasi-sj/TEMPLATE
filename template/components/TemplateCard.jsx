import Popover from "./Popover"
import Result from "./Result"
import Popovertext from "@/components/Popovertext"
import Resulttext from "@/components/Resulttext"


const TemplateCard = ({og_image , og_template , ext_text , temp_score , text_score}) => {
  return (
    <div className="">
    <div className="max-md:w-[1253px] gap-3 flex p-2 m-5  md:justify-evenly max-md:gap-3 w-[1499px] bg-slate-200">
        {og_image && <Popover img={og_image}></Popover>}
        {og_template && <Popover img={og_template}></Popover>}
        {ext_text && <Popovertext text={ext_text}></Popovertext>}
        {temp_score && <Result percentage_obj={temp_score}></Result>}
        {text_score && <Resulttext text_score={text_score}></Resulttext>}
    </div>
    </div>
  )
}

export default TemplateCard