import React from 'react';

import './Input.css';

 const Input = ({setMessage,sendMessage,message}) => {
     
     return (
         <div id="input" className="container">
             <div className="row">
                 <div className="col-12">
                    <div className="input-group mb-3">
                        <textarea
                            id="textarea"
                            className="form-control" 
                            cols='50' 
                            rows="2"
                            placeholder="Type a message ..."
                            value={message} 
                            onChange={(e)=>{setMessage(e.target.value)}}
                            onKeyPress={event => event.key === 'Enter' ? sendMessage(event) : null}
                        >
                        </textarea>
                        <div className="input-group-append">
                        <button className="btn btn-danger ml-1" onClick={ e => sendMessage(e)} >
                            SEND
                        </button>
                        </div>
                    </div>
                 </div>
             </div>
         </div>
     )
 }

 export default Input