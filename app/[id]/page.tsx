"use client"
import { useRouter } from "next/router";
import { useCurrentUser } from "@/hooks/user"
import type { NextPage } from "next"
import Image from "next/image";
import { BsArrowLeftShort } from "react-icons/bs"
import FeedCard from "../components/FeedCard/page";
import { Tweet } from "@/gql/graphql";
const UserProfilePage: NextPage = () => {
    const { user } = useCurrentUser();
    // const router = useRouter()
    return (
        <div className="">
            <nav className=" flex items-center gap-3 p-3 ">
                <BsArrowLeftShort className="text-3xl" />
                <div>
                    <h1 className="text-xl font-bold">Name</h1>
                    <h1 className="text-md font-bold text-slate-500 ">100 tweets</h1>
                </div>
            </nav>
            <div className="p-4 border-b border-slate-800">

                {user?.profileImageURL && <Image className="rounded-full" src={user?.profileImageURL} width={100} height={100} alt="profile Image" />}
                <h1 className="text-xl font-bold mt-5">Name</h1>
            </div>
            <div>
                {user?.tweets?.map((tweet) => tweet && <FeedCard data={tweet as Tweet} key={tweet.id} />)}
            </div>
        </div>
    )
}
export default UserProfilePage