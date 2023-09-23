import { connectTodDB } from "../../../utils/database";
import User from "../../../models/user";
export const POST = async(req)=>{
    const {position , username , password } = await req.json();
    try{
        await connectTodDB();
        const response = await User.findOne({position:position,username:username});
        console.log(response)
        if(response==null){
            return new Response("Failed to Log In",{status:404});
        }
        else if(response.password==password){
            console.log('ok')
            return new Response(JSON.stringify(response),{status:200});
        }else{
            return new Response("password mismatch",{status:500});
        }
    }catch(error){
        return new Response("Failed to connect to DB",{status:500});
    }
}