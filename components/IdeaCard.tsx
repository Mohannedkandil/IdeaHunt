import { formatDistanceToNow } from "date-fns"
import { useSession } from "next-auth/react"
import Link from "next/link"
import { useRouter } from "next/router"
import { ReactFragment, useState } from "react"

type IdeaData = {
  authorId: number
  title: string
  category: string
  userName: string
  created: string
  likedByUsers: number
  supportedByUsers: number
}

type Card = {
  post: any
  postId: any
  setShowPopup: any
}

export default function IdeaCard({ post, postId, setShowPopup }: Card) {
  const [data, setData] = useState(post)
  const router = useRouter()
  const { data: session, status } = useSession()
  const {
    authorId,
    content,
    topic,
    username,
    created,
    likedByUsers,
    supportedByUsers,
  }: any = data

  const isLiked = likedByUsers.some(
    (user: { id: number }) => user?.id == session?.userId
  )

  const isSupported = supportedByUsers.some(
    (user: { id: number }) => user?.id == session?.userId
  )

  const handlePostReactions = async (reaction: string) => {
    if (!session) {
      setShowPopup(true)
      return
    }

    try {
      const body = { postId }
      const updatedPostIdea = await fetch(`/api/${reaction}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })
      const newData = await updatedPostIdea.json()
      setData(newData)
    } catch (error) {
      console.log(error)
    }
  }
  return (
    <div className="w-[350px] h-[230px] text-white hover:border-[#00C6C0] border-2 bg-[#3A3B43] rounded-[10px] transition ease-in-out delay-150">
      <div className="px-4 py-4">
        <div className="h-[135px] mb-4">
          <div className="flex space-x-3 mb-4">
            <button onClick={() => router.push(`/profile/${authorId}`)}>
              By{" "}
              <span className="text-[#00C6C0] font-medium hover:underline">
                {username}
              </span>
            </button>
            <span>{topic}</span>
            <span>
              {formatDistanceToNow(new Date(created)).replace("about", "")} ago
            </span>
          </div>
          <p className="my-2">{content}</p>
        </div>
        <div className="flex justify-center space-x-4">
          <button
            onClick={() => handlePostReactions("like")}
            className="w-11 h-11 flex items-center justify-center rounded-lg bg-[#2E2F37] hover:bg-[#00C6C0]"
          >
            <span className="text-[25px]">😐</span>
          </button>
          <button className="w-11 flex items-center justify-center h-11 rounded-lg bg-[#2E2F37] hover:bg-[#00C6C0]">
            <span className="text-[25px]">💡</span>
          </button>
          <button
            onClick={() => handlePostReactions("support")}
            className="w-11 flex items-center justify-center h-11 rounded-lg bg-[#2E2F37] hover:bg-[#00C6C0]"
          >
            <span className="text-[25px]">🤑</span>
          </button>
        </div>
      </div>
    </div>
  )
}
