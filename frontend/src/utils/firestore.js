import { db } from "../firebase";
import { collection, addDoc, updateDoc, deleteDoc, doc, onSnapshot, query, orderBy } from "firebase/firestore";

export const listenToTasks = (boardId, setTasks) => {
  const tasksRef = collection(db, "boards", boardId, "tasks");
  const q = query(tasksRef, orderBy("createdAt", "asc"));

  return onSnapshot(q, (snapshot) => {
    const data = { todo: [], inProgress: [], done: [] };
    snapshot.forEach(doc => {
      const task = { id: doc.id, ...doc.data() };
      data[task.status].push(task);
    });
    setTasks(data);
  });
};

export const addTask = async (boardId, title) => {
  const tasksRef = collection(db, "boards", boardId, "tasks");
  await addDoc(tasksRef, { title, status: "todo", createdAt: new Date() });
};

export const updateTask = async (boardId, taskId, updates) => {
  const taskRef = doc(db, "boards", boardId, "tasks", taskId);
  await updateDoc(taskRef, updates);
};

export const deleteTask = async (boardId, taskId) => {
  const taskRef = doc(db, "boards", boardId, "tasks", taskId);
  await deleteDoc(taskRef);
};
