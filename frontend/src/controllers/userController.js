import {redirect} from "react-router-dom";
import {api} from "./axiosTemplate.js"
import { useNavigate } from 'react-router-dom';

//Creates a new account and logs you in
export async function signUp(email, username, password){

  var redirect_target = "";

  try {
    // Log the request data before sending the request
    console.log("Sending request to create user with data:", {
      email: email,
      username: username,
      password: password,
    });

    const response = await api.post('/api/users', {
      email: email,
      username: username,
      password: password,
    });

    // Log the API response to understand its structure
    console.log("API Response:", response);

    // Check the response data for success
    if (response.data?.msg !== 'Created user') {
      throw new Error(response.data?.msg || "Failed to create user");
    }

    // If successful, set redirect target
    redirect_target = '/Profile'; // redirect to profile on success
    console.log("Redirect target:", redirect_target); // Log the target URL

    // Perform redirection using window.location.href
    window.location.href = redirect_target; // Redirect to profile page

  } catch (error) {
    // Log any error that occurs during the request
    console.error("Error during sign-up process:", error);
    redirect_target = 'invalid'; // In case of an error
  }

  return redirect_target;
}

export async function changeStartPage(startPage){
  var ProccesedResponse = "";
  await api.put('/api/users', {
        startPage:startPage,
      },{
        headers:{
          "Access-Control-Allow-Origin": "http://localhost:6400",
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
          "Access-Control-Allow-Origin": "http://localhost:6400",
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
          "Access-Control-Allow-Origin": "http://localhost:6400",
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