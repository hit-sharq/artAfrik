"use client"

import { useState, useEffect } from "react"
import { X } from "lucide-react"
import Image from "next/image"
import { cloudinaryLoader } from "@/lib/cloudinary"

interface TeamMember {
  id: string
  name: string
  title: string
  bio: string
  image: string
  order: number
}

interface TeamMemberModalProps {
  isOpen: boolean
  onClose: () => void
  teamMemberId: string
}

export default function TeamMemberModal({ isOpen, onClose, teamMemberId }: TeamMemberModalProps) {
  const [teamMember, setTeamMember] = useState<TeamMember | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (isOpen && teamMemberId) {
      setIsLoading(true)
      // Fetch the team member details
      fetch(`/api/team-members/${teamMemberId}`)
        .then((res) => res.json())
        .then((data) => {
          setTeamMember(data)
          setIsLoading(false)
        })
        .catch((error) => {
          console.error("Error fetching team member details:", error)
          setIsLoading(false)
        })
    }
  }, [isOpen, teamMemberId])

  if (!isOpen) return null

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          <X size={24} />
        </button>

        {isLoading ? (
          <div className="modal-loading">
            <div className="loading-spinner"></div>
            <p>Loading team member details...</p>
          </div>
        ) : teamMember ? (
          <>
            <div className="modal-header">
              <h2>{teamMember.name}</h2>
            </div>
            <div
              className="modal-content"
              style={{ padding: "20px", display: "flex", flexDirection: "column", gap: "20px" }}
            >
              <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
                <div style={{ flex: "0 0 200px" }}>
                  <Image
                    src={teamMember.image || "/placeholder.svg"}
                    alt={teamMember.name}
                    width={200}
                    height={200}
                    style={{ objectFit: "cover", borderRadius: "8px" }}
                    loader={cloudinaryLoader}
                  />
                </div>
                <div style={{ flex: "1" }}>
                  <h3 style={{ color: "var(--primary-color)", marginBottom: "10px" }}>{teamMember.title}</h3>
                  <p style={{ lineHeight: "1.6" }}>{teamMember.bio}</p>
                  <p style={{ marginTop: "10px", color: "#666" }}>Display Order: {teamMember.order}</p>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="modal-error">
            <p>Team member not found. Please try again.</p>
            <button className="button" onClick={onClose}>
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
