import {redirect} from "react-router-dom";
import {api} from "./axiosTemplate.js"

//Creates a new account and logs you in
export async function signUp(email, username, password){
  var redirect_target = "";
  const response = await api.post('/api/users', {
      email:email,
      username: username,
      password: password,
    })
    .then(function(response){
      //Test for failed creation of account
      if(response.data?.msg !== "Created user"){
        throw Error(response.msg);
      }
      redirect_target = "/Profile";
    })
    .catch(function(error){
      console.log(error);
      redirect_target = "invalid";
  })
  return redirect_target;
}

export async function changeStartPage(startPage){
  var ProccesedResponse = "";
  await api.put('/api/users', {
        startPage:startPage,
      },{
        headers:{
          "Access-Control-Allow-Origin": "http://9.223.74.78:4000",
          "Access-Control-Allow-Credentials":"true",
        }
      })
      .then(function(response){
        //Test for failed login
        if(typeof response.data?.msg === "undefined" || response.data?.msg === "Failed to change start page"){
          throw new Error("Invalid response");
        }

        //Test return
        return "Success";
      })
      .catch(function(error){
          console.log(error);
          ProccesedResponse = "Failed to change start page";
      })

  return ProccesedResponse;
}


export async function changePassword(password) {
  var ProccesedResponse = "";
  await api.put('/api/password', {
        password:password,
      },{
        headers:{
          "Access-Control-Allow-Origin": "http://9.223.74.78:4000",
          "Access-Control-Allow-Credentials":"true",
        }
      })
      .then(function(response){
        //Test for failed login
        if(typeof response.data?.msg === "undefined" || response.data?.msg === "Failed to change password"){
          throw new Error("Invalid response");
        }

        //Test return
        return "Success";
      })
      .catch(function(error){
          console.log(error);
          ProccesedResponse = "Failed to change password";
      })

  return ProccesedResponse;
}

//Deletes the currently logged in user
export async function deleteUser() {
  var ProccesedResponse = "";
  await api.delete('/api/users',{
        headers:{
          "Access-Control-Allow-Origin": "http://9.223.74.78:4000",
          "Access-Control-Allow-Credentials":"true",
        }
      })
      .then(function(response){
        //Test for failed login
        if(typeof response.data?.msg === "undefined" || response.data?.msg === "Failed to delete user"){
          throw new Error("Invalid response");
        }

        //Test return
        return "Success";
      })
      .catch(function(error){
          console.log(error);
          ProccesedResponse = "Failed to delete user";
      })

  return ProccesedResponse;
}

export async function getCurrentUser(){
  var user;

  try {
    const response = await api.get('/api/users', user);
    if(typeof response.data === "undefined" || response.data?.msg === "Failed to get user"){
      throw "Error";
    }
    user = response.data;
    //console.log(userNameHere.email);
  }
  catch (error) {
    console.log(error)
    return "Failed to get user";
  }
  
  return user;
}