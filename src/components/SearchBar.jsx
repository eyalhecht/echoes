import React, { useState, useEffect, useRef } from 'react';
import { Search, X } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { callApiGateway } from "../firebaseConfig.js";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile.jsx";
import useUiStore from "../stores/useUiStore.js";

export function SearchBar() {
    const isMobile = useIsMobile();
    
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);
    const searchRef = useRef(null);
    const inputRef = useRef(null);

    const setActiveSidebarItem = useUiStore((state) => state.setActiveSidebarItem);
    const setActiveProfileView = useUiStore((state) => state.setActiveProfileView);
    const [isExpanded, setIsExpanded] = useState(!isMobile);

    useEffect(() => {
        setIsExpanded(!isMobile);
    }, [isMobile]);

    // Debounced search
    useEffect(() => {
        if (query.length < 2) {
            setResults([]);
            setShowDropdown(false);
            return;
        }

        const timeoutId = setTimeout(async () => {
            setIsLoading(true);
            try {
                const response = await callApiGateway({
                    action: 'searchUsers',
                    payload: {
                        query: query.trim(),
                        limit: isMobile ? 5 : 8
                    }
                });
                setResults(response.data.users || []);
                console.log("response", response.data.users);
                setShowDropdown(true);
            } catch (error) {
                console.error('Search failed:', error);
                setResults([]);
                setShowDropdown(false);
            } finally {
                setIsLoading(false);
            }
        }, 300);

        return () => clearTimeout(timeoutId);
    }, [query, isMobile]);

    // Handle click outside
    useEffect(() => {
        function handleClickOutside(event) {
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setShowDropdown(false);
                if (isMobile && !query) {
                    setIsExpanded(false);
                }
            }
        }

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [query, isMobile]);

    // Handle keyboard navigation
    const handleKeyDown = (e) => {
        if (e.key === 'Escape') {
            setShowDropdown(false);
            if (isMobile) {
                setIsExpanded(false);
            }
            setQuery('');
            inputRef.current?.blur();
        }
    };

    const handleUserClick = (user) => {
        setActiveSidebarItem('Profile');
        setActiveProfileView(user.userId);
        setShowDropdown(false);
        if (isMobile) {
            setIsExpanded(false);
        }
        setQuery('');
    };

    const handleSearchIconClick = () => {
        setIsExpanded(true);
        setTimeout(() => {
            inputRef.current?.focus();
        }, 100);
    };

    const handleClearClick = () => {
        setQuery('');
        setResults([]);
        setShowDropdown(false);
        inputRef.current?.focus();
    };

    const getUserInitials = (user) => {
        if (!user?.displayName) return 'U';
        return user.displayName
            .split(' ')
            .map(n => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    return (
        <div className="relative w-full max-w-md" ref={searchRef}>
            <div className={cn(
                "flex items-center transition-all duration-200 ease-in-out",
                isExpanded ? "w-full" : "w-10"
            )}>
                {!isExpanded ? (
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={handleSearchIconClick}
                        className="h-8 w-8"
                    >
                        <Search className="h-4 w-4" />
                    </Button>
                ) : (
                    <div className="relative flex items-center w-full">
                        <Search className="absolute left-3 h-4 w-4 text-muted-foreground" />
                        <Input
                            ref={inputRef}
                            type="text"
                            placeholder="Search..."
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            onKeyDown={handleKeyDown}
                            className="pl-10 pr-10 h-9 w-full"
                            autoComplete="off"
                        />
                        {query && (
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={handleClearClick}
                                className="absolute right-1 h-7 w-7"
                            >
                                <X className="h-3 w-3" />
                            </Button>
                        )}
                    </div>
                )}
            </div>

            {showDropdown && isExpanded && (
                <div className="absolute top-11 left-0 right-0 bg-background border border-border rounded-lg shadow-lg z-50 max-h-80 overflow-y-auto">
                    {isLoading ? (
                        <div className="p-4 text-center text-sm text-muted-foreground">
                            Searching...
                        </div>
                    ) : results.length > 0 ? (
                        <>
                            <div className="p-2 border-b">
                                <span className="text-xs font-medium text-muted-foreground tracking-wider">
                                    People ({results.length})
                                </span>
                            </div>
                            <div className="py-1">
                                {results.map((user) => (
                                    <button
                                        key={user.userId}
                                        onClick={() => handleUserClick(user)}
                                        className="flex items-center gap-3 w-full px-3 py-2 hover:bg-accent hover:text-accent-foreground transition-colors text-left"
                                    >
                                        <Avatar className="h-8 w-8 flex-shrink-0">
                                            <AvatarImage src={user.profilePictureUrl} />
                                            <AvatarFallback className="text-xs">
                                                {getUserInitials(user)}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium truncate">
                                                {user.displayName}
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                {user.followersCount} followers · {user.postsCount} posts
                                            </p>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </>
                    ) : query.length >= 2 ? (
                        <div className="p-4 text-center text-sm text-muted-foreground">
                            No people found for "{query}"
                        </div>
                    ) : null}
                </div>
            )}
        </div>
    );
}