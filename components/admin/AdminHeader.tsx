import Image from "next/image"
import { Search } from "lucide-react"

export default function AdminHeader() {
  return (
    <header className="admin-header">
      <div className="search-bar">
        <span className="search-icon">
          <Search size={16} />
        </span>
        <input type="text" placeholder="Search" />
      </div>

      <div className="admin-profile">
        <div className="profile-info">
          <div className="profile-name">Admin</div>
          <div className="profile-role">Arts Afrik</div>
        </div>
        <Image
          src="/placeholder.svg?height=40&width=40"
          alt="Admin Profile"
          width={40}
          height={40}
          className="profile-avatar"
          style={{ borderRadius: "50%" }}
        />
      </div>
    </header>
  )
}
