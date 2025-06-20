"use client";

import { useState } from "react";
import { Search, MessageCircle, Video, Star, MapPin, Clock } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// Mock data for mentors
const mentors = [
  {
    id: 1,
    name: "Sarah Chen",
    title: "Senior Software Engineer",
    company: "Google",
    avatar: "/placeholder.svg?height=80&width=80",
    rating: 4.9,
    reviews: 127,
    location: "San Francisco, CA",
    experience: "8 years",
    hourlyRate: 150,
    skills: ["React", "TypeScript", "System Design", "Leadership"],
    bio: "Passionate about mentoring junior developers and helping them grow their careers in tech.",
    availability: "Available now",
  },
  {
    id: 2,
    name: "Marcus Johnson",
    title: "Product Manager",
    company: "Microsoft",
    avatar: "/placeholder.svg?height=80&width=80",
    rating: 4.8,
    reviews: 89,
    location: "Seattle, WA",
    experience: "6 years",
    hourlyRate: 120,
    skills: ["Product Strategy", "Agile", "User Research", "Analytics"],
    bio: "Helping aspiring PMs navigate their career journey and build successful products.",
    availability: "Available in 2 hours",
  },
  {
    id: 3,
    name: "Emily Rodriguez",
    title: "UX Design Lead",
    company: "Airbnb",
    avatar: "/placeholder.svg?height=80&width=80",
    rating: 5.0,
    reviews: 156,
    location: "Austin, TX",
    experience: "10 years",
    hourlyRate: 180,
    skills: ["UI/UX Design", "Figma", "Design Systems", "User Testing"],
    bio: "Award-winning designer passionate about creating intuitive user experiences.",
    availability: "Available now",
  },
  {
    id: 4,
    name: "David Kim",
    title: "DevOps Engineer",
    company: "Netflix",
    avatar: "/placeholder.svg?height=80&width=80",
    rating: 4.7,
    reviews: 73,
    location: "Los Angeles, CA",
    experience: "7 years",
    hourlyRate: 140,
    skills: ["AWS", "Kubernetes", "CI/CD", "Monitoring"],
    bio: "Specializing in cloud infrastructure and helping teams scale their applications.",
    availability: "Available tomorrow",
  },
  {
    id: 5,
    name: "Lisa Wang",
    title: "Data Scientist",
    company: "Tesla",
    avatar: "/placeholder.svg?height=80&width=80",
    rating: 4.9,
    reviews: 94,
    location: "Palo Alto, CA",
    experience: "5 years",
    hourlyRate: 160,
    skills: ["Machine Learning", "Python", "Statistics", "Deep Learning"],
    bio: "Passionate about AI/ML and helping others break into the data science field.",
    availability: "Available now",
  },
  {
    id: 6,
    name: "Alex Thompson",
    title: "Startup Founder",
    company: "TechVenture Inc",
    avatar: "/placeholder.svg?height=80&width=80",
    rating: 4.8,
    reviews: 112,
    location: "New York, NY",
    experience: "12 years",
    hourlyRate: 200,
    skills: ["Entrepreneurship", "Fundraising", "Strategy", "Leadership"],
    bio: "Serial entrepreneur with 3 successful exits. Mentoring the next generation of founders.",
    availability: "Available in 1 hour",
  },
];

export default function MentorsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredMentors, setFilteredMentors] = useState(mentors);

  const handleSearch = (value) => {
    setSearchTerm(value);
    const filtered = mentors.filter(
      (mentor) =>
        mentor.name.toLowerCase().includes(value.toLowerCase()) ||
        mentor.title.toLowerCase().includes(value.toLowerCase()) ||
        mentor.company.toLowerCase().includes(value.toLowerCase()) ||
        mentor.skills.some((skill) => skill.toLowerCase().includes(value.toLowerCase()))
    );
    setFilteredMentors(filtered);
  };

  const handleChatConnect = (mentorName) => {
    alert(`Starting chat with ${mentorName}`);
  };

  const handleVideoCall = (mentorName) => {
    alert(`Starting video call with ${mentorName}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Find Your Mentor</h1>
          <p className="text-lg text-gray-600">Connect with industry experts and accelerate your career growth</p>
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
            Showing {filteredMentors.length} mentor{filteredMentors.length !== 1 ? "s" : ""}
          </p>
        </div>

        {/* Mentors Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMentors.map((mentor) => (
            <Card key={mentor.id} className="hover:shadow-lg transition-shadow duration-200">
              <CardHeader className="pb-4">
                <div className="flex items-start space-x-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={mentor.avatar || "/placeholder.svg"} alt={mentor.name} />
                    <AvatarFallback>
                      {mentor.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-lg text-gray-900 truncate">{mentor.name}</h3>
                    <p className="text-sm text-gray-600 truncate">{mentor.title}</p>
                    <p className="text-sm text-blue-600 font-medium">{mentor.company}</p>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Rating and Reviews */}
                <div className="flex items-center space-x-2">
                  <div className="flex items-center">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="ml-1 text-sm font-medium">{mentor.rating}</span>
                  </div>
                  <span className="text-sm text-gray-500">({mentor.reviews} reviews)</span>
                </div>

                {/* Location and Experience */}
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-1" />
                    <span>{mentor.location}</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    <span>{mentor.experience}</span>
                  </div>
                </div>

                {/* Hourly Rate */}
                <div className="text-lg font-semibold text-green-600">${mentor.hourlyRate}/hour</div>

                {/* Skills */}
                <div className="flex flex-wrap gap-1">
                  {mentor.skills.slice(0, 3).map((skill, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {skill}
                    </Badge>
                  ))}
                  {mentor.skills.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{mentor.skills.length - 3} more
                    </Badge>
                  )}
                </div>

                {/* Bio */}
                <p className="text-sm text-gray-600 line-clamp-2">{mentor.bio}</p>

                {/* Availability */}
                <div className="flex items-center">
                  <div
                    className={`h-2 w-2 rounded-full mr-2 ${
                      mentor.availability === "Available now" ? "bg-green-400" : "bg-yellow-400"
                    }`}
                  />
                  <span className="text-sm text-gray-600">{mentor.availability}</span>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-2 pt-2">
                  <Button
                    onClick={() => handleChatConnect(mentor.name)}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                    size="sm"
                  >
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Chat
                  </Button>
                  <Button
                    onClick={() => handleVideoCall(mentor.name)}
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
        {filteredMentors.length === 0 && (
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
