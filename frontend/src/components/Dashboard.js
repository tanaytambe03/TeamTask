import { toast } from "react-toastify";
import Navbar from "./Navbar";
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

      window.location.reload();

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

  const editTask = async (id) => {

  const newTitle = prompt(
    "Enter new task title"
  );

  if (!newTitle) {

    return;

  }

  try {

    const token = localStorage.getItem("token");

    await axios.put(
      `https://teamtask-backend-pdvc.onrender.com/tasks/${id}`,
      {
        title: newTitle
      },
      {
        headers: {
          authorization: token
        }
      }
    );
    toast.info("Task Updated");

    fetchTasks();

  } catch (error) {

    console.log(error);

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

    <div className="dashboard-container">
      <Navbar />
    <div className="task-stats">

    <h3>
      Total Tasks: {totalTasks}
    </h3>

    <h3>
      Completed: {completedTasks}
    </h3>

    <h3>
      Pending: {pendingTasks}
    </h3>

    </div>



      <div className="filter-buttons">

        <input
        className="search-input"
        type="text"
        placeholder="Search Tasks..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        />


      <select
        className="task-input"
        value={sortType}
        onChange={(e) =>
          setSortType(e.target.value)
        }
      >

        <option value="Newest">
          Newest
        </option>

        <option value="Due Date">
          Due Date
        </option>

      </select>
  

      <button onClick={() => setFilter("All")}>
        All
      </button>

      <button onClick={() => setFilter("Pending")}>
        Pending
      </button>

      <button onClick={() => setFilter("Completed")}>
        Completed
      </button>

    </div>
      

      <input
        className="task-input"
        type="text"
        placeholder="Enter Task"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <input
        className="search-input"
        type="text"
        placeholder="Enter Description"
        value={description}
        onChange={(e) =>
          setDescription(e.target.value)
        }
      />
      <input
        className="task-input"
        type="date"
        value={dueDate}
        onChange={(e) =>
          setDueDate(e.target.value)
        }
      />
     
      <select
        className="task-input"
        value={priority}
        onChange={(e) =>
          setPriority(e.target.value)
        }
      >

      <option value="High">
        High
      </option>

      <option value="Medium">
        Medium
      </option>

      <option value="Low">
        Low
      </option>

      </select>

        <button
          className="add-button"
          onClick={addTask}
          disabled={loading}
        >
            {loading ? "Adding..." : "Add Task"}
        </button>
      

    {
      sortedTasks.length === 0 ? (

        <h2 className="empty-message">

          No Tasks Found 📭

        </h2>

      ) : (

        sortedTasks.map((task) => (

          <div
            className="task-card"
            key={task._id}
          >

            <h3>{task.title}</h3>

            <p>{task.description}</p>

            <p>
              Due Date: {task.dueDate}
            </p>

            {
              task.status === "Pending" && task.dueDate && new Date(task.dueDate) < new Date() && (

                <p className="overdue-text">

                  ⚠ Overdue

                </p>

              )
            }

            <p
              className={
                task.priority === "High"
                  ? "high-priority"
                  : task.priority === "Medium"
                  ? "medium-priority"
                  : "low-priority"
              }
            >

              Priority: {task.priority}

            </p>

            <span
              className={
                task.status === "Completed"
                  ? "status-completed"
                  : "status-pending"
              }
            >

              {task.status}

            </span>

            <br /><br />

            <button onClick={() => updateTask(task._id)}>
              Complete
            </button>

            <button onClick={() => editTask(task._id)}>
              Edit
            </button>

            <button onClick={() => deleteTask(task._id)}>
              Delete
            </button>

          </div>

        ))

      )
    }


    </div>
  );
}

export default Dashboard;