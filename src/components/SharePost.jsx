import React, { useState } from 'react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { 
    Share2, 
    Copy, 
    Check,
    MessageCircle,
    Send,
    Facebook,
    Twitter,
    Linkedin
} from 'lucide-react';

function SharePost({ postId, className = "" }) {
    const [copied, setCopied] = useState(false);
    
    const postUrl = `${window.location.origin}/post/${postId}`;
    
    const handleCopyUrl = async () => {
        try {
            await navigator.clipboard.writeText(postUrl);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy URL:', err);
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = postUrl;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    const shareToWhatsApp = () => {
        const message = encodeURIComponent(`Check out this post: ${postUrl}`);
        window.open(`https://wa.me/?text=${message}`, '_blank');
    };

    const shareToTelegram = () => {
        const message = encodeURIComponent(`Check out this post: ${postUrl}`);
        window.open(`https://t.me/share/url?url=${encodeURIComponent(postUrl)}&text=${message}`, '_blank');
    };

    const shareToFacebook = () => {
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(postUrl)}`, '_blank');
    };

    const shareToTwitter = () => {
        const text = encodeURIComponent('Check out this post!');
        window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(postUrl)}&text=${text}`, '_blank');
    };

    const shareToLinkedIn = () => {
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(postUrl)}`, '_blank');
    };

    const handleNativeShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: 'Check out this post!',
                    url: postUrl,
                });
            } catch (err) {
                console.log('Native sharing cancelled or failed:', err);
            }
        }
    };

    return (
        <DropdownMenu>
            <Tooltip>
                <TooltipTrigger asChild>
                    <DropdownMenuTrigger asChild>
                        <Button
                            variant="ghost"
                            size="icon"
                            className={`h-4 w-4 ${className}`}
                        >
                            <Share2 className="h-5 w-5" />
                        </Button>
                    </DropdownMenuTrigger>
                </TooltipTrigger>
                <TooltipContent>
                    <p>Share post</p>
                </TooltipContent>
            </Tooltip>

            <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onClick={handleCopyUrl} className="cursor-pointer">
                    {copied ? (
                        <>
                            <Check className="h-4 w-4 mr-2 text-green-600" />
                            <span className="text-green-600">Copied!</span>
                        </>
                    ) : (
                        <>
                            <Copy className="h-4 w-4 mr-2" />
                            Copy link
                        </>
                    )}
                </DropdownMenuItem>
                {navigator.share && (
                    <>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={handleNativeShare} className="cursor-pointer">
                            <Share2 className="h-4 w-4 mr-2" />
                            Share...
                        </DropdownMenuItem>
                    </>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={shareToWhatsApp} className="cursor-pointer">
                    <MessageCircle className="h-4 w-4 mr-2 text-green-600" />
                    WhatsApp
                </DropdownMenuItem>
                <DropdownMenuItem onClick={shareToFacebook} className="cursor-pointer">
                    <Facebook className="h-4 w-4 mr-2 text-blue-600" />
                    Facebook
                </DropdownMenuItem>
                <DropdownMenuItem onClick={shareToTwitter} className="cursor-pointer">
                    <Twitter className="h-4 w-4 mr-2 text-blue-400" />
                    Twitter
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

export default SharePost;