-- Enums
CREATE TYPE "UserRole" AS ENUM ('USER', 'ADMIN');
CREATE TYPE "PostStatus" AS ENUM ('DRAFT', 'PUBLISHED', 'ARCHIVED');
CREATE TYPE "DraftStatus" AS ENUM ('DRAFT', 'PUBLISHED', 'ARCHIVED');

-- Users
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT,
    "name" TEXT,
    "avatarUrl" TEXT,
    "bio" TEXT,
    "joined_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "role" "UserRole" NOT NULL DEFAULT 'USER',
    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "User_username_key" ON "User"("username");
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- Posts (metrics, author, status, tags, draft sync)
ALTER TABLE "Post"
ADD COLUMN IF NOT EXISTS "authorId" TEXT,
ADD COLUMN IF NOT EXISTS "status" "PostStatus" NOT NULL DEFAULT 'PUBLISHED',
ADD COLUMN IF NOT EXISTS "views" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN IF NOT EXISTS "lastViewedAt" TIMESTAMP(3),
ADD COLUMN IF NOT EXISTS "commentCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN IF NOT EXISTS "likesCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN IF NOT EXISTS "bookmarksCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN IF NOT EXISTS "tags" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
ADD COLUMN IF NOT EXISTS "draftUpdatedAt" TIMESTAMP(3),
ADD COLUMN IF NOT EXISTS "readingTime" INTEGER;

ALTER TABLE "Post"
ADD CONSTRAINT "Post_authorId_fkey"
    FOREIGN KEY ("authorId") REFERENCES "User"("id")
    ON DELETE SET NULL ON UPDATE CASCADE;

-- Comments (threaded with likes)
CREATE TABLE "Comment" (
    "id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "postId" TEXT NOT NULL,
    "authorId" TEXT,
    "parentId" TEXT,
    "likes" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Comment_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "Comment_postId_idx" ON "Comment"("postId");
CREATE INDEX "Comment_parentId_idx" ON "Comment"("parentId");

ALTER TABLE "Comment"
ADD CONSTRAINT "Comment_postId_fkey"
    FOREIGN KEY ("postId") REFERENCES "Post"("id")
    ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "Comment"
ADD CONSTRAINT "Comment_authorId_fkey"
    FOREIGN KEY ("authorId") REFERENCES "User"("id")
    ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "Comment"
ADD CONSTRAINT "Comment_parentId_fkey"
    FOREIGN KEY ("parentId") REFERENCES "Comment"("id")
    ON DELETE SET NULL ON UPDATE CASCADE;

-- Comment likes
CREATE TABLE "CommentLike" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "commentId" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "CommentLike_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "CommentLike_userId_commentId_key" ON "CommentLike"("userId", "commentId");

ALTER TABLE "CommentLike"
ADD CONSTRAINT "CommentLike_userId_fkey"
    FOREIGN KEY ("userId") REFERENCES "User"("id")
    ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "CommentLike"
ADD CONSTRAINT "CommentLike_commentId_fkey"
    FOREIGN KEY ("commentId") REFERENCES "Comment"("id")
    ON DELETE CASCADE ON UPDATE CASCADE;

-- Post likes
CREATE TABLE "PostLike" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "postId" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "PostLike_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "PostLike_userId_postId_key" ON "PostLike"("userId", "postId");

ALTER TABLE "PostLike"
ADD CONSTRAINT "PostLike_userId_fkey"
    FOREIGN KEY ("userId") REFERENCES "User"("id")
    ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "PostLike"
ADD CONSTRAINT "PostLike_postId_fkey"
    FOREIGN KEY ("postId") REFERENCES "Post"("id")
    ON DELETE CASCADE ON UPDATE CASCADE;

-- Bookmarks
CREATE TABLE "Bookmark" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "postId" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Bookmark_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "Bookmark_userId_postId_key" ON "Bookmark"("userId", "postId");

ALTER TABLE "Bookmark"
ADD CONSTRAINT "Bookmark_userId_fkey"
    FOREIGN KEY ("userId") REFERENCES "User"("id")
    ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "Bookmark"
ADD CONSTRAINT "Bookmark_postId_fkey"
    FOREIGN KEY ("postId") REFERENCES "Post"("id")
    ON DELETE CASCADE ON UPDATE CASCADE;

-- Drafts
CREATE TABLE "Draft" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "excerpt" TEXT,
    "slug" TEXT,
    "coverImageUrl" TEXT,
    "status" "DraftStatus" NOT NULL DEFAULT 'DRAFT',
    "autosavedAt" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "authorId" TEXT,
    "postId" TEXT,
    CONSTRAINT "Draft_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "Draft_slug_key" ON "Draft"("slug");
CREATE INDEX "Draft_authorId_idx" ON "Draft"("authorId");
CREATE INDEX "Draft_postId_idx" ON "Draft"("postId");

ALTER TABLE "Draft"
ADD CONSTRAINT "Draft_authorId_fkey"
    FOREIGN KEY ("authorId") REFERENCES "User"("id")
    ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "Draft"
ADD CONSTRAINT "Draft_postId_fkey"
    FOREIGN KEY ("postId") REFERENCES "Post"("id")
    ON DELETE SET NULL ON UPDATE CASCADE;

