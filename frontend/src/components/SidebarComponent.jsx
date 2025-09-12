import { useState } from "react";
import { useNavigate } from "react-router-dom";

const SidebarComponent = ({ boards, setActiveBoard, addBoard, activeBoard }) => {
  const [newBoard, setNewBoard] = useState("");
  const navigate = useNavigate();

  const handleAddBoard = async () => {
    if (!newBoard.trim()) return;
    const boardId = await addBoard(newBoard); // Assume addBoard returns the new board ID
    setNewBoard("");
    setActiveBoard(boardId);
  };

  return (
    <div className="w-64 text-white h-screen p-4 flex flex-col bg-gray-900">
      <h2 className="text-xl font-bold mb-4">Boards</h2>

      <ul className="flex-1 overflow-y-auto">
        {boards.map((board) => (
          <li
            key={board.id}
            onClick={() => {
              setActiveBoard(board.id);
              navigate(`/board/${board.id}`);
            }}
            className={`p-2 mb-2 rounded cursor-pointer ${
              activeBoard === board.id ? "bg-blue-600" : "bg-gray-700 hover:bg-gray-600"
            }`}
          >
            {board.name}
          </li>
        ))}
      </ul>

      <div className="mt-4">
        <input
          type="text"
          placeholder="New Board"
          value={newBoard}
          onChange={(e) => setNewBoard(e.target.value)}
          className="w-full p-2 mb-2 rounded text-white"
        />
        <button
          onClick={handleAddBoard}
          className="w-full bg-green-500 hover:bg-green-600 p-2 rounded"
        >
          + Add Board
        </button>
      </div>
    </div>
  );
};

export default SidebarComponent;
