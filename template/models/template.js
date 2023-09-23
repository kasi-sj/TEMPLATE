import {Schema , model , models} from 'mongoose';

const TemplateSchema = new Schema({
    _id :{
        type:String
    },
    imageName:{
        type:String
    },
    imgUrl :{
        type : String,
        required :[true , 'url is required!'],
    }
});

const Template = models.Template ||  model("Template" , TemplateSchema);

export default Template;