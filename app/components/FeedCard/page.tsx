import Image from 'next/image'
import React from 'react'
import { AiOutlineHeart } from 'react-icons/ai'
import { BiMessageRounded, BiUpload } from 'react-icons/bi'
import { FaRetweet } from 'react-icons/fa'
import { Tweet } from '@/gql/graphql'
import Link from 'next/link'

interface FeedCardProp {
    data: Tweet
}

const FeedCard: React.FC<FeedCardProp> = ({data})  => {
    if (!data) return null;
    
    return (
        <div className='border border-l-0 border-r-0 border-gray-600 p-5 hover:bg-slate-900 transition-all cursor-pointer'>
            <div className="grid grid-cols-12 gap-2">
                <div className='col-span-2 md:col-span-1 '>
                    {data?.author?.profileImageURL && <Image src={data.author.profileImageURL} className='rounded-full w-8 h-8 md:w-12 md:h-12' alt='User Avatar' width={50} height={50} />}

                </div>
                <div className='col-span-10 md:ml-5'>
                    <h3 className='mb-1'>
                    {data.author?.id ?(<Link href={`/${data.author?.id}`} prefetch>{data.author?.firstName} </Link>):(<div>{data.author?.firstName} </div>)}
                    
                    </h3>

                    <p>{data.content} </p>
                    {data.imageUrl && <Image src={data.imageUrl}  className="mt-1" width={100} height={100} alt='tweet Images' />}
                    <div className='flex justify-between mt-5 text-xl  gap-7 items-start pr-10 w-[80%]'>
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
                    </div>
                </div>
            </div>
        </div>
    )
}

export default FeedCard