import { Outlet } from "react-router";
import { Toaster } from "sonner";

const DefaultLayout = () => {
  return (
    <div className="container mx-auto max-w-7xl">
      <main className="my-10">
        <Outlet />
      </main>
      <Toaster position="top-right" richColors duration={4000} closeButton />
    </div>
  );
};

export default DefaultLayout;
