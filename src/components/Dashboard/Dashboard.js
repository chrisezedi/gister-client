import React, {useState,useEffect} from 'react';
import {Link,Route,Switch,useHistory} from 'react-router-dom';

import './Dashboard.css';
import Rooms from '../Rooms/Rooms';
import User from '../user/User';
import Loading from '../Loading/Loading';

const Dashboard = ({match}) => {
    //state
    let history = useHistory();   
    const [user,setUser] = useState(null);

    useEffect(() => {
        let token = localStorage.getItem('x-auth-token');
        !token ? history.push('/') 
            :
            fetch(`${process.env.REACT_APP_API_ENDPOINT}/user`,{
                method:'GET',
                headers:{
                    'Content-type':'application/json',
                    'x-auth-token':token
                }
                })
                    .then(res => res.json())
                    .then(result => {
                        setUser(result.user);
                    })
    }, [])
     
     return (
         <div id="dashboard">
             {
                 user ?
                    <div className = "container-fluid">
                    <div className = "row mt-3">
                        <div className = "sidenav col-md-3 mb-3">
                            <ul className="nav flex-column">
                                <Link 
                                    className="btn bg-danger text-white shadow rounded" 
                                    to = {`${match.url}/rooms`}
                                    >
                                    Rooms 
                                    <span className="badge badge-light ml-1">
                                        {user.rooms.length !== 0 && user.rooms.length+' / 5'}
                                    </span>
                                </Link>
                            </ul>
                        </div>
                        
                        <div className = "col-md-9">
                            <div className="d-flex justify-content-center">
                                <Switch>
                                    <Route  path={`${match.path}/rooms`} render = {({match})=><Rooms user = {user} setUser = {setUser} match={match}/>}/>
                                    <Route  path={`${match.path}`} render = {()=><User user = {user}/>}/>
                                </Switch>
                            </div>
                        </div>
                    </div>
                </div>
                :
                <Loading />
             }
         </div>
     )
 }

 export default Dashboard