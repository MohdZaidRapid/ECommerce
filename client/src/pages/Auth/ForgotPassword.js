import Layout from '../../components/Layout/Layout'
import React, { useState } from 'react'
import toast from 'react-hot-toast';
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import "../../styles/AuthStyles.css";

const ForgotPassword = () => {
    const [email, setEmail] = useState("")
    const [newPassword, setNewPassword] = useState("")
    const [answer, setNewAnswer] = useState("")

    const navigate = useNavigate()


    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const res = await axios.post(`${process.env.REACT_APP_API}/api/v1/auth/forgot-password`, { email, newPassword, answer })
            if (res && res.data.success) {
                toast.success(res.data && res.data.message)
                navigate("/login")
            } else {
                toast.error(res.data.message)
            }
        } catch (error) {
            console.log(error)
            toast.error("Something went wrong")
        }
    }

    return (
        <Layout title={"Forgot Password"}>
            <div className='form-container'>
                <h1>RESET PASSWORD</h1>
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <input type="email" value={email
                        } onChange={e => setEmail(e.target.value)} className="form-control" id="InputEmail" placeholder='Enter your Email' required />
                    </div>
                    <div className="mb-3">
                        <input type="text" value={answer
                        } onChange={e => setNewAnswer(e.target.value)} className="form-control" id="InputEmail" placeholder='Enter your favourite sport' required />
                    </div>
                    <div className="mb-3">
                        <input type="password" value={newPassword
                        } onChange={e => setNewPassword(e.target.value)} className="form-control" id="InputPassword" placeholder='Enter your Passsword' required />
                    </div>
                    <button type="submit" className="btn btn-primary">Reset</button>
                </form>
            </div>
        </Layout>
    )
}

export default ForgotPassword