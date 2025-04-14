"use client"

import { useState, useEffect } from "react"
import { Filter, Eye, MessageSquare } from "lucide-react"
import Link from "next/link"

// Mock data for orders
const initialOrders = [
  {
    id: "AA143",
    customer: "Jane Mwikaii",
    email: "jane@example.com",
    artTitle: "Ebony Mask",
    location: "Accra, Ghana",
    status: "pending",
    date: "2023-05-15",
  },
  {
    id: "AA142",
    customer: "David Ofori",
    email: "david@example.com",
    artTitle: "Wooden Sculpture",
    location: "Lagos, Nigeria",
    status: "in-progress",
    date: "2023-05-12",
  },
  {
    id: "AA141",
    customer: "Fatima Diallo",
    email: "fatima@example.com",
    artTitle: "Mahogany Statue",
    location: "Dakar, Senegal",
    status: "shipped",
    date: "2023-05-10",
  },
  {
    id: "AA140",
    customer: "John Okeke",
    email: "john@example.com",
    artTitle: "Tribal Headdress",
    location: "Abuja, Nigeria",
    status: "shipped",
    date: "2023-05-05",
  },
  {
    id: "AA139",
    customer: "Amina Kamau",
    email: "amina@example.com",
    artTitle: "Rosewood Carving",
    location: "Nairobi, Kenya",
    status: "cancelled",
    date: "2023-05-18",
  },
  {
    id: "AA138",
    customer: "Samuel Mensah",
    email: "samuel@example.com",
    artTitle: "Ceramic Bust",
    location: "Kumasi, Ghana",
    status: "cancelled",
    date: "2023-05-20",
  },
]

export default function OrdersPage() {
  const [orders, setOrders] = useState(initialOrders)
  const [isLoading, setIsLoading] = useState(true)

  // Simulate loading data from API
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  const handleStatusChange = (orderId: string, newStatus: string) => {
    setOrders(orders.map((order) => (order.id === orderId ? { ...order, status: newStatus } : order)))
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "in-progress":
        return "In Progress"
      default:
        return status.charAt(0).toUpperCase() + status.slice(1)
    }
  }

  return (
    <>
      <div className="page-header">
        <h1 className="page-title">Orders</h1>
        <button className="filter-button">
          <Filter size={16} />
          Filter
        </button>
      </div>

      <div className="orders-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Art Title</th>
              <th>Delivery Location</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={6} className="loading-cell">
                  Loading orders...
                </td>
              </tr>
            ) : (
              orders.map((order) => (
                <tr key={order.id}>
                  <td>{order.id}</td>
                  <td>
                    <div className="customer-info">
                      <span className="customer-name">{order.customer}</span>
                      <span className="customer-email">{order.email}</span>
                    </div>
                  </td>
                  <td>{order.artTitle}</td>
                  <td>{order.location}</td>
                  <td>
                    <select
                      value={order.status}
                      onChange={(e) => handleStatusChange(order.id, e.target.value)}
                      className={`status-select ${order.status}`}
                    >
                      <option value="pending">Pending</option>
                      <option value="in-progress">In Progress</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </td>
                  <td>
                    <div className="row-actions">
                      <Link href={`/admin/orders/${order.id}`} className="action-icon view" title="View Details">
                        <Eye size={16} />
                      </Link>
                      <button className="action-icon message" title="Message Customer">
                        <MessageSquare size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </>
  )
}
