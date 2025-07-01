import { useEffect, useState } from "react";
import { Search, MessageCircle, Video, Star, MapPin, Clock } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useNavigate } from "react-router-dom";

export default function AdminsPage() {
  const [admins, setAdmins] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredAdmins, setFilteredAdmins] = useState([]);

  const navigate = useNavigate();

  // ✅ Fetch mentors from backend on mount
  useEffect(() => {
    const fetchAdmins = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/admin/all");
        const data = await res.json();
        setAdmins(data);
        setFilteredAdmins(data);
      } catch (err) {
        console.error("Failed to fetch admins", err);
      }
    };

    fetchAdmins();
  }, []);

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

  const handleChatConnect = (adminId) => {
  navigate(`/chat/:${adminId}`);
};

  const handleVideoCall = (adminName) => {
    alert(`Starting video call with ${adminName}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Find Your Mentor</h1>
          <p className="text-lg text-gray-600">
            Connect with industry experts and accelerate your career growth
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              type="text"
              placeholder="Search mentors by name, skills, or company..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-10 pr-4 py-2 w-full"
            />
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600">
            Showing {filteredAdmins.length} mentor{filteredAdmins.length !== 1 ? "s" : ""}
          </p>
        </div>

        {/* Mentors Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAdmins.map((admin) => (
            <Card key={admin._id} className="hover:shadow-lg transition-shadow duration-200">
              <CardHeader className="pb-4">
                <div className="flex items-start space-x-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={admin.avatar || "/placeholder.svg"} alt={admin.name} />
                    <AvatarFallback>
                      {admin.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-lg text-gray-900 truncate">{admin.name}</h3>
                    <p className="text-sm text-gray-600 truncate">{admin.title}</p>
                    <p className="text-sm text-blue-600 font-medium">{admin.company}</p>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Rating and Reviews */}
                <div className="flex items-center space-x-2">
                  <div className="flex items-center">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="ml-1 text-sm font-medium">{admin.rating || 0}</span>
                  </div>
                  <span className="text-sm text-gray-500">({admin.reviews || 0} reviews)</span>
                </div>

                {/* Location and Experience */}
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-1" />
                    <span>{admin.location || "N/A"}</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    <span>{admin.experience || "N/A"}</span>
                  </div>
                </div>

                {/* Hourly Rate */}
                <div className="text-lg font-semibold text-green-600">
                  ${admin.hourlyRate || "—"}/hour
                </div>

                {/* Skills */}
                <div className="flex flex-wrap gap-1">
                  {(admin.skills || []).slice(0, 3).map((skill, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {skill}
                    </Badge>
                  ))}
                  {admin.skills?.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{admin.skills.length - 3} more
                    </Badge>
                  )}
                </div>

                {/* Bio */}
                <p className="text-sm text-gray-600 line-clamp-2">{admin.bio}</p>

                {/* Availability */}
                <div className="flex items-center">
                  <div
                    className={`h-2 w-2 rounded-full mr-2 ${
                      admin.availability === "Available now" ? "bg-green-400" : "bg-yellow-400"
                    }`}
                  />
                  <span className="text-sm text-gray-600">
                    {admin.availability || "Check back later"}
                  </span>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-2 pt-2">
                  <Button
                    onClick={() => handleChatConnect(admin._id)}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                    size="sm"
                  >
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Chat
                  </Button>
                  <Button
                    onClick={() => handleVideoCall(admin._id)}
                    variant="outline"
                    className="flex-1 border-blue-600 text-blue-600 hover:bg-blue-50"
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
    </div>
  );
}
