import { connectTodDB } from "../../../../utils/database";
import Claim from "../../../../models/Claim";
export const POST = async(req)=>{
    const {HospitalName} = await req.json();
    console.log(HospitalName);
    try{
        await connectTodDB();
        const claimresult = await Claim.findOne({HospitalName});
        return new Response(JSON.stringify(claimresult),{status:200});
    }catch(error){
        return new Response("Failed to create a Claim"+error,{status:500});
    }
}