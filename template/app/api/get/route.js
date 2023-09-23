import { connectTodDB } from "../../../utils/database";
import Hospital from "../../../models/Hospital";
export const POST = async(req)=>{
    const {hospital_contact,hospital_name } = await req.json();
    console.log(hospital_contact,hospital_name);
    try{
        await connectTodDB();
        const hospital = await Hospital.aggregate([
            {
              $addFields: {
                matchScore: {
                  $sum: [
                    { $cond: [{ $eq: ["$fieldName", hospital_name] }, 1, 0] },
                    { $cond: [{ $eq: ["$contactNo", hospital_contact?.phone] }, 1, 0] },
                    { $cond: [{ $eq: ["$address", hospital_contact?.address] }, 1, 0] },
                  ]
                }
              }
            },
            {
              $sort: { matchScore: -1 } // Sort in descending order of matchScore
            },
            {
              $limit: 1 // Limit to retrieve only the document with the highest match score
            },
            {
              $project: {
                matchScore: 0 // Exclude the matchScore field from the final result if you don't need it
              }
            }
          ]);
        console.log(hospital);
        return new Response(JSON.stringify(hospital[0]),{status:200});
    }catch(error){
        console.log(error);
        return new Response("Failed to create a template",{status:500});
    }
}

