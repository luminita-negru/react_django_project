import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from "react-router-dom";

export function Navigation({history}) {
   const [isAuth, setIsAuth] = useState(false);
   const navigate = useNavigate();
   const location = useLocation();
   useEffect(() => {
     if (localStorage.getItem('access_token') !== null) {
        setIsAuth(true);
      }else{
        setIsAuth(false);
        if(!location.pathname.endsWith('login') && !location.pathname.endsWith('faq') && !location.pathname.endsWith('contact') 
        && !location.pathname.endsWith('donate') && !location.pathname.endsWith('register')){
          navigate('/');
        }
      }
    }, [isAuth]);

    return (
      <div>
        <div className="logo-container">
          <img src="/public/trade.png" alt="TradePlay Simulator" className="feature-logo" />
        </div>
        <Navbar bg="dark" variant="dark" fixed="top" className="navbar-with-logo">
          <Nav className="me-auto">
            <Nav.Link href="/">Home</Nav.Link>
            {isAuth ? <Nav.Link href="/frontend/portfolio">Portfolio</Nav.Link> : null}
            {isAuth ? <Nav.Link href="/frontend/trade">Trade</Nav.Link> : null}
            {isAuth ? <Nav.Link href="/frontend/stock">Research</Nav.Link> : null}
            {isAuth ? <Nav.Link href="/frontend/news">News</Nav.Link> : null}
            <Nav.Link href="/frontend/faq">FAQs</Nav.Link>
            <Nav.Link href="/frontend/contact">Contact</Nav.Link>
            <Nav.Link href="/frontend/donate">Donate</Nav.Link>
          </Nav>
          <Nav>
            {localStorage.getItem('access_token') !== null ? <Nav.Link href="/frontend/logout">Logout</Nav.Link> :
                      <Nav.Link href="/frontend/login">Login</Nav.Link>}
          </Nav>
        </Navbar>
      </div>
    );
}
