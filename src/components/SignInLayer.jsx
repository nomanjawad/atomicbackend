import { Icon } from "@iconify/react/dist/iconify.js"
import React, { useState, useEffect } from "react"
import { Link, useNavigate, useLocation } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import api from "../services/api"

const SignInLayer = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  // Service status state
  const [serviceStatus, setServiceStatus] = useState({
    api: { status: 'checking', message: 'Checking...' },
    database: { status: 'checking', message: 'Checking...' }
  })

  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const from = location.state?.from?.pathname || "/"

  // Check service status on mount
  useEffect(() => {
    checkServiceStatus()
  }, [])

  const checkServiceStatus = async () => {
    // Check API Health via GET /api/health
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/health`)
      const data = await response.json()

      if (data.ok && data.status?.healthy) {
        setServiceStatus(prev => ({
          ...prev,
          api: { status: 'online', message: 'Online' }
        }))

        // Check database/Supabase status from health response
        const supabaseOk = data.status?.services?.supabaseAPI?.ok && data.status?.services?.supabaseAuth?.ok
        setServiceStatus(prev => ({
          ...prev,
          database: {
            status: supabaseOk ? 'online' : 'offline',
            message: supabaseOk ? 'Connected' : 'Supabase service issue'
          }
        }))
      } else {
        setServiceStatus(prev => ({
          ...prev,
          api: { status: 'offline', message: 'Unhealthy response' },
          database: { status: 'offline', message: 'Unknown' }
        }))
      }
    } catch (err) {
      setServiceStatus(prev => ({
        ...prev,
        api: { status: 'offline', message: 'Connection failed' },
        database: { status: 'offline', message: 'Connection failed' }
      }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      const result = await login(email, password)
      if (result.success) {
        navigate(from, { replace: true })
      } else {
        setError(result.error || "Login failed. Please check your credentials.")
      }
    } catch (err) {
      setError(err.message || "An unexpected error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'online':
        return <Icon icon="mdi:check-circle" className="text-success-main" style={{ fontSize: '18px' }} />
      case 'offline':
        return <Icon icon="mdi:close-circle" className="text-danger-main" style={{ fontSize: '18px' }} />
      default:
        return <span className="spinner-border spinner-border-sm text-warning" style={{ width: '14px', height: '14px' }}></span>
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'online': return 'text-success-main'
      case 'offline': return 'text-danger-main'
      default: return 'text-warning-main'
    }
  }

  return (
    <section className="auth bg-base d-flex flex-wrap">
      <div className="auth-right py-32 px-24 d-flex flex-column justify-content-center w-100">
        <div className="max-w-464-px mx-auto w-100">
          <div>
            <Link to="/" className="mb-40 max-w-290-px">
              <span className="text-xl fw-semibold">Skytech Solution</span>
            </Link>
            <h4 className="mb-12">Sign In to your Account</h4>
            <p className="mb-32 text-secondary-light text-lg">
              Welcome back! please enter your detail
            </p>
          </div>

          {error && (
            <div className="alert alert-danger mb-16" role="alert">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="icon-field mb-16">
              <span className="icon top-50 translate-middle-y">
                <Icon icon="mage:email" />
              </span>
              <input
                type="email"
                className="form-control h-56-px bg-neutral-50 radius-12"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
            <div className="position-relative mb-20">
              <div className="icon-field">
                <span className="icon top-50 translate-middle-y">
                  <Icon icon="solar:lock-password-outline" />
                </span>
                <input
                  type={showPassword ? "text" : "password"}
                  className="form-control h-56-px bg-neutral-50 radius-12"
                  id="your-password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>
              <span
                className={`toggle-password cursor-pointer position-absolute end-0 top-50 translate-middle-y me-16 text-secondary-light ${showPassword ? 'ri-eye-off-line' : 'ri-eye-line'}`}
                onClick={() => setShowPassword(!showPassword)}
              />
            </div>
            <div className="">
              <div className="d-flex justify-content-between gap-2">
                <div className="form-check style-check d-flex align-items-center">
                  <input
                    className="form-check-input border border-neutral-300"
                    type="checkbox"
                    defaultValue=""
                    id="remeber"
                  />
                  <label className="form-check-label" htmlFor="remeber">
                    Remember me{" "}
                  </label>
                </div>
                <Link to="/forgot-password" className="text-primary-600 fw-medium">
                  Forgot Password?
                </Link>
              </div>
            </div>
            <button
              type="submit"
              className="btn btn-primary text-sm btn-sm px-12 py-16 w-100 radius-12 mt-32"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </button>

            <div className="mt-24 text-center">
              <p className="text-secondary-light mb-0">
                Don't have an account?{" "}
                <Link to="/sign-up" className="text-primary-600 fw-medium">
                  Sign Up
                </Link>
              </p>
            </div>
          </form>

          {/* Service Status Section */}
          <div className="mt-32 p-16 bg-neutral-50 radius-12 border border-neutral-200">
            <div className="d-flex align-items-center justify-content-between mb-12">
              <h6 className="text-sm fw-semibold text-secondary-light mb-0">
                <Icon icon="mdi:server-network" className="me-8" />
                Service Status
              </h6>
              <button
                type="button"
                onClick={checkServiceStatus}
                className="btn btn-sm text-primary-600 p-0"
                style={{ background: 'none', border: 'none' }}
              >
                <Icon icon="mdi:refresh" style={{ fontSize: '16px' }} />
              </button>
            </div>

            <div className="d-flex flex-column gap-8">
              {/* API Server Status */}
              <div className="d-flex align-items-center justify-content-between">
                <div className="d-flex align-items-center gap-8">
                  {getStatusIcon(serviceStatus.api.status)}
                  <span className="text-sm text-secondary-light">API Server</span>
                </div>
                <span className={`text-xs ${getStatusColor(serviceStatus.api.status)}`}>
                  {serviceStatus.api.message}
                </span>
              </div>

              {/* Database Status */}
              <div className="d-flex align-items-center justify-content-between">
                <div className="d-flex align-items-center gap-8">
                  {getStatusIcon(serviceStatus.database.status)}
                  <span className="text-sm text-secondary-light">Database</span>
                </div>
                <span className={`text-xs ${getStatusColor(serviceStatus.database.status)}`}>
                  {serviceStatus.database.message}
                </span>
              </div>
            </div>

            {(serviceStatus.api.status === 'offline' || serviceStatus.database.status === 'offline') && (
              <div className="mt-12 p-8 bg-danger-50 radius-8">
                <p className="text-xs text-danger-main mb-0">
                  <Icon icon="mdi:alert" className="me-4" />
                  Some services are offline. Login may not work.
                </p>
              </div>
            )}
          </div>

        </div>
      </div>
    </section>
  )
}

export default SignInLayer

