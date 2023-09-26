// pages/api/upload.js
import formidable from "formidable"
import path from "path"
import fs from 'fs';
import axios from "axios";

export const POST = async(req) =>{
    try {
        console.log("received file here")
        const templates = await req.json();
        if (!templates || !templates.data ) {
        return  new Response(JSON.stringify({ error: 'Invalid file data.' }),{status:400});
        }
        const url = 'http://127.0.0.1:5000/api/similar';
        const requestData = {
          file :{
            data : templates.data,
          }
        }
        try {
            const response = await axios.post(url,requestData,);
            console.log(response);
            if (response.status === 200) {
                return  new Response(JSON.stringify(response.data),{status:200});
              } else {
                throw new Error('Image processing failed.');
              }
        } catch (error) {
            console.error('POST Error:', error);
        }
        return  new Response(JSON.stringify({ message: 'File saved successfully.' }),{status:200});

      } catch (error) {
        console.error('Error saving file:', error);
        return  new Response(JSON.stringify({ error: 'Invalid file data.' }),{status:400});
      }
}