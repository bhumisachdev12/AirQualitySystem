import { useNavigate } from 'react-router-dom'
import { Activity, TrendingUp, Bell, BarChart3, ArrowRight, Wind, CheckCircle, Sparkles, Zap, Shield, Eye, Target, MapPin, Clock, LineChart } from 'lucide-react'

const Home = () => {
    const navigate = useNavigate()

    const handleLogin = () => {
        navigate('/login')
    }

    const handleGuestAccess = () => {
        localStorage.setItem('userMode', 'guest')
        navigate('/dashboard')
    }

    const features = [
        {
            icon: Activity,
            title: 'Live AQI Monitoring',
            description: 'View real-time air quality metrics for cities worldwide with instant updates from OpenWeather API',
            gradient: 'from-blue-500 to-cyan-500'
        },
        {
            icon: TrendingUp,
            title: '24-Hour Forecasting',
            description: 'Predict AQI trends for the next 24 hours using advanced ARIMA(1,1,1) machine learning forecasting',
            gradient: 'from-amber-500 to-orange-500'
        },
        {
            icon: Bell,
            title: 'Smart Alerts',
            description: 'Receive intelligent alert levels based on predicted air pollution severity (Normal, Moderate, High, Critical)',
            gradient: 'from-orange-500 to-red-500'
        },
        {
            icon: BarChart3,
            title: 'Trend Visualization',
            description: 'Compare current and predicted AQI with beautiful interactive graphs and real-time data visualization',
            gradient: 'from-green-500 to-emerald-500'
        }
    ]

    const steps = [
        {
            number: '01',
            title: 'Select Your City',
            description: 'Choose from cities worldwide to monitor air quality',
            icon: MapPin
        },
        {
            number: '02',
            title: 'AI Predicts AQI',
            description: 'Our ARIMA model forecasts the next 24 hours',
            icon: Sparkles
        },
        {
            number: '03',
            title: 'Get Alerts & Insights',
            description: 'Receive actionable alerts and trend visualizations',
            icon: Zap
        }
    ]

    const benefits = [
        { icon: Shield, text: 'Proactive pollution awareness' },
        { icon: Eye, text: 'Real-time air quality insights' },
        { icon: Bell, text: 'Predictive health alerts' },
        { icon: CheckCircle, text: 'Better decision-making' }
    ]

    return (
        <div className="min-h-screen bg-white overflow-hidden">
            {/* Navbar */}
            <nav className="absolute top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-lg border-b border-gray-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center shadow-lg">
                                <Wind className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <span className="text-xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                                    AirQuality AI
                                </span>
                                <p className="text-xs text-gray-500">Prediction System</p>
                            </div>
                        </div>
                        <button
                            onClick={handleLogin}
                            className="px-6 py-2.5 text-gray-700 hover:text-amber-600 font-semibold transition-colors"
                        >
                            Log In
                        </button>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 px-4 sm:px-6 overflow-hidden">
                {/* Background Elements */}
                <div className="absolute inset-0 bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50"></div>
                <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-amber-200/30 to-orange-200/30 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-yellow-200/30 to-amber-200/30 rounded-full blur-3xl"></div>
                
                <div className="relative max-w-7xl mx-auto">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        {/* Left Content */}
                        <div className="space-y-8">
                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-md border border-amber-100">
                                <Sparkles className="w-4 h-4 text-amber-600" />
                                <span className="text-sm font-semibold text-gray-700">Powered by AI & Real-time Data</span>
                            </div>
                            
                            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-tight">
                                <span className="text-gray-900">Air Quality</span>
                                <br />
                                <span className="bg-gradient-to-r from-amber-600 via-orange-600 to-amber-600 bg-clip-text text-transparent">
                                    Prediction & Alerts
                                </span>
                            </h1>
                            
                            <p className="text-xl text-gray-600 leading-relaxed max-w-xl">
                                Monitor real-time air quality, forecast AQI for the next 24 hours, and receive intelligent alerts 
                                before pollution levels become harmful. Stay ahead with AI-powered predictions.
                            </p>
                            
                            <div className="flex flex-col sm:flex-row gap-4 pt-4">
                                <button
                                    onClick={handleLogin}
                                    className="group px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center justify-center gap-3"
                                >
                                    Get Started
                                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </button>
                                <button
                                    onClick={handleGuestAccess}
                                    className="px-8 py-4 bg-white hover:bg-gray-50 text-gray-800 font-bold rounded-2xl border-2 border-gray-200 hover:border-amber-300 shadow-lg hover:shadow-xl transition-all duration-300"
                                >
                                    Try as Guest
                                </button>
                            </div>

                            <div className="flex items-center gap-8 pt-4">
                                {benefits.slice(0, 2).map((benefit, index) => (
                                    <div key={index} className="flex items-center gap-2">
                                        <CheckCircle className="w-5 h-5 text-green-500" />
                                        <span className="text-sm text-gray-600">{benefit.text}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Right Visual */}
                        <div className="relative hidden lg:block">
                            <div className="relative">
                                {/* Floating Cards */}
                                <div className="absolute top-0 right-0 w-64 bg-white rounded-2xl shadow-2xl p-6 transform rotate-3 hover:rotate-0 transition-transform duration-300">
                                    <div className="flex items-center justify-between mb-4">
                                        <span className="text-sm font-semibold text-gray-600">Current AQI</span>
                                        <Activity className="w-5 h-5 text-blue-500" />
                                    </div>
                                    <div className="text-4xl font-bold text-gray-900 mb-2">125</div>
                                    <div className="text-sm text-amber-600 font-semibold">Moderate</div>
                                </div>

                                <div className="absolute top-32 left-0 w-64 bg-gradient-to-br from-amber-500 to-orange-500 rounded-2xl shadow-2xl p-6 transform -rotate-3 hover:rotate-0 transition-transform duration-300">
                                    <div className="flex items-center justify-between mb-4">
                                        <span className="text-sm font-semibold text-white/90">Predicted AQI</span>
                                        <TrendingUp className="w-5 h-5 text-white" />
                                    </div>
                                    <div className="text-4xl font-bold text-white mb-2">98</div>
                                    <div className="text-sm text-white/90 font-semibold">Improving ↓</div>
                                </div>

                                <div className="absolute bottom-0 right-12 w-56 bg-white rounded-2xl shadow-2xl p-5 transform rotate-2 hover:rotate-0 transition-transform duration-300">
                                    <div className="flex items-center gap-2 mb-3">
                                        <Bell className="w-4 h-4 text-green-500" />
                                        <span className="text-xs font-semibold text-gray-600">Alert Status</span>
                                    </div>
                                    <div className="text-lg font-bold text-green-600">NORMAL</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-24 px-4 sm:px-6 bg-white relative">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
                            Powerful Features
                        </h2>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                            Everything you need to monitor and predict air quality with confidence
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {features.map((feature, index) => (
                            <div
                                key={index}
                                className="group relative bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-transparent hover:-translate-y-2"
                            >
                                <div className={`w-14 h-14 bg-gradient-to-br ${feature.gradient} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                                    <feature.icon className="w-7 h-7 text-white" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-3">
                                    {feature.title}
                                </h3>
                                <p className="text-gray-600 leading-relaxed">
                                    {feature.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* How It Works Section */}
            <section className="py-24 px-4 sm:px-6 bg-gradient-to-br from-gray-50 to-amber-50/30">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
                            How It Works
                        </h2>
                        <p className="text-xl text-gray-600">
                            Get started in three simple steps
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
                        {/* Connection Lines */}
                        <div className="hidden md:block absolute top-1/4 left-1/4 right-1/4 h-0.5 bg-gradient-to-r from-amber-200 via-orange-200 to-amber-200"></div>

                        {steps.map((step, index) => (
                            <div key={index} className="relative">
                                <div className="bg-white rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 text-center">
                                    <div className="relative inline-block mb-6">
                                        <div className="w-20 h-20 bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg">
                                            <step.icon className="w-10 h-10 text-white" />
                                        </div>
                                        <div className="absolute -top-2 -right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md border-2 border-amber-200">
                                            <span className="text-xs font-bold text-amber-600">{step.number}</span>
                                        </div>
                                    </div>
                                    <h3 className="text-2xl font-bold text-gray-900 mb-3">
                                        {step.title}
                                    </h3>
                                    <p className="text-gray-600">
                                        {step.description}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Benefits Section */}
            <section className="py-24 px-4 sm:px-6 bg-white">
                <div className="max-w-6xl mx-auto">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <div>
                            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
                                Why Choose Our Platform?
                            </h2>
                            <p className="text-xl text-gray-600 mb-8">
                                Make informed decisions about your health and outdoor activities with AI-powered air quality predictions.
                            </p>
                            <div className="space-y-4">
                                {benefits.map((benefit, index) => (
                                    <div key={index} className="flex items-center gap-4 p-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl">
                                        <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center flex-shrink-0">
                                            <benefit.icon className="w-6 h-6 text-white" />
                                        </div>
                                        <span className="text-lg font-semibold text-gray-800">{benefit.text}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="relative">
                            <div className="bg-gradient-to-br from-amber-100 to-orange-100 rounded-3xl p-12 shadow-2xl">
                                <div className="space-y-6">
                                    <div className="bg-white rounded-2xl p-6 shadow-lg">
                                        <div className="flex items-center justify-between mb-4">
                                            <span className="text-sm font-semibold text-gray-600">24h Forecast</span>
                                            <span className="text-xs px-3 py-1 bg-green-100 text-green-700 rounded-full font-semibold">Active</span>
                                        </div>
                                        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                            <div className="h-full w-3/4 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full"></div>
                                        </div>
                                    </div>
                                    <div className="bg-white rounded-2xl p-6 shadow-lg">
                                        <div className="text-center">
                                            <div className="text-5xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent mb-2">
                                                ARIMA
                                            </div>
                                            <div className="text-sm text-gray-600">ML Forecasting Model</div>
                                        </div>
                                    </div>
                                    <div className="bg-white rounded-2xl p-6 shadow-lg">
                                        <div className="flex items-center gap-3">
                                            <Clock className="w-8 h-8 text-amber-600" />
                                            <div>
                                                <div className="text-lg font-bold text-gray-900">Real-time Updates</div>
                                                <div className="text-sm text-gray-600">Live data from OpenWeather</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Final CTA Section */}
            <section className="py-24 px-4 sm:px-6 bg-gradient-to-br from-amber-500 via-orange-500 to-amber-600 relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRjMC0yLjIxLTEuNzktNC00LTRzLTQgMS43OS00IDQgMS43OSA0IDQgNCA0LTEuNzkgNC00em0wLTEwYzAtMi4yMS0xLjc5LTQtNC00cy00IDEuNzktNCA0IDEuNzkgNCA0IDQgNC0xLjc5IDQtNHoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-20"></div>
                
                <div className="relative max-w-4xl mx-auto text-center">
                    <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">
                        Start Monitoring Air Quality Smarter
                    </h2>
                    <p className="text-xl text-white/90 mb-10 max-w-2xl mx-auto">
                        Join thousands of users making informed decisions about their health and outdoor activities
                    </p>
                    
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <button
                            onClick={() => navigate('/signup')}
                            className="px-10 py-5 bg-white hover:bg-gray-50 text-amber-600 font-bold rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-300 text-lg"
                        >
                            Create Free Account
                        </button>
                        <button
                            onClick={handleGuestAccess}
                            className="px-10 py-5 bg-transparent hover:bg-white/10 text-white font-bold rounded-2xl border-2 border-white/50 hover:border-white transition-all duration-300 text-lg"
                        >
                            Try as Guest →
                        </button>
                    </div>

                    <p className="mt-8 text-white/80 text-sm">
                        No credit card required • Free forever • Cancel anytime
                    </p>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-gray-900 text-white py-12 px-4 sm:px-6">
                <div className="max-w-7xl mx-auto text-center">
                    <div className="flex items-center justify-center gap-2 mb-4">
                        <Wind className="w-6 h-6 text-amber-400" />
                        <span className="text-xl font-bold">AirQuality AI</span>
                    </div>
                    <p className="text-gray-400 mb-6">
                        Powered by ARIMA Machine Learning & OpenWeather API
                    </p>
                    <p className="text-gray-500 text-sm">
                        © 2026 Air Quality Prediction System. All rights reserved.
                    </p>
                </div>
            </footer>
        </div>
    )
}

export default Home
