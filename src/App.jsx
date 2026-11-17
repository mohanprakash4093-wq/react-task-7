import { useEffect, useState } from "react";
import "./App.css";

// Your 10 team members
const teamMembers = [
  { name: "Mohan", email: "mohan@example.com", phone: "+91 90000 00001" },
  { name: "Divya", email: "divya@example.com", phone: "+91 90000 00002" },
  { name: "Priya", email: "priya@example.com", phone: "+91 90000 00003" },
  { name: "Sweety", email: "sweety@example.com", phone: "+91 90000 00004" },
  { name: "Molly", email: "molly@example.com", phone: "+91 90000 00005" },
  { name: "Karthik", email: "karthik@example.com", phone: "+91 90000 00006" },
  { name: "Dinesh", email: "dinesh@example.com", phone: "+91 90000 00007" },
  { name: "Naveen", email: "naveen@example.com", phone: "+91 90000 00008" },
  { name: "Gokul", email: "gokul@example.com", phone: "+91 90000 00009" },
  { name: "Kumar", email: "kumar@example.com", phone: "+91 90000 00010" }
];

function App() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [refreshCount, setRefreshCount] = useState(0);

  // API integration using useEffect
  useEffect(() => {
    const controller = new AbortController();

    const fetchUsers = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          "https://jsonplaceholder.typicode.com/users",
          { signal: controller.signal }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch user data.");
        }

        const data = await response.json();

        // Replace API names, emails and phones
        // with your own team member details
        const updatedUsers = data.map((user, index) => ({
          ...user,
          ...teamMembers[index]
        }));

        setUsers(updatedUsers);

      } catch (err) {
        if (err.name !== "AbortError") {
          setError(err.message || "Something went wrong.");
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    fetchUsers();

    return () => controller.abort();
  }, [refreshCount]);

  // Search functionality
  const filteredUsers = users.filter((user) =>
    `${user.name} ${user.username} ${user.email}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  // Refresh button
  const handleRefresh = () => {
    setRefreshCount((count) => count + 1);
  };

  return (
    <div className="app">

      <header className="header">
        <div className="header-content">
          <div>
            <p className="welcome">
              WELCOME TO YOUR DASHBOARD
            </p>

            <h1>Team Members Dashboard</h1>

            <p className="subtitle">
              Manage and view your team member information.
            </p>
          </div>

          <div className="header-icon">👥</div>
        </div>
      </header>

      <main className="container">

        {/* Dashboard statistics */}
        <section className="stats">

          <div className="stat-card">
            <div className="stat-icon purple">👤</div>
            <div>
              <p>Total Members</p>
              <h2>{users.length}</h2>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon green">✓</div>
            <div>
              <p>API Status</p>
              <h2>
                {loading
                  ? "Loading"
                  : error
                  ? "Failed"
                  : "Connected"}
              </h2>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon orange">🔎</div>
            <div>
              <p>Search Results</p>
              <h2>{filteredUsers.length}</h2>
            </div>
          </div>

        </section>

        {/* Team members table */}
        <section className="users-section">

          <div className="section-heading">
            <div>
              <h2>Our Team Members</h2>
              <p>
                Team information fetched using React API integration
              </p>
            </div>

            <button
              className="refresh-btn"
              onClick={handleRefresh}
            >
              ↻ Refresh Data
            </button>
          </div>

          {/* Search bar */}
          <div className="search-box">
            <span>⌕</span>

            <input
              type="text"
              placeholder="Search team member by name, username or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* Loading message */}
          {loading ? (
            <div className="message loading">
              <div className="spinner"></div>
              <h3>Loading team members...</h3>
              <p>Please wait while we fetch the API data.</p>
            </div>

          ) : error ? (
            <div className="message error">
              <h3>Unable to load team members!</h3>
              <p>{error}</p>

              <button
                className="refresh-btn"
                onClick={handleRefresh}
              >
                Try Again
              </button>
            </div>

          ) : filteredUsers.length === 0 ? (
            <div className="message">
              <h3>No team members found</h3>
              <p>Try searching with another name or email.</p>
            </div>

          ) : (

            <div className="table-wrapper">
              <table>

                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Username</th>
                    <th>Email</th>
                    <th>Mobile Number</th>
                    <th>Website</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredUsers.map((user) => (
                    <tr key={user.id}>

                      <td>
                        <span className="user-id">
                          #{user.id}
                        </span>
                      </td>

                      <td>
                        <div className="name-cell">
                          <div className="avatar">
                            {user.name.charAt(0).toUpperCase()}
                          </div>

                          <strong>{user.name}</strong>
                        </div>
                      </td>

                      <td>{user.username}</td>

                      <td>
                        <a href={`mailto:${user.email}`}>
                          {user.email}
                        </a>
                      </td>

                      <td>
                        <a href={`tel:${user.phone}`}>
                          {user.phone}
                        </a>
                      </td>

                      <td>
                        <a
                          href={`https://${user.website}`}
                          target="_blank"
                          rel="noreferrer"
                        >
                          {user.website}
                        </a>
                      </td>

                    </tr>
                  ))}
                </tbody>

              </table>
            </div>
          )}

        </section>

        <footer>
          React Task 7 | useEffect | useState | Fetch API | Team Dashboard
        </footer>

      </main>
    </div>
  );
}

export default App;