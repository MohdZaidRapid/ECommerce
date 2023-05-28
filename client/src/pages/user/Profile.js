import React, { useEffect, useState } from 'react'
import Layout from '../../components/Layout/Layout'
import UserMenu from '../../components/Layout/UserMenu'
import { useAuth } from '../../context/auth'
import axios from 'axios'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'



const Profile = () => {
    const navigate = useNavigate()
    const [auth, setAuth] = useAuth()
    const [name, setName] = useState("");
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [phone, setPhone] = useState("")
    const [address, setAddress] = useState("")

    useEffect(() => {
        const { email, name, phone, address } = auth?.user
        setName(name)
        setEmail(email)
        setPhone(phone)
        setAddress(address)
    }, [auth.user])

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const { data } = await axios.put(`${process.env.REACT_APP_API}/api/v1/auth/profile`, { name, email, password, phone, address })
            if (data?.error) {
                toast.error(data?.error)
            } else {
                setAuth({ ...auth, user: data?.updatedUser })
                let ls = localStorage.getItem("auth")
                ls = JSON.parse(ls)
                ls.user = data.updatedUser
                localStorage.setItem("auth", JSON.stringify(ls))
                toast.success("Profile Updated successfully")
            }
        } catch (error) {
            console.log(error)
            toast.error("Something went wrong")
        }
    }
    return (
        <Layout title={"Your Profile"}>
            <div className="container-fluid m-3 p-3">
                <div className="row">
                    <div className="col-md-3">
                        <UserMenu />
                    </div>
                    <div className="col-md-9">
                        <div className='form-container'>
                            <form onSubmit={handleSubmit}>
                                <h4>USER PROFILE</h4>
                                <div className="mb-3">
                                    <input type="text" value={name} onChange={e => setName(e.target.value)} className="form-control" id="exampleInputName" placeholder='Enter your Name' />
                                </div>
                                <div className="mb-3">
                                    <input type="text" value={email
                                    } onChange={e => setEmail(e.target.value)} className="form-control" id="InputEmail" placeholder='Enter your Email' disabled />
                                </div>
                                <div className="mb-3">
                                    <input type="password" value={password
                                    } onChange={e => setPassword(e.target.value)} className="form-control" id="InputPassword" placeholder='Enter your Passsword' />
                                </div>
                                <div className="mb-3">
                                    <input type="text" onChange={e => setPhone(e.target.value)} value={phone} className="form-control" id="exampleInputPhone" placeholder='Enter your Phone' />
                                </div>
                                <div className="mb-3">
                                    <input type="text" value={address} className="form-control" onChange={e => setAddress(e.target.value)} id="exampleInputPassword" placeholder='Enter  your Address' />
                                </div>
                                <button type="submit" className="btn btn-primary">Update</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    )
}

export default Profile