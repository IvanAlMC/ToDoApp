import { Footer } from './components/Footer'
import { Header } from './components/Header'
import { ToDos } from './components/ToDos'
import { usetoDos } from './hooks/useTodos'

const App: React.FC = () => {
  const {
    activeCount,
    completedCount,
    filterSelected,
    handleClearCompleted,
    handleCompleted,
    handleFilterChange,
    handleRemove,
    handleSave,
    handleUpdateTitle,
    toDos: filteredTodos
  } = usetoDos()

  return (
    <>
      <div className='todoapp'>
        <Header saveTodo={handleSave} />
        <ToDos
          removeTodo={handleRemove}
          setCompleted={handleCompleted}
          setTitle={handleUpdateTitle}
          toDos={filteredTodos}
        />
        <Footer
          handleFilterChange={handleFilterChange}
          completedCount={completedCount}
          activeCount={activeCount}
          filterSelected={filterSelected}
          onClearCompleted={handleClearCompleted}
        />
      </div>
    </>
  )
}

export default App