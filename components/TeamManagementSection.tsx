"use client"

import { useState } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Eye, Edit, Trash2, Plus, Search, ChevronLeft, ChevronRight, UserPlus } from "lucide-react"
import { deleteTeamMember } from "@/app/actions/team-actions"
import { cloudinaryLoader } from "@/lib/cloudinary"

interface TeamMember {
  id: string
  name: string
  title: string
  bio: string
  image: string
  order: number
}

interface TeamManagementSectionProps {
  teamMembers: TeamMember[]
  onViewMember: (id: string) => void
  onRefresh: () => void
}

export default function TeamManagementSection({ teamMembers, onViewMember, onRefresh }: TeamManagementSectionProps) {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [isDeleting, setIsDeleting] = useState<string | null>(null)

  const itemsPerPage = 5

  // Filter team members based on search term
  const filteredMembers = teamMembers.filter(
    (member) =>
      member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.title.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // Calculate pagination
  const totalPages = Math.ceil(filteredMembers.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedMembers = filteredMembers.slice(startIndex, startIndex + itemsPerPage)

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const handleDeleteMember = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this team member? This action cannot be undone.")) {
      setIsDeleting(id)
      try {
        const result = await deleteTeamMember(id)
        if (result.success) {
          onRefresh() // Refresh the team members list
        } else {
          alert(result.message || "Failed to delete team member")
        }
      } catch (error) {
        console.error("Error deleting team member:", error)
        alert("An error occurred while deleting the team member")
      } finally {
        setIsDeleting(null)
      }
    }
  }

  return (
    <div className="team-management-section">
      <div className="team-header">
        <h2 className="section-title">Team Members</h2>
        <div className="team-actions">
          <div className="search-container">
            <Search className="search-icon" size={18} />
            <input
              type="text"
              placeholder="Search members..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
          <button className="add-member-button" onClick={() => router.push("/dashboard/team/new")}>
            <UserPlus size={18} />
            <span>Add Member</span>
          </button>
        </div>
      </div>

      {filteredMembers.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">👥</div>
          <h3>No Team Members Found</h3>
          <p>Add your first team member to get started</p>
          <button className="add-first-button" onClick={() => router.push("/dashboard/team/new")}>
            <Plus size={18} />
            Add Team Member
          </button>
        </div>
      ) : (
        <>
          <div className="team-table-container">
            <table className="team-table">
              <thead>
                <tr>
                  <th>Image</th>
                  <th>Name</th>
                  <th>Title</th>
                  <th>Display Order</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedMembers.map((member) => (
                  <tr key={member.id} className="team-row">
                    <td>
                      <div className="member-image">
                        <Image
                          src={member.image || "/placeholder.svg"}
                          alt={member.name}
                          width={50}
                          height={50}
                          loader={cloudinaryLoader}
                          className="rounded-image"
                        />
                      </div>
                    </td>
                    <td className="member-name">{member.name}</td>
                    <td className="member-title">{member.title}</td>
                    <td className="member-order">{member.order}</td>
                    <td>
                      <div className="member-actions">
                        <button
                          className="action-button view"
                          onClick={() => onViewMember(member.id)}
                          title="View details"
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          className="action-button edit"
                          onClick={() => router.push(`/dashboard/team/edit/${member.id}`)}
                          title="Edit member"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          className="action-button delete"
                          onClick={() => handleDeleteMember(member.id)}
                          disabled={isDeleting === member.id}
                          title="Delete member"
                        >
                          {isDeleting === member.id ? (
                            <span className="loading-spinner-small"></span>
                          ) : (
                            <Trash2 size={16} />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="pagination">
              <button
                className="pagination-button"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                <ChevronLeft size={16} />
              </button>
              <div className="pagination-info">
                Page {currentPage} of {totalPages}
              </div>
              <button
                className="pagination-button"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                <ChevronRight size={16} />
              </button>
            </div>
          )}
        </>
      )}

      <style jsx>{`
        .team-management-section {
          background-color: white;
          border-radius: 12px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
          padding: 24px;
        }
        
        .team-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
          flex-wrap: wrap;
          gap: 16px;
        }
        
        .section-title {
          font-size: 1.5rem;
          color: var(--primary-color);
          margin: 0;
        }
        
        .team-actions {
          display: flex;
          gap: 12px;
          align-items: center;
        }
        
        .search-container {
          position: relative;
          display: flex;
          align-items: center;
        }
        
        .search-icon {
          position: absolute;
          left: 12px;
          color: #666;
        }
        
        .search-input {
          padding: 8px 12px 8px 38px;
          border: 1px solid #e0e0e0;
          border-radius: 6px;
          font-size: 0.9rem;
          width: 220px;
          transition: all 0.2s ease;
        }
        
        .search-input:focus {
          border-color: var(--accent-color);
          box-shadow: 0 0 0 2px rgba(255, 127, 80, 0.2);
          outline: none;
        }
        
        .add-member-button {
          display: flex;
          align-items: center;
          gap: 8px;
          background-color: var(--primary-color);
          color: white;
          border: none;
          border-radius: 6px;
          padding: 8px 16px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        
        .add-member-button:hover {
          background-color: var(--accent-color);
          transform: translateY(-2px);
        }
        
        .team-table-container {
          overflow-x: auto;
          margin-bottom: 20px;
        }
        
        .team-table {
          width: 100%;
          border-collapse: collapse;
        }
        
        .team-table th {
          background-color: #f5f5f5;
          padding: 12px 16px;
          text-align: left;
          font-weight: 600;
          color: #333;
          border-bottom: 2px solid #e0e0e0;
        }
        
        .team-row {
          transition: background-color 0.2s ease;
        }
        
        .team-row:hover {
          background-color: #f9f9f9;
        }
        
        .team-table td {
          padding: 12px 16px;
          border-bottom: 1px solid #e0e0e0;
          vertical-align: middle;
        }
        
        .member-image {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          overflow: hidden;
          background-color: #f0f0f0;
        }
        
        .rounded-image {
          object-fit: cover;
          border-radius: 50%;
        }
        
        .member-name {
          font-weight: 600;
          color: #333;
        }
        
        .member-title {
          color: #666;
        }
        
        .member-order {
          color: #666;
          text-align: center;
        }
        
        .member-actions {
          display: flex;
          gap: 8px;
        }
        
        .action-button {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 32px;
          height: 32px;
          border-radius: 4px;
          border: none;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        
        .action-button.view {
          background-color: #e3f2fd;
          color: #1976d2;
        }
        
        .action-button.edit {
          background-color: #e8f5e9;
          color: #2e7d32;
        }
        
        .action-button.delete {
          background-color: #ffebee;
          color: #c62828;
        }
        
        .action-button:hover {
          transform: translateY(-2px);
        }
        
        .action-button.view:hover {
          background-color: #bbdefb;
        }
        
        .action-button.edit:hover {
          background-color: #c8e6c9;
        }
        
        .action-button.delete:hover {
          background-color: #ffcdd2;
        }
        
        .action-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
        }
        
        .loading-spinner-small {
          display: inline-block;
          width: 16px;
          height: 16px;
          border: 2px solid rgba(0, 0, 0, 0.1);
          border-radius: 50%;
          border-top-color: #c62828;
          animation: spin 1s linear infinite;
        }
        
        .pagination {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 16px;
          margin-top: 24px;
        }
        
        .pagination-button {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 36px;
          height: 36px;
          border-radius: 6px;
          border: 1px solid #e0e0e0;
          background-color: white;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        
        .pagination-button:hover:not(:disabled) {
          background-color: #f5f5f5;
          border-color: #ccc;
        }
        
        .pagination-button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        
        .pagination-info {
          font-size: 0.9rem;
          color: #666;
        }
        
        .empty-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 60px 20px;
          text-align: center;
        }
        
        .empty-icon {
          font-size: 3rem;
          margin-bottom: 16px;
        }
        
        .empty-state h3 {
          font-size: 1.2rem;
          margin-bottom: 8px;
          color: #333;
        }
        
        .empty-state p {
          color: #666;
          margin-bottom: 24px;
        }
        
        .add-first-button {
          display: flex;
          align-items: center;
          gap: 8px;
          background-color: var(--primary-color);
          color: white;
          border: none;
          border-radius: 6px;
          padding: 10px 20px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        
        .add-first-button:hover {
          background-color: var(--accent-color);
          transform: translateY(-2px);
        }
        
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        @media (max-width: 768px) {
          .team-header {
            flex-direction: column;
            align-items: flex-start;
          }
          
          .team-actions {
            width: 100%;
            flex-direction: column;
            align-items: stretch;
          }
          
          .search-input {
            width: 100%;
          }
          
          .add-member-button {
            width: 100%;
            justify-content: center;
          }
        }
      `}</style>
    </div>
  )
}
