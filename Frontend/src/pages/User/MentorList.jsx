import { useEffect, useState, useContext } from "react";
import { Search, MessageCircle, Video, MapPin, Clock, Mail, Globe } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useNavigate } from "react-router-dom";
import IncomingCallDialog from "../IncommingVideoCall";
import { SocketContext } from "@/context/socket";

export default function AdminsPage() {
  const socket = useContext(SocketContext);
  const [admins, setAdmins] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredAdmins, setFilteredAdmins] = useState([]);
  const [onlineStatusById, setOnlineStatusById] = useState({});
  const [incomingCall, setIncomingCall] = useState(null);
  const [isCallInitiating, setIsCallInitiating] = useState(false);
  const primaryBackendUrl = import.meta.env.VITE_PRIMARY_BACKEND_URL;
  const socketUrl = import.meta.env.VITE_SOCKET_URL;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAdmins = async () => {
      try {
        const [adminRes, mentorRes] = await Promise.all([
          fetch(`${primaryBackendUrl}/api/admin/all`),
          fetch(`${primaryBackendUrl}/api/mentor/all`),
        ]);

        const adminsData = adminRes.ok ? await adminRes.json() : [];
        const mentorsData = mentorRes.ok ? await mentorRes.json() : [];

        const normalizedAdmins = adminsData.map((item) => ({ ...item, accountModel: 'Admin' }));
        const normalizedMentors = mentorsData.map((item) => ({ ...item, accountModel: 'Mentor' }));
        const combined = [...normalizedAdmins, ...normalizedMentors];

        setAdmins(combined);
        setFilteredAdmins(combined);
      } catch (err) {
        console.error("Failed to fetch admins", err);
      }
    };

    fetchAdmins();
  }, []);

  useEffect(() => {
    const fetchInitialOnlineStatus = async () => {
      try {
        if (!socketUrl) return;
        const response = await fetch(`${socketUrl}/test`);
        if (!response.ok) return;
        const data = await response.json();

        const statusMap = {};
        (data.onlineAdmins || []).forEach((id) => {
          statusMap[id] = true;
        });
        (data.onlineMentors || []).forEach((id) => {
          statusMap[id] = true;
        });

        setOnlineStatusById((prev) => ({ ...prev, ...statusMap }));
      } catch (error) {
        console.warn("Failed to fetch initial online status", error);
      }
    };

    fetchInitialOnlineStatus();
  }, [socketUrl]);


  useEffect(() => {
    const userId = localStorage.getItem("id");
    const userName = localStorage.getItem("name") || "Student";
    if (userId) {
      socket.emit("register", { userId, userRole: "student" });
    }

    socket.on("incoming_call", ({ fromAdminId, roomId, adminName }) => {
      console.log("📞 Incoming call from admin:", adminName);
      setIncomingCall({ fromAdminId, roomId, adminName });
    });

    // Listen for call responses
    socket.on("call_accepted", ({ adminId, roomId: callRoomId }) => {
      console.log("Call accepted by admin:", adminId);
      setIsCallInitiating(false);
      navigate(`/videocall/${callRoomId}`);
    });

    socket.on("call_rejected", ({ adminId }) => {
      console.log("Call rejected by admin:", adminId);
      setIsCallInitiating(false);
      alert("Admin declined your call");
    });

    socket.on("call_failed", ({ message }) => {
      console.log("Call failed:", message);
      setIsCallInitiating(false);
      alert(message);
    });

    socket.on("admin_status_changed", ({ adminId, isOnline }) => {
      setOnlineStatusById((prev) => ({ ...prev, [adminId]: isOnline }));
    });

    socket.on("mentor_status_changed", ({ mentorId, isOnline }) => {
      setOnlineStatusById((prev) => ({ ...prev, [mentorId]: isOnline }));
    });

    return () => {
      socket.off("incoming_call");
      socket.off("call_accepted");
      socket.off("call_rejected");
      socket.off("call_failed");
      socket.off("admin_status_changed");
      socket.off("mentor_status_changed");
    };
  }, [socket, navigate]);

  const handleSearch = (value) => {
    setSearchTerm(value);
    const filtered = admins.filter(
      (admin) =>
        admin.name.toLowerCase().includes(value.toLowerCase()) ||
        admin.title?.toLowerCase().includes(value.toLowerCase()) ||
        admin.company?.toLowerCase().includes(value.toLowerCase()) ||
        admin.skills?.some((skill) => skill.toLowerCase().includes(value.toLowerCase()))
    );
    setFilteredAdmins(filtered);
  };



  const handleChatConnect = (adminId, accountModel) => {
    navigate(`/chat/${accountModel === 'Mentor' ? `mentor_${adminId}` : adminId}`);
  };

  const handleVideoCall = (adminId, accountModel) => {
    if (isCallInitiating) return;

    const userId = localStorage.getItem("id");
    const userName = localStorage.getItem("name") || "Student";

    if (!userId) {
      alert("You must be logged in to start a video call.");
      return;
    }

    setIsCallInitiating(true);
    const callRoomId = `call_${adminId}_${userId}_${Date.now()}`;

    console.log("Initiating call to admin:", adminId);
    socket.emit("initiate_call", {
      studentId: userId,
      adminId: adminId,
      adminModel: accountModel || 'Admin',
      roomId: callRoomId,
      studentName: userName
    });

    // Set timeout for no answer (30 seconds)
    setTimeout(() => {
      if (isCallInitiating) {
        setIsCallInitiating(false);
        alert("Admin did not respond to your call");
      }
    }, 30000);
  };

  const getUserStatus = (staff) => {
    const isOnline = !!onlineStatusById[staff._id];
    return {
      isOnline,
      label: isOnline ? "Online now" : "Offline",
      dotClass: isOnline ? "bg-green-500" : "bg-gray-400",
    };
  };

  const getLikelyActiveTime = (staff) => {
    if (onlineStatusById[staff._id]) return "Active now";

    if (typeof staff.probableActiveTime === "string" && staff.probableActiveTime.trim()) {
      return staff.probableActiveTime;
    }

    if (typeof staff.availability === "string" && staff.availability.trim()) {
      return staff.availability;
    }

    if (typeof staff.preferredActiveTime === "string" && staff.preferredActiveTime.trim()) {
      return staff.preferredActiveTime;
    }

    if (typeof staff.activeHours === "string" && staff.activeHours.trim()) {
      return staff.activeHours;
    }

    const hour = new Date().getHours();
    if (hour < 12) return "Likely active: 6:00 PM - 10:00 PM";
    if (hour < 18) return "Likely active: 7:00 PM - 11:00 PM";
    return "Likely active: 10:00 AM - 1:00 PM";
  };


  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header and Search Setup */}
        <div className="space-y-6 mb-8 mt-2">
          {/* Header */}
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-gray-900">Find Your Mentor</h1>
            <p className="text-gray-600">
              Connect with industry experts and accelerate your career growth
            </p>
          </div>

          {/* Search Bar & Count */}
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="relative w-full max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                type="text"
                placeholder="Search mentors by name, skills, or company..."
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-10 pr-4 py-2 w-full bg-white border border-gray-200 focus-visible:ring-1 focus-visible:ring-gray-900"
              />
            </div>
            <p className="text-sm font-medium text-gray-500 whitespace-nowrap">
              Showing {filteredAdmins.length} mentor{filteredAdmins.length !== 1 ? "s" : ""}
            </p>
          </div>
        </div>

        {/* Mentors Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAdmins.map((admin) => (
            <Card key={admin._id} className="bg-white border border-gray-200 hover:shadow-md transition-shadow duration-200 flex flex-col">
              <CardHeader className="pb-4 border-b border-gray-100">
                <div className="flex items-start space-x-4">
                  <Avatar className="h-14 w-14 border border-gray-100 shadow-sm">
                    <AvatarImage src={admin.avatar || "/placeholder.svg"} alt={admin.name} />
                    <AvatarFallback className="bg-gray-100 text-gray-700 font-semibold">
                      {admin.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-lg text-gray-900 truncate">{admin.name}</h3>
                    <p className="text-sm text-gray-600 truncate mb-1">{admin.title}</p>
                    <Badge variant="secondary" className="bg-blue-50 text-blue-700 hover:bg-blue-50 border-none px-2 py-0 text-xs font-medium mr-2">
                      {admin.company || "Independent"}
                    </Badge>
                    <Badge variant="outline" className="text-xs border-gray-200">
                      {admin.accountModel}
                    </Badge>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4 pt-5 pb-5 flex-1 flex flex-col">
                {/* Location and Likely Active Time */}
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-1" />
                    <span>{admin.location || "N/A"}</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    <span>{getLikelyActiveTime(admin)}</span>
                  </div>
                </div>

                {/* Hourly Rate */}
                <div className="text-lg font-semibold text-green-600">
                  ${admin.hourlyRate || "—"}/hour
                </div>

                {/* Contact and profile links */}
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center gap-2 truncate">
                    <Mail className="h-4 w-4" />
                    <span className="truncate">{admin.email || "No email available"}</span>
                  </div>
                  <div className="flex items-center gap-2 truncate">
                    <Globe className="h-4 w-4" />
                    <span className="truncate">{admin.website || admin.linkedin || admin.github || "No website/profile"}</span>
                  </div>
                </div>

                {/* Skills */}
                <div className="flex flex-wrap gap-1">
                  {(admin.skills || []).slice(0, 3).map((skill, index) => (
                    <Badge key={index} variant="secondary" className="text-xs bg-gray-100 text-gray-700 hover:bg-gray-200 border-none font-normal">
                      {skill}
                    </Badge>
                  ))}
                  {admin.skills?.length > 3 && (
                    <Badge variant="outline" className="text-xs text-gray-500 font-normal border-gray-200">
                      +{admin.skills.length - 3} more
                    </Badge>
                  )}
                </div>

                {/* Bio */}
                <p className="text-sm text-gray-600 line-clamp-2">{admin.description || "No description provided yet."}</p>

                {/* Current Status */}
                <div className="flex items-center">
                  {(() => {
                    const status = getUserStatus(admin);
                    return (
                      <>
                        <div className={`h-2 w-2 rounded-full mr-2 ${status.dotClass}`} />
                        <span className="text-sm text-gray-600">{status.label}</span>
                      </>
                    );
                  })()}
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-3 pt-4 mt-auto border-t border-gray-100">
                  <Button
                    onClick={() => handleChatConnect(admin._id, admin.accountModel)}
                    className="flex-1 bg-gray-900 hover:bg-gray-800 text-white shadow-sm"
                    size="sm"
                  >
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Chat
                  </Button>
                  <Button
                    onClick={() => handleVideoCall(admin._id, admin.accountModel)}
                    variant="outline"
                    className="flex-1 border-gray-200 text-gray-700 hover:bg-gray-50 shadow-sm"
                    size="sm"
                  >
                    <Video className="h-4 w-4 mr-2" />
                    Video Call
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* No Results */}
        {filteredAdmins.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Search className="h-12 w-12 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No mentors found</h3>
            <p className="text-gray-600">Try adjusting your search terms or browse all mentors.</p>
          </div>
        )}
      </div>
      <IncomingCallDialog
        isOpen={!!incomingCall}
        callerName={incomingCall?.adminName || "Mentor"}
        callerAvatar={"/placeholder.svg"} // Optional: replace with actual avatar
        onAccept={() => {
          if (incomingCall) {
            navigate(`/videocall/${incomingCall.roomId}`);
            setIncomingCall(null);
          }
        }}
        onDecline={() => {
          setIncomingCall(null);
        }}
      />
    </div>
  );
}
