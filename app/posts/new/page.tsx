import LogoScrollBar from "@/components/LogoScrollBar"
import PostEditor from "@/components/PostEditor"

export default function NewPost() {
  return (
    <div className="min-h-screen bg-white">
      <LogoScrollBar />
      <div className="max-w-4xl mx-auto px-6 md:px-8 py-16 md:py-24">
        <PostEditor />
      </div>
    </div>
  )
}
