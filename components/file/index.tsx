"use client";

import { Card, CardHeader, CardBody, Image } from "@nextui-org/react";

interface FileCardProps {
  file: any;
}

const FileCard = (props: FileCardProps) => {
  return (
    <Card className="py-4">
      <a
        href={`${process.env.NEXT_PUBLIC_API_SERVER_URL}/admin-api/back-office/file/resources?fileName=${props.file.path}`}
      >
        <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
          <p className="text-tiny uppercase font-bold">APK</p>
          <small className="text-default-500">{props.file.upd_date}</small>
          <h4 className="font-bold text-large">
            {props.file ? props.file.path : "-"}
          </h4>
        </CardHeader>
        <CardBody className="overflow-visible py-2">
          <Image
            alt="Card background"
            className="object-cover rounded-xl"
            src="https://nextui.org/images/hero-card-complete.jpeg"
            width={150}
          />
        </CardBody>
      </a>
    </Card>
  );
};

FileCard.displayName = "FileCard";

export default FileCard;
