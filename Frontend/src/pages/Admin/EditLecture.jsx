import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Save, ArrowLeft, Youtube, Loader2 } from "lucide-react";
import Navbar from "../../nonshadcncomponants/Navbar";

export default function EditLecture() {
  const navigate = useNavigate();
  const { id } = useParams();
  const primaryBackendUrl = import.meta.env.VITE_PRIMARY_BACKEND_URL;

  const [lecture, setLecture] = useState({
    title: "",
    description: "",
    subject: "",
    youtubeUrl: "",
    duration: "",
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const subjects = [
    "Mathematics",
    "Physics",
    "Chemistry",
    "Computer Science",
    "Biology",
    "English",
    "History",
    "Geography",
    "Economics",
    "Other",
  ];

  useEffect(() => {
    fetchLecture();
  }, [id]);

  const fetchLecture = async () => {
    try {
      const token = localStorage.getItem("jwtToken");
      const response = await fetch(`${primaryBackendUrl}/api/lectures/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to fetch lecture");
      }

      const data = await response.json();
      setLecture({
        title: data.lecture.title,
        description: data.lecture.description,
        subject: data.lecture.subject,
        youtubeUrl: data.lecture.youtubeUrl,
        duration: data.lecture.duration,
      });
    } catch (error) {
      console.error("Error fetching lecture:", error);
      alert("❌ Failed to load lecture");
      navigate("/admin/dashboard");
    } finally {
      setIsLoading(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!lecture.title.trim()) {
      newErrors.title = "Title is required";
    }

    if (!lecture.description.trim()) {
      newErrors.description = "Description is required";
    }

    if (!lecture.subject) {
      newErrors.subject = "Subject is required";
    }

    if (!lecture.youtubeUrl.trim()) {
      newErrors.youtubeUrl = "YouTube URL is required";
    } else if (!lecture.youtubeUrl.includes("youtube.com") && !lecture.youtubeUrl.includes("youtu.be")) {
      newErrors.youtubeUrl = "Please enter a valid YouTube URL";
    }

    if (!lecture.duration.trim()) {
      newErrors.duration = "Duration is required";
    } else if (!/^\d{1,2}:\d{2}(:\d{2})?$/.test(lecture.duration)) {
      newErrors.duration = "Duration must be in format MM:SS or HH:MM:SS";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const token = localStorage.getItem("jwtToken");
      const response = await fetch(`${primaryBackendUrl}/api/lectures/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
        body: JSON.stringify(lecture),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update lecture");
      }

      const data = await response.json();
      alert("✅ Lecture updated successfully!");
      navigate("/admin/dashboard");
    } catch (error) {
      console.error("Error updating lecture:", error);
      alert(`❌ Failed to update lecture: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field, value) => {
    setLecture((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container mx-auto px-4 py-8 flex items-center justify-center">
          <div className="flex items-center gap-2">
            <Loader2 className="w-6 h-6 animate-spin" />
            <span>Loading lecture...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate("/admin/dashboard")}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
          <h1 className="text-3xl font-bold text-gray-900">Edit Lecture</h1>
          <p className="text-gray-600 mt-2">Update the video lecture details</p>
        </div>

        <form onSubmit={handleSubmit}>
          <Card>
            <CardHeader>
              <CardTitle>Lecture Details</CardTitle>
              <CardDescription>
                Update the details of the video lecture
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Title */}
              <div className="space-y-2">
                <Label htmlFor="title">
                  Title <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="title"
                  placeholder="e.g., Introduction to Calculus"
                  value={lecture.title}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                  className={errors.title ? "border-red-500" : ""}
                />
                {errors.title && (
                  <p className="text-sm text-red-500">{errors.title}</p>
                )}
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description">
                  Description <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id="description"
                  placeholder="Provide a brief description of what this lecture covers..."
                  value={lecture.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  rows={4}
                  className={errors.description ? "border-red-500" : ""}
                />
                {errors.description && (
                  <p className="text-sm text-red-500">{errors.description}</p>
                )}
              </div>

              {/* Subject */}
              <div className="space-y-2">
                <Label htmlFor="subject">
                  Subject <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={lecture.subject}
                  onValueChange={(value) => handleInputChange("subject", value)}
                >
                  <SelectTrigger className={errors.subject ? "border-red-500" : ""}>
                    <SelectValue placeholder="Select a subject" />
                  </SelectTrigger>
                  <SelectContent>
                    {subjects.map((subject) => (
                      <SelectItem key={subject} value={subject}>
                        {subject}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.subject && (
                  <p className="text-sm text-red-500">{errors.subject}</p>
                )}
              </div>

              {/* YouTube URL */}
              <div className="space-y-2">
                <Label htmlFor="youtubeUrl">
                  YouTube URL <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <Youtube className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="youtubeUrl"
                    placeholder="https://www.youtube.com/watch?v=..."
                    value={lecture.youtubeUrl}
                    onChange={(e) => handleInputChange("youtubeUrl", e.target.value)}
                    className={`pl-10 ${errors.youtubeUrl ? "border-red-500" : ""}`}
                  />
                </div>
                {errors.youtubeUrl && (
                  <p className="text-sm text-red-500">{errors.youtubeUrl}</p>
                )}
                <p className="text-xs text-gray-500">
                  The video thumbnail will be automatically extracted from YouTube
                </p>
              </div>

              {/* Duration */}
              <div className="space-y-2">
                <Label htmlFor="duration">
                  Duration <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="duration"
                  placeholder="e.g., 45:30 or 1:45:30"
                  value={lecture.duration}
                  onChange={(e) => handleInputChange("duration", e.target.value)}
                  className={errors.duration ? "border-red-500" : ""}
                />
                {errors.duration && (
                  <p className="text-sm text-red-500">{errors.duration}</p>
                )}
                <p className="text-xs text-gray-500">
                  Format: MM:SS or HH:MM:SS (e.g., 45:30 for 45 minutes 30 seconds)
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Submit Button */}
          <div className="mt-6 flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/admin/dashboard")}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              <Save className="w-4 h-4 mr-2" />
              {isSubmitting ? "Updating..." : "Update Lecture"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
