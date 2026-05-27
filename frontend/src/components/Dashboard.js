import { toast } from "react-toastify";
import "./Dashboard.css";
import { useEffect, useState } from "react";
import axios from "axios";

function Dashboard() {

  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState("All");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [dueDate, setDueDate] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [sortType, setSortType] = useState("Newest");
  const [editingTask, setEditingTask] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editDueDate, setEditDueDate] = useState("");
  const [editPriority, setEditPriority] = useState("Medium");

  useEffect(() => {

    fetchTasks();

  }, []);

  const fetchTasks = async () => {

    try {

      const token = localStorage.getItem("token");

      const response = await axios.get(
        "https://teamtask-backend-pdvc.onrender.com/tasks",
        {
          headers: {
            authorization: token
          }
        }
      );

      console.log(response.data);


    if (Array.isArray(response.data)) {

      setTasks(response.data);

    }

    else {

      setTasks([]);

      localStorage.removeItem(
        "token"
      );

      window.location.href = "/";

    }




    } catch (error) {

      console.log(error);

    }

  };


  const addTask = async () => {

  try {

    setLoading(true);

    const token = localStorage.getItem("token");

    await axios.post(
      "https://teamtask-backend-pdvc.onrender.com/tasks",
      {
        title: title,
        description: description,
        dueDate: dueDate,
        priority: priority
      },
      {
        headers: {
          authorization: token
        }
      }
    );

    toast.success("Task Added Successfully");

    fetchTasks();

    setTitle("");
    setDescription("");
    setDueDate("");
    setPriority("Medium");

    setLoading(false);

  } catch (error) {

    setLoading(false);

    console.log(error);

  }

};

  const updateTask = async (id) => {

  try {

    const token = localStorage.getItem("token");

    await axios.put(
      `https://teamtask-backend-pdvc.onrender.com/tasks/${id}`,
      {
        status: "Completed"
      },
      {
        headers: {
          authorization: token
        }
      }
    );
    toast.success("Task Completed");

    fetchTasks();

  } catch (error) {

    console.log(error);

  }
};


  const deleteTask = async (id) => {

  const confirmDelete = window.confirm(
    "Are you sure you want to delete this task?"
  );
  if (!confirmDelete) {

    return;

  }

  try {

    const token = localStorage.getItem("token");

    await axios.delete(
      `https://teamtask-backend-pdvc.onrender.com/tasks/${id}`,
      {
        headers: {
          authorization: token
        }
      }
    );
    toast.error("Task Deleted");

    fetchTasks();

  } catch (error) {

    console.log(error);

  }
};

  const openEditModal = (task) => {
    setEditingTask(task);
    setEditTitle(task.title || "");
    setEditDescription(task.description || "");
    setEditDueDate(task.dueDate || "");
    setEditPriority(task.priority || "Medium");
  };

  const closeEditModal = () => {
    setEditingTask(null);
  };

  const saveEdit = async () => {
    if (!editTitle.trim()) {
      toast.warning("Title cannot be empty");
      return;
    }

    try {
      const token = localStorage.getItem("token");

      await axios.put(
        `https://teamtask-backend-pdvc.onrender.com/tasks/${editingTask._id}`,
        {
          title: editTitle,
          description: editDescription,
          dueDate: editDueDate,
          priority: editPriority
        },
        {
          headers: {
            authorization: token
          }
        }
      );
      toast.info("Task Updated");
      closeEditModal();
      fetchTasks();

    } catch (error) {
      console.log(error);
      toast.error("Failed to update task");
    }
  };

//   const logout = () => {

//   localStorage.removeItem("token");

//   window.location.reload();

// };


const filteredTasks = (tasks || []).filter(
  (task) => {

    const matchesFilter =

      filter === "All" ||
      task.status === filter;

    const matchesSearch =

      (task.title || "")
      .toLowerCase()
      .includes(
        search.toLowerCase()
      );

    return (
      matchesFilter &&
      matchesSearch
    );

});



const sortedTasks = [...filteredTasks];

if (sortType === "Newest") {

  sortedTasks.reverse();

}

