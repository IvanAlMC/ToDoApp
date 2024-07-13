import type { TO_DO_FILTERS } from './consts'

export interface ToDo {
  id: string
  title: string
  completed: boolean
}

export type ToDoId = Pick<ToDo, 'id'>
export type ToDoTitle = Pick<ToDo, 'title'>
export type ToDoCompleted = Pick<ToDo, 'completed'>

export type FilterValue = typeof TO_DO_FILTERS[keyof typeof TO_DO_FILTERS]

export type ToDoList = ToDo[]