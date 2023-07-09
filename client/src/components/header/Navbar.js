import { React, useContext,useEffect,useState } from "react";
import "./Navbar.css";
import SearchIcon from "@mui/icons-material/Search";
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Badge from "@mui/material/Badge";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import Avatar from "@mui/material/Avatar";
import { NavLink, useNavigate } from "react-router-dom";
import { LoginContext } from "../context/ContextProvider";
import MenuIcon from '@mui/icons-material/Menu';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import Rightheader from "./Rightheader";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import LogoutIcon from '@mui/icons-material/Logout';
import { useSelector } from "react-redux";
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
const Navbar = () => {
  //const classes = usestyle();
  const history = useNavigate();
  const [dropen, setDropen] = useState(false);
  const { account, setAccount } = useContext(LoginContext);
  //console.log(account);
  const [anchorEl, setAnchorEl] =useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  //search bar
  const [text,setText]=useState("");
  const [liopen,setLiopen]=useState(true);
  const { products } = useSelector(state => state.getproductsdata);
const getText=(items)=>{
  setText(items);
  setLiopen(false);
}
  const getdetailsvaliduser = async () => {
    const res = await fetch("/validuser", {
        method: "GET",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
        },
        credentials: "include"
    });
    const data = await res.json();
    if (res.status !== 201) {
      console.log("first login");
  } else {
      // console.log("cart add ho gya hain");
      setAccount(data);
  }

  }
  useEffect(() => {
    getdetailsvaliduser();
}, []);
//for logout
const logoutuser = async () => {
  const res2 = await fetch("/logout", {
      method: "GET",
      headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
      },
      credentials: "include"
  });

  const data2 = await res2.json();
   console.log(data2);

  if (!res2.status === 201) {
      const error = new Error(res2.error);
      throw error;
  } else {
      setAccount(false);
      toast.success("user Logout 😃!", {
          position: "top-center"
      });
      history("/");
  }
}
//for drawer
const handelopen = () => {
  setDropen(true);
}
const handleClosedr = () => {
  setDropen(false)
}

  return (
    <header>
      <nav>
        <div className="left">
        <IconButton className="hamburgur" onClick={handelopen} >
                        <MenuIcon style={{ color: "#fff" }} />
                    </IconButton>
                    <Drawer  open={dropen} onClose={handleClosedr}>
                        <Rightheader  logclose={handleClosedr} userlog={logoutuser} />
                    </Drawer>
          <div className="navlogo">
            <NavLink to="/">
              {" "}
              <img src="./amazon_PNG25.png" alt="" />
            </NavLink>
          </div>
          <div className="nav_searchbaar">
            <input type="text" name="" 
            onChange={(e)=>getText(e.target.value)}
            placeholder="Search your products"
            id=""
             />
            <div className="search_icon">
              <SearchIcon id="search" />
            </div>
            {/*Search Filter*/}
            {
              text && 
              <List className="extrasearch" hidden={liopen}>
              {
                products.filter(product => product.title.longTitle.toLowerCase().includes(text.toLowerCase())).map(product => (
                                        <ListItem>
                                            <NavLink to={`/getproductsone/${product.id}`} onClick={() => setLiopen(true)}>
                                                {product.title.longTitle}
                                            </NavLink>
                                        </ListItem>
                                    ))
              }

              </List>
            }
          </div>
        </div>
        <div className="right">
          <div className="nav_btn">
            <NavLink to="/login">Sign in</NavLink>
          </div>

          <div className="cart_btn">
            {account ? (
              <NavLink to="/buynow">
                <Badge badgeContent={account.carts.length} color="primary">
                  <ShoppingCartIcon id="icon" />
                </Badge>
              </NavLink>
            ) : (
              <NavLink to="/login">
                <Badge badgeContent={0} color="primary">
                  <ShoppingCartIcon id="icon" />
                </Badge>
              </NavLink>
            )}
            <ToastContainer/>
            <p>Cart</p>
          </div>
          {
           account ?  <Avatar className="avtar2"
             id="demo-positioned-button"
        aria-controls={open ? 'demo-positioned-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
            >{account.fname[0].toUpperCase()} </Avatar> :
           <Avatar className="avtar" 
             id="demo-positioned-button"
        aria-controls={open ? 'demo-positioned-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
           ></Avatar>
          }
        
      <Menu
        id="demo-positioned-menu"
        aria-labelledby="demo-positioned-button"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
      >
        
        <MenuItem onClick={handleClose}>My account</MenuItem>
        {
          account ? <MenuItem onClick={handleClose}><LogoutIcon style={{ fontSize: 16, marginRight: 3 }} onClick={logoutuser} />Logout</MenuItem> : ""
        }
        
      </Menu>

        </div>
      </nav>
    </header>
  );
};

export default Navbar;
