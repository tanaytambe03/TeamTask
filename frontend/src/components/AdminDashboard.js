import { toast } from "react-toastify";
import "./AdminDashboard.css";
import { useEffect, useState } from "react";
import axios from "axios";

const API = "https://teamtask-backend-pdvc.onrender.com";

function AdminDashboard() {

  const [activeTab, setActiveTab] = useState("users");
  const [users, setUsers] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [userSearch, setUserSearch] = useState("");
  const [taskSearch, setTaskSearch] = useState("");

  useEffect(() => {
    if (activeTab === "users") fetchUsers();
    else fetchTasks();
  }, [activeTab]);

  const getToken = () => localStorage.getItem("token");

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API}/admin/users`, {
        headers: { authorization: getToken() }
      });
      if (Array.isArray(response.data)) {
        setUsers(response.data);
      }
      setLoading(false);
    } catch (error) {
      console.log(error);
      toast.error("Failed to load users");
      setLoading(false);
    }
  };

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API}/admin/tasks`, {
        headers: { authorization: getToken() }
      });
      if (Array.isArray(response.data)) {
        setTasks(response.data);
      }
      setLoading(false);
    } catch (error) {
      console.log(error);
      toast.error("Failed to load tasks");
      setLoading(false);
    }
  };

  const deleteUser = async (userId, userName) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete user "${userName}"? This will also delete all their tasks.`
    );
    if (!confirmDelete) return;

    try {
      setLoading(true);
      await axios.delete(`${API}/admin/users/${userId}`, {
        headers: { authorization: getToken() }
      });
      toast.success(`User "${userName}" deleted`);
      fetchUsers();
      setLoading(false);
    } catch (error) {
      console.log(error);
      toast.error("Failed to delete user");
      setLoading(false);
    }
  };

  const deleteTask = async (taskId, taskTitle) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete task "${taskTitle}"?`
    );
    if (!confirmDelete) return;

    try {
      setLoading(true);
      await axios.delete(`${API}/admin/tasks/${taskId}`, {
        headers: { authorization: getToken() }
      });
      toast.success(`Task "${taskTitle}" deleted`);
      fetchTasks();
      setLoading(false);
    } catch (error) {
      console.log(error);
      toast.error("Failed to delete task");
      setLoading(false);
    }
  };

  // Filter users by search
  const filteredUsers = users.filter((user) => {
    const q = userSearch.toLowerCase();
    return (
      (user.name || "").toLowerCase().includes(q) ||
      (user.email || "").toLowerCase().includes(q)
    );
  });

  // Filter tasks by search
  const filteredTasks = tasks.filter((task) => {
    const q = taskSearch.toLowerCase();
    return (
      (task.title || "").toLowerCase().includes(q) ||
      (task.user?.name || "").toLowerCase().includes(q) ||
      (task.user?.email || "").toLowerCase().includes(q)
    );
  });

  const totalUsers = users.length;
  const totalTasks = tasks.length;
  const adminUsers = users.filter((u) => u.role === "admin").length;
  const completedTasks = tasks.filter((t) => t.status === "Completed").length;
  const pendingTasks = tasks.filter((t) => t.status === "Pending").length;

  const handleTabSwitch = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div className="admin-layout">

      {/* ===== HEADER ===== */}
      <div className="admin-header">
        <h1 className="admin-title">🔧 Admin Dashboard</h1>
        <p className="admin-subtitle">Manage users and tasks across the platform</p>
      </div>

      {/* ===== STATS CARDS ===== */}
      <div className="admin-stats">
        <div className="admin-stat-card stat-users">
          <span className="admin-stat-number">{totalUsers}</span>
          <span className="admin-stat-label">Total Users</span>
        </div>
        <div className="admin-stat-card stat-admins">
          <span className="admin-stat-number">{adminUsers}</span>
          <span className="admin-stat-label">Admins</span>
        </div>
        <div className="admin-stat-card stat-all-tasks">
          <span className="admin-stat-number">{totalTasks}</span>
          <span className="admin-stat-label">Total Tasks</span>
        </div>
        <div className="admin-stat-card stat-completed-tasks">
          <span className="admin-stat-number">{completedTasks}</span>
          <span className="admin-stat-label">Completed</span>
        </div>
        <div className="admin-stat-card stat-pending-tasks">
          <span className="admin-stat-number">{pendingTasks}</span>
          <span className="admin-stat-label">Pending</span>
        </div>
      </div>

      {/* ===== TABS ===== */}
      <div className="admin-tabs">
        <button
          className={`admin-tab ${activeTab === "users" ? "active" : ""}`}
          onClick={() => handleTabSwitch("users")}
        >
          👥 Users ({totalUsers})
        </button>
        <button
          className={`admin-tab ${activeTab === "tasks" ? "active" : ""}`}
          onClick={() => handleTabSwitch("tasks")}
        >
          📋 Tasks ({totalTasks})
        </button>
      </div>

      {/* ===== USERS TAB ===== */}
      {activeTab === "users" && (
        <div className="admin-section">
          <div className="admin-search-bar">
            <input
              type="text"
              placeholder="Search users by name or email..."
              value={userSearch}
              onChange={(e) => setUserSearch(e.target.value)}
              className="admin-search-input"
            />
            <button className="admin-refresh-btn" onClick={fetchUsers}>
              ⟳ Refresh
            </button>
          </div>

          <div className="admin-table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>User ID</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="5" className="admin-loading-cell">Loading...</td>
                  </tr>
                ) : filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="admin-loading-cell">
                      {userSearch ? "No users match your search" : "No users found"}
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((user) => (
                    <tr key={user._id}>
                      <td className="admin-user-cell">
                        <span className="admin-user-avatar">
                          {(user.name || user.email).charAt(0).toUpperCase()}
                        </span>
                        {user.name || "Unnamed"}
                      </td>
                      <td>{user.email}</td>
                      <td>
                        <span className={`admin-role-badge ${user.role === "admin" ? "role-admin" : "role-user"}`}>
                          {user.role || "user"}
                        </span>
                      </td>
                      <td className="admin-id-cell">{user._id}</td>
                      <td>
                        {user.role !== "admin" && (
                          <button
                            className="admin-delete-btn"
                            onClick={() => deleteUser(user._id, user.name || user.email)}
                          >
                            ✕ Delete
                          </button>
                        )}
                        {user.role === "admin" && (
                          <span className="admin-protected-text">Protected</span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ===== TASKS TAB ===== */}
      {activeTab === "tasks" && (
        <div className="admin-section">
          <div className="admin-search-bar">
            <input
              type="text"
              placeholder="Search tasks by title or user..."
              value={taskSearch}
              onChange={(e) => setTaskSearch(e.target.value)}
              className="admin-search-input"
            />
            <button className="admin-refresh-btn" onClick={fetchTasks}>
              ⟳ Refresh
            </button>
          </div>

          <div className="admin-table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>User</th>
                  <th>Email</th>
                  <th>Priority</th>
                  <th>Status</th>
                  <th>Due Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="7" className="admin-loading-cell">Loading...</td>
                  </tr>
                ) : filteredTasks.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="admin-loading-cell">
                      {taskSearch ? "No tasks match your search" : "No tasks found"}
                    </td>
                  </tr>
                ) : (
                  filteredTasks.map((task) => (
                    <tr key={task._id}>
                      <td className="admin-task-title-cell">{task.title}</td>
                      <td>
                        <span className="admin-user-avatar-sm">
                          {(task.user?.name || task.user?.email || "?").charAt(0).toUpperCase()}
                        </span>
                        {task.user?.name || "Unknown"}
                      </td>
                      <td>{task.user?.email || "-"}</td>
                      <td>
                        <span className={`admin-priority-badge ${task.priority === "High" ? "p-high" : task.priority === "Medium" ? "p-medium" : "p-low"}`}>
                          {task.priority || "N/A"}
                        </span>
                      </td>
                      <td>
                        <span className={`admin-status-badge ${task.status === "Completed" ? "s-completed" : "s-pending"}`}>
                          {task.status || "Pending"}
                        </span>
                      </td>
                      <td>{task.dueDate || "-"}</td>
                      <td>
                        <button
                          className="admin-delete-btn-sm"
                          onClick={() => deleteTask(task._id, task.title)}
                        >
                          ✕ Delete
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;
