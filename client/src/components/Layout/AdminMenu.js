import React from 'react'
import { NavLink } from 'react-router-dom'

const AdminMenu = () => {
    return (
        <>
            <div className='text-center'>
                <div class="list-group">
                    <h4>Admin Panel</h4>
                    <NavLink to="/dashboard/admin/create-category" className="list-group-item list-group-item-action">A Create Category</NavLink>
                    <NavLink to="/dashboard/admin/create-product" className="list-group-item list-group-item-action">A Create Product</NavLink>
                    <NavLink to="/dashboard/admin/products" className="list-group-item list-group-item-action">A Products</NavLink>
                    <NavLink to="/dashboard/admin/orders" className="list-group-item list-group-item-action">Orders</NavLink>
                    <NavLink to="/dashboard/admin/users" className="list-group-item list-group-item-action">A Users</NavLink>
                </div>
            </div>
        </>
    )
}

export default AdminMenu