import { type ToDoList } from '../types'

const API_URL = 'https://api.jsonbin.io/v3/b/63ff3a52ebd26539d087639c'

interface ToDos {
  id: string
  title: string
  completed: boolean
  order: number
}

export const fetchtoDos = async (): Promise<ToDos[]> => {
  const res = await fetch(API_URL)
  if (!res.ok) {
    console.error('Error fetching toDos')
    return []
  }

  const { record: toDos } = await res.json() as { record: ToDos[] }
  return toDos
}

export const updatetoDos = async ({ toDos }: { toDos: ToDoList }): Promise<boolean> => {
  console.log(import.meta.env.VITE_API_BIN_KEY)
  const res = await fetch(API_URL, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'X-Master-Key': import.meta.env.VITE_API_BIN_KEY
    },
    body: JSON.stringify(toDos)
  })

  return res.ok
}