import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Bell, Settings, Info, User, Shield, Moon, Sun, LogOut } from "lucide-react";

export default function ProfilePage() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm z-10">
        <div className="px-4 py-3 flex items-center justify-between">
          <h1 className="text-lg font-semibold text-primary">Profile</h1>
        </div>
      </header>

      <main className="flex-1 p-4">
        {/* User Info */}
        <Card className="mb-4">
          <CardContent className="pt-6">
            <div className="flex items-center">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center text-white text-2xl font-semibold">
                U
              </div>
              <div className="ml-4">
                <h2 className="text-xl font-semibold">User</h2>
                <p className="text-gray-500">user@example.com</p>
              </div>
            </div>
            <Button variant="outline" className="w-full mt-4">
              <User className="w-4 h-4 mr-2" />
              Edit Profile
            </Button>
          </CardContent>
        </Card>

        {/* Settings */}
        <Card className="mb-4">
          <CardHeader>
            <CardTitle className="text-base flex items-center">
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Bell className="w-4 h-4 mr-2 text-gray-500" />
                <Label htmlFor="notifications" className="cursor-pointer">
                  Notifications
                </Label>
              </div>
              <Switch id="notifications" defaultChecked />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Moon className="w-4 h-4 mr-2 text-gray-500" />
                <Label htmlFor="darkMode" className="cursor-pointer">
                  Dark Mode
                </Label>
              </div>
              <Switch id="darkMode" />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Shield className="w-4 h-4 mr-2 text-gray-500" />
                <Label htmlFor="dataSaving" className="cursor-pointer">
                  Data Saving Mode
                </Label>
              </div>
              <Switch id="dataSaving" />
            </div>
          </CardContent>
        </Card>

        {/* About */}
        <Card className="mb-4">
          <CardHeader>
            <CardTitle className="text-base flex items-center">
              <Info className="w-4 h-4 mr-2" />
              About
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Version</span>
              <span>1.0.0</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Last Update</span>
              <span>June 2023</span>
            </div>
            <Button variant="ghost" className="text-primary w-full justify-start px-0 text-sm">
              Privacy Policy
            </Button>
            <Button variant="ghost" className="text-primary w-full justify-start px-0 text-sm">
              Terms of Service
            </Button>
          </CardContent>
        </Card>

        {/* Logout */}
        <Button variant="outline" className="w-full mt-2 border-red-200 text-red-500 hover:bg-red-50">
          <LogOut className="w-4 h-4 mr-2" />
          Logout
        </Button>
      </main>
    </div>
  );
}
