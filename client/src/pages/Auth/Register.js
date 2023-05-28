import React, { useState } from 'react'
import Layout from '../../components/Layout/Layout'
import toast from 'react-hot-toast';
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import "../../styles/AuthStyles.css";


const Register = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [phone, setPhone] = useState("")
    const [address, setAddress] = useState("")
    const [answer, setAnswer] = useState("")
    const navigate = useNavigate()

    //form function
    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const res = await axios.post(`${process.env.REACT_APP_API}/api/v1/auth/register`, { name, email, password, phone, address, answer })
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
        <Layout title="Register - Ecommerce App">
            <div className='form-container'>
                <form onSubmit={handleSubmit}>
                    <h4>REGISTER FORM</h4>
                    <div className="mb-3">
                        <input type="text" value={name} onChange={e => setName(e.target.value)} className="form-control" id="exampleInputName" placeholder='Enter your Name' required />
                    </div>
                    <div className="mb-3">
                        <input type="text" value={email
                        } onChange={e => setEmail(e.target.value)} className="form-control" id="InputEmail" placeholder='Enter your Email' required />
                    </div>
                    <div className="mb-3">
                        <input type="password" value={password
                        } onChange={e => setPassword(e.target.value)} className="form-control" id="InputPassword" placeholder='Enter your Passsword' required />
                    </div>
                    <div className="mb-3">
                        <input type="text" onChange={e => setPhone(e.target.value)} value={phone} className="form-control" id="exampleInputPhone" placeholder='Enter your Phone' required />
                    </div>
                    <div className="mb-3">
                        <input type="text" value={address} className="form-control" onChange={e => setAddress(e.target.value)} id="exampleInputPassword" placeholder='Enter  your Address' required />
                    </div>
                    <div className="mb-3">
                        <input type="text" value={answer} className="form-control" onChange={e => setAnswer(e.target.value)} id="exampleInputAnswer" placeholder='What is your Favourite fruit' required />
                    </div>
                    <button type="submit" className="btn btn-primary">Submit</button>
                </form>
            </div>
        </Layout>
    )
}

export default Register