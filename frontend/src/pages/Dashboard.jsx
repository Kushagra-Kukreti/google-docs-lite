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
import { Menu, MenuItem, Avatar, Divider, Typography } from "@mui/material";
import BoardCard from "../components/BoardCard.jsx";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [boards, setBoards] = useState([]);
  const [activeBoard, setActiveBoard] = useState(null);
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [selectedBoard, setSelectedBoard] = useState(null);
  const [shareOpen, setShareOpen] = useState(false);

  // Profile menu state
  const [profileAnchor, setProfileAnchor] = useState(null);

  const navigate = useNavigate();

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

  const inviteUser = async (boardId, userInfo) => {
    const boardRef = doc(db, "boards", boardId);
    const board = boards.find((b) => b.id === boardId);
    if (!board) return;
    const updatedMembers = [...new Set([...board.members, userInfo])];
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

  const handleProfileOpen = (event) => {
    setProfileAnchor(event.currentTarget);
  };

  const handleProfileClose = () => {
    setProfileAnchor(null);
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <SidebarComponent boards={boards} setActiveBoard={setActiveBoard} addBoard={createBoard} />

      {/* Main Area */}
      <div className="flex-1 p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Welcome {user.displayName}</h1>

          {/* Profile Avatar */}
          <div>
            <Avatar
              src={user.photoURL}
              alt={user.displayName}
              onClick={handleProfileOpen}
              sx={{ cursor: "pointer" }}
            />
            <Menu
              anchorEl={profileAnchor}
              open={Boolean(profileAnchor)}
              onClose={handleProfileClose}
            >
              <div className="px-4 py-2">
                <Typography variant="subtitle1" className="font-bold">
                  {user.displayName}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {user.email}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                 uid:{user.uid}
                </Typography>
              </div>
              <Divider />
              <MenuItem onClick={logout}>Logout</MenuItem>
            </Menu>
          </div>
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
              handleMenuClose();
              setShareOpen(true)
            }}
          >
            Share
          </MenuItem>
          <MenuItem
            onClick={() => {
              handleMenuClose();
              navigate(`/board/${selectedBoard.id}`);
            }}
          >
            Edit
          </MenuItem>
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
