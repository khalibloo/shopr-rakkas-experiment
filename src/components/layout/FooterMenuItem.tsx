import React from "react";
import { Image, Typography } from "antd";
import { Link } from "rakkasjs";
import { FooterMenuItemConfig } from ".altrc";
// import Image from "@/components/Image";

interface Props extends FooterMenuItemConfig {}

const FooterMenuItem: React.FC<Props> = ({ type, content, headingSize, src, url }) => {
  let output;
  if (type === "heading") {
    output = <Typography.Title level={headingSize || 3}>{content}</Typography.Title>;
  } else if (type === "text") {
    output = <Typography.Text>{content}</Typography.Text>;
  } else if (type === "image") {
    output = <Image className="max-w-full" src={src} />;
  }
  if (url) {
    return (
      <div>
        <Link href={url}>{output}</Link>
      </div>
    );
  }
  return <div>{output}</div>;
};

export default FooterMenuItem;
