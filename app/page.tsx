"use client"
import React, { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { BiImageAlt } from "react-icons/bi";
import FeedCard from "./components/FeedCard/page";
import toast from "react-hot-toast";
import { graphqlClient } from "../clients/api";
import { useCurrentUser } from "@/hooks/user";
import { useCreateTweet, useGetAllTweets } from "@/hooks/tweet";
import { getSignedURLForTweetQuery } from "@/graphql/query/tweet";
import axios from "axios";
import SkeletonLoader from "./[id]/Skeleton";


export default function Home() {
  const { user } = useCurrentUser()
  const { tweets = [] } = useGetAllTweets()
  const [content, setContent] = useState('')
  const [imageURL, setImageURL] = useState('')
  const [loading, setLoading] = useState(true)
  const { mutate } = useCreateTweet()

  useEffect((
    
  )=>{
    if(user)
      setLoading(false)
  },[user])

  const handleInputChangeFile = useCallback((input: HTMLInputElement) => {
    return async (event: Event) => {
      event.preventDefault();
      const file: File | null | undefined = input.files?.item(0);
      if (!file) return
      const { getSignedURLForTweet } = await graphqlClient.request(getSignedURLForTweetQuery, {
        imageName: file.name,
        imageType: file.type
      })
      if (!getSignedURLForTweet) return
      if (getSignedURLForTweet) {
        toast.loading('Uploading Image...', { id: '2' })
        await axios.put(getSignedURLForTweet, file, { headers: { 'Content-type': file.type } })
        toast.success('Image Uploaded...', { id: '2' })
      }
      const url = new URL(getSignedURLForTweet)
      const myFilePath = `${url.origin}${url.pathname}`
      setImageURL(myFilePath)
      console.log(imageURL);
    }
  }, [imageURL])

  const handleSelectImage = useCallback(() => {
    const input = document.createElement("input")
    input.setAttribute("type", "file")
    input.setAttribute("accept", "image/*")
    const handlerFn = handleInputChangeFile(input)
    input.addEventListener('change', handlerFn)
    input.click();
  }, [handleInputChangeFile])

  const handleCreateTweet = useCallback(() => {
    console.log(imageURL);
    mutate({
      content,
      imageUrl: imageURL
    }, {
      onSuccess: () => {
          setContent('');
          setImageURL('');
      }
  })

  }, [content, mutate, imageURL])
  if(loading)return <SkeletonLoader/>

  return (
    <div className="">

      <div className='border border-l-0 border-r-0 border-gray-600 p-5 hover:bg-slate-900 transition-all cursor-pointer'>
        <div className="grid grid-cols-12 gap-2">
          <div className='col-span-2 md:col-span-1'>
            {user?.profileImageURL && <Image src={user?.profileImageURL} alt='User Avatar' className="rounded-full w-8 h-8 md:w-12 md:h-12" width={50} height={50} />}

          </div>
          <div className='col-span-10 md:mx-5'>

            <textarea value={content} onChange={(e) => setContent(e.target.value)} className="border-b h-14 w-full bg-transparent text-xl p-3" placeholder="What's happening?" rows={6} id=""></textarea>
            {imageURL && <Image src={imageURL} width={100} height={100} alt="Tweet Image" />}
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
