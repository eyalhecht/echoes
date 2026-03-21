import React, { useState, useEffect, useRef } from 'react';
import { Search, X } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { callApiGateway } from "../firebaseConfig.js";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile.jsx";
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { useAuthStore } from '../stores/useAuthStore.js';
import useUiStore from '../stores/useUiStore.js';

export function SearchBar() {
    const navigate = useNavigate();
    const location = useLocation();
    const isMobile = useIsMobile();
    const { isAuthenticated } = useAuthStore();
    const [searchParams, setSearchParams] = useSearchParams();
    const isOnExplorePage = location.pathname === '/explore';

    const [inputValue, setInputValue] = useState(
        () => isOnExplorePage ? (searchParams.get('q') ?? '') : ''
    );
    const [results, setResults] = useState({ users: [] });
    const [isLoading, setIsLoading] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);
    const [isExpanded, setIsExpanded] = useState(!isMobile);
    const searchRef = useRef(null);
    const inputRef = useRef(null);

    // Sync input value when navigating to/from explore
    useEffect(() => {
        if (isOnExplorePage) {
            const urlQuery = searchParams.get('q') ?? '';
            setInputValue(prev => prev !== urlQuery ? urlQuery : prev);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [location.pathname]);

    useEffect(() => {
        setIsExpanded(!isMobile);
    }, [isMobile]);

    // Debounced URL update when typing on explore page
    useEffect(() => {
        if (!isOnExplorePage || !isAuthenticated) return;
        const timer = setTimeout(() => {
            setSearchParams(prev => {
                const currentQ = prev.get('q') ?? '';
                const newQ = inputValue.trim();
                if (currentQ === newQ) return prev;
                const next = new URLSearchParams(prev);
                if (newQ) next.set('q', newQ);
                else next.delete('q');
                return next;
            }, { replace: true });
        }, 300);
        return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [inputValue, isOnExplorePage]);

    // Debounced user search for dropdown (any page)
    useEffect(() => {
        if (!isAuthenticated || inputValue.length < 2) {
            setResults({ users: [] });
            setShowDropdown(false);
            return;
        }

        const timeoutId = setTimeout(async () => {
            setIsLoading(true);
            try {
                const usersResponse = await callApiGateway({
                    action: 'searchUsers',
                    payload: { query: inputValue.trim(), limit: isMobile ? 5 : 8 }
                });
                setResults({ users: usersResponse.data.users || [] });
                setShowDropdown(true);
            } catch (error) {
                console.error('Search failed:', error);
                setResults({ users: [] });
                setShowDropdown(false);
            } finally {
                setIsLoading(false);
            }
        }, 300);

        return () => clearTimeout(timeoutId);
    }, [inputValue, isMobile]);

    // Close dropdown on outside click
    useEffect(() => {
        function handleClickOutside(event) {
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setShowDropdown(false);
                if (isMobile && !inputValue) setIsExpanded(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [inputValue, isMobile]);

    const handleKeyDown = (e) => {
        if (e.key === 'Escape') {
            setShowDropdown(false);
            if (isMobile) setIsExpanded(false);
            setInputValue('');
            inputRef.current?.blur();
        } else if (e.key === 'Enter' && inputValue.trim().length > 0) {
            e.preventDefault();
            navigateToExplore();
        }
    };

    const navigateToExplore = () => {
        if (!isAuthenticated) { useUiStore.getState().showAuthGate('Sign in to search Echoes and discover historical photos, stories, and people.'); return; }
        setShowDropdown(false);
        if (isMobile) setIsExpanded(false);
        if (!isOnExplorePage) {
            navigate(`/explore?q=${encodeURIComponent(inputValue.trim())}`);
        }
        // If already on explore, URL is already updated by the debounced effect
    };

    const handleUserClick = (user) => {
        navigate(`/profile/${user.userId}`);
        setShowDropdown(false);
        if (isMobile) setIsExpanded(false);
        if (!isOnExplorePage) setInputValue('');
    };

    const handleClearClick = () => {
        setInputValue('');
        setResults({ users: [] });
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
                        onClick={() => {
                            setIsExpanded(true);
                            setTimeout(() => inputRef.current?.focus(), 100);
                        }}
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
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyDown={handleKeyDown}
                            className="pl-10 pr-10 h-9 w-full"
                            autoComplete="off"
                        />
                        {inputValue && (
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
                <div className="absolute top-11 left-0 right-0 bg-background border rounded-lg shadow-lg z-50 max-h-80 overflow-y-auto">
                    {isLoading ? (
                        <div className="p-4 text-center text-sm text-muted-foreground">
                            Searching...
                        </div>
                    ) : results.users?.length > 0 ? (
                        <>
                            {/* Search posts — primary action at top */}
                            <button
                                onClick={navigateToExplore}
                                className="flex items-center gap-3 w-full px-3 py-2.5 hover:bg-accent hover:text-accent-foreground transition-colors text-left border-b"
                            >
                                <div className="h-8 w-8 flex-shrink-0 flex items-center justify-center bg-primary/10 rounded">
                                    <Search className="h-4 w-4 text-primary" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium">
                                        Search posts for &ldquo;{inputValue.trim()}&rdquo;
                                    </p>
                                    <p className="text-xs text-muted-foreground">Photos, stories, and more</p>
                                </div>
                            </button>

                            <div className="p-2 border-b">
                                <span className="text-xs font-medium text-muted-foreground tracking-wider">
                                    People ({results.users.length})
                                </span>
                            </div>
                            <div className="py-1">
                                {results.users.map((user) => (
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
                                            <p className="text-sm font-medium truncate">{user.displayName}</p>
                                            <p className="text-xs text-muted-foreground">
                                                {user.followersCount} followers · {user.postsCount} posts
                                            </p>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </>
                    ) : inputValue.length >= 2 ? (
                        <div className="p-4 text-center">
                            <p className="text-sm text-muted-foreground mb-3">
                                No people found for &ldquo;{inputValue}&rdquo;
                            </p>
                            <button
                                onClick={navigateToExplore}
                                className="flex items-center gap-2 mx-auto px-3 py-2 hover:bg-accent hover:text-accent-foreground transition-colors rounded-md"
                            >
                                <Search className="h-4 w-4" />
                                <span className="text-sm">Search posts instead</span>
                            </button>
                        </div>
                    ) : null}
                </div>
            )}
        </div>
    );
}
