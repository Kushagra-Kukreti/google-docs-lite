import { useEffect, useState } from "react";
import { db } from "../firebase";
import {
  collection,
  addDoc,
  query,
  where,
  onSnapshot,
  updateDoc,
  doc,
  deleteDoc,
} from "firebase/firestore";
import { useAuth } from "../context/AuthContext.jsx";
import SidebarComponent from "../components/SidebarComponent.jsx";
import ShareModal from "../components/ShareModal.jsx";
import { Menu, MenuItem } from "@mui/material";
import BoardCard from "../components/BoardCard.jsx";

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [boards, setBoards] = useState([]);
  const [activeBoard, setActiveBoard] = useState(null);
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [selectedBoard, setSelectedBoard] = useState(null);
  const [shareOpen, setShareOpen] = useState(false);

  // Fetch boards where user is a member
  useEffect(() => {
    if (!user?.uid) return;
    const q = query(collection(db, "boards"), where("members", "array-contains", user.uid));
    const unsub = onSnapshot(q, (snapshot) => {
      const boardsData = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setBoards(boardsData);
    });
    return () => unsub();
  }, [user?.uid]);

  const createBoard = async (boardName) => {
    if (!boardName.trim()) return;
    await addDoc(collection(db, "boards"), {
      name: boardName,
      ownerId: user.uid,
      members: [user.uid],
      createdAt: new Date(),
    });
  };

  const inviteUser = async (boardId, uid) => {
    const boardRef = doc(db, "boards", boardId);
    const board = boards.find((b) => b.id === boardId);
    if (!board) return;
    const updatedMembers = [...new Set([...board.members, uid])];
    await updateDoc(boardRef, { members: updatedMembers });
  };

  const deleteBoard = async (boardId) => {
    await deleteDoc(doc(db, "boards", boardId));
  };

  const handleMenuOpen = (event, board) => {
    setMenuAnchor(event.currentTarget);
    setSelectedBoard(board);
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <SidebarComponent boards={boards} setActiveBoard={setActiveBoard} addBoard={createBoard} />

      {/* Main Area */}
      <div className="flex-1 p-6">
        <div className="flex justify-between mb-6">
          <h1 className="text-2xl font-bold">Welcome {user.displayName}</h1>
          <button onClick={logout} className="bg-red-500 px-3 py-1 text-white rounded">
            Logout
          </button>
        </div>

        {/* Boards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {boards.map((board) => (
            <BoardCard key={board.id} board={board} onMenuOpen={handleMenuOpen} />
          ))}
        </div>

        {/* Menu for board options */}
        <Menu anchorEl={menuAnchor} open={Boolean(menuAnchor)} onClose={handleMenuClose}>
          <MenuItem
            onClick={() => {
              setShareOpen(true);
              handleMenuClose();
            }}
          >
            Share
          </MenuItem>
          <MenuItem onClick={handleMenuClose}>Edit</MenuItem>
          <MenuItem
            onClick={() => {
              deleteBoard(selectedBoard.id);
              handleMenuClose();
            }}
          >
            Delete
          </MenuItem>
        </Menu>

        {/* Share Modal */}
        <ShareModal
          open={shareOpen}
          onClose={() => setShareOpen(false)}
          board={selectedBoard}
          onInvite={inviteUser}
        />
      </div>
    </div>
  );
}
