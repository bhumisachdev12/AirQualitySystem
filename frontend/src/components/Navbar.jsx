import { Link, useLocation } from 'react-router-dom'
import { useState, useEffect, useRef } from 'react'
import { LayoutDashboard, History, CloudSun, User, LogOut, Search as SearchIcon, Sun } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { getTotalSearches } from '../services/api'

const Navbar = () => {
    const location = useLocation()
    const { user, logout } = useAuth()
    const [showProfile, setShowProfile] = useState(false)
    const [totalSearches, setTotalSearches] = useState(0)
    const profileRef = useRef(null)

    useEffect(() => {
        if (user) {
            fetchTotalSearches()
        }
    }, [user])

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (profileRef.current && !profileRef.current.contains(event.target)) {
                setShowProfile(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    const fetchTotalSearches = async () => {
        try {
            const data = await getTotalSearches()
            setTotalSearches(data.total_searches)
        } catch (error) {
            console.error('Failed to fetch total searches:', error)
        }
    }

    const isActive = (path) => location.pathname === path

    const navLinks = [
        { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { path: '/predict', label: 'Predict', icon: CloudSun },
        { path: '/history', label: 'History', icon: History },
    ]

    return (
        <nav className="bg-white/80 backdrop-blur-md border-b border-amber-200 sticky top-0 z-50 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link to="/dashboard" className="flex items-center gap-3 group">
                        <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center shadow-warm group-hover:shadow-warm-lg transition-shadow">
                            <Sun className="w-6 h-6 text-white" />
                        </div>
                        <div className="hidden sm:block">
                            <h1 className="text-xl font-bold text-gray-800">AirQuality</h1>
                            <p className="text-xs text-gray-500">Prediction System</p>
                        </div>
                    </Link>

                    {/* Nav Links */}
                    <div className="flex items-center gap-2">
                        {navLinks.map(({ path, label, icon: Icon }) => (
                            <Link
                                key={path}
                                to={path}
                                className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all ${
                                    isActive(path)
                                        ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-warm'
                                        : 'text-gray-600 hover:bg-amber-50 hover:text-amber-700'
                                }`}
                            >
                                <Icon className="w-4 h-4" />
                                <span className="hidden sm:inline">{label}</span>
                            </Link>
                        ))}

                        {/* Profile Dropdown or Guest Logout */}
                        {user ? (
                            <div className="relative ml-2" ref={profileRef}>
                                <button
                                    onClick={() => setShowProfile(!showProfile)}
                                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-700 font-medium transition-all"
                                >
                                    <User className="w-4 h-4" />
                                    <span className="hidden sm:inline">{user.username}</span>
                                </button>

                                {/* Dropdown */}
                                {showProfile && (
                                    <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-warm-xl border border-amber-100 overflow-hidden">
                                        <div className="p-4 bg-gradient-to-br from-amber-50 to-orange-50 border-b border-amber-100">
                                            <p className="font-semibold text-gray-800">{user.username}</p>
                                            <p className="text-sm text-gray-600">{user.email}</p>
                                        </div>
                                        <div className="p-4">
                                            <div className="flex items-center justify-between mb-4">
                                                <div className="flex items-center gap-2 text-gray-600">
                                                    <SearchIcon className="w-4 h-4" />
                                                    <span className="text-sm">Total Searches</span>
                                                </div>
                                                <span className="text-2xl font-bold text-amber-600">{totalSearches}</span>
                                            </div>
                                            <button
                                                onClick={logout}
                                                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl font-medium transition-all"
                                            >
                                                <LogOut className="w-4 h-4" />
                                                Logout
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <>
                                <button
                                    onClick={() => {
                                        localStorage.removeItem('userMode')
                                        window.location.href = '/'
                                    }}
                                    className="flex items-center gap-2 px-4 py-2 rounded-xl text-gray-600 hover:bg-red-50 hover:text-red-600 font-medium transition-all"
                                >
                                    <LogOut className="w-4 h-4" />
                                    <span className="hidden sm:inline">Logout</span>
                                </button>
                                <Link
                                    to="/login"
                                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white font-medium shadow-warm hover:shadow-warm-lg transition-all"
                                >
                                    <User className="w-4 h-4" />
                                    <span className="hidden sm:inline">Sign In</span>
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    )
}

export default Navbar
