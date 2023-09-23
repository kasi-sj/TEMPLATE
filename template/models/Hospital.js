import {Schema , model , models} from 'mongoose';

const HospitalSchema = new Schema({
    field:{
        type:String,
    },
    fieldName:{
        type:String,
    },
    contactNo:{
        type:Number,
    },
    bio:{
        type:String,
    },
    address:{
        type:String,
    },
    template:{
        type:String,
    },
    password :{
        type : String,
        required :[true , 'password is required!'],
        match : [/^(?=.{8,20}$)(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$/, "password invalid, it should contain 8-20 alphanumeric letters and be unique!"]
    }
});

const Hospital = models.Hospital ||  model("Hospital" , HospitalSchema);

export default Hospital;