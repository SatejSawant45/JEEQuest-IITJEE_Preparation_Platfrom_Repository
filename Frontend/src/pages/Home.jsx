import { useState, useEffect, useRef } from "react"
import { motion, useScroll, useTransform, AnimatePresence, useInView, useMotionValue, useSpring } from "framer-motion"
import {
    BookOpen,
    MessageCircle,
    Video,
    Bot,
    BarChart3,
    FileText,
    Star,
    ArrowRight,
    CheckCircle,
    Users,
    Trophy,
    Target,
    Clock,
    Zap,
    Shield,
    Award,
    Play,
    Menu,
    X,
    Sparkles,
    Brain,
    Rocket,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useNavigate } from "react-router-dom"

const features = [
    {
        title: "Smart Practice Quizzes",
        description: "AI-powered adaptive quizzes that adjust to your learning pace and identify weak areas",
        icon: BookOpen,
        color: "bg-blue-100 text-blue-800",
        stats: "500+ Questions",
    },
    {
        title: "24/7 Mentor Chat",
        description: "Instant access to experienced JEE mentors for doubt clearing and guidance",
        icon: MessageCircle,
        color: "bg-green-100 text-green-800",
        stats: "Always Available",
    },
    {
        title: "Live Video Sessions",
        description: "One-on-one video calls with top educators for personalized learning",
        icon: Video,
        color: "bg-purple-100 text-purple-800",
        stats: "Expert Teachers",
    },
    {
        title: "AI Study Assistant",
        description: "Your personal AI tutor that understands your learning style and adapts accordingly",
        icon: Bot,
        color: "bg-orange-100 text-orange-800",
        stats: "Smart Learning",
    },
    {
        title: "Performance Analytics",
        description: "Detailed insights into your progress with actionable improvement suggestions",
        icon: BarChart3,
        color: "bg-red-100 text-red-800",
        stats: "Data-Driven",
    },
    {
        title: "Expert Study Blogs",
        description: "Curated articles and strategies from successful JEE toppers and educators",
        icon: FileText,
        color: "bg-indigo-100 text-indigo-800",
        stats: "Weekly Updates",
    },
]

const testimonials = [
    {
        name: "Arjun Sharma",
        rank: "AIR 47, JEE Advanced 2024",
        content:
            "This platform completely transformed my preparation strategy. The AI-powered features helped me identify and work on my weak areas systematically.",
        avatar: "/placeholder.svg?height=60&width=60",
        subject: "Physics Topper",
    },
    {
        name: "Priya Patel",
        rank: "AIR 156, JEE Advanced 2024",
        content:
            "The mentor support was incredible. Having 24/7 access to experienced teachers made all the difference during my preparation.",
        avatar: "/placeholder.svg?height=60&width=60",
        subject: "Chemistry Expert",
    },
    {
        name: "Rohit Kumar",
        rank: "AIR 89, JEE Advanced 2024",
        content:
            "The practice questions are perfectly aligned with JEE patterns. The detailed explanations helped me understand concepts better than any textbook.",
        avatar: "/placeholder.svg?height=60&width=60",
        subject: "Mathematics Ace",
    },
]

const stats = [
    { number: 10000, label: "Active Students", icon: Users, suffix: "+" },
    { number: 500, label: "Top 1000 Ranks", icon: Trophy, suffix: "+" },
    { number: 95, label: "Success Rate", icon: Target, suffix: "%" },
    { number: 24, label: "Support Available", icon: Clock, suffix: "/7" },
]

const benefits = [
    "Personalized learning paths based on your strengths and weaknesses",
    "Access to 500+ carefully curated JEE practice questions",
    "Live doubt clearing sessions with experienced mentors",
    "AI-powered performance tracking and improvement suggestions",
    "Mobile-friendly platform for learning on the go",
    "Regular mock tests following latest JEE patterns",
]

const floatingElements = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    delay: Math.random() * 2,
    duration: 3 + Math.random() * 2,
}))

