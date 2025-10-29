import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "./actions/auth";

function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage({ text: "", type: "" });

    try {
      const data = await loginUser(username, password);
      const overFlag = data.user.length > 1 ? 1 : 0;

      if (overFlag === 0) {
        localStorage.setItem("userData", JSON.stringify(data.user[0]));
        navigate("/home");
      } else {
        setMessage({
          text: "Hello: " + data.user.map(u => u.name).join(", "),
          type: "success",
        });
      }
    } catch (err) {
      setMessage({ text: err.message, type: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-black-10 text-gray-100">
      <div className="w-full max-w-md p-8 space-y-8 bg-black-25 rounded-lg shadow-2xl">
        <h2 className="text-3xl font-bold text-center text-white">Netlab Login</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="username" className="block mb-2 text-sm font-medium text-gray-300">
              Username
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              disabled={isLoading}
              className="w-full px-4 py-2 bg-black-30 border border-black rounded-md text-gray-100 placeholder-white placeholder:opacity-50 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent disabled:opacity-50"
              placeholder="Enter username"
            />
          </div>

          <div>
            <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-300">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isLoading}
              className="w-full px-4 py-2 bg-black-30 border border-black rounded-md text-gray-100 placeholder-white placeholder:opacity-50 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent disabled:opacity-50"
              placeholder="Enter password"
            />
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full px-4 py-2 font-bold text-white bg-black rounded-md hover:bg-white hover:text-black focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:ring-offset-gray-800 transition duration-300 disabled:bg-gray-500"
            >
              {isLoading ? "Logging in..." : "Login"}
            </button>
          </div>
        </form>

        {message.text && (
          <div className="mt-6 text-center">
            <p
              className={`text-sm ${
                message.type === "error" ? "text-red-400" : "text-green-400"
              }`}
            >
              {message.text}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default LoginPage;
