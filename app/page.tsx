"use client"
import React, { useCallback, useState } from "react";
import Image from "next/image";
import { BsTwitter } from "react-icons/bs";
import { BiBell, BiBookmark, BiEnvelope, BiHash, BiHome, BiImageAlt, BiUser } from "react-icons/bi";
import { CredentialResponse, GoogleLogin } from '@react-oauth/google'
import FeedCard from "./components/FeedCard/page";
import toast from "react-hot-toast";
import { graphqlClient } from "../clients/api";
import { verifyUserGoogleTokenQuery } from "../graphql/query/user"
import { useCurrentUser } from "@/hooks/user";
import { useQueryClient } from "@tanstack/react-query";
import TweetCard from "./components/TweetCard/page";
import { useCreateTweet, useGetAllTweets } from "@/hooks/tweet";


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
  const { user } = useCurrentUser()
  console.log(user);
  const queryClient = useQueryClient()
  const { tweets = [] } = useGetAllTweets()
  const [content, setContent] = useState('')
  const { mutate } = useCreateTweet()

  const handleLoignWithGoogle = useCallback(async (cred: CredentialResponse) => {
    const googleToken = cred.credential

    if (!googleToken) return toast.error(`Google token not Found`)
    const { verifyGoogleToken } = await graphqlClient.request(verifyUserGoogleTokenQuery, { token: googleToken })

    toast.success('verified Sucess')
    console.log(verifyGoogleToken);

    if (verifyGoogleToken) window.localStorage.setItem('__twitter_token', verifyGoogleToken)
    await queryClient.invalidateQueries({ queryKey: ["current-user"] })


  }, [queryClient])

  const handleSelectImage = useCallback(() => {
    const input = document.createElement("input")
    input.setAttribute("type", "file")
    input.setAttribute("accept", "image/*")
    input.click();
  }, [])

  const handleCreateTweet = useCallback(() => {
    mutate({
      content
    })
  }, [content, mutate])

  return (
    <div className="">
      <div className="grid grid-cols-12 h-screen w-fit px-20 ">
        <div className="col-span-3  justify-start pt-8 pr-4 relative">
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
          {user && (<div className="absolute bottom-5 flex gap-2 items-center bg-slate-800 p-3 rounded-xl">

            <Image className="rounded-full" src={user?.profileImageURL || ""} alt="user" height={50} width={50} />
            <h3 className="text-xl">{user.firstName}{" " + user.lastName}</h3>
          </div>
          )}
        </div>

        <div className="col-span-6 border-r-[0.5px] border-l-[0.5px] border-gray-600 h-screen overflow-scroll scrollbar-hidden">

          <div className='border border-l-0 border-r-0 border-gray-600 p-5 hover:bg-slate-900 transition-all cursor-pointer'>
            <div className="grid grid-cols-12 gap-2">
              <div className='col-span-1'>
                {user?.profileImageURL && <Image src={user?.profileImageURL} alt='User Avatar' className="rounded-full" width={50} height={50} />}

              </div>
              <div className='col-span-10'>

                <textarea value={content} onChange={(e) => setContent(e.target.value)} className="border-b h-10 w-full bg-transparent text-xl p-3" placeholder="What's happening?" rows={6} id=""></textarea>
                <div className="mt-2 flex justify-between items-center ">

                  <BiImageAlt onClick={handleSelectImage} className="text-2xl" />
                  <button onClick={handleCreateTweet} className="bg-[#1d9bf0] text-sm px-4 py-2 mt-4 rounded-full  ">Tweet</button>
                </div>
                {/* <div className='flex justify-between mt-5 text-xl items-start pr-10 w-[80%]'>
                  <div>
                    <BiMessageRounded />
                  </div>
                  <div>
                    <FaRetweet />
                  </div>
                  <div>
                    <AiOutlineHeart />
                  </div>
                  <div>
                    <BiUpload />
                  </div>
                </div> */}
              </div>
            </div>
          </div>
          {tweets?.map(tweet => (tweet && <FeedCard key={tweet.id} data={tweet} />))}

          {/* <FeedCard />
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
          <FeedCard /> */}
        </div>

        <div className="col-span-3">

          {!user && <div className="p-5 bg-slate-700 rounded-lg">
            <h1 className="my-2 text-2xl">New to Twitter?</h1>
            <GoogleLogin
              onSuccess={handleLoignWithGoogle}
            />
          </div>}
        </div>
      </div>
    </div>
  );
}
