import React, { useState } from "react";
import type { ToDo as TodoType } from '../types'
import { ToDo } from "./ToDo";
import { useAutoAnimate } from '@formkit/auto-animate/react'

interface Props {
    toDos: TodoType[]
    setCompleted: (id: string, completed: boolean) => void
    setTitle: (params: Omit<TodoType, 'completed'>) => void
    removeTodo: (id: string) => void
}

export const ToDos: React.FC<Props> = ({
    toDos, 
    setCompleted, 
    setTitle,
    removeTodo
    }) => {

    const [isEditing, setIsEditing] = useState('')
    const [parent] = useAutoAnimate(/* optional config */)

    return (
        <ul className="todo-list"  ref={parent}>
            {toDos.map((toDo) =>(
                <li key={toDo.id} 
                onDoubleClick={() => { setIsEditing(toDo.id) }}
                className={`
                    ${toDo.completed ? 'Completed' : ''}
                    ${isEditing === toDo.id ? 'editing' : ''}
                    `}
                >
                    <ToDo
                        key={toDo.id}
                        id={toDo.id}
                        title={toDo.title}
                        completed={toDo.completed}
                        setCompleted={setCompleted}
                        setTitle={setTitle}
                        removeTodo={removeTodo}
                        isEditing={isEditing}
                        setIsEditing={setIsEditing}
                    />
                </li>
            ))}
        </ul>
    )
}