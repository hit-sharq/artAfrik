"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";

export default function EditTeamMemberPage() {
  const router = useRouter();
  const params = useParams();
  const { id } = params;

  const [name, setName] = useState("");
  const [title, setTitle] = useState("");
  const [bio, setBio] = useState("");
  const [image, setImage] = useState("");
  const [displayOrder, setDisplayOrder] = useState(0);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function fetchTeamMember() {
      try {
        const res = await fetch(`/api/team-members/${id}`);
        if (res.ok) {
          const data = await res.json();
          setName(data.name);
          setTitle(data.title);
          setBio(data.bio);
          setImage(data.image);
          setDisplayOrder(data.displayOrder);
        } else {
          alert("Failed to fetch team member");
        }
      } catch {
        alert("Failed to fetch team member");
      } finally {
        setLoading(false);
      }
    }
    fetchTeamMember();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const res = await fetch(`/api/team-members/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, title, bio, image, displayOrder }),
      });

      if (res.ok) {
        router.push("/dashboard/team-members");
      } else {
        alert("Failed to update team member");
      }
    } catch {
      alert("Failed to update team member");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="container mx-auto p-4 max-w-lg">
      <h1 className="text-2xl font-bold mb-4">Edit Team Member</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1">Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="input input-bordered w-full"
          />
        </div>
        <div>
          <label className="block mb-1">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="input input-bordered w-full"
          />
        </div>
        <div>
          <label className="block mb-1">Bio</label>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            required
            className="textarea textarea-bordered w-full"
          />
        </div>
        <div>
          <label className="block mb-1">Image URL</label>
          <input
            type="text"
            value={image}
            onChange={(e) => setImage(e.target.value)}
            required
            className="input input-bordered w-full"
          />
        </div>
        <div>
          <label className="block mb-1">Display Order</label>
          <input
            type="number"
            value={displayOrder}
            onChange={(e) => setDisplayOrder(parseInt(e.target.value))}
            className="input input-bordered w-full"
          />
        </div>
        <button
          type="submit"
          disabled={saving}
          className="btn btn-primary w-full"
        >
          {saving ? "Saving..." : "Save"}
        </button>
      </form>
    </div>
  );
}
