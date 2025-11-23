"use client";

import { Award, CheckCircle, Clock, Mail, Phone, User, XCircle } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function AdminAgentsPage() {
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all"); // all, pending, verified

  useEffect(() => {
    fetchAgents();
  }, []);

  const fetchAgents = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/admin/agents");
      const data = await response.json();
      
      if (data.success) {
        setAgents(data.data);
      }
    } catch (error) {
      console.error("Error fetching agents:", error);
      toast.error("Failed to load agents");
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (agentId) => {
    console.log("Attempting to approve agent with ID:", agentId);
    console.log("ID type:", typeof agentId);
    console.log("ID value:", JSON.stringify(agentId));
    
    if (!confirm("Approve this agent?")) return;

    try {
      const url = `/api/admin/agents/${agentId}/approve`;
      console.log("Calling URL:", url);
      
      const response = await fetch(url, {
        method: "POST",
      });

      const data = await response.json();
      console.log("Response data:", data);

      if (data.success) {
        toast.success("Agent approved successfully!");
        fetchAgents();
      } else {
        toast.error(data.message || "Failed to approve agent");
        console.error("Approval failed:", data);
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Error approving agent");
    }
  };

  const handleReject = async (agentId) => {
    if (!confirm("Reject this agent? This will deactivate their account.")) return;

    try {
      const response = await fetch(`/api/admin/agents/${agentId}/reject`, {
        method: "POST",
      });

      const data = await response.json();

      if (data.success) {
        toast.success("Agent rejected");
        fetchAgents();
      } else {
        toast.error(data.message || "Failed to reject agent");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Error rejecting agent");
    }
  };

  const filteredAgents = agents.filter((agent) => {
    if (filter === "pending") return !agent.agentProfile?.isVerified;
    if (filter === "verified") return agent.agentProfile?.isVerified;
    return true;
  });

  const pendingCount = agents.filter(a => !a.agentProfile?.isVerified).length;
  const verifiedCount = agents.filter(a => a.agentProfile?.isVerified).length;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-rose-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Agent Management</h1>
        <p className="text-gray-600 mt-1">Approve and manage real estate agents</p>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 border-b border-gray-200">
        <button
          onClick={() => setFilter("all")}
          className={`px-4 py-2 font-medium text-sm border-b-2 transition ${
            filter === "all"
              ? "border-rose-500 text-rose-600"
              : "border-transparent text-gray-600 hover:text-gray-900"
          }`}
        >
          All Agents ({agents.length})
        </button>
        <button
          onClick={() => setFilter("pending")}
          className={`px-4 py-2 font-medium text-sm border-b-2 transition ${
            filter === "pending"
              ? "border-rose-500 text-rose-600"
              : "border-transparent text-gray-600 hover:text-gray-900"
          }`}
        >
          Pending Approval ({pendingCount})
        </button>
        <button
          onClick={() => setFilter("verified")}
          className={`px-4 py-2 font-medium text-sm border-b-2 transition ${
            filter === "verified"
              ? "border-rose-500 text-rose-600"
              : "border-transparent text-gray-600 hover:text-gray-900"
          }`}
        >
          Verified ({verifiedCount})
        </button>
      </div>

      {/* Agents List */}
      <div className="grid grid-cols-1 gap-4">
        {filteredAgents.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
            <p className="text-gray-500">No agents found</p>
          </div>
        ) : (
          filteredAgents.map((agent) => (
            <div
              key={agent._id}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition"
            >
              <div className="flex flex-col lg:flex-row lg:items-center gap-6">
                {/* Agent Info */}
                <div className="flex-1">
                  <div className="flex items-start gap-4">
                    <div className="h-16 w-16 rounded-full bg-gradient-to-br from-rose-400 to-rose-600 flex items-center justify-center text-white font-semibold text-2xl flex-shrink-0">
                      {agent.name?.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-lg font-semibold text-gray-900">{agent.name}</h3>
                        {agent.agentProfile?.isVerified ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">
                            <CheckCircle className="h-3 w-3" />
                            Verified
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700">
                            <Clock className="h-3 w-3" />
                            Pending
                          </span>
                        )}
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-gray-600 mt-2">
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4 text-gray-400" />
                          <span className="truncate">{agent.email}</span>
                        </div>
                        {agent.phone && (
                          <div className="flex items-center gap-2">
                            <Phone className="h-4 w-4 text-gray-400" />
                            <span>{agent.phone}</span>
                          </div>
                        )}
                        {agent.agentProfile?.agency && (
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4 text-gray-400" />
                            <span className="truncate">{agent.agentProfile.agency}</span>
                          </div>
                        )}
                        {agent.agentProfile?.experience && (
                          <div className="flex items-center gap-2">
                            <Award className="h-4 w-4 text-gray-400" />
                            <span>{agent.agentProfile.experience} years exp.</span>
                          </div>
                        )}
                      </div>

                      {agent.agentProfile?.specialization?.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-3">
                          {agent.agentProfile.specialization.map((spec) => (
                            <span
                              key={spec}
                              className="px-2 py-1 bg-gray-100 text-gray-700 rounded-md text-xs font-medium capitalize"
                            >
                              {spec}
                            </span>
                          ))}
                        </div>
                      )}

                      {agent.agentProfile?.bio && (
                        <p className="text-sm text-gray-600 mt-3 line-clamp-2">
                          {agent.agentProfile.bio}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                {!agent.agentProfile?.isVerified && (
                  <div className="flex gap-2 lg:flex-col">
                    <button
                      onClick={() => handleApprove(agent._id)}
                      className="flex-1 lg:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition text-sm font-medium"
                    >
                      <CheckCircle className="h-4 w-4" />
                      Approve
                    </button>
                    <button
                      onClick={() => handleReject(agent._id)}
                      className="flex-1 lg:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition text-sm font-medium"
                    >
                      <XCircle className="h-4 w-4" />
                      Reject
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
