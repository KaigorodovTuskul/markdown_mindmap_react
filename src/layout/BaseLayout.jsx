import { Outlet } from "react-router-dom";

const BaseLayout = () => {
  return (
    <main className="page-wrapper">
      <div className="content-wrapper">
        <Outlet />
      </div>
    </main>
  );
};

export default BaseLayout;
