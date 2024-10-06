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

const FeedCard: React.FC<FeedCardProp> = (props) => {
    const { data } = props
    return (
        <div className='border border-l-0 border-r-0 border-gray-600 p-5 hover:bg-slate-900 transition-all cursor-pointer'>
            <div className="grid grid-cols-12 gap-2">
                <div className='col-span-1'>
                    {data?.author?.profileImageURL && <Image src={data.author.profileImageURL} className='rounded-full' alt='User Avatar' width={50} height={50} />}

                </div>
                <div className='col-span-10'>
                    <h3 className='mb-1'>
                        <Link href={`/${data.author?.id}`}>{data.author?.firstName}</Link>
                    </h3>

                    <p>{data.content} </p>
                    {data.imageUrl && <Image src={data.imageUrl} width={100} height={100} alt='tweet Images' />}
                    <div className='flex justify-between mt-5 text-xl items-start pr-10 w-[80%]'>
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