'use client';
import React, { useEffect } from 'react'
import axios from 'axios';
import { CCarousel, CCarouselItem, CImage } from '@coreui/react'
// import '@coreui/coreui/dist/css/coreui.min.css'
import Popovertext from "@/components/Popovertext"
import { useState } from 'react';
import { InputFile } from '@/components/input'
import TemplateCard from '@/components/TemplateCard';
import { useUploadThing } from '@/lib/hooks/uploadthings';
import { set } from 'mongoose';
import { Item } from '@radix-ui/react-dropdown-menu';
import Similar from '@/components/Similar';


//image imports
import Image from 'next/image';
import logo from '@/public/images/logo.png';


const page = () => {
  const [submitting , setSubmitting] = useState(false);
  const[ index, setIndex] = useState(0);
  const [selected , setSelected] = useState([]);
  const [fileData , setFileData] = useState([]);
  const {startUpload} = useUploadThing("media");

  const onSubmit = async (event)=>{
    setSubmitting(true)

    for(var index = 0 ; index < selected.length ; index++){
      const Item = selected[index];
      await appendData(Item,index);
    }
  }

  const appendData = async (Item , index)=>{
    return new Promise(async (resolve) => {
      const fileReader = new FileReader();
      fileReader.onload = async () => {
        const fileData = {
          name: Item.name,
          type: Item.type,
          dataUrl: fileReader.result,
        };
        try {
          const url = '/api/scan';
          const response = await axios.post(url, JSON.stringify(fileData), {
            headers: {
              'Content-Type': 'application/json',
            },
          });
          if (response.status !== 200) {
            resolve(false);
            return;
          }

          setFileData((prev) => {
            prev[index].data = response.data;
            return [...prev];
          });

          await getTemplate(response.data, index);        

          console.log("data extracted", response.data);
  
          resolve(true);
        } catch (error) {
          console.log("data is not extracted");
          resolve(false);
        }
      };
      fileReader.readAsDataURL(Item);
    });
  }

  const getTemplate = async(Item , index)=>{
    return new Promise(async (resolve) => {
      try {
        const response = await axios.post("/api/get", { ...Item });
        if (response.status === 200) {
  
          setFileData((prev) => {
            prev[index].template = response.data.template;
            return [...prev];
          });
          
          await getMatch(response, index);
          
          resolve(true);
        } else {
          resolve(false);
        }
      } catch (error) {
        console.log("Error in getTemplate:", error);
        resolve(false);
      }
    });
  }

  const getMatch = (Item, index) => {
    return new Promise(async (resolve) => {
      const fileReader = new FileReader();
      fileReader.onload = async () => {
        try {
          const templates = {
            template: Item.data.template,
            data: fileReader.result.split(';base64,').pop(),
          };
          const matchresponse = await axios.post('/api/match', JSON.stringify(templates), {
            headers: {
              'Content-Type': 'application/json',
            },
          });
          
          setFileData((prev) => {
            prev[index].result = matchresponse.data;
            return [...prev];
          });
          
          getSimilarity(Item, index);

          resolve(matchresponse.data);
        } catch (error) {
          console.log("Error in getMatch:", error);
          resolve(null);
        }
      };
      
      fileReader.readAsDataURL(selected[index]);
    });
  };


  const getSimilarity = (Item, index) => {
    console.log("Item", Item);
    return new Promise(async (resolve) => {
      const fileReader = new FileReader();
      fileReader.onload = async () => {
        try {
          const fileData = {
            data: fileReader.result.split(';base64,').pop(),
          };
          const similarResponse = await axios.post('/api/similar', JSON.stringify(fileData), {
            headers: {
              'Content-Type': 'application/json',
            },
          });
          
          getSimilarityScore(similarResponse,index);

          setFileData((prev) => {
            prev[index].similarResult = similarResponse.data.similar;
            prev[index].similarityScore = [];
            return [...prev];
          });
          console.log("similarResponse", similarResponse.data);
          resolve(similarResponse.data);
        } catch (error) {
          console.log("Error in getSimilarity:", error);
          resolve(null);
        }
      };
      fileReader.readAsDataURL(selected[index]);
    });
  }

  const getSimilarityScore = async (Item, index) => {
    console.log("Item", Item);
    console.log('ok')
    for(var i = 0 ; i < Item.data.similar.length ; i++){
      await getSimilarityScore1(Item.data.similar[i].id,index);
    }
    finalScore(index);
  }

  

  const getSimilarityScore1 = async (Item, index) => {
    return new Promise(async (resolve) => {
      const fileReader = new FileReader();
      fileReader.onload = async () => {
        try {
          const fileData = {
            template: Item,
            data: fileReader.result.split(';base64,').pop(),
          };
          const similarResponse = await axios.post('/api/textMatch', JSON.stringify(fileData), {
            headers: {
              'Content-Type': 'application/json',
            },
          });
          
          setFileData((prev) => {
            prev[index].similarityScore.push(similarResponse.data);
            return [...prev];
          });
          console.log("similarScoreResponse", similarResponse.data);
          resolve(similarResponse.data);
        } catch (error) {
          console.log("Error in getSimilarity:", error);
          resolve(null);
        }
      };
      
      fileReader.readAsDataURL(selected[index]);
    });
  }

  const finalScore = (index)=>{
    var max = 0;
    fileData[index].similarityScore.map((item)=>{
      max = Math.max(item.score,max);
    })
    
    var temp_score = fileData[index].result.SIFT + fileData[index].SSIM + fileData[index].Hash + fileData[index].Color;
    temp_score/=4;
    setFileData((prev) => { 
      if(temp_score > 95 && max < 90)
      prev[index].finalScore = 'green';
      else if(temp_score > 90 && max < 95)
      prev[index].finalScore = 'Amber';
      else 
      prev[index].finalScore = 'red';
      return [...prev];
    });
  }

  const onChange = async (event)=>{
    setSelected(event.target.files);
    for(var file of event.target.files){
      await appendFile(file);
    }
  }

  const appendFile = async (file) => {
    return new Promise((resolve, reject) => {
      if (file) {
        const reader = new FileReader();
  
        reader.onload = (event) => {
          const newFileData = {
            src: event.target.result,
            template: null,
            data: null,
            result: null,
            textResult: null,
            similarResult: [],
            similarityScore: [],
            upload: false,
            finalScore: null,
          };
  
          setFileData((prev) => [...prev, newFileData]);
          resolve(newFileData);
        };
  
        reader.onerror = (error) => {
          reject(error);
        };
  
        reader.readAsDataURL(file);
      } else {
        reject(new Error('No file provided'));
      }
    });
  };
  
  const onUpload = async (Item, index) => {
    setFileData((prev) => {
      prev[index].upload = true;
      return [...prev];
    });
    const obj = [...selected]
    console.log(obj)
    const imageRes = await startUpload(Array.from([obj[index]]));
    var imgUrl = null
    if(imageRes ){
      imgUrl = imageRes[0].fileUrl;
    }
    
    if(imgUrl){
      const fileReader = new FileReader();
      fileReader.onload = async () => {
        try {
          const templates = {
            imgUrl : imgUrl,
            data: fileReader.result.split(';base64,').pop(),
          };
          const vectorresponse = await axios.post('/api/vectorUpload', JSON.stringify(templates), {
            headers: {
              'Content-Type': 'application/json',
            },
          });
          console.log(vectorresponse);
        } catch (error) {
          console.log("Error in getMatch:", error);
        }
      };
      
      fileReader.readAsDataURL(selected[index]);
    }
    setFileData((prev) => {
      prev[index].upload = false;
      return [...prev];
    });
  }
  
  return (
    // <div className='grid grid-cols-2  h-screen border-solid border-2 border-black'>
    //   <div className='col-span-2 row-span-1 grid grid-cols-2 border-solid border-2 border-black'>
    //     <InputFile selected={selected}  submitting={submitting}  onSubmit={onSubmit} onChange={onChange} />
    //     <div className='border-solid border-2 border-black col-span-1 flex flex-col gap-2 justify-center items-center '>
    //       {fileData.length>0 && <FileCard src={fileData[0].src} name={"Selected"} />}
    //       {fileData.length>0 && fileData[0].data && <Popovertext text={fileData[0].data} />}
    //     </div>
    //     </div> 
    //   <div className='col-span-3 row-span-1 border-solid border-2 border-black'></div>
    //   <div className='col-span-5 row-span-1 border-solid border-2 border-black grid grid-cols-3'> 
    //     {fileData.length > 0 && fileData[0].similarResult.map((item,index)=>(
    //       <Similar item={item} index={index} similarityScore={fileData[0].similarityScore} />
    //     ))}
    //   </div>
    // </div>
          // {/* <InputFile selected={selected}  submitting={submitting}  onSubmit={onSubmit} onChange={onChange} /> */}
          //  {
          //   fileData.map((Item,index)=>(
          //     <div key={index} className='w-full flex gap-5'>
          //       <TemplateCard ext_text={Item.data} og_image={Item.src} og_template={Item.template} temp_score={Item.result} text_score={Item.textResult } index={index} upload={Item.upload} onUpload={onUpload} similarResult={Item.similarResult} similarityScore={Item.similarityScore} finalScore={Item.finalScore} ></TemplateCard>
          //     </div>
          //   ))
          // }
          
        //athesh adiccha code-uu
        <>
        {selected.length == 0 && <InputFile selected={selected}  submitting={submitting}  onSubmit={onSubmit} onChange={onChange} />}
        {selected.length != 0 && <div className='h-screen grid grid-cols-2 border-solid border-black border-2 '>  
            <div className='w-3/4'>
              <div className='border-2 border-black h-2/4'>
                {fileData.length > 0 && <Image src={fileData[0].src} width={300} height={400} />}
              </div>
              <div className='border-2 border-black h-2/4'>
              {fileData.length>0 && fileData[0].data && <Popovertext text={fileData[0].data} />}
              </div>
            </div>
          <div className='w-3/4 pt-5'>
         
          {/* <CCarousel controls indicators activeIndex={index} onSlid= {(active, direction)=>{
            setIndex(active)
            console.log(index) 
            }
            }>
            <CCarouselItem >
                <CImage className="d-block w-100 rounded-md" src="https://coreui.io/react/docs/static/react-83088efde08a5dedde9f67a954cb4b5b.jpg" alt="slide 1" />
                <CImage className="d-block w-100 rounded-md" src="https://coreui.io/react/docs/static/react-83088efde08a5dedde9f67a954cb4b5b.jpg" alt="slide 1" />
            </CCarouselItem>
            <CCarouselItem>
              <CImage className="d-block w-100 rounded-md" src="https://coreui.io/react/docs/static/vue-8a74d93fde1a02c247304291cce46797.jpg" alt="slide 2" />
              <CImage className="d-block w-100 rounded-md" src="https://coreui.io/react/docs/static/react-83088efde08a5dedde9f67a954cb4b5b.jpg" alt="slide 1" />
            </CCarouselItem>
            <CCarouselItem>
              <CImage className="d-block w-100 rounded-md" src="https://coreui.io/react/docs/static/angular-2f3764e2ec8b0b47ebe68f2f80260ef1.jpg" alt="slide 3" />
              <CImage className="d-block w-100 rounded-md" src="https://coreui.io/react/docs/static/react-83088efde08a5dedde9f67a954cb4b5b.jpg" alt="slide 1" />
            </CCarouselItem>
           
          </CCarousel> */}
          </div>
        </div>}
        </>
  )
}

const FileCard = ({src , name})=>{
  return(
    src && <div className=' flex flex-col justify-between items-center '>
      <h2 className='font-semibold text-lg'>{name}</h2>
      <img src={src} id={name} alt={name} className='h-[200px] w-[200px]' />
    </div>
  )
}


export default page
