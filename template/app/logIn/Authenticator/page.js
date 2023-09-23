'use client'
import React, { useEffect } from 'react'
import axios from 'axios';
import { useState } from 'react';
import { InputFile } from '@/components/input'
import TemplateCard from '@/components/TemplateCard';


const page = () => {
  const [submitting , setSubmitting] = useState(false);
  const [selected , setSelected] = useState([]);
  const [fileData , setFileData] = useState([]);

  const onSubmit = async (event)=>{
    setSubmitting(true)
    for(var index = 0 ; index < selected.length ; index++){
      const Item = selected[index];
      await appendData(Item,index);
    }
    setSubmitting(false)
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
  
          resolve(matchresponse.data);
        } catch (error) {
          console.log("Error in getMatch:", error);
          resolve(null);
        }
      };
      
      fileReader.readAsDataURL(selected[index]);
    });
  };




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
  
  
  return (
    <div className='flex flex-row flex-wrap justify-evenly items-center'>
        <div className='flex-col justify-center items-center'>
          <InputFile selected={selected}  submitting={submitting}  onSubmit={onSubmit} onChange={onChange} />
          {
            fileData.map((Item,index)=>(
              <div key={index} className='w-full flex gap-5'>
                <TemplateCard ext_text={Item.data} og_image={Item.src} og_template={Item.template} temp_score={Item.result} text_score={Item.textResult}></TemplateCard>

              </div>
              
            ))
          }
        </div>
    </div>
  )
}

const FileCard = ({src , name})=>{
  return(
    src && <div className='w-1/3 pr-4 flex flex-col'>
      <h2>{name}</h2>
      <img height={600} src={src} id={name} alt={name} />
    </div>
  )
}


export default page
