import AppHeader from "@/components/AppHeader";
import Sidebar from "@/components/Sidebar";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { Outlet } from "react-router";
import { Toaster } from "sonner";

const DefaultLayout = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-muted/30 p-4">
      <Card className="flex h-[calc(100vh-2rem)] flex-col overflow-hidden py-0 gap-0">
        <AppHeader />
        <div className="flex flex-1 overflow-hidden">
          {isAuthenticated && <Sidebar />}
          <main className="flex-1 overflow-y-auto p-6">
            <Outlet />
          </main>
        </div>
      </Card>
      <Toaster position="top-right" richColors duration={4000} closeButton />
    </div>
  );
};

export default DefaultLayout;
