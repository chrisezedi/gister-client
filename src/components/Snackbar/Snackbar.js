import React from 'react';
import './Snackbar.css';


 const Snackbar = ({snackbar,setSnackbar}) => {
    snackbar.display && setTimeout(() => {
        setSnackbar({display:false,message:''})
    }, 3000);
 
    return (
        snackbar.display &&
            <div className="col-md-12 d-flex justify-content-center">
                <div className="alert alert-success mt-1 shadow" role="alert">
                    {snackbar.message}
                </div>
            </div>    
     )
 }

 export default Snackbar