import React, { useState, useRef, useMemo, useEffect } from 'react';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import {
    Camera,
    X,
    MapPin,
    Upload,
    Image,
    Calendar,
    FileText,
    Package,
    Video,
    Youtube,
    CheckCircle,
} from 'lucide-react';
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage, auth, functions, db } from "../firebaseConfig.js";
import { httpsCallable } from "firebase/functions";
import { GeoPoint, doc, onSnapshot } from "firebase/firestore";
import LocationPickerModal from './LocationPickerModal';
import Professor from './Professor.jsx';
import {useNavigate} from "react-router-dom";

const UploadPost = () => {
    const navigate = useNavigate()
    const { toast } = useToast();
    const [currentStep, setCurrentStep] = useState(1);
    const [justCompletedStep, setJustCompletedStep] = useState(null);

    // Refs for scrolling
    const stepRefs = useRef({});
    const containerRef = useRef(null);

    // Form state
    const [type, setType] = useState('');
    const [files, setFiles] = useState([]);
    const [filePreviews, setFilePreviews] = useState([]);
    const [description, setDescription] = useState('');
    const [location, setLocation] = useState(null);
    const [selectedYear, setSelectedYear] = useState('');
    const [error, setError] = useState(null);
    const [isMapModalOpen, setIsMapModalOpen] = useState(false);

    // Upload + analysis state machine
    // phase: null (form) | 'uploading' | 'processing' | 'analyzing' | 'complete'
    const [uploadPhase, setUploadPhase] = useState(null);
    const [uploadMessage, setUploadMessage] = useState('');
    const [analyzingPostId, setAnalyzingPostId] = useState(null);

    // Derived — keeps all disabled={isUploading} props in the form working
    const isUploading = !!uploadPhase;

    const fileInputRef = useRef(null);

    useEffect(() => {
        if (!analyzingPostId) return;

        const unsubscribe = onSnapshot(doc(db, 'posts', analyzingPostId), (snapshot) => {
            if (!snapshot.exists()) return;
            const data = snapshot.data();

            if (data.aiStatus) {
                setUploadMessage(data.aiStatus);
            }

            if (!data.aiStatus && data.AiMetadata) {
                setUploadMessage("Fascinating! The Professor has completed his analysis.");
                setUploadPhase('complete');
                setTimeout(() => navigate('/home'), 2500);
            }
        });

        return () => unsubscribe();
    }, [analyzingPostId]); // eslint-disable-line react-hooks/exhaustive-deps

    const postTypes = [
        {
            id: 'photo',
            label: 'Photo',
            icon: Image,
            description: 'Share a photo or image',
            accept: 'image/*'
        },
        // {
        //     id: 'video',
        //     label: 'Video',
        //     icon: Video,
        //     description: 'Upload a video file',
        //     accept: 'video/*'
        // },
        // {
        //     id: 'document',
        //     label: 'Document',
        //     icon: FileText,
        //     description: 'Share a document',
        //     accept: '.pdf,.doc,.docx,.txt'
        // },
        // {
        //     id: 'item',
        //     label: 'Item',
        //     icon: Package,
        //     description: 'Share an item or object',
        //     accept: 'image/*'
        // },
        // {
        //     id: 'youtube',
        //     label: 'YouTube',
        //     icon: Youtube,
        //     description: 'Share a YouTube video',
        //     accept: null
        // }
    ];

    const yearOptions = useMemo(() => {
        const currentYear = new Date().getFullYear();
        const maxYear = currentYear - 5;
        const minYear = 1900;
        const years = [];
        for (let year = maxYear; year >= minYear; year--) {
            years.push(year);
        }
        return years;
    }, []);

    const selectedTypeData = postTypes.find(t => t.id === type);

    // Smooth scroll to step with highlight effect
    const scrollToStep = (stepNumber) => {
        setTimeout(() => {
            const stepElement = stepRefs.current[stepNumber];
            if (stepElement) {
                stepElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start',
                    inline: 'nearest'
                });

                // Add highlight effect
                setJustCompletedStep(stepNumber);
                setTimeout(() => setJustCompletedStep(null), 3000);
            }
        }, 100);
    };

    // Focus management for better UX
    const focusStepInput = (stepNumber) => {
        setTimeout(() => {
            const stepElement = stepRefs.current[stepNumber];
            if (stepElement) {
                const input = stepElement.querySelector('input, textarea, button[type="button"]');
                if (input && input.focus) {
                    input.focus();
                }
            }
        }, 300);
    };

    const handleTypeSelect = (typeId) => {
        setType(typeId);
        setFiles([]);
        setFilePreviews([]);
        setError(null);
        if (typeId) {
            setCurrentStep(2);
            scrollToStep(2);
            focusStepInput(2);
        }
    };

    const handleFileChange = (event) => {
        const newFiles = Array.from(event.target.files);
        if (newFiles.length > 0) {
            const newFilePreviews = newFiles.map(file => URL.createObjectURL(file));
            setFiles((prevFiles) => [...prevFiles, ...newFiles]);
            setFilePreviews((prevPreviews) => [...prevPreviews, ...newFilePreviews]);
            setError(null);
            setCurrentStep(3);
            scrollToStep(3);
            focusStepInput(3);
        }
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleYouTubeUrlChange = (url) => {
        setFiles([url]);
        setError(null);
        if (url.trim()) {
            setCurrentStep(3);
            scrollToStep(3);
            focusStepInput(3);
        }
    };

    const handleRemoveFile = (indexToRemove) => {
        setFiles((prevFiles) => prevFiles.filter((_, index) => index !== indexToRemove));
        setFilePreviews((prevPreviews) => {
            const removedPreviewUrl = prevPreviews[indexToRemove];
            if (removedPreviewUrl) {
                URL.revokeObjectURL(removedPreviewUrl);
            }
            return prevPreviews.filter((_, index) => index !== indexToRemove);
        });
    };

    const handleDescriptionChange = (event) => {
        setDescription(event.target.value);
        if (event.target.value.trim() && currentStep === 3) {
            setCurrentStep(4);
            scrollToStep(4);
        }
    };

    const handleUploadPost = async () => {
        if (!description.trim() && files.length === 0 && type !== 'youtube') {
            setError('Please enter a description or select at least one file to post.');
            return;
        }
        if (type === 'youtube' && (files.length === 0 || !files[0].trim())) {
            setError('Please enter a YouTube video URL.');
            return;
        }
        if (type !== 'youtube' && files.length === 0) {
            setError('At least one file is required for this post type.');
            return;
        }

        // Immediately hand off to the Professor — form disappears right now
        setError(null);
        setUploadPhase('uploading');
        setUploadMessage('Preparing your files for the archive...');

        try {
            let fileUrls = [];

            if (type !== 'youtube' && files.length > 0) {
                const uploadPromises = files.map(async (file) => {
                    const storageRef = ref(storage, `post_media/${auth.currentUser?.uid || 'anonymous'}/${Date.now()}_${file.name}`);
                    const uploadTaskSnapshot = await uploadBytes(storageRef, file);
                    return await getDownloadURL(uploadTaskSnapshot.ref);
                });
                fileUrls = await Promise.all(uploadPromises);
            } else if (type === 'youtube' && files.length > 0) {
                fileUrls = files;
            }

            setUploadPhase('processing');
            setUploadMessage('Registering your echo in the archive...');

            const payload = {
                action: 'createPost',
                payload: {
                    description: description.trim(),
                    type: type,
                    fileUrls: fileUrls,
                    location: location ? new GeoPoint(location.lat, location.lng) : null,
                    year: selectedYear ? [parseInt(selectedYear)] : [],
                }
            };

            const result = await httpsCallable(functions, 'api')(payload);

            const postId = result?.data?.postId;
            if (postId) {
                setAnalyzingPostId(postId);
                setUploadPhase('analyzing');
                setUploadMessage('The Professor is examining your image...');
            } else {
                // Fallback: backend didn't return a postId, navigate directly
                setUploadPhase('complete');
                setUploadMessage('Your echo has been archived!');
                setTimeout(() => navigate('/home'), 2000);
            }
        } catch (err) {
            console.error('Error uploading post:', err);
            let errorMessage = 'Failed to upload post. Please try again.';
            if (err.code && err.message) {
                errorMessage = `Error (${err.code}): ${err.message}`;
            } else if (err.message) {
                errorMessage = err.message;
            }

            // Return to form with error
            setUploadPhase(null);
            setUploadMessage('');
            setError(errorMessage);

            toast({
                title: "Upload failed",
                description: errorMessage,
                variant: "destructive",
                duration: 7000,
            });
        }
    };

    const canProceedToUpload = () => {
        if (uploadPhase) return false;
        if (type === 'youtube') {
            return files.length > 0 && files[0].trim() && description.trim();
        }
        return files.length > 0 && description.trim();
    };

    return (
        <div className="max-w-2xl mx-auto" ref={containerRef}>
            <Card className="shadow-lg bg-sidebar">
                {uploadPhase ? (
                    /* ── Professor analysis view ── */
                    <CardContent className="py-16 flex flex-col items-center justify-center gap-7">
                        <div className="relative">
                            <Professor size={96} />
                            {uploadPhase !== 'complete' && (
                                <span className="absolute -bottom-1 -right-1 flex h-4 w-4">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
                                    <span className="relative inline-flex rounded-full h-4 w-4 bg-amber-500" />
                                </span>
                            )}
                        </div>

                        <div className="text-center max-w-sm px-4">
                            <span className="text-[10px] font-mono tracking-widest text-amber-700 dark:text-amber-500 uppercase block mb-3">
                                {uploadPhase === 'complete' ? 'Analysis Complete' : 'Archiving Your Echo'}
                            </span>
                            <p className="text-sm text-muted-foreground italic leading-relaxed">
                                {uploadMessage}
                            </p>
                        </div>

                        {uploadPhase === 'complete' ? (
                            <CheckCircle className="h-7 w-7 text-green-500" />
                        ) : (
                            <div className="flex gap-1.5">
                                <span className="inline-block w-2 h-2 rounded-full bg-amber-500 animate-bounce" style={{ animationDelay: '0ms' }} />
                                <span className="inline-block w-2 h-2 rounded-full bg-amber-500 animate-bounce" style={{ animationDelay: '160ms' }} />
                                <span className="inline-block w-2 h-2 rounded-full bg-amber-500 animate-bounce" style={{ animationDelay: '320ms' }} />
                            </div>
                        )}
                    </CardContent>
                ) : (
                <>
                <CardHeader className="text-center pb-6">
                    <h1 className="text-2xl font-bold">Create New Post</h1>
                    <div className="flex justify-center mt-4">
                        <div className="flex items-center space-x-2">
                            {[1, 2, 3, 4].map((step) => (
                                <div key={step} className="flex items-center">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                                        currentStep >= step
                                            ? 'bg-primary text-primary-foreground'
                                            : 'bg-muted text-muted-foreground'
                                    }`}>
                                        {step}
                                    </div>
                                    {step < 4 && (
                                        <div className={`w-8 h-0.5 mx-1 ${
                                            currentStep > step ? 'bg-primary' : 'bg-muted'
                                        }`} />
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="space-y-6">
                    {/* Step 1: Post Type Selection */}
                    {currentStep >= 1 && (
                        <div
                            ref={el => stepRefs.current[1] = el}
                            className={`space-y-4 transition-all duration-500 ${
                                justCompletedStep === 1 ? 'ring-2 ring-primary/50 rounded-lg p-4 -m-4' : ''
                            }`}
                        >
                            <div className="flex items-center gap-2">
                                <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">1</div>
                                <Label className="text-lg font-semibold">What are you sharing?</Label>
                                <Badge variant="secondary">Required</Badge>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {postTypes.map((postType) => (
                                    <Card
                                        key={postType.id}
                                        className={`cursor-pointer transition-all hover:shadow-md ${
                                            type === postType.id
                                                ? 'ring-2 ring-primary bg-primary/5'
                                                : 'hover:bg-accent'
                                        }`}
                                        onClick={() => handleTypeSelect(postType.id)}
                                    >
                                        <CardContent className="p-4 flex items-center space-x-3">
                                            <postType.icon className={`h-8 w-8 ${
                                                type === postType.id ? 'text-primary' : 'text-muted-foreground'
                                            }`} />
                                            <div>
                                                <h3 className="font-medium">{postType.label}</h3>
                                                <p className="text-sm text-muted-foreground">{postType.description}</p>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Step 2: File Upload */}
                    {currentStep >= 2 && type && (
                        <div
                            ref={el => stepRefs.current[2] = el}
                            className={`space-y-4 transition-all duration-500 animate-in slide-in-from-top-4 ${
                                justCompletedStep === 2 ? 'ring-2 ring-primary/50 rounded-lg p-4 -m-4' : ''
                            }`}
                        >
                            <div className="flex items-center gap-2">
                                <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">2</div>
                                <Label className="text-lg font-semibold">
                                    {type === 'youtube' ? 'Enter YouTube URL' : `Upload ${selectedTypeData?.label}`}
                                </Label>
                                <Badge variant="secondary">Required</Badge>
                            </div>

                            {type === 'youtube' ? (
                                <div className="space-y-2">
                                    <Input
                                        placeholder="e.g., https://www.youtube.com/watch?v=dQw4w9WgXcQ"
                                        value={files[0] || ''}
                                        onChange={(e) => handleYouTubeUrlChange(e.target.value)}
                                        disabled={isUploading}
                                    />
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    <div className="flex items-center gap-4">
                                        <input
                                            accept={selectedTypeData?.accept}
                                            className="hidden"
                                            id="file-upload"
                                            type="file"
                                            onChange={handleFileChange}
                                            disabled={isUploading}
                                            ref={fileInputRef}
                                        />
                                        <Label htmlFor="file-upload">
                                            <Button
                                                variant="outline"
                                                className="cursor-pointer border-2 border-dashed border-primary bg-primary/5 hover:bg-primary/10"
                                                asChild
                                            >
                                                <span>
                                                    <Camera className="h-4 w-4 mr-2" />
                                                    Choose {selectedTypeData?.label}
                                                </span>
                                            </Button>
                                        </Label>
                                        {files.length > 0 && (
                                            <span className="text-sm text-muted-foreground">
                                                {files.length} file(s) selected
                                            </span>
                                        )}
                                    </div>

                                    {/* File Previews */}
                                    {filePreviews.length > 0 && (
                                        <div className="flex flex-wrap gap-3 p-4 bg-muted/30 rounded-lg">
                                            {filePreviews.map((previewUrl, index) => (
                                                <div key={index} className="relative group">
                                                    <div className="w-20 h-20 rounded-lg overflow-hidden shadow-md group-hover:shadow-lg transition-shadow">
                                                        {(type === 'photo' || type === 'item') && (
                                                            <img
                                                                src={previewUrl}
                                                                alt={`Preview ${index}`}
                                                                className="w-full h-full object-cover"
                                                            />
                                                        )}
                                                        {type === 'video' && (
                                                            <video
                                                                src={previewUrl}
                                                                className="w-full h-full object-cover"
                                                            />
                                                        )}
                                                        {type === 'document' && (
                                                            <div className="w-full h-full flex items-center justify-center bg-muted text-2xl">
                                                                📄
                                                            </div>
                                                        )}
                                                    </div>
                                                    <Button
                                                        variant="destructive"
                                                        size="icon"
                                                        className="absolute -top-2 -right-2 h-6 w-6 rounded-full"
                                                        onClick={() => handleRemoveFile(index)}
                                                        disabled={isUploading}
                                                    >
                                                        <X className="h-3 w-3" />
                                                    </Button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    )}

                    {/* Step 3: Description */}
                    {currentStep >= 3 && files.length > 0 && (
                        <div
                            ref={el => stepRefs.current[3] = el}
                            className={`space-y-4 transition-all duration-500 animate-in slide-in-from-top-4 ${
                                justCompletedStep === 3 ? 'ring-2 ring-primary/50 rounded-lg p-4 -m-4' : ''
                            }`}
                        >
                            <div className="flex items-center gap-2">
                                <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">3</div>
                                <Label htmlFor="description" className="text-lg font-semibold">Tell your story</Label>
                                <Badge variant="secondary">Required</Badge>
                            </div>
                            <Textarea
                                id="description"
                                placeholder="What's the story behind this post? Share the memories, context, or significance..."
                                value={description}
                                onChange={handleDescriptionChange}
                                disabled={isUploading}
                                className="min-h-[120px] resize-none"
                            />
                        </div>
                    )}

                    {/* Step 4: Context (Year & Location) */}
                    {currentStep >= 4 && description.trim() && (
                        <div
                            ref={el => stepRefs.current[4] = el}
                            className={`space-y-4 transition-all duration-500 animate-in slide-in-from-top-4 ${
                                justCompletedStep === 4 ? 'ring-2 ring-primary/50 rounded-lg p-4 -m-4' : ''
                            }`}
                        >
                            <div className="flex items-center gap-2">
                                <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">4</div>
                                <Label className="text-lg font-semibold">Add Context</Label>
                                <Badge variant="outline">Optional</Badge>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Year Selection */}


                                {/* Location Selection */}
                                <div className="space-y-3">
                                    <div className="flex items-center gap-2">
                                        <MapPin className="h-4 w-4 text-muted-foreground" />
                                        <Label>Where was this taken?</Label>
                                    </div>
                                    <div className="space-y-2">
                                        <Button
                                            variant="outline"
                                            onClick={() => setIsMapModalOpen(true)}
                                            disabled={isUploading}
                                            className="w-full justify-start"
                                        >
                                            <MapPin className="h-4 w-4 mr-2" />
                                            {location ? 'Change Location' : 'Select Location'}
                                        </Button>

                                        {location && (
                                            <div className="flex items-center gap-2">
                                                <Badge variant="secondary" className="gap-1">
                                                    <MapPin className="h-3 w-3" />
                                                    {location.lat.toFixed(4)}, {location.lng.toFixed(4)}
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-4 w-4 ml-1 hover:bg-destructive hover:text-destructive-foreground"
                                                        onClick={() => setLocation(null)}
                                                        disabled={isUploading}
                                                    >
                                                        <X className="h-2 w-2" />
                                                    </Button>
                                                </Badge>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <div className="flex items-center gap-2">
                                        <Calendar className="h-4 w-4 text-muted-foreground" />
                                        <Label htmlFor="year-select">When was this taken?</Label>
                                    </div>
                                    <Select value={selectedYear} onValueChange={setSelectedYear} disabled={isUploading}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select year" />
                                        </SelectTrigger>
                                        <SelectContent className="max-h-60">
                                            {yearOptions.map((year) => (
                                                <SelectItem key={year} value={year.toString()}>
                                                    {year}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Error Message */}
                    {error && (
                        <Alert variant="destructive">
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}

                    {/* Upload Button */}
                    {currentStep >= 3 && (
                        <div className="pt-4 animate-in slide-in-from-bottom-4 duration-500">
                            <Button
                                onClick={handleUploadPost}
                                disabled={!canProceedToUpload()}
                                className="w-full h-12 text-base font-semibold"
                            >
                                <Upload className="h-4 w-4 mr-2" />
                                Create Post
                            </Button>
                        </div>
                    )}
                </CardContent>
                </>
                )}
            </Card>

            <LocationPickerModal
                open={isMapModalOpen}
                onClose={() => setIsMapModalOpen(false)}
                onSelectLocation={(coords) => setLocation(coords)}
            />
        </div>
    );
};

export default UploadPost;