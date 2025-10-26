import React from "react";
import Breadcrumb from "../../../components/common/Breadcrumb";

const ServicePage = () => {
  return (
    <>
      <Breadcrumb
        items={[
          { label: "Home", path: "/", icon: "home" },
          { label: " Service" },
        ]}
        pageTitle=" Service"
      />
    </>
  );
};

export default ServicePage;
