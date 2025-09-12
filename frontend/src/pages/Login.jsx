import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { login } = useAuth();

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md text-center">
        <h1 className="text-2xl font-bold mb-6">Welcome to Real-Time Todo App</h1>
        <button
          onClick={login}
          className="bg-blue-500 text-white px-6 py-3 rounded hover:bg-blue-600"
        >
          Sign in with Google
        </button>
      </div>
    </div>
  );
}
