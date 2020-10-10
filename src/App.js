import React, {Suspense,lazy } from 'react';
import { BrowserRouter as Router, Route, Switch,Redirect } from 'react-router-dom';
import io from "socket.io-client";

import Navbar from './components/Navbar/Navbar';
import Loading from './components/Loading/Loading';

import './App.css';
import data from './config/defaults';

const Chat = lazy(() => import('./components/Chat/Chat'));
const Dashboard = lazy(() => import('./components/Dashboard/Dashboard'));
const Home = lazy(() => import('./components/Home/Home'));

let ApiEndpoint = data.API_ENDPOINT;

function App() {
  let socket = io(ApiEndpoint);

  return (
    <div id = "main-container">
      <Navbar/>
      <Router>
        <Suspense fallback={<Loading/>}>
          <Switch>
            <Route path = "/chat/:name/:id" render = {({match})=><Chat socket = {socket} match={match}/>} />
            <Route path = "/dashboard" component = {Dashboard} />
            <Route path = "/" exact component = {Home} />
            <Redirect to = "/not-found"/>
          </Switch>
        </Suspense>
      </Router>
    </div>
  );
}

export default App;