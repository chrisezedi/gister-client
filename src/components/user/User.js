import React from 'react';
 const User = ({user}) => {
     return (
         user &&
         <div className="container">
             <div className="row justify-content-center">
                 <div className="col-md-6">
                    <div className="shadow-sm border-0">
                        <div className="d-flex justify-content-center">
                            <img src={user.picture} className="rounded-pill" alt={user.name} width="100px" height="100px"/>
                        </div>
                        <div className="card-body">
                            <h3>Name </h3> <p className="card-text">{user.name}</p>
                            <h3>Rooms </h3> <p className="card-text">{`${user.rooms.length}/5`}</p>
                        </div>
                    </div>
                 </div>
             </div>
         </div>
     )
 }

 export default User