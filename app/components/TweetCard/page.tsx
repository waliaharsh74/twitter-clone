import React from 'react'
import { AiOutlineHeart } from 'react-icons/ai'
import { BiMessageRounded, BiUpload } from 'react-icons/bi'
import { FaRetweet } from 'react-icons/fa'

const TweetCard: React.FC = () => {
    return (
        <div className='border border-l-0 border-r-0 border-gray-600 p-5 hover:bg-slate-900 transition-all cursor-pointer'>
            <div className="grid grid-cols-12 gap-2">
                <div className='col-span-1'>
                    {/* <Image src={user?.profileImageUrl} alt='User Avatar' width={50} height={50} /> */}

                </div>
                <div className='col-span-10'>
                    <h5>Harsh</h5>
                    <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Repellat amet labore saepe ullam eius laboriosam harum error impedit possimus velit accusantium temporibus veritatis facilis illum optio tempore, odit ab excepturi aut alias ad. Officiis in eum amet quod, vero dignissimos </p>
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

export default TweetCard