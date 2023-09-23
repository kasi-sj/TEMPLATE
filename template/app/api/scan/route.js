// pages/api/upload.js
import axios from "axios";

export const POST = async(req) =>{
    try {
        const fileData = await req.json();
        if (!fileData || !fileData.name || !fileData.dataUrl) {
        return  new Response(JSON.stringify({ error: 'Invalid file data.' }),{status:400});
        }
        
        const base64Data = fileData.dataUrl.split(';base64,').pop();
        const binaryData = Buffer.from(base64Data, 'base64');
        const url = 'http://127.0.0.1:5000/api/scan';
        try {
            const response = await axios.post(url, {file:binaryData}, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            console.log(response.data);
            return  new Response(response.data,{status:200});
        } catch (error) {
            console.error('POST Error:', error);
        }
        return  new Response(JSON.stringify({ message: 'File saved successfully.' }),{status:200});

      } catch (error) {
        console.error('Error saving file:', error);
        return  new Response(JSON.stringify({ error: 'Invalid file data.' }),{status:400});
      }
}