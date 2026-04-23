import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Mail, Lock, User, Sun, AlertCircle, CheckCircle } from 'lucide-react'
import { signup, getCurrentUser } from '../services/api'
import { useAuth } from '../context/AuthContext'

const Signup = () => {
    const navigate = useNavigate()
    const { loginUser } = useAuth()
    const [formData, setFormData] = useState({
        email: '',
        username: '',
        password: '',
        confirmPassword: ''
    })
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    const handleChange = (e) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }))
        setError('')
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')

        // Validation
        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match')
            return
        }

        if (formData.password.length < 6) {
            setError('Password must be at least 6 characters')
            return
        }

        setLoading(true)

        try {
            const { access_token } = await signup(formData.email, formData.username, formData.password)
            localStorage.setItem('token', access_token)
            localStorage.setItem('userMode', 'authenticated')
            const userData = await getCurrentUser()
            loginUser(access_token, userData)
            navigate('/dashboard')
        } catch (err) {
            setError(err.message || 'Signup failed. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    const passwordStrength = formData.password.length >= 8 ? 'strong' : formData.password.length >= 6 ? 'medium' : 'weak'

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                {/* Logo */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl shadow-warm-lg mb-4">
                        <Sun className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">Create Account</h1>
                    <p className="text-gray-600">Join us to track air quality predictions</p>
                </div>

                {/* Signup Card */}
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
                                name="email"
                                type="email"
                                placeholder="you@example.com"
                                value={formData.email}
                                onChange={handleChange}
                                className="input-field"
                                required
                            />
                        </div>

                        {/* Username */}
                        <div>
                            <label className="label" htmlFor="username">
                                <User className="w-4 h-4 text-amber-600" />
                                Username
                            </label>
                            <input
                                id="username"
                                name="username"
                                type="text"
                                placeholder="johndoe"
                                value={formData.username}
                                onChange={handleChange}
                                className="input-field"
                                required
                                minLength={3}
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
                                name="password"
                                type="password"
                                placeholder="••••••••"
                                value={formData.password}
                                onChange={handleChange}
                                className="input-field"
                                required
                                minLength={6}
                            />
                            {formData.password && (
                                <div className="mt-2 flex items-center gap-2">
                                    <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                                        <div 
                                            className={`h-full transition-all ${
                                                passwordStrength === 'strong' ? 'w-full bg-green-500' :
                                                passwordStrength === 'medium' ? 'w-2/3 bg-yellow-500' :
                                                'w-1/3 bg-red-500'
                                            }`}
                                        />
                                    </div>
                                    <span className="text-xs text-gray-600 capitalize">{passwordStrength}</span>
                                </div>
                            )}
                        </div>

                        {/* Confirm Password */}
                        <div>
                            <label className="label" htmlFor="confirmPassword">
                                <CheckCircle className="w-4 h-4 text-amber-600" />
                                Confirm Password
                            </label>
                            <input
                                id="confirmPassword"
                                name="confirmPassword"
                                type="password"
                                placeholder="••••••••"
                                value={formData.confirmPassword}
                                onChange={handleChange}
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
                            {loading ? 'Creating account...' : 'Create Account'}
                        </button>
                    </form>

                    {/* Login Link */}
                    <div className="mt-6 text-center">
                        <p className="text-sm text-gray-600">
                            Already have an account?{' '}
                            <Link to="/login" className="text-amber-600 hover:text-amber-700 font-semibold">
                                Sign in
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Signup
