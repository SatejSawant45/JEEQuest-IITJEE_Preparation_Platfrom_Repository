import { useEffect, useState } from "react";
import { Phone, PhoneOff, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function IncomingCallPopup({ call, onAccept, onReject }) {
  const [callDuration, setCallDuration] = useState(0);

  useEffect(() => {
    if (!call) return;

    const interval = setInterval(() => {
      setCallDuration((prev) => prev + 1);
    }, 1000);

    return () => {
      clearInterval(interval);
      setCallDuration(0);
    };
  }, [call]);

  if (!call) return null;

  return (
    <Dialog open={!!call} onOpenChange={() => onReject()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl">Incoming Call</DialogTitle>
          <DialogDescription className="text-center">
            {call.studentName} is calling you
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col items-center py-6 space-y-4">
          {/* Avatar */}
          <div className="relative">
            <Avatar className="h-24 w-24 ring-4 ring-green-500 animate-pulse">
              <AvatarFallback className="bg-green-100 text-green-700 text-3xl">
                {call.studentName?.charAt(0) || "S"}
              </AvatarFallback>
            </Avatar>
            <div className="absolute -bottom-1 -right-1 bg-green-500 rounded-full p-2">
              <Phone className="h-4 w-4 text-white" />
            </div>
          </div>

          {/* Student Name */}
          <div className="text-center">
            <h3 className="text-xl font-semibold">{call.studentName}</h3>
            <p className="text-sm text-gray-500">Student</p>
          </div>

          {/* Call Duration */}
          <div className="text-sm text-gray-400">
            Ringing... {callDuration}s
          </div>
        </div>

        <DialogFooter className="flex justify-center gap-4 sm:justify-center">
          {/* Reject Button */}
          <Button
            variant="destructive"
            size="lg"
            className="rounded-full h-16 w-16"
            onClick={onReject}
          >
            <PhoneOff className="h-6 w-6" />
          </Button>

          {/* Accept Button */}
          <Button
            variant="default"
            size="lg"
            className="rounded-full h-16 w-16 bg-green-600 hover:bg-green-700"
            onClick={onAccept}
          >
            <Phone className="h-6 w-6" />
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
