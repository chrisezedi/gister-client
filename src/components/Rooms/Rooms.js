import React, { useState,useEffect } from 'react';
import {Link} from 'react-router-dom';
import * as Yup from 'yup';

import './Rooms.css';
import Snackbar from '../Snackbar/Snackbar';

//validation
const validationSchema = Yup.object().shape({
    name:Yup.string().required('Room name field is required').max(10),
    password:Yup.string().required('Password field is required').min(6)
});

let token = localStorage.getItem('x-auth-token');

const Rooms = ({user,setUser}) => {
    const [snackbar,setSnackbar] = useState({display:false,message:''});
    const [formVisibilityToggler,setFormVisibility] = useState(false);
    const [error,setError] = useState('');

    useEffect(() => {
        setUser(user)
    }, [user])

    function handleClick() {
        if (user.rooms.length < 5) {
           return formVisibilityToggler ? setFormVisibility(false) : setFormVisibility(true)   
        }
        setError('You cant create more than five(5) rooms.')
    }

    //submit handle:creating a room
    const handleSubmit = (event) => {
        event.preventDefault();

        //retrieve form data
        let formData = {
            name:event.target.name.value.trim(),
            password:event.target.password.value.trim()
        }

        //validate form
        validationSchema.validate(formData)
            .then(payload=>{
                console.log(process.env.REACT_APP_API_ENDPOINT)
                fetch(`${process.env.REACT_APP_API_ENDPOINT}/room`, {
                    method:'POST',
                    body:JSON.stringify(payload),
                    headers:{
                        'Content-type':'application/json',
                        'x-auth-token':token
                    }
                })
                    .then(res => res.json())
                    .then(result => {
                        setUser(result.user);
                        setFormVisibility(false);
                        error && setError('')
                     },error => setError(error));
            })
            .catch(error=>setError(error.message))
    }

    //update handler:update a room
    const handleUpdate = (e,index) => {
        e.preventDefault();
        //retrieve form data
        let formData = {
            name:e.target.name.value.trim(),
            password:e.target.password.value.trim()
        }

        //set form value to initial value if input is empty
        if (formData.name === "" ) {
            formData.name = user.rooms[index].name;
        }
        
        fetch(`${process.env.REACT_APP_API_ENDPOINT}/room/${user.rooms[index]._id}`, {
            method:'PUT',
            body:JSON.stringify(formData),
            headers:{'Content-type':'application/json','x-auth-token':token}
        })
            .then(res => res.json())
            .then(result =>{
                setUser(result.user);
                setSnackbar({display:true,message:'update successfull'})
             }
                );   
        
    }

    //delete handler:delete a room 
    const handleDelete = (id) =>{
        fetch(`${process.env.REACT_APP_API_ENDPOINT}/room/${id}`, {
            method:'DELETE',
            headers:{'Content-type':'application/json','x-auth-token':token}
        })
            .then(res => res.json())
            .then(result => {
                setUser(result.user);
             },error => setError(error));
    }

    //copy room url to clipboard
    const copyUrlToClipboard = (token) => {
        let href = document.getElementById(`chat-room-url${token}`).getAttribute('href');
        href = encodeURI(`${process.env.REACT_APP_CLIENT_ENDPOINT}${href}`);

        document.getElementById('hiddenUrlInput').setAttribute('value',href);
        document.getElementById('hiddenUrlInput').select();
        document.execCommand('copy');
        setSnackbar({display:true,message:'Room Link copied to Clipboard'});
    }

     return (
         user &&
            <div className="container">
                <div className="row justify-content-md-center">
                    <div className="col-md-8">
                        <button className="btn btn-danger float-right" onClick = {handleClick}>
                            <span><i className="fas fa-plus p-1"></i></span>
                        </button>

                        <h1>Rooms</h1>

                        <div className="visibility">
                            <input id="hiddenUrlInput"  onChange={()=>{}}/>
                        </div>

                        {error}<br></br>

                        {user.rooms.length === 0 && 'You haven"t created any room yet' }
                        {
                        user &&  user.rooms.map((room,index)=>

                        <div key={index}>
                            <ul className="list-group">
                                <li className="list-group-item d-flex justify-content-between align-items-center shadow-sm p-1 m-1 border-0 bg-white rounded">
                                    {room.name}
                                    <div>
                                        <button 
                                            className="btn p-2 text-danger" 
                                            data-toggle="collapse" data-target={`#${room.name}`.trim().replace(' ','-')} aria-expanded="false"
                                            >
                                            <span><i className="fas fa-pencil-alt p-1"></i></span>
                                        </button>

                                        <Link className="btn p-2 text-danger" to={`/chat/${room.name}/${room._id}`} id={`chat-room-url${room._id}`}>
                                            <span><i className="fas fa-comment-alt p-1"></i></span>
                                        </Link>

                                        <button className="btn p-2 text-danger" onClick={()=>copyUrlToClipboard(room._id)}>
                                            <span><i className="fas fa-link p-1"></i></span>
                                        </button>

                                        <button className="btn p-2 text-danger" onClick={()=>handleDelete(room._id)}>
                                            <span><i className="fas fa-trash p-1"></i></span>
                                        </button>
                                    </div>
                                </li>
                                <div className="collapse" id={`${room.name}`.trim().replace(' ','-')}>
                                    <div className="shadow-sm p-3 mt-5 bg-secondary rounded">
                                        <form onSubmit={(e)=>handleUpdate(e,index)}>
                                            <div className="form-row">
                                                <div className="col-md-4 my-1">
                                                    <input 
                                                        type="text" 
                                                        className="form-control" 
                                                        name="name" 
                                                        placeholder="New name" 
                                                        onChange={(e)=>{}}
                                                    />
                                                </div>

                                                <div className="col-md-4 my-1">
                                                    <input 
                                                        type="text" 
                                                        className="form-control" 
                                                        name="password" 
                                                        placeholder="New password"
                                                        onChange={(e)=>{}}
                                                        />
                                                </div>

                                                <div className="col-md-4 my-1">
                                                    <button 
                                                        className="btn btn-danger btn-block" 
                                                        type="submit">Update
                                                    </button>
                                                </div>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </ul>
                        </div>
                        )
                        }

                            {
                                formVisibilityToggler && 
                                    <form onSubmit={event=>handleSubmit(event)}>
                                        <div className="form-row">
                                            <div className="col-md-4 my-1">
                                                <input 
                                                    type="text" 
                                                    className="form-control" 
                                                    placeholder="Room name"
                                                    name="name" 
                                                    />
                                            </div>

                                            <div className="col-md-4 my-1">
                                                <input 
                                                    type="text" 
                                                    className="form-control" 
                                                    placeholder="Room password"
                                                    name="password"
                                                    />
                                            </div>

                                            <div className="col-md-4 my-1">
                                                <button 
                                                    className="btn btn-danger btn-block" 
                                                    type="submit" 
                                                >Submit
                                                </button>
                                            </div>
                                        </div>
                                </form>
                            }
                    </div>
                </div>

                <Snackbar  snackbar={snackbar} setSnackbar={setSnackbar} />              

        </div>
     )
 }

 export default Rooms