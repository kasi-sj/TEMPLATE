import { connectTodDB } from "../../../utils/database";
import Hospital from "../../../models/Hospital";
import User from '../../../models/user'
export const POST = async(req)=>{
    const {id , field , fieldName , address , bio , contactNo, password , template } = await req.json();
    try{
        await connectTodDB();
        const hospital = new Hospital({ _id : id ,template  , field , fieldName,contactNo,address,bio,password})
        await hospital.save();
        const user = new User({position:"Hospital" , username:fieldName , password:password});
        await user.save();
        return new Response(JSON.stringify({}),{status:200});
    }catch(error){
        return new Response("Failed to create a template"+error,{status:500});
    }
}