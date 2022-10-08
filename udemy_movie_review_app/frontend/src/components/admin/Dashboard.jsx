import React from "react";
import AppInfoBox from "../AppInfoBox";
import LatestUploads from "../LatestUploads";

export default function Dashboard() {
  //basic
  //return <div>Dashboard</div>;
  //what the guy does here initially is in the NavBar file in this folder
  //second part is in the Header file
  //third, (162) is MovieUpload
  //return <MovieUpload />;
  //no sense to do 'return <MovieUpload />;
  //rendering MovieUpload in Admin navigator
  //return null;

  return (
    <div className="grid grid-cols-3 gap-5 my-5">
      <AppInfoBox title="Total Uploads" subTitle="100" />
      <AppInfoBox title="Total Reviews" subTitle="100" />
      <AppInfoBox title="Total Users" subTitle="100" />
      
      <LatestUploads />
    </div>
  );
}
