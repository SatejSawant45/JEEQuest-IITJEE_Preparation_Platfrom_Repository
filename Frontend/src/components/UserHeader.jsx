import { useState } from 'react'
import { LogOut, User, Settings, Shield } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { logout, getUserData } from '@/lib/auth'
import { useNavigate } from 'react-router-dom'
import { useToast } from './Toast'

export default function UserHeader() {
  const navigate = useNavigate()
  const { toast } = useToast()
  const [showLogoutDialog, setShowLogoutDialog] = useState(false)
  const userData = getUserData()
  const primaryBackendUrl = import.meta.env.VITE_PRIMARY_BACKEND_URL

  const handleLogout = () => {
    toast.info('Goodbye!', 'You have been logged out successfully.')
    logout()
    navigate('/')
  }

  const handleProfile = () => {
    if (userData.role === 'admin') {
      navigate('/admin/profile')
    } else {
      navigate('/user/dashboard/profile')
    }
  }

  const getInitials = (name) => {
    if (!name) return 'U'
    return name.split(' ').map(n => n[0]).join('').toUpperCase()
  }

  const getProfileImageUrl = () => {
    if (userData.profilePicture && !userData.profilePicture.startsWith('http')) {
      return `${primaryBackendUrl}${userData.profilePicture}`
    }
    return userData.profilePicture
  }

  return (
    <div className="flex items-center space-x-4">
      <div className="flex items-center space-x-2">
        <span className="text-sm text-gray-600">Welcome back,</span>
        <span className="font-medium text-gray-900">{userData.name || 'User'}</span>
        {userData.role === 'admin' && (
          <Shield className="w-4 h-4 text-purple-600" />
        )}
      </div>
      
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-10 w-10 rounded-full">
            <Avatar className="h-10 w-10">
              <AvatarImage 
                src={getProfileImageUrl()} 
                alt={userData.name || 'User'} 
              />
              <AvatarFallback className="bg-blue-100 text-blue-700">
                {getInitials(userData.name)}
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">{userData.name}</p>
              <p className="text-xs leading-none text-muted-foreground">
                {userData.email}
              </p>
              <p className="text-xs leading-none text-muted-foreground capitalize">
                {userData.role} Account
              </p>
            </div>
          </DropdownMenuLabel>
          
          <DropdownMenuSeparator />
          
          <DropdownMenuItem onClick={handleProfile} className="cursor-pointer">
            <User className="mr-2 h-4 w-4" />
            <span>Profile</span>
          </DropdownMenuItem>
          
          <DropdownMenuItem className="cursor-pointer">
            <Settings className="mr-2 h-4 w-4" />
            <span>Settings</span>
          </DropdownMenuItem>
          
          <DropdownMenuSeparator />
          
          <DropdownMenuItem 
            onClick={() => setShowLogoutDialog(true)}
            className="cursor-pointer text-red-600 focus:text-red-600"
          >
            <LogOut className="mr-2 h-4 w-4" />
            <span>Log out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to logout?</AlertDialogTitle>
            <AlertDialogDescription>
              You will be signed out of your account and redirected to the home page.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700"
            >
              Logout
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}