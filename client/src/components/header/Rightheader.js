import React,{useContext} from 'react'
import { LoginContext } from '../context/ContextProvider';
import Avatar from '@mui/material/Avatar';
import { Divider } from '@mui/material';
import { NavLink } from 'react-router-dom';
import "./rightheader.css";
import LogoutIcon from '@mui/icons-material/Logout';
const Rightheader = ({ logclose,userlog}) => {
    const imgd = "/india.png"
    const { account, setAccount } = useContext(LoginContext);
  return (
    <>
      <div className="rightheader">
        <div className="right_nav">
        {
                    account ?
                        <Avatar className="avtar2"
                             title={account.fname.toUpperCase()}>{account.fname[0].toUpperCase()}</Avatar> :
                        <Avatar className="avtar"
                     />
                }
                {account ? <h3>Hello, {account.fname.toUpperCase()}</h3> : ""}
            </div>
                <div className="nav_btn" onClick={()=>logclose()} >
                <NavLink to="/">Home</NavLink>
                <NavLink to="/">Shop By Category</NavLink>
                <Divider style={{ width: "100%", marginLeft: -20 }} />
                <NavLink to="/" style={{ marginTop: 10 }}>Today's Deal</NavLink>
                {
                    account ? <NavLink to="/buynow">Your Order</NavLink> : <NavLink to="/login">Your Order</NavLink>
                }
                <Divider style={{ width: "100%", marginLeft: -20 }} />
                <div className="flag">
                    <NavLink to="" style={{ marginTop: 14 }}>Settings</NavLink>
                    <img src={imgd} alt="india flag" style={{ width: 35, marginLeft: 10 }} />
                </div>

                {
                    account ?
                        <div className="flag">
                        <LogoutIcon style={{ fontSize: 18, marginRight: 4 }} />
                            <h3 onClick={() => userlog()}  style={{ cursor: "pointer", fontWeight: 500 }}>Log Out</h3>
                        </div>
                        : <NavLink to="/login">Sign in</NavLink>
                }
                
        </div>
      </div>
    </>
  )
}

export default Rightheader