// Animated Counter Component
const AnimatedCounter = ({ value, suffix = "", duration = 2 }) => {
    const ref = useRef(null)
    const motionValue = useMotionValue(0)
    const springValue = useSpring(motionValue, { duration: duration * 1000 })
    const isInView = useInView(ref, { once: true })

    useEffect(() => {
        if (isInView) {
            motionValue.set(value)
        }
    }, [isInView, motionValue, value])

    useEffect(() => {
        springValue.on("change", (latest) => {
            if (ref.current) {
                ref.current.textContent = Math.floor(latest).toLocaleString() + suffix
            }
        })
    }, [springValue, suffix])

    return <span ref={ref}>0{suffix}</span>
}

// Typewriter Effect Component
const TypewriterText = ({ texts, speed = 100 }) => {
    const [currentTextIndex, setCurrentTextIndex] = useState(0)
    const [currentText, setCurrentText] = useState("")
    const [isDeleting, setIsDeleting] = useState(false)

    useEffect(() => {
        const timeout = setTimeout(
            () => {
                const fullText = texts[currentTextIndex]

                if (isDeleting) {
                    setCurrentText(fullText.substring(0, currentText.length - 1))
                } else {
                    setCurrentText(fullText.substring(0, currentText.length + 1))
                }

                if (!isDeleting && currentText === fullText) {
                    setTimeout(() => setIsDeleting(true), 1000)
                } else if (isDeleting && currentText === "") {
                    setIsDeleting(false)
                    setCurrentTextIndex((prev) => (prev + 1) % texts.length)
                }
            },
            isDeleting ? speed / 2 : speed,
        )

        return () => clearTimeout(timeout)
    }, [currentText, isDeleting, currentTextIndex, texts, speed])

    return (
        <span className="inline-block">
            {currentText}
            <motion.span
                animate={{ opacity: [1, 0] }}
                transition={{ duration: 0.8, repeat: Number.POSITIVE_INFINITY }}
                className="inline-block w-0.5 h-8 bg-blue-600 ml-1"
            />
        </span>
    )
}

// Floating Particles Component
const FloatingParticles = () => {
    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {floatingElements.map((element) => (
                <motion.div
                    key={element.id}
                    className="absolute w-2 h-2 bg-blue-200 rounded-full opacity-30"
                    style={{
                        left: `${element.x}%`,
                        top: `${element.y}%`,
                    }}
                    animate={{
                        y: [0, -30, 0],
                        x: [0, Math.random() * 20 - 10, 0],
                        scale: [1, 1.2, 1],
                        opacity: [0.3, 0.6, 0.3],
                    }}
                    transition={{
                        duration: element.duration,
                        delay: element.delay,
                        repeat: Number.POSITIVE_INFINITY,
                        ease: "easeInOut",
                    }}
                />
            ))}
        </div>
    )
}

