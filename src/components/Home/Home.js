import React, { useState, useEffect } from 'react';
import {useHistory} from 'react-router-dom';
import * as queryString from 'query-string';

import './Home.css';

 const Home = () => {
     const [splashscreen,setSplashscreen] = useState(true);  
     let history = useHistory();

     useEffect(() => {
         if (!localStorage.getItem('x-auth-token')) {
            const urlParams = queryString.parse(window.location.search);
            if (urlParams.code) {
                async function getAccessToken(code) {
                    return await fetch(`${process.env.REACT_APP_API_ENDPOINT}/get-token`,{
                        method:'POST',
                        body:JSON.stringify({code}),
                        headers:{'Content-type':'application/json'}       
                    });
                }
                const token = getAccessToken(urlParams.code)
                    .then(res=>res.json())
                    .then(result=>{
                        localStorage.setItem('x-auth-token',result.token);
                        history.push({pathname:'/dashboard'});
                    })
            }
         } else {
            history.push({pathname:'/dashboard'});
         }
     })

     setTimeout(()=>{setSplashscreen(false)},5000);
     
     const googleAuth = () => {

         fetch(`${process.env.REACT_APP_API_ENDPOINT}/google-auth`,{
             method:'POST'
         })
            .then(res => res.json())
            .then(result => {
                window.location.href = result.url;
            })
     }

     return (
         <div id="home" className="primary-color">
            <div className="container-fluid full-height ">
                {splashscreen 
                    ?
                    <div className="row full-height">
                        <div className="col-12 full-height d-flex flex-column justify-content-center align-items-center">
                            <div className="shadow p-5">
                                <p className="text-shadow display-1 text-center">Gister</p>
                                <div>
                                    <span className="text-center text-white">The chat app for millenials</span>
                                    <span><i className="fas fa-comment-alt display-5 mx-2 text-white"></i></span>
                                </div>
                                <div>
                                <small className="text-white text-center ">Signin - Create Room - Share Link - Chat </small>
                                </div>
                            </div>

                            <div className="d-flex justify-content-center mt-3">
                                <div className="spinner-grow text-white" role="status">
                                    <span className="sr-only">Loading...</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    : 
                <div className="row full-height ">
                    <div className="col-md-7 d-none d-sm-block">
                        <div className="full-height d-flex flex-column justify-content-around">
                            <div className="row justify-content-center">
                                <div id="step-box" className="col-md-5 d-flex flex-column align-items-center m-1 p-4 bg-white rounded ">
                                    <div id='icon' className="d-flex flex-column align-items-center shadow mb-3 primary-color">
                                        <h1>1</h1>
                                    </div>
                                    <p>Signin</p>
                                </div>

                                <div id="step-box" className="col-md-5 d-flex flex-column align-items-center m-1 p-4 bg-white rounded">
                                    <div id='icon' className="d-flex flex-column align-items-center shadow mb-3 primary-color">
                                        <h1>2</h1>
                                    </div>
                                    <p>Create Room</p>
                                </div>

                                <div id="step-box" className="col-md-5 d-flex flex-column align-items-center m-1 p-4 bg-white rounded">
                                    <div id='icon' className="d-flex flex-column align-items-center shadow mb-3 primary-color">
                                        <h1>3</h1>
                                    </div>
                                    <p>Share link</p>
                                </div>

                                <div id="step-box" className="col-md-5 d-flex flex-column align-items-center m-1 p-4 bg-white rounded">
                                    <div id='icon' className="d-flex flex-column align-items-center shadow primary-color">
                                        <h1>4</h1>
                                    </div>
                                    <p>Chat !</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="col-md-5">
                        <div className="d-flex full-height flex-column justify-content-center align-items-center">
                            <div id="auth-form" className="shadow-lg">
                                <h2 className="text-center text-shadow">Get Started</h2>
                                <div className="d-flex flex-column">
                                    <button className="btn bg-white mb-1" onClick={googleAuth}>
                                        <i className="fab fa-google text-danger"></i>
                                        Login with Google
                                    </button>          
                                </div>
                            </div>
                            
                        </div>
                    </div>
                </div>
                }
            </div>
         </div>
     )
 }

 export default Home