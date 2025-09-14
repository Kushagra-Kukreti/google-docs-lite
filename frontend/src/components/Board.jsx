import { useEffect, useState } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import {
  listenToTasks,
  addTask,
  updateTask,
  deleteTask,
  getMembersList,
} from "../utils/firestore";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

export default function Board({ boardId }) {
  const [tasks, setTasks] = useState({ todo: [], inProgress: [], done: [] });
  const [newTask, setNewTask] = useState("");
  const [accessDenied, setAccessDenied] = useState(false);
  const navigate = useNavigate();
  const checkPermission = async (boardId) => {
    const response = await getMembersList(boardId);
    if (response === "permission-denied") {
      setAccessDenied(true);
    }
  };
  useEffect(() => {
    checkPermission(boardId);
    if (!accessDenied) {
      const unsub = listenToTasks(boardId, setTasks);
      return () => unsub();
    }
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

  if (accessDenied) {
    return (
      <AnimatePresence>
        {accessDenied && (
          <motion.div
            className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-2xl p-6 shadow-lg w-full max-w-lg"
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
              transition={{ type: "spring", stiffness: 120, damping: 20 }}
            >
              <h2 className="text-xl font-bold mb-4">🚫 Access Denied</h2>
              <p className="mb-4 text-gray-600">
                You don’t have permission to view this board.
              </p>
              <div className="flex justify-end">
                <button
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
                  onClick={() => {
                    setAccessDenied(false);
                    navigate("/");
                  }}
                >
                  Okay
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    );
  }

  return (
    <div>
      <form onSubmit={handleAddTask} className="flex gap-2 mb-4">
        <input
          className="border p-2 rounded flex-1"
          placeholder="New Task..."
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
        />
        <button className="bg-blue-500 text-white px-4 py-2 rounded">
          Add
        </button>
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
                    <Draggable
                      key={task.id}
                      draggableId={task.id}
                      index={index}
                    >
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
