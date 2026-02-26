import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Heart, Bookmark } from "lucide-react";
import { formatDistanceToNowStrict, isToday, isYesterday, format } from "date-fns";
import { usePostInteractions } from "../hooks/usePostInteractions";
import SharePost from "./SharePost.jsx";
import {useNavigate} from "react-router-dom";

export default function MapPostCard({ post, isSelected, onCardClick }) {
    const navigate = useNavigate();
    const [imageHeight, setImageHeight] = useState(280);
    const [imageLoaded, setImageLoaded] = useState(false);

    const {
        liked,
        bookmarked,
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
        height = Math.max(200, Math.min(height, 350));
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
                    window.history.pushState({}, '', `?post=${post.id}`);
                    onCardClick?.(post);
                }}
                className={cn(
                    "overflow-hidden border rounded-xl transition hover:shadow-md cursor-pointer",
                    isSelected && "ring-4 ring-primary"
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

                    <div className="absolute top-2 right-2 flex gap-2">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="bg-background/80 backdrop-blur-sm rounded-full"
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
                        </Button>
                        
                        <Button
                            variant="ghost"
                            size="icon"
                            className="bg-background/80 backdrop-blur-sm rounded-full"
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
                        <div onClick={(e) => e.stopPropagation()}>
                            <SharePost 
                                postId={post.id} 
                                className="bg-background/80 backdrop-blur-sm rounded-full h-[36px] w-[36px]"
                            />
                        </div>
                    </div>
                </div>

                <CardContent className="p-3 space-y-3">
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
                </CardContent>
            </Card>
        </>
    );
}
