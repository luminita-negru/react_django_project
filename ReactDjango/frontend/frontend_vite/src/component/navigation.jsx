import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import React, { useState, useEffect } from 'react';

export function Navigation() {
   const [isAuth, setIsAuth] = useState(false);

   useEffect(() => {
     if (localStorage.getItem('access_token') !== null) {
        setIsAuth(true);
      }
    }, [isAuth]);

    return (
      <div>
        <Navbar bg="dark" variant="dark" fixed="top">
          <Navbar.Brand href="/">TradePlaySimulator</Navbar.Brand>
          <Nav className="me-auto">
            {isAuth ? <Nav.Link href="/">Home</Nav.Link> : null}
            {isAuth ? <Nav.Link href="/portfolio">Portfolio</Nav.Link> : null}
            {isAuth ? <Nav.Link href="/trade">Trade</Nav.Link> : null}
            {isAuth ? <Nav.Link href="/frontend/stock">Research</Nav.Link> : null}
            {isAuth ? <Nav.Link href="/frontend/news">News</Nav.Link> : null}
          </Nav>
          <Nav>
            {isAuth ? <Nav.Link href="/logout">Logout</Nav.Link> :
                      <Nav.Link href="/login">Login</Nav.Link>}
          </Nav>
        </Navbar>
      </div>
    );
}
