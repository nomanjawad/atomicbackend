import { Icon } from "@iconify/react/dist/iconify.js"
import React, { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

const SignUpLayer = () => {
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [agreeTerms, setAgreeTerms] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const { signup } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setSuccess("")

    // Validation
    if (password !== confirmPassword) {
      setError("Passwords do not match")
      return
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long")
      return
    }

    if (!agreeTerms) {
      setError("Please agree to the Terms & Conditions")
      return
    }

    setIsLoading(true)

    try {
      const result = await signup(email, password, fullName)
      if (result.success) {
        setSuccess("Account created successfully! Redirecting to login...")
        setTimeout(() => {
          navigate("/sign-in")
        }, 2000)
      } else {
        setError(result.error || "Signup failed. Please try again.")
      }
    } catch (err) {
      setError(err.message || "An unexpected error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <section className="auth bg-base d-flex flex-wrap">
      <div className="auth-right py-32 px-24 d-flex flex-column justify-content-center w-100">
        <div className="max-w-464-px mx-auto w-100">
          <div>
            <Link to="/" className="mb-40 max-w-290-px">
              <img src="assets/images/logo.png" alt="" />
            </Link>
            <h4 className="mb-12">Create your Account</h4>
            <p className="mb-32 text-secondary-light text-lg">
              Sign up to access the admin dashboard
            </p>
          </div>

          {error && (
            <div className="alert alert-danger mb-16" role="alert">
              {error}
            </div>
          )}

          {success && (
            <div className="alert alert-success mb-16" role="alert">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Full Name */}
            <div className="icon-field mb-16">
              <span className="icon top-50 translate-middle-y">
                <Icon icon="mage:user" />
              </span>
              <input
                type="text"
                className="form-control h-56-px bg-neutral-50 radius-12"
                placeholder="Full Name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>

            {/* Email */}
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

            {/* Password */}
            <div className="position-relative mb-16">
              <div className="icon-field">
                <span className="icon top-50 translate-middle-y">
                  <Icon icon="solar:lock-password-outline" />
                </span>
                <input
                  type={showPassword ? "text" : "password"}
                  className="form-control h-56-px bg-neutral-50 radius-12"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  disabled={isLoading}
                />
              </div>
              <span
                className={`toggle-password cursor-pointer position-absolute end-0 top-50 translate-middle-y me-16 text-secondary-light ${showPassword ? 'ri-eye-off-line' : 'ri-eye-line'}`}
                onClick={() => setShowPassword(!showPassword)}
              />
            </div>

            {/* Confirm Password */}
            <div className="position-relative mb-20">
              <div className="icon-field">
                <span className="icon top-50 translate-middle-y">
                  <Icon icon="solar:lock-password-outline" />
                </span>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  className="form-control h-56-px bg-neutral-50 radius-12"
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>
              <span
                className={`toggle-password cursor-pointer position-absolute end-0 top-50 translate-middle-y me-16 text-secondary-light ${showConfirmPassword ? 'ri-eye-off-line' : 'ri-eye-line'}`}
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              />
            </div>

            {/* Terms and Conditions */}
            <div className="mb-20">
              <div className="form-check style-check d-flex align-items-center">
                <input
                  className="form-check-input border border-neutral-300"
                  type="checkbox"
                  id="agreeTerms"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  disabled={isLoading}
                />
                <label className="form-check-label" htmlFor="agreeTerms">
                  I agree to the{" "}
                  <Link to="/terms-condition" className="text-primary-600 fw-medium">
                    Terms & Conditions
                  </Link>
                </label>
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary text-sm btn-sm px-12 py-16 w-100 radius-12"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  Creating account...
                </>
              ) : (
                "Sign Up"
              )}
            </button>

            <div className="mt-24 text-center">
              <p className="text-secondary-light mb-0">
                Already have an account?{" "}
                <Link to="/sign-in" className="text-primary-600 fw-medium">
                  Sign In
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </section>
  )
}

export default SignUpLayer
