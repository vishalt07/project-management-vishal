import { createSlice } from '@reduxjs/toolkit'

const loadProjects = () => {
  try {
    return JSON.parse(localStorage.getItem('pm_projects') || '[]')
  } catch {
    return []
  }
}

const save = (projects) => {
  localStorage.setItem('pm_projects', JSON.stringify(projects))
}

const STATUS = { TODO: 'todo', IN_PROGRESS: 'in-progress', DONE: 'done' }
const PRIORITY = { LOW: 'low', MEDIUM: 'medium', HIGH: 'high' }

const projectSlice = createSlice({
  name: 'projects',
  initialState: {
    list: loadProjects(),
    activeId: null,
  },
  reducers: {
    addProject(state, action) {
      const project = {
        id: Date.now().toString(),
        name: action.payload.name,
        description: action.payload.description || '',
        color: action.payload.color || '#6366f1',
        status: STATUS.IN_PROGRESS,
        priority: action.payload.priority || PRIORITY.MEDIUM,
        createdAt: new Date().toISOString(),
        dueDate: action.payload.dueDate || null,
        tasks: [],
        members: [],
      }
      state.list.push(project)
      save(state.list)
    },
    deleteProject(state, action) {
      state.list = state.list.filter(p => p.id !== action.payload)
      if (state.activeId === action.payload) state.activeId = null
      save(state.list)
    },
    updateProject(state, action) {
      const idx = state.list.findIndex(p => p.id === action.payload.id)
      if (idx !== -1) {
        state.list[idx] = { ...state.list[idx], ...action.payload }
        save(state.list)
      }
    },
    setActiveProject(state, action) {
      state.activeId = action.payload
    },
    addTask(state, action) {
      const { projectId, task } = action.payload
      const project = state.list.find(p => p.id === projectId)
      if (project) {
        project.tasks.push({
          id: Date.now().toString(),
          title: task.title,
          description: task.description || '',
          status: task.status || STATUS.TODO,
          priority: task.priority || PRIORITY.MEDIUM,
          dueDate: task.dueDate || null,
          createdAt: new Date().toISOString(),
        })
        save(state.list)
      }
    },
    updateTask(state, action) {
      const { projectId, taskId, updates } = action.payload
      const project = state.list.find(p => p.id === projectId)
      if (project) {
        const task = project.tasks.find(t => t.id === taskId)
        if (task) Object.assign(task, updates)
        save(state.list)
      }
    },
    deleteTask(state, action) {
      const { projectId, taskId } = action.payload
      const project = state.list.find(p => p.id === projectId)
      if (project) {
        project.tasks = project.tasks.filter(t => t.id !== taskId)
        save(state.list)
      }
    },
  },
})

export const { addProject, deleteProject, updateProject, setActiveProject, addTask, updateTask, deleteTask } = projectSlice.actions
export default projectSlice.reducer
