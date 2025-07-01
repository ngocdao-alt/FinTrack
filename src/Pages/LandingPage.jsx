import { useNavigate } from 'react-router-dom'  // 

function LandingPage() {
  const navigate = useNavigate(); // 

  return (
    <div className="flex flex-col items-center justify-center h-screen gap-4">
      <h1 className="text-3xl font-bold">Đây là trang Landing</h1>
      <div className="flex gap-4">
        <button
          onClick={() => navigate('/login')} // 
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Login
        </button>
        <button
          onClick={() => navigate('/register')}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Register
        </button>
      </div>
    </div>
  )
}

export default LandingPage
