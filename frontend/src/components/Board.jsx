import { useEffect, useState } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { listenToTasks, addTask, updateTask, deleteTask } from "../utils/firestore";

export default function Board({ boardId }) {
  const [tasks, setTasks] = useState({ todo: [], inProgress: [], done: [] });
  const [newTask, setNewTask] = useState("");

  useEffect(() => {
    const unsub = listenToTasks(boardId, setTasks);
    return () => unsub();
  }, [boardId]);

  const onDragEnd = (result) => {
    if (!result.destination) return;
    const { source, destination } = result;
    if (source.droppableId === destination.droppableId) return;

    const movedTask = tasks[source.droppableId][source.index];
    updateTask(boardId, movedTask.id, { status: destination.droppableId });
  };

  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!newTask.trim()) return;
    await addTask(boardId, newTask);
    setNewTask("");
  };

  return (
    <div>
      <form onSubmit={handleAddTask} className="flex gap-2 mb-4">
        <input
          className="border p-2 rounded flex-1"
          placeholder="New Task..."
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
        />
        <button className="bg-blue-500 text-white px-4 py-2 rounded">Add</button>
      </form>

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="grid grid-cols-3 gap-4">
          {Object.entries(tasks).map(([colId, items]) => (
            <Droppable droppableId={colId} key={colId}>
              {(provided) => (
                <div
                  className="bg-gray-100 p-4 rounded min-h-[300px]"
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                >
                  <h2 className="font-bold mb-2 capitalize">{colId}</h2>
                  {items.map((task, index) => (
                    <Draggable key={task.id} draggableId={task.id} index={index}>
                      {(provided) => (
                        <div
                          className="bg-white p-2 rounded shadow mb-2 flex justify-between"
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                        >
                          {task.title}
                          <button
                            className="text-red-500 ml-2"
                            onClick={() => deleteTask(boardId, task.id)}
                          >
                            ✕
                          </button>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          ))}
        </div>
      </DragDropContext>
    </div>
  );
}
