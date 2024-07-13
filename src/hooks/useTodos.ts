import { useEffect, useReducer } from 'react'
import { TODO_FILTERS } from '../consts'
import { fetchtoDos, updatetoDos } from '../services/ToDos'
import { type ToDoList, type FilterValue } from '../types'

const initialState = {
  sync: false,
  toDos: [],
  filterSelected: (() => {
    // read from url query params using URLSearchParams
    const params = new URLSearchParams(window.location.search)
    const filter = params.get('filter') as FilterValue | null
    if (filter === null) return TODO_FILTERS.ALL
    // check filter is valid, if not return ALL
    return Object
      .values(TODO_FILTERS)
      .includes(filter)
      ? filter
      : TODO_FILTERS.ALL
  })()
}

type Action =
  | { type: 'INIT_toDos', payload: { toDos: ToDoList } }
  | { type: 'CLEAR_COMPLETED' }
  | { type: 'COMPLETED', payload: { id: string, completed: boolean } }
  | { type: 'FILTER_CHANGE', payload: { filter: FilterValue } }
  | { type: 'REMOVE', payload: { id: string } }
  | { type: 'SAVE', payload: { title: string } }
  | { type: 'UPDATE_TITLE', payload: { id: string, title: string } }

interface State {
  sync: boolean
  toDos: ToDoList
  filterSelected: FilterValue
}

const reducer = (state: State, action: Action): State => {
  if (action.type === 'INIT_toDos') {
    const { toDos } = action.payload
    return {
      ...state,
      sync: false,
      toDos
    }
  }

  if (action.type === 'CLEAR_COMPLETED') {
    return {
      ...state,
      sync: true,
      toDos: state.toDos.filter((todo) => !todo.completed)
    }
  }

  if (action.type === 'COMPLETED') {
    const { id, completed } = action.payload
    return {
      ...state,
      sync: true,
      toDos: state.toDos.map((todo) => {
        if (todo.id === id) {
          return {
            ...todo,
            completed
          }
        }

        return todo
      })
    }
  }

  if (action.type === 'FILTER_CHANGE') {
    const { filter } = action.payload
    return {
      ...state,
      sync: true,
      filterSelected: filter
    }
  }

  if (action.type === 'REMOVE') {
    const { id } = action.payload
    return {
      ...state,
      sync: true,
      toDos: state.toDos.filter((todo) => todo.id !== id)
    }
  }

  if (action.type === 'SAVE') {
    const { title } = action.payload
    const newTodo = {
      id: crypto.randomUUID(),
      title,
      completed: false
    }

    return {
      ...state,
      sync: true,
      toDos: [...state.toDos, newTodo]
    }
  }

  if (action.type === 'UPDATE_TITLE') {
    const { id, title } = action.payload
    return {
      ...state,
      sync: true,
      toDos: state.toDos.map((todo) => {
        if (todo.id === id) {
          return {
            ...todo,
            title
          }
        }

        return todo
      })
    }
  }

  return state
}

export const usetoDos = (): {
  activeCount: number
  completedCount: number
  toDos: ToDoList
  filterSelected: FilterValue
  handleClearCompleted: () => void
  handleCompleted: (id: string, completed: boolean) => void
  handleFilterChange: (filter: FilterValue) => void
  handleRemove: (id: string) => void
  handleSave: (title: string) => void
  handleUpdateTitle: (params: { id: string, title: string }) => void
} => {
  const [{ sync, toDos, filterSelected }, dispatch] = useReducer(reducer, initialState)

  const handleCompleted = (id: string, completed: boolean): void => {
    dispatch({ type: 'COMPLETED', payload: { id, completed } })
  }

  const handleRemove = (id: string): void => {
    dispatch({ type: 'REMOVE', payload: { id } })
  }

  const handleUpdateTitle = ({ id, title }: { id: string, title: string }): void => {
    dispatch({ type: 'UPDATE_TITLE', payload: { id, title } })
  }

  const handleSave = (title: string): void => {
    dispatch({ type: 'SAVE', payload: { title } })
  }

  const handleClearCompleted = (): void => {
    dispatch({ type: 'CLEAR_COMPLETED' })
  }

  const handleFilterChange = (filter: FilterValue): void => {
    dispatch({ type: 'FILTER_CHANGE', payload: { filter } })

    const params = new URLSearchParams(window.location.search)
    params.set('filter', filter)
    window.history.pushState({}, '', `${window.location.pathname}?${params.toString()}`)
  }

  const filteredtoDos = toDos.filter(todo => {
    if (filterSelected === TODO_FILTERS.ACTIVE) {
      return !todo.completed
    }

    if (filterSelected === TODO_FILTERS.COMPLETED) {
      return todo.completed
    }

    return true
  })

  const completedCount = toDos.filter((todo) => todo.completed).length
  const activeCount = toDos.length - completedCount

  useEffect(() => {
    fetchtoDos()
      .then(toDos => {
        dispatch({ type: 'INIT_toDos', payload: { toDos } })
      })
      .catch(err => { console.error(err) })
  }, [])

  useEffect(() => {
    if (sync) {
      updatetoDos({ toDos }).catch(err => { console.error(err) })
    }
  }, [toDos, sync])

  return {
    activeCount,
    completedCount,
    filterSelected,
    handleClearCompleted,
    handleCompleted,
    handleFilterChange,
    handleRemove,
    handleSave,
    handleUpdateTitle,
    toDos: filteredtoDos
  }
}