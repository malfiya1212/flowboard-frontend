import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const DataContext = createContext(null);

export function DataProvider({ children }) {
  const { currentUser } = useAuth();

  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [isInitializing, setIsInitializing] = useState(true);

  // Load user data upon authentication state changes
  useEffect(() => {
    if (!currentUser) {
      setProjects([]);
      setTasks([]);
      setIsInitializing(false);
      return;
    }

    try {
      const allProjects = JSON.parse(localStorage.getItem('flowboard_all_projects') || '[]');
      const allTasks = JSON.parse(localStorage.getItem('flowboard_all_tasks') || '[]');

      // Restrict in-memory state to only the current user's records
      setProjects(allProjects.filter((p) => p.userId === currentUser.id));
      setTasks(allTasks.filter((t) => t.userId === currentUser.id));
    } catch (e) {
      console.error('Failed to parse database records:', e);
      setProjects([]);
      setTasks([]);
    } finally {
      setIsInitializing(false);
    }
  }, [currentUser]);

  // Project CRUD Actions
  const createProject = (projectData) => {
    if (!currentUser) return null;

    const newProject = {
      id: `proj_${Date.now()}`,
      userId: currentUser.id,
      name: projectData.name.trim(),
      description: projectData.description?.trim() || '',
      createdAt: new Date().toISOString(),
    };

    const allProjects = JSON.parse(localStorage.getItem('flowboard_all_projects') || '[]');
    const updatedAll = [newProject, ...allProjects];
    localStorage.setItem('flowboard_all_projects', JSON.stringify(updatedAll));

    setProjects((prev) => [newProject, ...prev]);
    return newProject;
  };

  const updateProject = (projectId, updates) => {
    if (!currentUser) return;

    const allProjects = JSON.parse(localStorage.getItem('flowboard_all_projects') || '[]');
    const updatedAll = allProjects.map((p) => {
      if (p.id === projectId && p.userId === currentUser.id) {
        return {
          ...p,
          name: updates.name.trim(),
          description: updates.description?.trim() || '',
        };
      }
      return p;
    });

    localStorage.setItem('flowboard_all_projects', JSON.stringify(updatedAll));
    setProjects((prev) =>
      prev.map((p) => (p.id === projectId ? { ...p, ...updates } : p))
    );
  };

  const deleteProject = (projectId) => {
    if (!currentUser) return;

    // Delete project and cascade-delete its assigned tasks
    const allProjects = JSON.parse(localStorage.getItem('flowboard_all_projects') || '[]');
    const filteredProjects = allProjects.filter(
      (p) => !(p.id === projectId && p.userId === currentUser.id)
    );
    localStorage.setItem('flowboard_all_projects', JSON.stringify(filteredProjects));

    const allTasks = JSON.parse(localStorage.getItem('flowboard_all_tasks') || '[]');
    const filteredTasks = allTasks.filter(
      (t) => !(t.projectId === projectId && t.userId === currentUser.id)
    );
    localStorage.setItem('flowboard_all_tasks', JSON.stringify(filteredTasks));

    setProjects((prev) => prev.filter((p) => p.id !== projectId));
    setTasks((prev) => prev.filter((t) => t.projectId !== projectId));
  };

  // Task CRUD Actions
  const createTask = (taskData) => {
    if (!currentUser) return null;

    const newTask = {
      id: `task_${Date.now()}`,
      projectId: taskData.projectId,
      userId: currentUser.id,
      title: taskData.title.trim(),
      description: taskData.description?.trim() || '',
      status: taskData.status || 'Todo',
      priority: taskData.priority || 'Medium',
      dueDate: taskData.dueDate || '',
      createdAt: new Date().toISOString(),
    };

    const allTasks = JSON.parse(localStorage.getItem('flowboard_all_tasks') || '[]');
    const updatedAll = [newTask, ...allTasks];
    localStorage.setItem('flowboard_all_tasks', JSON.stringify(updatedAll));

    setTasks((prev) => [newTask, ...prev]);
    return newTask;
  };

  const updateTask = (taskId, updates) => {
    if (!currentUser) return;

    const allTasks = JSON.parse(localStorage.getItem('flowboard_all_tasks') || '[]');
    const updatedAll = allTasks.map((t) => {
      if (t.id === taskId && t.userId === currentUser.id) {
        return { ...t, ...updates };
      }
      return t;
    });

    localStorage.setItem('flowboard_all_tasks', JSON.stringify(updatedAll));
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, ...updates } : t))
    );
  };

  const deleteTask = (taskId) => {
    if (!currentUser) return;

    const allTasks = JSON.parse(localStorage.getItem('flowboard_all_tasks') || '[]');
    const filteredTasks = allTasks.filter(
      (t) => !(t.id === taskId && t.userId === currentUser.id)
    );
    localStorage.setItem('flowboard_all_tasks', JSON.stringify(filteredTasks));

    setTasks((prev) => prev.filter((t) => t.id !== taskId));
  };

  return (
    <DataContext.Provider
      value={{
        projects,
        tasks,
        isInitializing,
        createProject,
        updateProject,
        deleteProject,
        createTask,
        updateTask,
        deleteTask,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) throw new Error('useData must be used within a DataProvider');
  return context;
};