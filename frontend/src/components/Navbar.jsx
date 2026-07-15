import { useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user") || "null");

  const logout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <div className="navbar">
      <h2>💬 Chat App</h2>

      <div>
        <span>{user ? user.name : "Guest"}</span>

        <button onClick={logout}>Logout</button>
      </div>
    </div>
  );
}

export default Navbar;