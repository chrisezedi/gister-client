import React, { useEffect, useState } from 'react';
import * as Yup from 'yup';

import Input from '../Input/Input';
import './Chat.css';

const validationSchema = Yup.object().shape({
    name:Yup.string().required('Name field is required'),
    password:Yup.string().required('password field is required')
 });

 const Chat = ({match,socket}) => {

    const LoggedIn = () => {
        return sessionStorage.getItem('name') && sessionStorage.getItem('password') ?  true : false;
   }
     const [room,setRoom] = useState(null);
     const [isLoggedIn,setIsLoggedIn] = useState(LoggedIn());
     const [error,setError] = useState(null);
     const [message,setMessage] = useState('');
     const [messages,setMessages] = useState([]);

    let id = match.params.id;

    useEffect(() => {
        //load messages from room
        fetch(`${process.env.REACT_APP_API_ENDPOINT}/room/${id}`)
            .then(res => res.json())
            .then(result => {
                setMessages(result.messages);
                setRoom(result)
            })
            .catch(error => console.log(error))

        if (isLoggedIn && room === null) {
            let payload = {
                name:sessionStorage.getItem('name'),
                password:sessionStorage.getItem('password'),
                init:false
            }
            socket.emit('join',{id,payload},(error)=>{
                error && setError(error)              
            })
        }

        socket.on('joinSuccess', message => {
            if (!isLoggedIn) {
                message.name && sessionStorage.setItem('name',message.name);
                message.password && sessionStorage.setItem('password',message.password);
                setIsLoggedIn(true)
            }
            message.init && setMessages(messages => [ ...messages, {user:message.user, message:message.text} ]);
            message.room && setRoom(message.room);
            });

            socket.on('message', message => {
                 setMessages(messages => [ ...messages, {user:message.user, message:message.text} ]);
            });

            socket.on('logout', message => {
                if (message.logout) {
                    setMessages(messages => [ ...messages, {user:message.user, message:message.text} ]);
                    setRoom(message.room)
                } 
           });
    },[]);

    const handleSubmit = (event) => {
        event.preventDefault();
        let formData = {
            name:event.target.name.value,
            password:event.target.password.value,
            init:true
        }
        
           validationSchema.validate(formData)
           .then((payload)=>{
               socket.emit('join',{id,payload},(error)=>{
                   error && setError(error)              
               })
           })
           .catch((err)=>setError(err.message))
    }

    const sendMessage = (event) => {
        event.preventDefault();   
        const name = sessionStorage.getItem('name');
        message && socket.emit('sendMessage',{id,name,message}, ()=>setMessage(''));
    }

    const logout = () => {
        socket.emit('setLogout',{id},(logout)=>{
            if (logout) {
                sessionStorage.removeItem('name');
                sessionStorage.removeItem('password');
                if (!sessionStorage.getItem('name') && !sessionStorage.getItem('password')) {
                    window.location.reload()        
                }
            }
        })
    }
   
     return (
       <section className="full-height">
           {
               !isLoggedIn ?
               <div className="container" id="chat">
               <div className="row shadow-sm p-3 mb-1 rounded">
                   <div className="col-12">
                      <h1>Room {room && room.name}</h1>
                      {error}
                      <form onSubmit={(event)=>handleSubmit(event)}>
                          <div className="form-row">
                              <div className="col-md-3 my-1">
                                  <input 
                                      type="text" 
                                      className="form-control" 
                                      name="name" 
                                      placeholder="Username" 
                                      onChange={(e)=>{}}
                                  />
                              </div>

                              <div className="col-md-4 my-1">
                                  <input 
                                      type="text" 
                                      className="form-control" 
                                      name="password" 
                                      placeholder="Room password"
                                      onChange={(e)=>{}}
                                  />
                              </div>

                              <div className="col-md-3 my-1">
                                  <button 
                                      className="btn btn-danger btn-block" 
                                      type="submit">JOIN
                                  </button>
                              </div>
                          </div>
                      </form>
                   </div>
               </div>
           </div> 
           :
            <div className="container-fluid full-height" id="chat">
               <header>
                    <div className="d-flex justify-content-between">
                        <h3>{match.params.name}</h3>
                        <button className="btn btn-danger" onClick={logout}>
                            <span><i className="fas fa-sign-out-alt"></i></span>
                        </button>
                    </div>
                </header>

                <div className="row" id="chatarea">
                    <div className="col-md-3 d-none d-sm-block">
                        <ul className="py-0">
                            {
                                room !== null &&
                                room.members.map((member,index)=>
                                    <li key={index} className="list-group-item d-flex justify-content-between align-items-center shadow-sm my-1 bg-white rounded">
                                        {member.name}
                                    </li>
                                )
                            }
                        </ul>
                    </div>

                    <div className="col-md-9 p-1">
                        <div>
                        {
                                messages !==[] && messages.map((message,index)=>
                                <div key={index} className={sessionStorage.getItem('name') === message.user ? 'd-flex justify-content-end' : 'd-flex justify-content-start'}>
                                    <span 
                                    className={
                                        sessionStorage.getItem('name') === message.user 
                                        ? 'msgBox bg-white p-1 mb-2 shadow-sm align-content-center' 
                                        : 'msgBox bg-white p-1 mb-2 shadow-sm align-content-center'
                                        } >
                                    <span className="badge badge-danger">{message.user}</span>
                                    <p key={index} className="mb-0">{message.message}</p>
                                    </span> <br></br>
                                </div>)
                            }
                        </div>

                        <div className="d-flex justify-content-center">
                            <div id="inputContainer">
                                <Input setMessage={setMessage} sendMessage={sendMessage} message={message}/>
                            </div>
                        </div>

                        </div>
                </div>
            </div>  
           }
       </section>
     )
 }

 export default Chat