if (sortType === "Due Date") {

  sortedTasks.sort(
    (a, b) =>
      new Date(a.dueDate) -
      new Date(b.dueDate)
  );

}






    const totalTasks = Array.isArray(tasks)
      ? tasks.length
      : 0;

    const completedTasks = Array.isArray(tasks)
      ? tasks.filter(
          (task) =>
            task.status === "Completed"
        ).length
      : 0;

    const pendingTasks = Array.isArray(tasks)
      ? tasks.filter(
          (task) =>
            task.status === "Pending"
        ).length
      : 0;



  return (

    <div className="dashboard-layout">

        <aside className="dashboard-sidebar">

          <div className="sidebar-section">
            <h3 className="sidebar-heading">📊 Task Overview</h3>
            <div className="stat-cards">
              <div className="stat-card stat-total">
                <span className="stat-number">{totalTasks}</span>
                <span className="stat-label">Total Tasks</span>
              </div>
              <div className="stat-card stat-completed">
                <span className="stat-number">{completedTasks}</span>
                <span className="stat-label">Completed</span>
              </div>
              <div className="stat-card stat-pending">
                <span className="stat-number">{pendingTasks}</span>
                <span className="stat-label">Pending</span>
              </div>
            </div>
          </div>



          <div className="sidebar-section">
            <h3 className="sidebar-heading">🔍 Search &amp; Filter</h3>
            <input
              className="sidebar-search"
              type="text"
              placeholder="Search Tasks..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            <div className="sidebar-sort">
              <label>Sort by</label>
              <select
                value={sortType}
                onChange={(e) =>
                  setSortType(e.target.value)
                }
              >
                <option value="Newest">Newest</option>
                <option value="Due Date">Due Date</option>
              </select>
            </div>

            <div className="sidebar-filters">
              <button
                className={`filter-btn ${filter === "All" ? "active" : ""}`}
                onClick={() => setFilter("All")}
              >
                All
              </button>
              <button
                className={`filter-btn ${filter === "Pending" ? "active" : ""}`}
                onClick={() => setFilter("Pending")}
              >
                Pending
              </button>
              <button
                className={`filter-btn ${filter === "Completed" ? "active" : ""}`}
                onClick={() => setFilter("Completed")}
              >
                Completed
              </button>
            </div>
          </div>

        </aside>

        <main className="dashboard-main">

          <section className="create-task-section">
            <h3 className="section-title">✏️ Create New Task</h3>
            <div className="create-task-form">
              <div className="form-row">
                <input
                  className="form-input"
                  type="text"
                  placeholder="Task Title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
                <input
                  className="form-input"
                  type="text"
                  placeholder="Description"
                  value={description}
                  onChange={(e) =>
                    setDescription(e.target.value)
                  }
                />
              </div>
              <div className="form-row">
                <input
                  className="form-input form-input-small"
                  type="date"
                  value={dueDate}
                  onChange={(e) =>
                    setDueDate(e.target.value)
                  }
                />
                <select
                  className="form-input form-input-small"
                  value={priority}
                  onChange={(e) =>
                    setPriority(e.target.value)
                  }
                >
                  <option value="High">High Priority</option>
                  <option value="Medium">Medium Priority</option>
                  <option value="Low">Low Priority</option>
                </select>
                <button
                  className="add-task-btn"
                  onClick={addTask}
                  disabled={loading}
                >
                  {loading ? "Adding..." : "+ Add Task"}
                </button>
              </div>
            </div>
          </section>
      

          <section className="task-list-section">
            <h3 className="section-title">📋 Tasks</h3>
            {
              sortedTasks.length === 0 ? (

                <h2 className="empty-message">
                  No Tasks Found 📭
                </h2>

              ) : (

                <div className="task-list">
                  {sortedTasks.map((task) => (

                    <div
                      className="task-card"
                      key={task._id}
                    >
                      <div className="task-card-header">
                        <h3 className="task-title">{task.title}</h3>
                        <span
                          className={
                            task.status === "Completed"
                              ? "status-completed"
                              : "status-pending"
                          }
                        >
                          {task.status}
                        </span>
                      </div>

                      <p className="task-desc">{task.description}</p>

                      <div className="task-meta">
                        <span className="task-due">
                          📅 {task.dueDate || "No due date"}
                        </span>
                        <span
                          className={
                            task.priority === "High"
                              ? "priority-high"
                              : task.priority === "Medium"
                              ? "priority-medium"
                              : "priority-low"
                          }
                        >
                          {task.priority} Priority
                        </span>
                      </div>

                      {
                        task.status === "Pending" && task.dueDate && new Date(task.dueDate) < new Date() && (

                          <p className="overdue-text">
                            ⚠ Overdue
                          </p>

                        )
                      }

                      <div className="task-actions">
                        <button className="btn-complete" onClick={() => updateTask(task._id)}>
                          ✓ Complete
                        </button>
                        <button className="btn-edit" onClick={() => openEditModal(task)}>
                          ✎ Edit
                        </button>
                        <button className="btn-delete" onClick={() => deleteTask(task._id)}>
                          ✕ Delete
                        </button>
                      </div>

                    </div>

                  ))}
                </div>

              )
            }
          </section>


          {/* ========== EDIT MODAL ========== */}
          {editingTask && (
            <div className="modal-overlay" onClick={closeEditModal}>
              <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                  <h3 className="modal-title">✎ Edit Task</h3>
                  <button className="modal-close-btn" onClick={closeEditModal}>✕</button>
                </div>

                <div className="modal-body">
                  <div className="input-group">
                    <label>Title</label>
                    <input
                      className="form-input"
                      type="text"
                      placeholder="Task Title"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                    />
                  </div>

                  <div className="input-group">
                    <label>Description</label>
                    <textarea
                      className="form-input form-textarea"
                      placeholder="Task Description"
                      value={editDescription}
                      onChange={(e) => setEditDescription(e.target.value)}
                      rows="3"
                    />
                  </div>

                  <div className="edit-row">
                    <div className="input-group">
                      <label>Due Date</label>
                      <input
                        className="form-input"
                        type="date"
                        value={editDueDate}
                        onChange={(e) => setEditDueDate(e.target.value)}
                      />
                    </div>

                    <div className="input-group">
                      <label>Priority</label>
                      <select
                        className="form-input"
                        value={editPriority}
                        onChange={(e) => setEditPriority(e.target.value)}
                      >
                        <option value="High">High Priority</option>
                        <option value="Medium">Medium Priority</option>
                        <option value="Low">Low Priority</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="modal-actions">
                  <button className="btn-cancel" onClick={closeEditModal}>Cancel</button>
                  <button className="btn-save" onClick={saveEdit}>Save Changes</button>
                </div>
              </div>
            </div>
          )}
        </main>

      </div>
  );
}

export default Dashboard;