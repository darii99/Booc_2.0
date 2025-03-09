//import logo from './logo.svg';
import './Feed.css';
import React, { useEffect } from 'react';
// MUI
//import BasicTabs from './tabs';
import BasicButtons from './button';
import {ListOfFriends, ListOfGroups} from '../../modelData/Feed/list';
import LetterAvatars from './avatar';
// Self created
import Meeting from '../../modelData/Feed/meeting';
import Navbar from './navbar';
import Notification from '../../modelData/Feed/notification';

import BasicFriendModal from '../forms/add_friend';
import GroupModal from '../forms/create_group';
import ModifyGroupModal from '../forms/modify_group_form';
import { useState } from 'react';


// Axios and JWT related
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const API_URL = process.env.NODE_ENV === 'production' ? '/api' : 'http://localhost:6401';

function Feed() {
  const [userToken, setUserToken] = useState(localStorage.getItem('token'));
  const [userData, setUserData] = useState(null);
  const [groups, setGroups] = useState([]); // Define the groups state
  const [loading, setLoading] = useState(true); // Loading state for groups
  const [error, setError] = useState(null); // Error state

  // Fetch user data and groups on mount or when userToken changes
  useEffect(() => {
    if (!userToken) return;

    const decodedToken = jwtDecode(userToken);
    const userEmail = decodedToken.email;
    setUserData({ email: userEmail });

    async function fetchGroups() {
      try {
        const response = await axios.get(`${API_URL}/groups`, {
          headers: {
            Authorization: `Bearer ${userToken}`,
          }
        });
        setGroups(response.data);
      } catch (error) {
        console.error('Error fetching groups:', error);
      }
    }

    fetchGroups();
  }, [userToken]);

  // Token expiration handling
  useEffect(() => {
    if (!userToken) return;
    const decodedToken = jwtDecode(userToken);
    const expiryTime = decodedToken.exp * 1000; // JWT expiration is in seconds

    const timer = setTimeout(() => {
      alert('Session expired. Please log in again.');
      localStorage.removeItem('token');
      setUserToken(null); // Clear the token
    }, expiryTime - Date.now());

    return () => clearTimeout(timer);
  }, [userToken]);

  const handleLogin = (newToken) => {
    localStorage.setItem('token', newToken);
    setUserToken(newToken);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUserToken(null);
  };
/*
import {io} from 'socket.io-client';
import { useRevalidator } from 'react-router';
import { getAllGroups } from '../../modelData/group';
const URL = process.env.NODE_ENV === 'production' ? undefined : 'http://localhost:6401';

const socket = io("http://localhost:6401", {
    withCredentials: true,
    headers:{
        "Access-Control-Allow-Origin": "http://localhost:6401",
        "Access-Control-Allow-Credentials":"true",
      }
  });

function Feed() {
    const revalidator = useRevalidator();
    const Revalidatecallback = () => revalidator.revalidate();
    const [groups, setGroups] = React.useState([]);

    useEffect(() => {
        console.log("Connected to server by socket");

        async function getGroups(){
            const groupGot = (await getAllGroups());
            console.log(groupGot);
            setGroups(groupGot);
        }

        socket.on('connect', function () {
            console.log(`Connected to server`);
        });

        socket.on('sendingObj', function () {
            console.log(`Recived`);
            Revalidatecallback();
        });

        getGroups();

        return () => {
            socket.off('sendingObj');
        }
    },[]);

    function connect () {
        console.log("connected");
        socket.connect();
    }

    function disconnect(){
        console.log("disconnected");
        socket.disconnect();
    }
*/

  return (
    <div style={{ height: '100vh', width: '100%', overflow: 'hidden'  }}>
        <Navbar page={'Feed'}/>

        <div className="grid-container" style={{
                display: 'grid',
                gridTemplateColumns: '25% 50% 25%',
                height: 'calc(100vh - 65px)'
            }}>
            <div className="contacts" >
                <div className='list' style={{ height: 'calc((100vh - 90px)/2)', marginBottom: '10px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                        <h2>Friends</h2>
                        <BasicFriendModal displayText={"+"}/> 
                    </div>
                    <div style={{ height: 'calc((100vh - 90px)/2 - 61px)', overflow: 'auto' }}>
                        <ListOfFriends/>
                    </div>
                </div>
                <div className='list' style={{ height: 'calc((100vh - 90px)/2)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                        <h2>Groups</h2>
                        <div>
                            <div style={{ float: 'right' }}>
                                <GroupModal displayText={"+"}/> 
                            </div>
                            {groups.length > 0 ? 
                            <div style={{ float: 'right', marginRight: '5px'}}>
                                <ModifyGroupModal displayText={"✎"}/>
                            </div>
                            : <div/>}
                        </div>
                    </div>
                    <div style={{ height: 'calc((100vh - 90px)/2 - 61px)', overflow: 'auto' }}>
                        <ListOfGroups/>
                    </div>
                </div>
            </div>

            <div className="meatings">
                <h2>Events</h2>
                 <Meeting/>
            </div>

            <div className="info">
                
                
                {
                    //<h2>Notifications</h2>
                    //<Notification/>
                    //<Notification/>
                    //<button onClick={ connect }>Connect</button>
                    //<button onClick={ disconnect }>disconnect</button>

                }
                
            </div>
        </div>

    </div>
  );
}

export default Feed;