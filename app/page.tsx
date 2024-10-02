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
import Twitterlayout from "./components/FeedCard/Layout/TwitterLayout";







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

          </div>
        </div>
      </div>
      {tweets?.map(tweet => (tweet && <FeedCard key={tweet.id} data={tweet} />))}

    </div>
  );
}
