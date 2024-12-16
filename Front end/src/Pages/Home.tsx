import React from "react";
import { MenuItemCard, MenuItemsList } from "../Components/Page/MenuItems";
import { useState, useEffect } from "react";
import { Banner, MainLoader } from "../Components/Page/Common";

function Home() {
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 300);
  }, []);

  if (isLoading) {
    return <MainLoader />;
  }

  return (
    <div>
      {/* <Banner /> */}
      <div className="container p-2">
        <MenuItemsList />
      </div>
    </div>
  );
}

export default Home;
