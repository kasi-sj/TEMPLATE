import { connectTodDB } from "../../../../utils/database";
import Claim from "../../../../models/Claim";
export const POST = async(req)=>{
    const {HospitalName,Claimdata} = await req.json();
    try{
        await connectTodDB();
        const claimresult = new Claim({HospitalName,Claim : Claimdata});
        await claimresult.save();
        return new Response(JSON.stringify({}),{status:200});
    }catch(error){
        return new Response("Failed to create a Claim"+error,{status:500});
    }
}