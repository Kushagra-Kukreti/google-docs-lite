import { useParams } from "react-router-dom";
import Board from "../components/Board";

export default function BoardPage() {
  const { id } = useParams();
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Board</h1>
      <Board boardId={id} />
    </div>
  );
}
