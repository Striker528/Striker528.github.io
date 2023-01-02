import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { getAppInfo } from "../../api/admin";
import { useNotification } from "../../hooks";
import AppInfoBox from "../AppInfoBox";
import LatestUploads from "../LatestUploads";
import MostRatedMovies from "../MostRatedMovies";

export default function Dashboard() {
  const { updateNotification } = useNotification();
  //basic
  //return <div>Dashboard</div>;
  //what the guy does here initially is in the NavBar file in this folder
  //second part is in the Header file
  //third, (162) is MovieUpload
  //return <MovieUpload />;
  //no sense to do 'return <MovieUpload />;
  //rendering MovieUpload in Admin navigator
  //return null;

  const [appInfo, setAppInfo] = useState({
    movieCount: 0,
    reviewCount: 0,
    userCount: 0,
  });

  const fetchAppInfo = async () => {
    const { appInfo, error } = await getAppInfo();
    if (error) return updateNotification("error", error);

    setAppInfo({ ...appInfo });
  };

  useEffect(() => {
    fetchAppInfo();
  }, []);

  //function .toLocalString() add's commas to #'s, ex: 1255 becomes 1,255
  return (
    <div className="grid grid-cols-3 gap-5 my-5">
      <AppInfoBox
        title="Total Uploads"
        subTitle={appInfo.movieCount.toLocaleString()}
      />
      <AppInfoBox
        title="Total Reviews"
        subTitle={appInfo.reviewCount.toLocaleString()}
      />
      <AppInfoBox
        title="Total Users"
        subTitle={appInfo.userCount.toLocaleString()}
      />

      <LatestUploads />
      <MostRatedMovies />
    </div>
  );
}
