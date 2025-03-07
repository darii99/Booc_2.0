import {api} from "./axiosTemplate.js"

export async function getEvents(username, identifier){
    var event = [];
  
    try {
      const response = await api.get('/api/event', {params: { username, identifier }});
      if(typeof response.data === "undefined" || response.data?.msg === "Failed to get user"){
        throw "Error";
      }
      event = response.data.group;
      //console.log("Full response:", event[0].title);
    }
    catch (error) {
      console.log(error)
      return [];
    }
    // console.log("Jag är efter frontend och getEvents");
    return event;
}



export async function deleteEvent(_id)
{
  var ProccesedResponse = "";

  await api.delete('/api/event', 
    {
      headers: {
        "Access-Control-Allow-Origin": "http://9.223.169.233:4000",
        "Access-Control-Allow-Credentials":"true",
      },
      data: {
        _id:_id,
      }
    })
    .then(function(response) {

      if (typeof response.data?.msg === "undefined" || response.data?.msg === "Failed to delete event") {
        throw new Error("Invalid response");
      }

      ProccesedResponse = "Success";
    })
    .catch(function(error) {
      console.log(error);
      ProccesedResponse = "Failed";
    })

    return ProccesedResponse;
}


