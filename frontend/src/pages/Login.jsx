import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Mail, Lock, Sun, AlertCircle } from 'lucide-react'
import { login, getCurrentUser } from '../services/api'
import { useAuth } from '../context/AuthContext'

const Login = () => {
    const navigate = useNavigate()
    const { loginUser } = useAuth()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        setLoading(true)

        try {
            const { access_token } = await login(email, password)
            localStorage.setItem('token', access_token)
            localStorage.setItem('userMode', 'authenticated')
            const userData = await getCurrentUser()
            loginUser(access_token, userData)
            navigate('/dashboard')
        } catch (err) {
            setError(err.message || 'Invalid email or password. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                {/* Logo */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl shadow-warm-lg mb-4">
                        <Sun className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">Welcome Back</h1>
                    <p className="text-gray-600">Sign in to access your air quality dashboard</p>
                </div>

                {/* Login Card */}
                <div className="card p-8">
                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Email */}
                        <div>
                            <label className="label" htmlFor="email">
                                <Mail className="w-4 h-4 text-amber-600" />
                                Email Address
                            </label>
                            <input
                                id="email"
                                type="email"
                                placeholder="you@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="input-field"
                                required
                            />
                        </div>

                        {/* Password */}
                        <div>
                            <label className="label" htmlFor="password">
                                <Lock className="w-4 h-4 text-amber-600" />
                                Password
                            </label>
                            <input
                                id="password"
                                type="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="input-field"
                                required
                            />
                        </div>

                        {/* Error Message */}
                        {error && (
                            <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-xl">
                                <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                                <p className="text-sm text-red-700">{error}</p>
                            </div>
                        )}

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="btn-primary w-full"
                        >
                            {loading ? 'Signing in...' : 'Sign In'}
                        </button>
                    </form>

                    {/* Signup Link */}
                    <div className="mt-6 text-center">
                        <p className="text-sm text-gray-600">
                            Don't have an account?{' '}
                            <Link to="/signup" className="text-amber-600 hover:text-amber-700 font-semibold">
                                Sign up
                            </Link>
                        </p>
                    </div>
                </div>

                {/* Guest Access */}
                <div className="mt-4 text-center">
                    <button
                        onClick={() => {
                            localStorage.setItem('userMode', 'guest')
                            navigate('/dashboard')
                        }}
                        className="text-sm text-gray-500 hover:text-gray-700"
                    >
                        Continue as guest →
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Login
