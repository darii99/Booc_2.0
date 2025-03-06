import {redirect} from "react-router-dom";
import {api} from "./axiosTemplate.js"

//Get info about group for recreating form
export async function getGroup(groupName){
    var ProccesedResponse = "";
    await api.get('/api/group', {
          params: {
            groupName:groupName,
          }
        },{
          headers:{
            "Access-Control-Allow-Origin": "http://9.223.74.78:4000",
            "Access-Control-Allow-Credentials":"true",
          }
        })
        .then(function(response){
          //Test for failed login
          if(typeof response.data?.msg === "undefined" || response.data?.msg === "Failed to get group"){
            throw new Error("Invalid response");
          }
  
          //Test if successfully got group info
          ProccesedResponse = response.data.group;
        })
        .catch(function(error){
            console.log(error);
            ProccesedResponse = "Failed to get group info";
        })

    return ProccesedResponse;
}

//Get all groups the current user is in
//Will return array of groups that the user is in
export async function getAllGroups(){
    var ProccesedResponse = "";
    await api.get('/api/groups', {
        },{
          headers:{
            "Access-Control-Allow-Origin": "http://9.223.74.78:4000",
            "Access-Control-Allow-Credentials":"true",
          }
        })
        .then(function(response){
          //Test for failed login
          if(typeof response.data?.msg === "undefined" || response.data?.msg === "Failed to get groups"){
            throw new Error("Invalid response");
          }
  
          //Test if successfully got group info
          ProccesedResponse = response.data.groups;
        })
        .catch(function(error){
            console.log(error);
            ProccesedResponse = "Failed to get groups info";
        })
  
    return ProccesedResponse;
}

//Create group
export async function createGroup(groupName, members){
    var ProccesedResponse = "";
    await api.post('/api/group', {
          groupName:groupName,
          members:members,
        },{
          headers:{
            "Access-Control-Allow-Origin": "http://9.223.74.78:4000",
            "Access-Control-Allow-Credentials":"true",
          }
        })
        .then(function(response){
          //Test for failed login
          if(typeof response.data?.msg === "undefined" || response.data?.msg === "Failed to create group"){
            throw new Error("Invalid response");
          }
  
          //Test return
          ProccesedResponse = "Success";
        })
        .catch(function(error){
            console.log(error);
            ProccesedResponse = "Failed to create group";
        })
  
    return ProccesedResponse;
}

//Update group
export async function updateGroup(currentGroupName, groupName,owners,members){
    var ProccesedResponse = "";
    await api.put('/api/group', {
            currentGroupName:currentGroupName,
            groupName:groupName,
            owners:owners,
            members:members,
        },{
          headers:{
            "Access-Control-Allow-Origin": "http://9.223.74.78:4000",
            "Access-Control-Allow-Credentials":"true",
          }
        })
        .then(function(response){
          //Test for failed login
          if(typeof response.data?.msg === "undefined" || response.data?.msg === "Failed to update group"){
            throw new Error("Invalid response");
          }
  
          //Test return
          ProccesedResponse = "Success";
        })
        .catch(function(error){
            console.log(error);
            ProccesedResponse = "Failed to update group";
        })
  
    return ProccesedResponse;
}

//Delete group
export async function deleteGroup(groupName){
    var ProccesedResponse = "";
    await api.delete('/api/group', 
        {
        headers:{
          "Access-Control-Allow-Origin": "http://9.223.74.78:4000",
          "Access-Control-Allow-Credentials":"true",
        },
        data: {
          groupName:groupName,
        }
        })
        .then(function(response){
          //Test for failed login
          if(typeof response.data?.msg === "undefined" || response.data?.msg === "Failed to delete group"){
            throw new Error("Invalid response");
          }
  
          //Test return
          ProccesedResponse = "Success";
        })
        .catch(function(error){
            console.log(error);
            ProccesedResponse = "Failed to delete group";
        })
  
    return ProccesedResponse;
}

//Leave group
export async function leaveGroup(groupName){
  var ProccesedResponse = "";
  await api.delete('/api/groups', 
      {
      headers:{
        "Access-Control-Allow-Origin": "http://9.223.74.78:4000",
        "Access-Control-Allow-Credentials":"true",
      },
      data: {
        groupName:groupName,
      }
      })
      .then(function(response){
        //Test for failed login
        console.log("Controller: ",response)
        if(typeof response.data?.msg === "undefined" || response.data?.msg === "Failed to leave group"){
          throw new Error("Invalid response");
        }

        //Test return
        ProccesedResponse = "Success";
      })
      .catch(function(error){
          console.log(error);
          ProccesedResponse = "Failed to leave group";
      })

  return ProccesedResponse;
}