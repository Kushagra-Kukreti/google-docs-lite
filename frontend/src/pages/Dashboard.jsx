import { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, addDoc, query, where, onSnapshot, updateDoc, doc } from "firebase/firestore";
import { useAuth } from "../context/AuthContext.jsx";
import SidebarComponent from "../components/SidebarComponent.jsx";
export default function Dashboard() {
  const { user, logout } = useAuth();
  const [inviteEmail, setInviteEmail] = useState("");
  const [boards, setBoards] = useState([]);
  const [activeBoard, setActiveBoard] = useState(null);

  // Fetch boards where user is a member
  useEffect(() => {
    const q = query(collection(db, "boards"), where("members", "array-contains", user.uid));
    const unsub = onSnapshot(q, (snapshot) => {
      const boardsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setBoards(boardsData);
    });
    return () => unsub();
  }, [user.uid]);

  const createBoard = async (boardName) => {
    if (!boardName.trim()) return;
    await addDoc(collection(db, "boards"), {
      name: boardName,
      ownerId: user.uid,
      members: [user.uid],
      createdAt: new Date()
    });
  };

  // Invite user to selected board
  const inviteUser = async (boardId) => {
    if (!inviteEmail.trim()) return;
    const boardRef = doc(db, "boards", boardId);
    // For MVP, assume email = uid
    await updateDoc(boardRef, { members: [...boards.find(b => b.id === boardId).members, inviteEmail] });
    setInviteEmail("");
  };

  return (
    <div className="flex h-screen">
      <SidebarComponent
        boards={boards}
        setActiveBoard={setActiveBoard}
        addBoard={createBoard}
      />

      <div className="flex-1 p-4">
        <div className="flex justify-between mb-4">
          <h1 className="text-2xl">Welcome {user.displayName}</h1>
          <button onClick={logout} className="bg-red-500 px-3 py-1 text-white rounded">Logout</button>
        </div>

        <div className="mb-4">
          <h2 className="font-bold">Invite User to Board</h2>
          <input
            placeholder="User Email / UID"
            value={inviteEmail}
            onChange={e => setInviteEmail(e.target.value)}
            className="border p-2 rounded mr-2"
          />
          <button
            onClick={() => inviteUser(activeBoard || boards[0]?.id)}
            className="bg-blue-500 text-white px-3 py-1 rounded"
          >
            Invite
          </button>
        </div>

        <p>Select a board from the sidebar to start collaborating!</p>
      </div>
    </div>
  );
}
