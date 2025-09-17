import React ,{useState}  from 'react';
import '../css/Login.css';
import { useNavigate } from 'react-router-dom';

function Login()
{
   const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate=useNavigate();

  const handleSubmit=(e)=>{
    e.preventDefault();
    if(email==="admin@admin.com" && password==="admin123")
    {
      navigate('/dashboard');
    }
    else{
      alert("Invalid Credentials");
    }
}



   
return(

    <div className="login-wrapper">
      <div className="login-card">
        <h2>Admin Login</h2>
        <form onSubmit={handleSubmit} >
          <div className="form-group">
            <input
              type="email"
              placeholder="Email/Username"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <input
              type="password"
              placeholder="Enter Password"
              value={password }
             onChange={(e) => setPassword(e.target.value)}
             
              required
            />
          </div>
         

          <button type="submit" className="login-btn">Login</button>
        </form>
      </div>
    </div>
)
}
export default Login;