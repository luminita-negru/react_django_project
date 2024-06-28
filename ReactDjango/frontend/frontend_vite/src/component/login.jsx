import axios from "axios";
import {useState} from "react";

export const Login = () => {
     const [username, setUsername] = useState('');
     const [password, setPassword] = useState('');
     const submit = async e => {
          e.preventDefault();
          const user = {
                username: username,
                password: password
               };

          const {data} = await axios.post('http://localhost:8000/token/', user ,{headers: {'Content-Type': 'application/json'}}, {withCredentials: true});
     
         localStorage.clear();
         localStorage.setItem('access_token', data.access);
         localStorage.setItem('refresh_token', data.refresh);
         axios.defaults.headers.common['Authorization'] = 
                                         `Bearer ${data['access']}`;
         window.location.href = '/frontend/portfolio'
    }
    return(
      <div className="Auth-form-container">
      <form className="auth-form" onSubmit={submit}>
        <div className="auth-form-content">
          <h3 className="auth-form-title">Log In</h3>
          <div className="form-group mt-3">
            <label>Username</label>
            <input className="form-control mt-1"
              placeholder="Enter Username"
              name='username'
              type='text' value={username}
              required
              onChange={e => setUsername(e.target.value)} />
          </div>
          <div className="form-group mt-3">
            <label>Password</label>
            <input name='password'
              type="password"
              className="form-control mt-1"
              placeholder="Enter password"
              value={password}
              required
              onChange={e => setPassword(e.target.value)} />
          </div>
          <div className="d-grid gap-2 mt-3">
            <button type="submit" className="submit-button">Submit</button>
          </div>
          <p className="mt-3 text-center">
            Don't have an account?{" "}
            <a href="/frontend/register" className="register-link">Register here</a>
          </p>
        </div>
      </form>
    </div>
     )
    }
