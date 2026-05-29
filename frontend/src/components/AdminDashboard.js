import { toast } from "react-toastify";
import "./AdminDashboard.css";
import { useEffect, useState } from "react";
import axios from "axios";

const API = process.env.REACT_APP_API_URL || "https://teamtask-backend-pdvc.onrender.com";

function AdminDashboard() {

  const [activeTab, setActiveTab] = useState("users");
  const [users, setUsers] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [tasksLoading, setTasksLoading] = useState(false);
  const [userSearch, setUserSearch] = useState("");
  const [taskSearch, setTaskSearch] = useState("");
  const [newUserName, setNewUserName] = useState("");
  const [newUserEmail, setNewUserEmail] = useState("");
  const [newUserPassword, setNewUserPassword] = useState("");
  const [creatingUser, setCreatingUser] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskAssignee, setNewTaskAssignee] = useState("");
  const [newTaskPriority, setNewTaskPriority] = useState("Medium");
  const [newTaskStatus, setNewTaskStatus] = useState("Pending");
  const [newTaskDueDate, setNewTaskDueDate] = useState("");
  const [creatingTask, setCreatingTask] = useState(false);

  const getToken = () => localStorage.getItem("token");

  const fetchUsers = async () => {
    try {
      setUsersLoading(true);
      const response = await axios.get(`${API}/admin/users`, {
        headers: { authorization: getToken() }
      });
      if (Array.isArray(response.data)) {
        setUsers(response.data);
      }
      setUsersLoading(false);
    } catch (error) {
      console.log(error);
      toast.error("Failed to load users");
      setUsersLoading(false);
    }
  };

  const fetchTasks = async () => {
    try {
      setTasksLoading(true);
      const response = await axios.get(`${API}/admin/tasks`, {
        headers: { authorization: getToken() }
      });
      if (Array.isArray(response.data)) {
        setTasks(response.data);
      }
      setTasksLoading(false);
    } catch (error) {
      console.log(error);
      toast.error("Failed to load tasks");
      setTasksLoading(false);
    }
  };

  // Fetch both users and tasks on mount AND on tab switch — keeps all stats fresh
  useEffect(() => {
    fetchUsers();
    fetchTasks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  const deleteUser = async (userId, userName) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete user "${userName}"? This will also delete all their tasks.`
    );
    if (!confirmDelete) return;

    try {
      await axios.delete(`${API}/admin/users/${userId}`, {
        headers: { authorization: getToken() }
      });
      toast.success(`User "${userName}" deleted`);
      await fetchUsers();
    } catch (error) {
      console.log(error);
      toast.error("Failed to delete user");
      setUsersLoading(false);
    }
  };

  const createUser = async () => {
    if (!newUserName.trim() || !newUserEmail.trim() || !newUserPassword.trim()) {
      toast.warning("All fields are required");
      return;
    }
    setCreatingUser(true);
    try {
      await axios.post(
        `${API}/admin/users`,
        { name: newUserName, email: newUserEmail, password: newUserPassword },
        { headers: { authorization: getToken() } }
      );
      toast.success(`User "${newUserName}" created`);
      setNewUserName("");
      setNewUserEmail("");
      setNewUserPassword("");
      await fetchUsers();
    } catch (error) {
      const msg = error.response?.data?.message || "Failed to create user";
      toast.error(msg);
    }
    setCreatingUser(false);
  };

  const createTask = async () => {
    if (!newTaskTitle.trim() || !newTaskAssignee) {
      toast.warning("Title and assigned user are required");
      return;
    }
    setCreatingTask(true);
    try {
      await axios.post(
        `${API}/admin/tasks`,
        {
          title: newTaskTitle,
          user: newTaskAssignee,
          priority: newTaskPriority,
          status: newTaskStatus,
          dueDate: newTaskDueDate
        },
        { headers: { authorization: getToken() } }
      );
      toast.success(`Task "${newTaskTitle}" created`);
      setNewTaskTitle("");
      setNewTaskAssignee("");
      setNewTaskPriority("Medium");
      setNewTaskStatus("Pending");
      setNewTaskDueDate("");
      await fetchTasks();
    } catch (error) {
      const msg = error.response?.data?.message || "Failed to create task";
      toast.error(msg);
    }
    setCreatingTask(false);
  };

  const deleteTask = async (taskId, taskTitle) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete task "${taskTitle}"?`
    );
    if (!confirmDelete) return;

    try {
      await axios.delete(`${API}/admin/tasks/${taskId}`, {
        headers: { authorization: getToken() }
      });
      toast.success(`Task "${taskTitle}" deleted`);
      await fetchTasks();
    } catch (error) {
      console.log(error);
      toast.error("Failed to delete task");
      setTasksLoading(false);
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
          {/* CREATE USER FORM */}
          <div className="admin-create-user">
            <h3 className="admin-create-user-title">➕ Create New User</h3>
            <div className="admin-create-user-form">
              <input
                type="text"
                placeholder="Name"
                value={newUserName}
                onChange={(e) => setNewUserName(e.target.value)}
                className="admin-create-input"
              />
              <input
                type="email"
                placeholder="Email"
                value={newUserEmail}
                onChange={(e) => setNewUserEmail(e.target.value)}
                className="admin-create-input"
              />
              <input
                type="password"
                placeholder="Password"
                value={newUserPassword}
                onChange={(e) => setNewUserPassword(e.target.value)}
                className="admin-create-input"
              />
              <button
                className="admin-create-btn"
                disabled={creatingUser}
                onClick={createUser}
              >
                {creatingUser ? "Creating..." : "Create User"}
              </button>
            </div>
          </div>

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
                {usersLoading ? (
                  <tr>
                    <td colSpan="5" className="admin-loading-cell">
                      <span className="admin-spinner admin-spinner--large" />
                    </td>
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
          {/* CREATE TASK FORM */}
          <div className="admin-create-user">
            <h3 className="admin-create-user-title">➕ Create New Task</h3>
            <div className="admin-create-task-form">
              <input
                type="text"
                placeholder="Task Title"
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                className="admin-create-input"
              />
              <select
                className="admin-create-input"
                value={newTaskAssignee}
                onChange={(e) => setNewTaskAssignee(e.target.value)}
              >
                <option value="">— Assign to user —</option>
                {users
                  .filter((u) => u.role !== "admin")
                  .map((u) => (
                    <option key={u._id} value={u._id}>
                      {u.name || u.email} ({u.email})
                    </option>
                  ))}
              </select>
              {newTaskAssignee && (
                <input
                  type="email"
                  placeholder="Email"
                  value={users.find((u) => u._id === newTaskAssignee)?.email || ""}
                  className="admin-create-input"
                  disabled
                  readOnly
                />
              )}
              <select
                className="admin-create-input"
                value={newTaskPriority}
                onChange={(e) => setNewTaskPriority(e.target.value)}
              >
                <option value="High">High Priority</option>
                <option value="Medium">Medium Priority</option>
                <option value="Low">Low Priority</option>
              </select>
              <select
                className="admin-create-input"
                value={newTaskStatus}
                onChange={(e) => setNewTaskStatus(e.target.value)}
              >
                <option value="Pending">Pending</option>
                <option value="Completed">Completed</option>
              </select>
              <input
                type="date"
                value={newTaskDueDate}
                onChange={(e) => setNewTaskDueDate(e.target.value)}
                className="admin-create-input"
              />
              <button
                className="admin-create-btn"
                disabled={creatingTask}
                onClick={createTask}
              >
                {creatingTask ? "Creating..." : "Create Task"}
              </button>
            </div>
          </div>

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
                {tasksLoading ? (
                  <tr>
                    <td colSpan="7" className="admin-loading-cell">
                      <span className="admin-spinner admin-spinner--large" />
                    </td>
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
