import React, { useState, useEffect } from "react";
import {
  Plus,
  Edit3,
  Trash2,
  Check,
  Calendar,
  User,
  LogOut,
  Search,
  Filter,
  Moon,
  Sun,
  Github,
  Mail,
} from "lucide-react";
import useStore from './store';
import LoginRegister from './LoginRegister';

const TodoApp = () => {
  const { 
    user, 
    tasks, 
    isLoading, 
    error, 
    setUser, 
    logout, 
    fetchTasks, 
    createTask, 
    updateTask, 
    deleteTask, 
    handleLogin,
    handleEmailLogin,
    handleEmailRegister
  } = useStore();
  const [showAddTask, setShowAddTask] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [darkMode, setDarkMode] = useState(false);
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    dueDate: "",
    status: "Open",
  });

  // Sample data
  const sampleTasks = [
    {
      id: 1,
      title: "Complete React Project",
      description: "Finish the todo app with all required features",
      dueDate: "2025-05-30",
      status: "Open",
    },
    {
      id: 2,
      title: "Review Backend Code",
      description: "Check API endpoints and database connections",
      dueDate: "2025-05-28",
      status: "Complete",
    },
    {
      id: 3,
      title: "Deploy Application",
      description: "Deploy frontend and backend to cloud platforms",
      dueDate: "2025-06-01",
      status: "Open",
    },
  ];
  useEffect(() => {
    // Check for token in URL when component mounts
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    if (token) {
      handleLogin(token);
      // Clean up URL
      window.history.replaceState({}, document.title, window.location.pathname);
    } else {
      // Check for stored token
      const storedToken = localStorage.getItem('token');
      if (storedToken) {
        handleLogin(storedToken);
      }
    }
  }, []);

  useEffect(() => {
    if (user) {
      fetchTasks();
    }
  }, [user]);

  const handleSocialLogin = (provider) => {
    // Redirect to backend auth route
    window.location.href = `http://localhost:5000/api/auth/${provider}`;
  };

  const handleAddTask = async () => {
    if (newTask.title.trim()) {
      await createTask(newTask);
      setNewTask({ title: "", description: "", dueDate: "", status: "Open" });
      setShowAddTask(false);
    }
  };

  const handleEditTask = (taskId) => {
    const task = tasks.find((t) => t._id === taskId);
    setEditingTask(task);
    setNewTask(task);
    setShowAddTask(true);
  };

  const handleUpdateTask = async () => {
    await updateTask(editingTask._id, newTask);
    setEditingTask(null);
    setNewTask({ title: "", description: "", dueDate: "", status: "Open" });
    setShowAddTask(false);
  };

  const handleDeleteTask = async (taskId) => {
    await deleteTask(taskId);
  };

  const toggleTaskStatus = async (taskId) => {
    const task = tasks.find((t) => t._id === taskId);
    if (!task) return; // Guard clause to prevent undefined access
    await updateTask(taskId, {
      ...task,
      status: task.status === "Open" ? "Complete" : "Open"
    });
  };

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter =
      filterStatus === "all" ||
      (filterStatus === "open" && task.status === "Open") ||
      (filterStatus === "complete" && task.status === "Complete");
    return matchesSearch && matchesFilter;
  });

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const isOverdue = (dueDate) => {
    if (!dueDate) return false;
    return (
      new Date(dueDate) < new Date() &&
      new Date(dueDate).toDateString() !== new Date().toDateString()
    );
  };
  if (!user) {
    return (
      <div
        className={`min-h-screen transition-all duration-300 ${
          darkMode
            ? "bg-gray-900"
            : "bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50"
        }`}
      >
        <div className="absolute top-4 right-4">
          <button
            onClick={() => setDarkMode(!darkMode)}
            className={`p-2 rounded-full transition-all duration-300 ${
              darkMode
                ? "bg-yellow-400 text-gray-900 hover:bg-yellow-300"
                : "bg-gray-800 text-yellow-400 hover:bg-gray-700"
            }`}
          >
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>

        <LoginRegister darkMode={darkMode} />
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen transition-all duration-300 ${
        darkMode
          ? "bg-gray-900"
          : "bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50"
      }`}
    >
      {/* Header */}
      <header
        className={`border-b backdrop-blur-sm sticky top-0 z-40 transition-all duration-300 ${
          darkMode
            ? "bg-gray-800/90 border-gray-700"
            : "bg-white/90 border-white/20"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                  darkMode
                    ? "bg-indigo-600"
                    : "bg-gradient-to-r from-indigo-500 to-purple-600"
                }`}
              >
                <Check className="text-white" size={20} />
              </div>
              <h1
                className={`text-xl font-bold ${
                  darkMode ? "text-white" : "text-gray-800"
                }`}
              >
                TaskFlow
              </h1>
            </div>

            <div className="flex items-center gap-4">
              <button
                onClick={() => setDarkMode(!darkMode)}
                className={`p-2 rounded-lg transition-all duration-300 ${
                  darkMode
                    ? "bg-yellow-400 text-gray-900 hover:bg-yellow-300"
                    : "bg-gray-800 text-yellow-400 hover:bg-gray-700"
                }`}
              >
                {darkMode ? <Sun size={16} /> : <Moon size={16} />}
              </button>

              <div className="flex items-center gap-3">
                <img
                  src={user?.avatar}
                  alt={user?.name}
                  className="w-8 h-8 rounded-full border-2 border-indigo-200"
                />
                <span
                  className={`hidden sm:inline text-sm font-medium ${
                    darkMode ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  {user?.name}
                </span>
              </div>              <button
                onClick={logout}
                className={`p-2 rounded-lg transition-all duration-300 ${
                  darkMode
                    ? "text-gray-400 hover:text-white hover:bg-gray-700"
                    : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                }`}
              >
                <LogOut size={16} />
              </button>
            </div>
          </div>
        </div>
      </header>      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Error Message */}
        {error && (
          <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-xl">
            {error}
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div
            className={`p-6 rounded-2xl shadow-lg backdrop-blur-sm transition-all duration-300 hover:scale-[1.02] ${
              darkMode
                ? "bg-gray-800/90 border border-gray-700"
                : "bg-white/90 border border-white/20"
            }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p
                  className={`text-sm font-medium ${
                    darkMode ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  Total Tasks
                </p>
                <p
                  className={`text-2xl font-bold ${
                    darkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  {tasks.length}
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <Calendar className="text-blue-600" size={24} />
              </div>
            </div>
          </div>

          <div
            className={`p-6 rounded-2xl shadow-lg backdrop-blur-sm transition-all duration-300 hover:scale-[1.02] ${
              darkMode
                ? "bg-gray-800/90 border border-gray-700"
                : "bg-white/90 border border-white/20"
            }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p
                  className={`text-sm font-medium ${
                    darkMode ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  Open Tasks
                </p>
                <p
                  className={`text-2xl font-bold ${
                    darkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  {tasks.filter((t) => t.status === "Open").length}
                </p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                <Plus className="text-orange-600" size={24} />
              </div>
            </div>
          </div>

          <div
            className={`p-6 rounded-2xl shadow-lg backdrop-blur-sm transition-all duration-300 hover:scale-[1.02] ${
              darkMode
                ? "bg-gray-800/90 border border-gray-700"
                : "bg-white/90 border border-white/20"
            }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p
                  className={`text-sm font-medium ${
                    darkMode ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  Completed
                </p>
                <p
                  className={`text-2xl font-bold ${
                    darkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  {tasks.filter((t) => t.status === "Complete").length}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <Check className="text-green-600" size={24} />
              </div>
            </div>
          </div>

          <div
            className={`p-6 rounded-2xl shadow-lg backdrop-blur-sm transition-all duration-300 hover:scale-[1.02] ${
              darkMode
                ? "bg-gray-800/90 border border-gray-700"
                : "bg-white/90 border border-white/20"
            }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p
                  className={`text-sm font-medium ${
                    darkMode ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  Overdue
                </p>
                <p
                  className={`text-2xl font-bold ${
                    darkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  {
                    tasks.filter(
                      (t) => t.status === "Open" && isOverdue(t.dueDate)
                    ).length
                  }
                </p>
              </div>
              <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                <Calendar className="text-red-600" size={24} />
              </div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search
              className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${
                darkMode ? "text-gray-400" : "text-gray-400"
              }`}
              size={20}
            />
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full pl-10 pr-4 py-3 rounded-xl border-2 transition-all duration-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                darkMode
                  ? "bg-gray-800 border-gray-600 text-white placeholder-gray-400"
                  : "bg-white border-gray-200 text-gray-900 placeholder-gray-500"
              }`}
            />
          </div>

          <div className="flex gap-2">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className={`px-4 py-3 rounded-xl border-2 transition-all duration-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                darkMode
                  ? "bg-gray-800 border-gray-600 text-white"
                  : "bg-white border-gray-200 text-gray-900"
              }`}
            >
              <option value="all">All Tasks</option>
              <option value="open">Open</option>
              <option value="complete">Complete</option>
            </select>

            <button
              onClick={() => setShowAddTask(true)}
              className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-6 py-3 rounded-xl hover:from-indigo-600 hover:to-purple-700 transition-all duration-300 flex items-center gap-2 hover:scale-[1.02] shadow-lg"
            >
              <Plus size={20} />
              <span className="hidden sm:inline">Add Task</span>
            </button>
          </div>
        </div>

        {/* Tasks Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTasks.map((task) => (
            <div
              key={task._id}
              className={`p-6 rounded-2xl shadow-lg backdrop-blur-sm transition-all duration-300 hover:scale-[1.02] border ${
                darkMode
                  ? "bg-gray-800/90 border-gray-700"
                  : "bg-white/90 border-white/20"
              } ${task.status === "Complete" ? "opacity-75" : ""}`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => toggleTaskStatus(task._id)}
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                      task.status === "Complete"
                        ? "bg-green-500 border-green-500"
                        : darkMode
                        ? "border-gray-500 hover:border-green-400"
                        : "border-gray-300 hover:border-green-500"
                    }`}
                  >
                    {task.status === "Complete" && (
                      <Check size={12} className="text-white" />
                    )}
                  </button>
                  <div
                    className={`px-2 py-1 rounded-lg text-xs font-medium ${
                      task.status === "Complete"
                        ? "bg-green-100 text-green-800"
                        : isOverdue(task.dueDate)
                        ? "bg-red-100 text-red-800"
                        : "bg-blue-100 text-blue-800"
                    }`}
                  >
                    {task.status === "Complete"
                      ? "Complete"
                      : isOverdue(task.dueDate)
                      ? "Overdue"
                      : "Open"}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleEditTask(task._id)}
                    className={`p-2 rounded-lg transition-all duration-300 ${
                      darkMode
                        ? "text-gray-400 hover:text-white hover:bg-gray-700"
                        : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    <Edit3 size={16} />
                  </button>
                  <button
                    onClick={() => handleDeleteTask(task._id)}
                    className={`p-2 rounded-lg transition-all duration-300 ${
                      darkMode
                        ? "text-gray-400 hover:text-red-400 hover:bg-gray-700"
                        : "text-gray-500 hover:text-red-600 hover:bg-gray-100"
                    }`}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              
              <h3
                className={`text-lg font-semibold mb-2 ${
                  darkMode ? "text-white" : "text-gray-900"
                } ${task.status === "Complete" ? "line-through" : ""}`}
              >
                {task.title}
              </h3>

              {task.description && (
                <p
                  className={`text-sm mb-4 ${
                    darkMode ? "text-gray-300" : "text-gray-600"
                  } ${task.status === "Complete" ? "line-through" : ""}`}
                >
                  {task.description}
                </p>
              )}

              {task.dueDate && (
                <div className="flex items-center gap-2 text-sm">
                  <Calendar
                    size={14}
                    className={
                      isOverdue(task.dueDate)
                        ? "text-red-500"
                        : darkMode
                        ? "text-gray-400"
                        : "text-gray-500"
                    }
                  />
                  <span
                    className={
                      isOverdue(task.dueDate)
                        ? "text-red-500 font-medium"
                        : darkMode
                        ? "text-gray-400"
                        : "text-gray-500"
                    }
                  >
                    {formatDate(task.dueDate)}
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>

        {filteredTasks.length === 0 && (
          <div
            className={`text-center py-12 rounded-2xl ${
              darkMode ? "bg-gray-800/50" : "bg-white/50"
            }`}
          >
            <div
              className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${
                darkMode ? "bg-gray-700" : "bg-gray-100"
              }`}
            >
              <Calendar
                className={darkMode ? "text-gray-400" : "text-gray-400"}
                size={32}
              />
            </div>
            <h3
              className={`text-lg font-medium mb-2 ${
                darkMode ? "text-white" : "text-gray-900"
              }`}
            >
              No tasks found
            </h3>
            <p className={darkMode ? "text-gray-400" : "text-gray-500"}>
              {searchTerm || filterStatus !== "all"
                ? "Try adjusting your search or filter"
                : "Create your first task to get started"}
            </p>
          </div>
        )}
      </div>

      {/* Add/Edit Task Modal */}
      {showAddTask && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div
            className={`w-full max-w-md p-6 rounded-2xl shadow-2xl transition-all duration-300 ${
              darkMode ? "bg-gray-800 border border-gray-700" : "bg-white"
            }`}
          >
            <h2
              className={`text-xl font-bold mb-6 ${
                darkMode ? "text-white" : "text-gray-900"
              }`}
            >
              {editingTask ? "Edit Task" : "Add New Task"}
            </h2>

            <div className="space-y-4">
              <input
                type="text"
                placeholder="Task title"
                value={newTask.title}
                onChange={(e) =>
                  setNewTask({ ...newTask, title: e.target.value })
                }
                className={`w-full p-3 rounded-xl border-2 transition-all duration-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                  darkMode
                    ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                    : "bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-500"
                }`}
              />

              <textarea
                placeholder="Task description (optional)"
                value={newTask.description}
                onChange={(e) =>
                  setNewTask({ ...newTask, description: e.target.value })
                }
                rows={3}
                className={`w-full p-3 rounded-xl border-2 transition-all duration-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none ${
                  darkMode
                    ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                    : "bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-500"
                }`}
              />

              <input
                type="date"
                value={newTask.dueDate}
                onChange={(e) =>
                  setNewTask({ ...newTask, dueDate: e.target.value })
                }
                className={`w-full p-3 rounded-xl border-2 transition-all duration-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                  darkMode
                    ? "bg-gray-700 border-gray-600 text-white"
                    : "bg-gray-50 border-gray-200 text-gray-900"
                }`}
              />

              <select
                value={newTask.status}
                onChange={(e) =>
                  setNewTask({ ...newTask, status: e.target.value })
                }
                className={`w-full p-3 rounded-xl border-2 transition-all duration-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                  darkMode
                    ? "bg-gray-700 border-gray-600 text-white"
                    : "bg-gray-50 border-gray-200 text-gray-900"
                }`}
              >
                <option value="Open">Open</option>
                <option value="Complete">Complete</option>
              </select>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => {
                  setShowAddTask(false);
                  setEditingTask(null);
                  setNewTask({
                    title: "",
                    description: "",
                    dueDate: "",
                    status: "Open",
                  });
                }}
                className={`flex-1 py-3 rounded-xl border-2 transition-all duration-300 ${
                  darkMode
                    ? "border-gray-600 text-gray-300 hover:bg-gray-700"
                    : "border-gray-200 text-gray-700 hover:bg-gray-50"
                }`}
              >
                Cancel
              </button>
              <button
                onClick={editingTask ? handleUpdateTask : handleAddTask}
                disabled={!newTask.title.trim()}
                className="flex-1 py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:from-indigo-600 hover:to-purple-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {editingTask ? "Update Task" : "Add Task"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TodoApp;
