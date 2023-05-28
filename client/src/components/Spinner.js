import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

const Spinner = ({ path = "login" }) => {
    const [count, setCount] = useState(3);
    const navigate = useNavigate()
    const location = useLocation()


    useEffect(() => {
        const interval = setInterval(() => {
            setCount((preValue) => --preValue)
        }, 1000)
        count === 0 && navigate(`/${path}`, { state: location.pathname })
        return () => clearInterval(interval)
    }, [count, navigate, location, path])
    return (
        <>
            <div class="d-flex justify-content-center align-items-center" style={{ height: "100vh" }}>
                <h1 className="text-center">redirecting to you in {count} second </h1>
                <div class="spinner-border" role="status">
                    <span class="visually-hidden">Loading...</span>
                </div>
            </div>
        </>
    )
}

export default Spinner