import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Heart, Bookmark, MessageCircle } from "lucide-react";
import { formatDistanceToNowStrict, isToday, isYesterday, format } from "date-fns";
import PostDetailView from "./PostDetailView";
import useUiStore from "../stores/useUiStore";
import { usePostInteractions } from "../hooks/usePostInteractions";
import {useNavigate} from "react-router-dom";

export default function MapPostCard({ post, isSelected, onCardClick }) {
    const navigate = useNavigate();
    const [detailViewOpen, setDetailViewOpen] = useState(false);
    const [imageHeight, setImageHeight] = useState(180);
    const [imageLoaded, setImageLoaded] = useState(false);

    const {
        liked,
        likesCount,
        bookmarked,
        bookmarksCount,
        handleLikeToggle,
        handleBookmarkToggle,
    } = usePostInteractions(post.id);

    const {
        userDisplayName,
        userProfilePicUrl,
        description,
        files,
        userId,
        createdAt,
        commentsCount,
    } = post;

    const formatDate = (firebaseTimestamp) => {
        if (!firebaseTimestamp?._seconds) return "";
        const date = new Date(
            firebaseTimestamp._seconds * 1000 +
            firebaseTimestamp._nanoseconds / 1000000
        );
        if (isToday(date)) return formatDistanceToNowStrict(date, { addSuffix: true });
        if (isYesterday(date)) return "Yesterday";
        if (Date.now() - date.getTime() < 7 * 864e5) return format(date, "EEE");
        return format(date, "MMM dd");
    };

    const handleImageLoad = (e) => {
        const img = e.target;
        const aspect = img.naturalHeight / img.naturalWidth;
        const width = 220;
        let height = width * aspect;
        height = Math.max(140, Math.min(height, 350));
        setImageHeight(height);
        setImageLoaded(true);
    };

    const handleNameClick = (e) => {
        e.stopPropagation();
        navigate(`/profile/${userId}`);
    };

    return (
        <>
            <Card
                onClick={() => {
                    setDetailViewOpen(true);
                    onCardClick?.(post);
                }}
                className={cn(
                    "overflow-hidden border rounded-xl transition hover:shadow-md cursor-pointer",
                    isSelected && "ring-2 ring-primary"
                )}
            >
                {/* Image */}
                <div
                    className="relative w-full bg-muted"
                    style={{ height: imageHeight }}
                >
                    {files?.[0] ? (
                        <img
                            src={files[0]}
                            alt=""
                            onLoad={handleImageLoad}
                            className={cn(
                                "w-full h-full object-cover transition-opacity",
                                imageLoaded ? "opacity-100" : "opacity-70"
                            )}
                        />
                    ) : (
                        <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                            No image
                        </div>
                    )}

                    {/* Bookmark */}
                    <Button
                        variant="ghost"
                        size="icon"
                        className="absolute top-2 right-2 bg-background/80 backdrop-blur-sm rounded-full"
                        onClick={(e) => {
                            e.stopPropagation();
                            handleBookmarkToggle();
                        }}
                    >
                        <Bookmark
                            className={cn(
                                "h-4 w-4",
                                bookmarked && "fill-primary text-primary"
                            )}
                        />
                    </Button>
                </div>

                <CardContent className="p-3 space-y-3">
                    {/* User */}
                    <div className="flex items-center gap-2">
                        <Avatar className="h-7 w-7">
                            <AvatarImage src={userProfilePicUrl} />
                            <AvatarFallback>{userDisplayName?.[0] ?? "U"}</AvatarFallback>
                        </Avatar>
                        <div
                            onClick={handleNameClick}
                            className="flex flex-col leading-none"
                        >
              <span className="text-sm font-medium hover:underline">
                {userDisplayName ?? "Anonymous"}
              </span>
                            <span className="text-xs text-muted-foreground">
                {formatDate(createdAt)}
              </span>
                        </div>
                    </div>

                    {/* Description */}
                    {description && (
                        <p className="text-sm text-foreground line-clamp-3">
                            {description}
                        </p>
                    )}

                    {/* Actions */}
                    <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-3">
                            {/* Like */}
                            <button
                                className="flex items-center gap-1 hover:opacity-80"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleLikeToggle();
                                }}
                            >
                                <Heart
                                    className={cn(
                                        "h-4 w-4",
                                        liked && "fill-red-500 text-red-500"
                                    )}
                                />
                                {likesCount ?? 0}
                            </button>

                            {/* Comments */}
                            <div className="flex items-center gap-1 text-muted-foreground">
                                <MessageCircle className="h-4 w-4" />
                                {commentsCount ?? 0}
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Detail Modal */}
            {detailViewOpen && (
                <PostDetailView
                    post={post}
                    open={detailViewOpen}
                    onClose={() => setDetailViewOpen(false)}
                />
            )}
        </>
    );
}
