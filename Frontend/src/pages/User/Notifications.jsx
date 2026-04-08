import { useEffect, useMemo, useState } from "react"
import { Bell, BookOpen, CheckCircle2, Clock, FileText, GraduationCap, Trash2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

const MAX_ITEMS_PER_SOURCE = 10

const toTimeLabel = (dateLike) => {
  const date = new Date(dateLike)
  if (Number.isNaN(date.getTime())) return "Just now"

  const diffMs = Date.now() - date.getTime()
  const diffMin = Math.floor(diffMs / (1000 * 60))
  const diffHour = Math.floor(diffMin / 60)
  const diffDay = Math.floor(diffHour / 24)

  if (diffMin < 1) return "Just now"
  if (diffMin < 60) return `${diffMin}m ago`
  if (diffHour < 24) return `${diffHour}h ago`
  if (diffDay < 7) return `${diffDay}d ago`
  return date.toLocaleDateString()
}

export default function NotificationsPage() {
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState("all")
  const [notifications, setNotifications] = useState([])

  const primaryBackendUrl = import.meta.env.VITE_PRIMARY_BACKEND_URL
  const getSafeStorageItem = (key, fallback = "") => {
    try {
      if (typeof window === "undefined") return fallback
      return window.localStorage.getItem(key) || fallback
    } catch {
      return fallback
    }
  }

  const setSafeStorageItem = (key, value) => {
    try {
      if (typeof window === "undefined") return
      window.localStorage.setItem(key, value)
    } catch {
      // Ignore storage errors to keep UI functional
    }
  }

  const userId = getSafeStorageItem("id", "unknown")
  const readStorageKey = `user-notifications-read-${userId}`

  const readMap = useMemo(() => {
    try {
      return JSON.parse(getSafeStorageItem(readStorageKey, "{}"))
    } catch {
      return {}
    }
  }, [readStorageKey])

  const persistReadState = (nextMap) => {
    setSafeStorageItem(readStorageKey, JSON.stringify(nextMap))
  }

  useEffect(() => {
    const loadNotifications = async () => {
      try {
        setLoading(true)
        const token = getSafeStorageItem("jwtToken", "")

        const [attemptsRes, blogsRes, lecturesRes] = await Promise.allSettled([
          fetch(`${primaryBackendUrl}/api/attempt/user`, {
            headers: token ? { Authorization: `Bearer ${token}` } : {},
          }),
          fetch(`${primaryBackendUrl}/api/blog`),
          fetch(`${primaryBackendUrl}/api/lectures`),
        ])

        const items = []

        if (attemptsRes.status === "fulfilled" && attemptsRes.value.ok) {
          const attempts = await attemptsRes.value.json()
          attempts
            .filter((a) => a.completedAt)
            .slice(0, MAX_ITEMS_PER_SOURCE)
            .forEach((attempt) => {
              const id = `attempt-${attempt._id}`
              items.push({
                id,
                type: "quiz",
                title: "Quiz submitted",
                message: `You completed ${attempt.quiz?.title || "a quiz"} with ${attempt.percentage || 0}% score.`,
                createdAt: attempt.completedAt,
                read: !!readMap[id],
              })
            })
        }

        if (blogsRes.status === "fulfilled" && blogsRes.value.ok) {
          const blogsData = await blogsRes.value.json()
          const blogs = blogsData.blogs || []

          blogs.slice(0, MAX_ITEMS_PER_SOURCE).forEach((blog) => {
            const id = `blog-${blog._id}`
            items.push({
              id,
              type: "blog",
              title: "New study blog posted",
              message: `${blog.author?.name || "A mentor"} posted: ${blog.title || "New blog"}`,
              createdAt: blog.createdAt,
              read: !!readMap[id],
            })
          })
        }

        if (lecturesRes.status === "fulfilled" && lecturesRes.value.ok) {
          const lecturesData = await lecturesRes.value.json()
          const lectures = lecturesData.lectures || lecturesData || []

          if (Array.isArray(lectures)) {
            lectures.slice(0, MAX_ITEMS_PER_SOURCE).forEach((lecture) => {
              const id = `lecture-${lecture._id || lecture.id || lecture.title}`
              items.push({
                id,
                type: "lecture",
                title: "New lecture available",
                message: `${lecture.title || "A new lecture"} is available for study.`,
                createdAt: lecture.createdAt || lecture.updatedAt || new Date().toISOString(),
                read: !!readMap[id],
              })
            })
          }
        }

        const deduped = Array.from(new Map(items.map((n) => [n.id, n])).values())
        deduped.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        setNotifications(deduped)
      } catch (error) {
        console.error("Failed to load notifications:", error)
        setNotifications([])
      } finally {
        setLoading(false)
      }
    }

    loadNotifications()
  }, [primaryBackendUrl, readStorageKey])

  const unreadCount = notifications.filter((n) => !n.read).length

  const filteredNotifications = notifications.filter((n) => {
    if (filter === "read") return n.read
    if (filter === "unread") return !n.read
    return true
  })

  const markAsRead = (id) => {
    const next = notifications.map((n) => (n.id === id ? { ...n, read: true } : n))
    setNotifications(next)

    const nextMap = { ...readMap, [id]: true }
    persistReadState(nextMap)
  }

  const markAllAsRead = () => {
    const next = notifications.map((n) => ({ ...n, read: true }))
    setNotifications(next)

    const nextMap = { ...readMap }
    next.forEach((n) => {
      nextMap[n.id] = true
    })
    persistReadState(nextMap)
  }

  const clearAll = () => {
    setNotifications([])
    persistReadState({})
  }

  const getIcon = (type) => {
    if (type === "quiz") return <CheckCircle2 className="h-4 w-4 text-blue-600" />
    if (type === "blog") return <FileText className="h-4 w-4 text-indigo-600" />
    if (type === "lecture") return <GraduationCap className="h-4 w-4 text-emerald-600" />
    return <Bell className="h-4 w-4 text-gray-600" />
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="mx-auto max-w-6xl space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Notifications</h1>
            <p className="text-muted-foreground">Stay updated on your quizzes, lectures, and community activity.</p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="text-sm">
              {unreadCount} unread
            </Badge>
            <Button variant="outline" onClick={markAllAsRead} disabled={!notifications.length || unreadCount === 0}>
              Mark all as read
            </Button>
            <Button variant="outline" onClick={clearAll} disabled={!notifications.length}>
              <Trash2 className="mr-2 h-4 w-4" />
              Clear all
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Activity Feed</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs value={filter} onValueChange={setFilter} className="space-y-4">
              <TabsList>
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="unread">Unread</TabsTrigger>
                <TabsTrigger value="read">Read</TabsTrigger>
              </TabsList>
            </Tabs>

            {loading ? (
              <div className="py-14 text-center text-muted-foreground">Loading notifications...</div>
            ) : filteredNotifications.length === 0 ? (
              <div className="py-14 text-center">
                <BookOpen className="mx-auto mb-3 h-10 w-10 text-muted-foreground" />
                <p className="font-medium">No notifications found</p>
                <p className="text-sm text-muted-foreground">You are all caught up for this filter.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredNotifications.map((item) => (
                  <div
                    key={item.id}
                    className={`rounded-lg border p-4 transition ${item.read ? "bg-white" : "bg-blue-50/50 border-blue-200"}`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex gap-3">
                        <div className="mt-0.5">{getIcon(item.type)}</div>
                        <div>
                          <p className="font-medium leading-5">{item.title}</p>
                          <p className="mt-1 text-sm text-muted-foreground">{item.message}</p>
                          <div className="mt-2 inline-flex items-center gap-1 text-xs text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            {toTimeLabel(item.createdAt)}
                          </div>
                        </div>
                      </div>

                      {!item.read && (
                        <Button size="sm" variant="outline" onClick={() => markAsRead(item.id)}>
                          Mark read
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
