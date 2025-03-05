import axios from 'axios';
import {api} from "./axiosTemplate.js"

//Checks if you are logged in
export async function login(email, password){
  var redirect_target = "";
  const response =  await api.post('/api/auth', {
        email:email,
        password: password,
      },{
        headers:{
          "Access-Control-Allow-Origin": "http://gateway:4000",
          "Access-Control-Allow-Credentials":"true",
        }
      })
      .then(function(response){
        //Test for failed login
        if(typeof response.data?.msg === "undefined" || response.data?.msg === "Bad credentials"){
          throw new Error("Response not found");
        }

        //If success then redirect to next page
        if(response.data.startingPage == 0){
          redirect_target = "/Profile";
        }
        else{
          redirect_target =  "/Feed";
        }
      })
      .catch(function(error){
          console.log(error);
          redirect_target = "invalid";
      })

  //cookies.set("Session", response);
  return redirect_target;
}

//Checks your seesion cookie to see if you are logged in
export async function isAuth(){
  return await api.get('/api/auth', {
      })
      .then(function(response){
        //Test for failed login
        if(typeof response.data?.msg === "undefined"){
          throw new Error(response.data.msg);
        }
        //Checks if the user was authenticated or not
        if(response.data.msg == "You are authenticated"){
            return "authenticated";
        }
        else{
            return "Not authenticated";
        }
      })
      .catch(function(error){
        return("failed to get authenticated status");
      })
}

export async function logOut() {
    return await api.delete("/api/auth", {
    })
    .then(function(response){
      if(typeof response.data?.msg === "undefined"){
        throw new Error(response.data.msg);
      }

      if(response.data.msg === "Logged out"){
        return 1;
      }
      else{
        return 0;
      }
    })
    .catch(function(error){
      console.log("The following error originates from logOut .catch:\n")
      console.log(error);
      return 0;
    })
}