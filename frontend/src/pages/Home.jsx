import { useEffect, useState } from "react";
import axios from "axios";

import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import ChatBox from "../components/ChatBox";

function Home() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);

  const token = localStorage.getItem("token");

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/users", {
        headers: {
          Authorization: token,
        },
      });

      setUsers(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="home">

      <Navbar />

      <div className="chat-container">

        <Sidebar
          users={users}
          setSelectedUser={setSelectedUser}
        />

        <ChatBox selectedUser={selectedUser} />

      </div>

    </div>
  );
}

export default Home;