import React from "react";
import { Helmet } from "react-helmet";

const Meta = ({ title, description, keywords }) => {
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keyword" content={keywords} />
    </Helmet>
  );
};

Meta.defaultProps = {
  title: "Welcome To Weon Impex",
  description: "We sell the quality products for cheap",
  keywords:
    "home appliances, gas stoves, imported goods, electronics, buy electronics, cheap electroincs",
};

export default Meta;
