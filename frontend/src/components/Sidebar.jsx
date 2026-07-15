function Sidebar({ users, setSelectedUser }) {

  return (
    <div className="sidebar">

      <h3>Users</h3>

      {
        users.map((user) => (

          <div
            key={user._id}
            className="user-card"
            onClick={() => setSelectedUser(user)}
          >
            {user.name}
          </div>

        ))
      }

    </div>
  );
}

export default Sidebar;