import { useAuth } from "../context/AuthContext";
import GoogleIcon from "@mui/icons-material/Google";
import { motion } from "framer-motion";

export default function Login() {
  const { login } = useAuth();

  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-br from-indigo-50 to-blue-50">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="bg-white p-10 rounded-3xl shadow-xl w-full max-w-sm text-center"
      >
        <h1 className="text-3xl font-bold mb-8 text-gray-800">
          Task Flow Real-Time Collaboration
        </h1>

        <p className="text-gray-500 mb-6">
          Sign in with your Google account to continue
        </p>

        <button
          onClick={login}
          className="flex items-center justify-center gap-3 w-full bg-white border border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:shadow-md transition-all duration-200"
        >
          <GoogleIcon />
          <span>Sign in with Google</span>
        </button>
      </motion.div>
    </div>
  );
}