export default function LandingPage() {
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], [0, -50]);
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.9 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.8,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.8, rotateY: -15 },
    visible: {
      opacity: 1,
      scale: 1,
      rotateY: 0,
      transition: {
        duration: 0.6,
        ease: "backOut",
      },
    },
    hover: {
      scale: 1.05,
      rotateY: 5,
      z: 50,
      transition: {
        duration: 0.3,
        ease: "easeOut",
      },
    },
  };

  const pulseVariants = {
    pulse: {
      scale: [1, 1.05, 1],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  };

    return (
        <div className="min-h-screen bg-white overflow-x-hidden">
            {/* Navigation */}
            <motion.nav
                initial={{ y: -100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="fixed top-0 w-full bg-white/95 backdrop-blur-sm border-b border-gray-200 z-50"
            >
                <div className="max-w-7xl mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        <motion.div
                            whileHover={{ scale: 1.05, rotate: 5 }}
                            whileTap={{ scale: 0.95 }}
                            className="flex items-center gap-2"
                        >
                            <motion.div
                                className="w-8 h-8 bg-gray-900 rounded-lg flex items-center justify-center"
                                whileHover={{ rotate: 360 }}
                                transition={{ duration: 0.6 }}
                            >
                                <BookOpen className="h-5 w-5 text-white" />
                            </motion.div>
                            <span className="text-xl font-bold text-gray-900">JEE Master</span>
                        </motion.div>

                        <div className="hidden md:flex items-center gap-8">
                            {["Features", "Success Stories", "Pricing"].map((item, index) => (
                                <motion.a
                                    key={item}
                                    href={`#${item.toLowerCase().replace(" ", "-")}`}
                                    className="text-gray-600 hover:text-gray-900 transition-colors relative"
                                    whileHover={{ scale: 1.1 }}
                                    initial={{ opacity: 0, y: -20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 + 0.5 }}
                                >
                                    {item}
                                    <motion.div
                                        className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gray-900"
                                        whileHover={{ width: "100%" }}
                                        transition={{ duration: 0.3 }}
                                    />
                                </motion.a>
                            ))}
                            <motion.div
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.8 }}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <Button className="bg-gray-900 hover:bg-gray-800 text-white">Get Started</Button>
                            </motion.div>
                        </div>

                        <motion.button className="md:hidden" whileTap={{ scale: 0.9 }} onClick={() => setIsMenuOpen(!isMenuOpen)}>
                            <motion.div animate={{ rotate: isMenuOpen ? 180 : 0 }} transition={{ duration: 0.3 }}>
                                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                            </motion.div>
                        </motion.button>
                    </div>
                </div>

                <AnimatePresence>
                    {isMenuOpen && (
                        <motion.div
                            initial={{ opacity: 0, height: 0, y: -20 }}
                            animate={{ opacity: 1, height: "auto", y: 0 }}
                            exit={{ opacity: 0, height: 0, y: -20 }}
                            transition={{ duration: 0.3, ease: "easeOut" }}
                            className="md:hidden bg-white border-t border-gray-200"
                        >
                            <motion.div
                                className="px-6 py-4 space-y-4"
                                variants={containerVariants}
                                initial="hidden"
                                animate="visible"
                            >
                                {["Features", "Success Stories", "Pricing"].map((item, index) => (
                                    <motion.a
                                        key={item}
                                        href={`#${item.toLowerCase().replace(" ", "-")}`}
                                        className="block text-gray-600"
                                        variants={itemVariants}
                                        whileHover={{ x: 10, color: "#111827" }}
                                    >
                                        {item}
                                    </motion.a>
                                ))}
                                <motion.div variants={itemVariants}>
                                    <Button className="w-full bg-gray-900 hover:bg-gray-800 text-white">Get Started</Button>
                                </motion.div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.nav>

            {/* Hero Section */}
            <section className="pt-24 pb-16 px-6 relative">
                <FloatingParticles />
                <motion.div style={{ y, opacity }} className="max-w-7xl mx-auto relative z-10">
                    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="text-center space-y-8">
                        <motion.div variants={itemVariants} className="space-y-4">
                            <motion.div
                                initial={{ scale: 0, rotate: -180 }}
                                animate={{ scale: 1, rotate: 0 }}
                                transition={{ duration: 0.8, ease: "backOut" }}
                            >
                                <Badge className="bg-blue-100 text-blue-800 px-4 py-2">
                                    <motion.span
                                        animate={{ rotate: [0, 10, -10, 0] }}
                                        transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                                        className="inline-block mr-2"
                                    >
                                        🚀
                                    </motion.span>
                                    Trusted by 10,000+ JEE Aspirants
                                </Badge>
                            </motion.div>

                            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 leading-tight">
                                <motion.span
                                    initial={{ opacity: 0, y: 50 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.8, delay: 0.2 }}
                                >
                                    Master JEE with
                                </motion.span>
                                <br />
                                <motion.span
                                    className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600"
                                    initial={{ opacity: 0, scale: 0.5 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 1, delay: 0.5 }}
                                >
                                    <TypewriterText texts={["AI-Powered Learning", "Expert Mentorship", "Smart Analytics"]} />
                                </motion.span>
                            </h1>

                            <motion.p className="text-xl text-gray-600 max-w-3xl mx-auto" variants={itemVariants}>
                                Join thousands of successful students who cracked JEE with our comprehensive platform featuring AI
                                tutoring, expert mentorship, and personalized learning paths.
                            </motion.p>
                        </motion.div>

                        <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 justify-center">
                            <motion.div
                                whileHover={{ scale: 1.05, boxShadow: "0 10px 30px rgba(0,0,0,0.2)" }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <Button size="lg" className="bg-gray-900 hover:bg-gray-800 text-white group relative overflow-hidden" onClick={() => navigate("/user/signup")}>
                                    <motion.div
                                        className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600"
                                        initial={{ x: "-100%" }}
                                        whileHover={{ x: "0%" }}
                                        transition={{ duration: 0.3 }}
                                    />
                                    <span className="relative z-10 flex items-center">
                                        Get Started as Student
                                        <motion.div
                                            animate={{ x: [0, 5, 0] }}
                                            transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
                                        >
                                            <ArrowRight className="ml-2 h-4 w-4" />
                                        </motion.div>
                                    </span>
                                </Button>
                            </motion.div>

                            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                <Button size="lg" variant="outline" className="group bg-transparent relative overflow-hidden">
                                    <motion.div
                                        className="absolute inset-0 bg-gray-100"
                                        initial={{ scale: 0 }}
                                        whileHover={{ scale: 1 }}
                                        transition={{ duration: 0.3 }}
                                    />
                                    <span className="relative z-10 flex items-center">
                                        <motion.div
                                            animate={{ scale: [1, 1.2, 1] }}
                                            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                                        >
                                            <Play className="mr-2 h-4 w-4" />
                                        </motion.div>
                                        Get Started as Mentor
                                    </span>
                                </Button>
                            </motion.div>
                        </motion.div>

                        <motion.div variants={itemVariants} className="grid grid-cols-2 md:grid-cols-4 gap-8 pt-8">
                            {stats.map((stat, index) => (
                                <motion.div
                                    key={index}
                                    className="text-center"
                                    whileHover={{ scale: 1.1, y: -5 }}
                                    initial={{ opacity: 0, y: 50 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 + 1 }}
                                >
                                    <motion.div
                                        className="flex justify-center mb-2"
                                        animate={{
                                            rotate: [0, 10, -10, 0],
                                            scale: [1, 1.1, 1],
                                        }}
                                        transition={{
                                            duration: 3,
                                            repeat: Number.POSITIVE_INFINITY,
                                            delay: index * 0.5,
                                        }}
                                    >
                                        <stat.icon className="h-8 w-8 text-gray-700" />
                                    </motion.div>
                                    <div className="text-2xl font-bold text-gray-900">
                                        <AnimatedCounter value={stat.number} suffix={stat.suffix} />
                                    </div>
                                    <div className="text-sm text-gray-600">{stat.label}</div>
                                </motion.div>
                            ))}
                        </motion.div>
                    </motion.div>
                </motion.div>

                {/* Animated Background Elements */}
                <motion.div
                    className="absolute top-20 left-10 w-20 h-20 bg-blue-100 rounded-full opacity-20"
                    animate={{
                        scale: [1, 1.2, 1],
                        rotate: [0, 180, 360],
                    }}
                    transition={{
                        duration: 8,
                        repeat: Number.POSITIVE_INFINITY,
                        ease: "linear",
                    }}
                />
                <motion.div
                    className="absolute bottom-20 right-10 w-16 h-16 bg-purple-100 rounded-full opacity-20"
                    animate={{
                        scale: [1.2, 1, 1.2],
                        rotate: [360, 180, 0],
                    }}
                    transition={{
                        duration: 6,
                        repeat: Number.POSITIVE_INFINITY,
                        ease: "linear",
                    }}
                />
            </section>

            {/* Features Section */}
            <section id="features" className="py-16 px-6 bg-gray-50 relative">
                <div className="max-w-7xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="text-center mb-16"
                    >
                        <motion.div
                            animate={{ rotate: [0, 360] }}
                            transition={{ duration: 20, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                            className="inline-block mb-4"
                        >
                            <Sparkles className="h-8 w-8 text-blue-600" />
                        </motion.div>
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Everything You Need to Crack JEE</h2>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            Our comprehensive platform combines cutting-edge AI technology with expert human guidance to give you the
                            best preparation experience.
                        </p>
                    </motion.div>

                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                    >
                        {features.map((feature, index) => (
                            <motion.div key={index} variants={cardVariants} whileHover="hover" className="perspective-1000">
                                <Card className="bg-white border border-gray-200 h-full hover:shadow-xl transition-all duration-300 relative overflow-hidden group">
                                    <motion.div
                                        className="absolute inset-0 bg-gradient-to-br from-blue-50 to-purple-50 opacity-0 group-hover:opacity-100"
                                        transition={{ duration: 0.3 }}
                                    />
                                    <CardHeader className="relative z-10">
                                        <div className="flex items-center gap-3 mb-2">
                                            <motion.div
                                                className="p-2 bg-gray-100 rounded-lg group-hover:bg-white transition-colors"
                                                whileHover={{ rotate: 360, scale: 1.1 }}
                                                transition={{ duration: 0.6 }}
                                            >
                                                <feature.icon className="h-6 w-6 text-gray-700" />
                                            </motion.div>
                                            <motion.div
                                                initial={{ scale: 0 }}
                                                animate={{ scale: 1 }}
                                                transition={{ delay: index * 0.1 + 0.5 }}
                                            >
                                                <Badge className={feature.color}>{feature.stats}</Badge>
                                            </motion.div>
                                        </div>
                                        <CardTitle className="text-xl font-semibold text-gray-900">{feature.title}</CardTitle>
                                    </CardHeader>
                                    <CardContent className="relative z-10">
                                        <CardDescription className="text-gray-600 leading-relaxed">{feature.description}</CardDescription>
                                        <motion.div
                                            className="mt-4 w-full h-1 bg-gray-200 rounded-full overflow-hidden"
                                            initial={{ width: 0 }}
                                            whileInView={{ width: "100%" }}
                                            viewport={{ once: true }}
                                            transition={{ delay: index * 0.1, duration: 1 }}
                                        >
                                            <motion.div
                                                className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
                                                initial={{ x: "-100%" }}
                                                whileInView={{ x: "0%" }}
                                                viewport={{ once: true }}
                                                transition={{ delay: index * 0.1 + 0.5, duration: 1 }}
                                            />
                                        </motion.div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* Benefits Section */}
            <section className="py-16 px-6 relative">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                            className="space-y-6"
                        >
                            <motion.div
                                animate={{ scale: [1, 1.05, 1] }}
                                transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
                            >
                                <Brain className="h-12 w-12 text-blue-600 mb-4" />
                            </motion.div>
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Why Choose Our Platform?</h2>
                            <p className="text-lg text-gray-600">
                                We've helped over 500 students achieve top 1000 ranks in JEE Advanced. Here's what makes us different:
                            </p>
                            <div className="space-y-4">
                                {benefits.map((benefit, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, x: -20 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: index * 0.1 }}
                                        whileHover={{ x: 10, scale: 1.02 }}
                                        className="flex items-start gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                                    >
                                        <motion.div
                                            initial={{ scale: 0, rotate: -180 }}
                                            whileInView={{ scale: 1, rotate: 0 }}
                                            viewport={{ once: true }}
                                            transition={{ delay: index * 0.1 + 0.2 }}
                                        >
                                            <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                                        </motion.div>
                                        <span className="text-gray-700">{benefit}</span>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                            className="relative"
                        >
                            <motion.div
                                className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-8 relative overflow-hidden"
                                whileHover={{ scale: 1.02 }}
                                transition={{ duration: 0.3 }}
                            >
                                <motion.div
                                    className="absolute top-4 right-4"
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 10, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                                >
                                    <Rocket className="h-6 w-6 text-blue-400" />
                                </motion.div>

                                <div className="grid grid-cols-2 gap-4">
                                    {[
                                        { icon: Zap, title: "Fast Learning", subtitle: "AI-optimized pace", color: "text-yellow-500" },
                                        { icon: Shield, title: "Proven Results", subtitle: "95% success rate", color: "text-green-500" },
                                        { icon: Award, title: "Expert Mentors", subtitle: "IIT/NIT alumni", color: "text-purple-500" },
                                        { icon: Target, title: "Personalized", subtitle: "Adaptive learning", color: "text-red-500" },
                                    ].map((item, index) => (
                                        <motion.div
                                            key={index}
                                            className="bg-white p-4 rounded-lg shadow-sm relative overflow-hidden group"
                                            whileHover={{ scale: 1.05, y: -5 }}
                                            initial={{ opacity: 0, y: 20 }}
                                            whileInView={{ opacity: 1, y: 0 }}
                                            viewport={{ once: true }}
                                            transition={{ delay: index * 0.1 }}
                                        >
                                            <motion.div
                                                className="absolute inset-0 bg-gradient-to-br from-blue-100 to-purple-100 opacity-0 group-hover:opacity-100"
                                                transition={{ duration: 0.3 }}
                                            />
                                            <motion.div
                                                animate={{
                                                    rotate: [0, 10, -10, 0],
                                                    scale: [1, 1.1, 1],
                                                }}
                                                transition={{
                                                    duration: 2,
                                                    repeat: Number.POSITIVE_INFINITY,
                                                    delay: index * 0.5,
                                                }}
                                            >
                                                <item.icon className={`h-8 w-8 ${item.color} mb-2 relative z-10`} />
                                            </motion.div>
                                            <div className="text-sm font-medium text-gray-900 relative z-10">{item.title}</div>
                                            <div className="text-xs text-gray-600 relative z-10">{item.subtitle}</div>
                                        </motion.div>
                                    ))}
                                </div>
                            </motion.div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Testimonials Section */}
            <section id="success-stories" className="py-16 px-6 bg-gray-50 relative overflow-hidden">
                <div className="max-w-7xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="text-center mb-16"
                    >
                        <motion.div
                            animate={{
                                rotate: [0, 360],
                                scale: [1, 1.2, 1],
                            }}
                            transition={{
                                duration: 4,
                                repeat: Number.POSITIVE_INFINITY,
                                ease: "easeInOut",
                            }}
                            className="inline-block mb-4"
                        >
                            <Trophy className="h-8 w-8 text-yellow-500" />
                        </motion.div>
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Success Stories from Our Students</h2>
                        <p className="text-xl text-gray-600">
                            Join the ranks of successful JEE toppers who achieved their dreams with our platform
                        </p>
                    </motion.div>

                    <div className="relative">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={currentTestimonial}
                                initial={{ opacity: 0, x: 100, rotateY: 90 }}
                                animate={{ opacity: 1, x: 0, rotateY: 0 }}
                                exit={{ opacity: 0, x: -100, rotateY: -90 }}
                                transition={{ duration: 0.6, ease: "backOut" }}
                                className="max-w-4xl mx-auto"
                            >
                                <Card className="bg-white border border-gray-200 relative overflow-hidden">
                                    <motion.div
                                        className="absolute inset-0 bg-gradient-to-br from-blue-50 to-purple-50 opacity-50"
                                        animate={{
                                            background: [
                                                "linear-gradient(45deg, rgba(59, 130, 246, 0.1), rgba(147, 51, 234, 0.1))",
                                                "linear-gradient(45deg, rgba(147, 51, 234, 0.1), rgba(59, 130, 246, 0.1))",
                                            ],
                                        }}
                                        transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
                                    />
                                    <CardContent className="p-8 text-center relative z-10">
                                        <motion.div
                                            className="flex justify-center mb-6"
                                            initial={{ scale: 0, rotate: -180 }}
                                            animate={{ scale: 1, rotate: 0 }}
                                            transition={{ duration: 0.6, delay: 0.2 }}
                                        >
                                            <motion.div whileHover={{ scale: 1.1, rotate: 5 }} variants={pulseVariants} animate="pulse">
                                                <Avatar className="h-16 w-16 ring-4 ring-blue-100">
                                                    <AvatarImage src={testimonials[currentTestimonial].avatar || "/placeholder.svg"} />
                                                    <AvatarFallback className="bg-gray-100 text-gray-700 text-lg">
                                                        {testimonials[currentTestimonial].name
                                                            .split(" ")
                                                            .map((n) => n[0])
                                                            .join("")}
                                                    </AvatarFallback>
                                                </Avatar>
                                            </motion.div>
                                        </motion.div>

                                        <motion.blockquote
                                            className="text-xl text-gray-800 mb-6 italic"
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.4 }}
                                        >
                                            "{testimonials[currentTestimonial].content}"
                                        </motion.blockquote>

                                        <motion.div
                                            className="space-y-2"
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.6 }}
                                        >
                                            <div className="font-semibold text-gray-900">{testimonials[currentTestimonial].name}</div>
                                            <motion.div
                                                initial={{ scale: 0 }}
                                                animate={{ scale: 1 }}
                                                transition={{ delay: 0.8, type: "spring" }}
                                            >
                                                <Badge className="bg-green-100 text-green-800">{testimonials[currentTestimonial].rank}</Badge>
                                            </motion.div>
                                            <div className="text-sm text-gray-600">{testimonials[currentTestimonial].subject}</div>
                                        </motion.div>

                                        <motion.div
                                            className="flex justify-center mt-4"
                                            initial={{ opacity: 0, scale: 0 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            transition={{ delay: 1 }}
                                        >
                                            {[...Array(5)].map((_, i) => (
                                                <motion.div
                                                    key={i}
                                                    initial={{ opacity: 0, rotate: -180 }}
                                                    animate={{ opacity: 1, rotate: 0 }}
                                                    transition={{ delay: 1 + i * 0.1 }}
                                                    whileHover={{ scale: 1.2, rotate: 360 }}
                                                >
                                                    <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                                                </motion.div>
                                            ))}
                                        </motion.div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        </AnimatePresence>

                        <div className="flex justify-center mt-8 gap-2">
                            {testimonials.map((_, index) => (
                                <motion.button
                                    key={index}
                                    onClick={() => setCurrentTestimonial(index)}
                                    className={`w-3 h-3 rounded-full transition-all duration-300 ${index === currentTestimonial ? "bg-gray-900 scale-125" : "bg-gray-300"
                                        }`}
                                    whileHover={{ scale: 1.2 }}
                                    whileTap={{ scale: 0.9 }}
                                    animate={index === currentTestimonial ? { scale: [1, 1.2, 1] } : {}}
                                    transition={{ duration: 0.3 }}
                                />
                            ))}
                        </div>
                    </div>
                </div>

                {/* Floating Elements */}
                <motion.div
                    className="absolute top-10 left-10 w-4 h-4 bg-yellow-300 rounded-full opacity-60"
                    animate={{
                        y: [0, -20, 0],
                        x: [0, 10, 0],
                        scale: [1, 1.2, 1],
                    }}
                    transition={{
                        duration: 4,
                        repeat: Number.POSITIVE_INFINITY,
                        ease: "easeInOut",
                    }}
                />
                <motion.div
                    className="absolute bottom-10 right-10 w-6 h-6 bg-blue-300 rounded-full opacity-60"
                    animate={{
                        y: [0, 20, 0],
                        x: [0, -15, 0],
                        rotate: [0, 180, 360],
                    }}
                    transition={{
                        duration: 5,
                        repeat: Number.POSITIVE_INFINITY,
                        ease: "easeInOut",
                    }}
                />
            </section>

            {/* CTA Section */}
            <section className="py-16 px-6 relative overflow-hidden">
                <motion.div
                    className="absolute inset-0 bg-gradient-to-br from-blue-600 to-purple-600 opacity-5"
                    animate={{
                        background: [
                            "linear-gradient(45deg, rgba(59, 130, 246, 0.05), rgba(147, 51, 234, 0.05))",
                            "linear-gradient(45deg, rgba(147, 51, 234, 0.05), rgba(59, 130, 246, 0.05))",
                        ],
                    }}
                    transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY }}
                />

                <div className="max-w-4xl mx-auto text-center relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="space-y-8"
                    >
                        <motion.div
                            animate={{ rotate: [0, 360] }}
                            transition={{ duration: 8, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                            className="inline-block"
                        >
                            <Rocket className="h-12 w-12 text-blue-600 mb-4" />
                        </motion.div>

                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Ready to Start Your JEE Success Journey?</h2>
                        <p className="text-xl text-gray-600">
                            Join thousands of students who are already on their path to IIT. Start your free trial today and
                            experience the difference.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <motion.div
                                whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(0,0,0,0.1)" }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <Button size="lg" className="bg-gray-900 hover:bg-gray-800 text-white group relative overflow-hidden">
                                    <motion.div
                                        className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600"
                                        initial={{ x: "-100%" }}
                                        whileHover={{ x: "0%" }}
                                        transition={{ duration: 0.3 }}
                                    />
                                    <span className="relative z-10 flex items-center">
                                        Start Free Trial
                                        <motion.div
                                            animate={{ x: [0, 5, 0] }}
                                            transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
                                        >
                                            <ArrowRight className="ml-2 h-4 w-4" />
                                        </motion.div>
                                    </span>
                                </Button>
                            </motion.div>

                            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                <Button size="lg" variant="outline" className="relative overflow-hidden group bg-transparent">
                                    <motion.div
                                        className="absolute inset-0 bg-gray-100"
                                        initial={{ scale: 0, rotate: 180 }}
                                        whileHover={{ scale: 1, rotate: 0 }}
                                        transition={{ duration: 0.3 }}
                                    />
                                    <span className="relative z-10">Schedule Demo Call</span>
                                </Button>
                            </motion.div>
                        </div>

                        <motion.p
                            className="text-sm text-gray-500"
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.5 }}
                        >
                            No credit card required • 7-day free trial • Cancel anytime
                        </motion.p>
                    </motion.div>
                </div>
            </section>

            {/* Footer */}
            <motion.footer
                className="bg-gray-900 text-white py-12 px-6 relative overflow-hidden"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
            >
                <motion.div
                    className="absolute inset-0 opacity-10"
                    animate={{
                        backgroundPosition: ["0% 0%", "100% 100%"],
                    }}
                    transition={{
                        duration: 20,
                        repeat: Number.POSITIVE_INFINITY,
                        ease: "linear",
                    }}
                    style={{
                        backgroundImage:
                            "linear-gradient(45deg, #3B82F6 25%, transparent 25%, transparent 75%, #3B82F6 75%, #3B82F6), linear-gradient(45deg, #3B82F6 25%, transparent 25%, transparent 75%, #3B82F6 75%, #3B82F6)",
                        backgroundSize: "20px 20px",
                        backgroundPosition: "0 0, 10px 10px",
                    }}
                />

                <div className="max-w-7xl mx-auto relative z-10">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        <motion.div
                            className="space-y-4"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 }}
                        >
                            <div className="flex items-center gap-2">
                                <motion.div
                                    className="w-8 h-8 bg-white rounded-lg flex items-center justify-center"
                                    whileHover={{ rotate: 360, scale: 1.1 }}
                                    transition={{ duration: 0.6 }}
                                >
                                    <BookOpen className="h-5 w-5 text-gray-900" />
                                </motion.div>
                                <span className="text-xl font-bold">JEE Master</span>
                            </div>
                            <p className="text-gray-400">Empowering JEE aspirants with AI-powered learning and expert mentorship.</p>
                        </motion.div>

                        {[
                            { title: "Features", items: ["Practice Quizzes", "AI Chatbot", "Mentor Support", "Video Sessions"] },
                            { title: "Resources", items: ["Study Blogs", "Test Analysis", "Success Stories", "Help Center"] },
                            { title: "Company", items: ["About Us", "Contact", "Privacy Policy", "Terms of Service"] },
                        ].map((section, sectionIndex) => (
                            <motion.div
                                key={section.title}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: (sectionIndex + 2) * 0.1 }}
                            >
                                <h3 className="font-semibold mb-4">{section.title}</h3>
                                <ul className="space-y-2 text-gray-400">
                                    {section.items.map((item, itemIndex) => (
                                        <motion.li
                                            key={item}
                                            whileHover={{ x: 5, color: "#ffffff" }}
                                            transition={{ duration: 0.2 }}
                                            className="cursor-pointer"
                                        >
                                            {item}
                                        </motion.li>
                                    ))}
                                </ul>
                            </motion.div>
                        ))}
                    </div>

                    <motion.div
                        className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.5 }}
                    >
                        <p>&copy; 2024 JEE Master. All rights reserved.</p>
                    </motion.div>
                </div>
            </motion.footer>
        </div>
    )
}
