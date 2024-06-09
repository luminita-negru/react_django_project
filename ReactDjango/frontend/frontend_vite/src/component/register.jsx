import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

// Define the Register function.
export const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  const navigate = useNavigate();

  // Create the submit method.
  const submit = async (e) => {
    e.preventDefault();

    const user = {
      username,
      email,
      password,
      password2,
      first_name: firstName,
      last_name: lastName,
    };

    try {
      const { data } = await axios.post(
        "http://localhost:8000/register/", // Adjust URL based on your API endpoint
        user,
        { headers: { "Content-Type": "application/json" } }
      );
      
      // Handle successful registration (e.g., redirect to login page)
      console.log("Registration successful:", data);
      navigate("/frontend/register_form");
    } catch (error) {
      // Handle registration errors (e.g., display error messages)
      console.error("Registration error:", error.response.data);
    }
  };

  return (
    <div className="auth-form-content">
      <form className="auth-form" onSubmit={submit}>
        <div className="auth-form-content">
          <h3 className="auth-form-title">Sign Up</h3>
          <div className="form-group mt-3">
            <label>Username</label>
            <input
              className="form-control mt-1"
              placeholder="Enter Username"
              name="username"
              type="text"
              value={username}
              required
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="form-group mt-3">
            <label>Email</label>
            <input
              className="form-control mt-1"
              placeholder="Enter Email"
              name="email"
              type="email"
              value={email}
              required
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="form-group mt-3">
            <label>Password</label>
            <input
              name="password"
              type="password"
              className="form-control mt-1"
              placeholder="Enter password"
              value={password}
              required
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="form-group mt-3">
            <label>Confirm Password</label>
            <input
              name="password2"
              type="password"
              className="form-control mt-1"
              placeholder="Confirm password"
              value={password2}
              required
              onChange={(e) => setPassword2(e.target.value)}
            />
          </div>
          <div className="form-group mt-3">
            <label>First Name</label>
            <input
              className="form-control mt-1"
              placeholder="Enter First Name"
              name="firstName"
              type="text"
              value={firstName}
              required
              onChange={(e) => setFirstName(e.target.value)}
            />
          </div>
          <div className="form-group mt-3">
            <label>Last Name</label>
            <input
              className="form-control mt-1"
              placeholder="Enter Last Name"
              name="lastName"
              type="text"
              value={lastName}
              required
              onChange={(e) => setLastName(e.target.value)}
            />
          </div>
          <div className="d-grid gap-2 mt-3">
            <button type="submit" className="submit-button">
              Register
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
