import React from "react";
import Image from "next/image";
import { BsTwitter } from "react-icons/bs";
import { BiBell, BiBookmark, BiEnvelope, BiHash, BiHome, BiUser } from "react-icons/bi";
import FeedCard from "./components/FeedCard/page";


interface TwitterSidebarButtons {
  title: String,
  icon: React.ReactNode
}
const sideBarMenuItems: TwitterSidebarButtons[] = [
  {
    title: "Home",
    icon: <BiHome />
  },
  {
    title: "Explore",
    icon: <BiHash />
  },
  {
    title: "Notifications",
    icon: <BiBell />
  },
  {
    title: "Messages",
    icon: <BiEnvelope />
  },
  {
    title: "Bookmarks",
    icon: <BiBookmark />
  },
  {
    title: "Profile",
    icon: <BiUser />
  },
]

export default function Home() {
  return (
    <div className="">
      <div className="grid grid-cols-12 h-screen w-fit px-20">
        <div className="col-span-3  justify-start pt-8 pr-4">
          <div className="text-4xl h-fit w-fit hover:bg-gray-700 rounded-full p-2 ml-[10px] cursor-pointer transition-all" >
            <BsTwitter />
          </div>
          <div className="mt-4 text-xl font-semi-bold">
            <ul>
              {sideBarMenuItems.map((item, index) => <li key={index} className="flex w-fit justify-start items-center gap-4 hover:bg-gray-700 rounded-lg py-2 px-4 my-2 cursor-pointer transition-all">
                <span>{item.icon}</span>
                <span>{item.title}</span>
              </li>)}
            </ul>
            <button className="bg-[#1d9bf0] p-3 mt-4 rounded-full w-full">Tweet</button>
          </div>

        </div>
        <div className="col-span-6 border-r-[0.5px] border-l-[0.5px] border-gray-600 h-screen overflow-scroll scrollbar-hidden">
          <FeedCard />
          <FeedCard />
          <FeedCard />
          <FeedCard />
          <FeedCard />
          <FeedCard />
          <FeedCard />
          <FeedCard />
          <FeedCard />
          <FeedCard />
          <FeedCard />
          <FeedCard />
        </div>
        <div className="col-span-3"></div>
      </div>
    </div>
  );
}
