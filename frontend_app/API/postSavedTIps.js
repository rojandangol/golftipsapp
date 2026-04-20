// import axios from 'axios';
// //will send an async axios post request to /addSavedTips on node server with json data
// //expected data: {tips_id: int,user_id: int}
// const postSavedTips = async (data) =>{
//     try{
//         const response = await axios.post("http://localhost:3306/addSavedTip",data);
//         return response.data
//     }catch(err){
//         console.error("Error posting saved tip:" , err);
//         throw err;
//     }
// }

// export default postSavedTips;