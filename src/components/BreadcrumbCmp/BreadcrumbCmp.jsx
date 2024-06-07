import { Breadcrumb, BreadcrumbItem, BreadcrumbLink } from "@chakra-ui/react";
import React from "react";

const BreadcrumbCmp = ({ BreadcrumbList }) => {
  return (
    <Breadcrumb>
      {BreadcrumbList.length > 0 &&
        BreadcrumbList.map(({ pathLink, label }, index) => (
          <BreadcrumbItem key={index}>
            <BreadcrumbLink href={pathLink}>{label}</BreadcrumbLink>
          </BreadcrumbItem>
        ))}
    </Breadcrumb>
  );
};

export default BreadcrumbCmp;
