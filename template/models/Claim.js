import {Schema , model , models} from 'mongoose';

const ClaimSchema = new Schema({

    HospitalName:{
        type:String,
    },

    Claim:{
        type:Array,
    }

});

const Claim = models.Claim ||  model("Claim" , ClaimSchema);

export default Claim;