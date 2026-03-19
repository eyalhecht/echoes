import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { getEraColor, getEraLabelForYear } from "@/lib/eraColors";
import { Heart, Bookmark, Calendar } from "lucide-react";
import { formatDistanceToNowStrict, isToday, isYesterday, format } from "date-fns";
import { usePostInteractions } from "../hooks/usePostInteractions";
import SharePost from "./SharePost.jsx";
import { useNavigate, useSearchParams } from "react-router-dom";

function formatDate(firebaseTimestamp) {
    if (!firebaseTimestamp?._seconds) return "";
    const date = new Date(
        firebaseTimestamp._seconds * 1000 +
        firebaseTimestamp._nanoseconds / 1000000
    );
    if (isToday(date)) return formatDistanceToNowStrict(date, { addSuffix: true });
    if (isYesterday(date)) return "Yesterday";
    if (Date.now() - date.getTime() < 7 * 864e5) return format(date, "EEE");
    return format(date, "MMM dd");
}

export default function MapPostCard({ post, isSelected, onCardClick, onCardHover, onCardHoverEnd }) {
    const navigate = useNavigate();
    const [, setSearchParams] = useSearchParams();

    const { liked, bookmarked, handleLikeToggle, handleBookmarkToggle } =
        usePostInteractions(post.id);

    const { userDisplayName, userProfilePicUrl, description, files, userId, createdAt, year, AiMetadata } = post;
    const displayYear = year?.[0] || AiMetadata?.date_estimate;
    const eraLabel = getEraLabelForYear(year?.[0]);
    const eraColors = eraLabel ? getEraColor(eraLabel) : null;

    return (
        <Card
            data-testid="post-card"
            data-selected={isSelected ? "true" : "false"}
            onClick={() => {
                setSearchParams(prev => {
                    const next = new URLSearchParams(prev);
                    next.set('post', post.id);
                    return next;
                });
                onCardClick?.(post);
            }}
            onMouseEnter={() => onCardHover?.(post.id)}
            onMouseLeave={() => onCardHoverEnd?.()}
            className={cn(
                "overflow-hidden border rounded-xl transition hover:shadow-lifted cursor-pointer",
                isSelected && "ring-2 ring-echoes-amber"
            )}
            style={eraColors ? { borderTopColor: eraColors.bg, borderTopWidth: 3 } : {}}
        >
            <div className="relative w-full aspect-[4/3] bg-muted">
                {files?.[0] ? (
                    <img
                        src={files[0]}
                        alt=""
                        className="w-full h-full object-cover"
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
                        onClick={(e) => { e.stopPropagation(); handleLikeToggle(); }}
                    >
                        <Heart className={cn("h-4 w-4", liked ? "fill-echoes-amber text-echoes-amber" : "text-muted-foreground")} />
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="bg-background/80 backdrop-blur-sm rounded-full"
                        onClick={(e) => { e.stopPropagation(); handleBookmarkToggle(); }}
                    >
                        <Bookmark className={cn("h-4 w-4", bookmarked ? "fill-echoes-teal text-echoes-teal" : "text-muted-foreground")} />
                    </Button>
                    <div onClick={(e) => e.stopPropagation()}>
                        <SharePost
                            postId={post.id}
                            className="bg-background/80 backdrop-blur-sm rounded-full h-[36px] w-[36px]"
                        />
                    </div>
                </div>
            </div>

            <CardContent className="p-3 space-y-2">
                <div className="flex items-center gap-2">
                    <Avatar className="h-7 w-7">
                        <AvatarImage src={userProfilePicUrl} />
                        <AvatarFallback>{userDisplayName?.[0] ?? "U"}</AvatarFallback>
                    </Avatar>
                    <div
                        onClick={(e) => { e.stopPropagation(); navigate(`/profile/${userId}`); }}
                        className="flex flex-col leading-none"
                    >
                        <span className="text-sm font-medium hover:underline">
                            {userDisplayName ?? "Anonymous"}
                        </span>
                        <span className="text-xs text-muted-foreground">
                            {formatDate(createdAt)}
                        </span>
                    </div>
                    {displayYear && eraColors && (
                        <span className="ml-auto flex items-center gap-1 text-[11px] font-medium px-1.5 py-0.5 rounded-tight"
                              style={{ background: eraColors.light, color: eraColors.bg, border: `1px solid ${eraColors.border}`, fontFamily: "'Lora', Georgia, serif", fontStyle: 'italic' }}>
                            {displayYear}
                        </span>
                    )}
                </div>

                {description && (
                    <p className="text-sm text-foreground line-clamp-2">{description}</p>
                )}
            </CardContent>
        </Card>
    );
}
