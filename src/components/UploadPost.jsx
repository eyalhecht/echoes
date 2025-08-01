import React, { useState, useRef, useMemo } from 'react';
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
import {
    Camera,
    X,
    MapPin,
    Loader2,
    Upload,
} from 'lucide-react';
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage, auth, functions } from "../firebaseConfig.js";
import { httpsCallable } from "firebase/functions";
import { GeoPoint } from "firebase/firestore";
import LocationPickerModal from './LocationPickerModal';

const UploadPost = () => {
    const [description, setDescription] = useState('');
    const [type, setType] = useState('photo');
    const [files, setFiles] = useState([]);
    const [filePreviews, setFilePreviews] = useState([]);
    const [location, setLocation] = useState(null);
    const [selectedYear, setSelectedYear] = useState('');
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState(null);
    const [isMapModalOpen, setIsMapModalOpen] = useState(false);

    const fileInputRef = useRef(null);

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

    const handleDescriptionChange = (event) => {
        setDescription(event.target.value);
    };

    const handleTypeChange = (value) => {
        setType(value);
        setFiles([]);
        setFilePreviews([]);
    };

    const handleYearSelect = (value) => {
        setSelectedYear(value);
        setError(null);
    };

    const handleFileChange = (event) => {
        const newFiles = Array.from(event.target.files);
        if (newFiles.length > 0) {
            const newFilePreviews = newFiles.map(file => URL.createObjectURL(file));
            setFiles((prevFiles) => [...prevFiles, ...newFiles]);
            setFilePreviews((prevPreviews) => [...prevPreviews, ...newFilePreviews]);
            setError(null);
        }
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
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

        setIsUploading(true);
        setError(null);

        try {
            let fileUrls = [];

            if (type !== 'youtube' && files.length > 0) {
                const uploadPromises = files.map(async (file) => {
                    const storageRef = ref(storage, `post_media/${auth.currentUser?.uid || 'anonymous'}/${Date.now()}_${file.name}`);
                    const uploadTaskSnapshot = await uploadBytes(storageRef, file);
                    return await getDownloadURL(uploadTaskSnapshot.ref);
                });
                fileUrls = await Promise.all(uploadPromises);
                console.log('Files uploaded to Storage:', fileUrls);
            } else if (type === 'youtube' && files.length > 0) {
                fileUrls = files;
            }

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

            const response = await httpsCallable(functions, 'apiGateway')(payload);

            console.log('Post creation response from backend:', response.data);

            // Reset form
            setDescription('');
            setType('photo');
            setFiles([]);
            setFilePreviews([]);
            setLocation(null);
            setSelectedYear('');
            alert(response.data.message || 'Post uploaded successfully!');

        } catch (err) {
            console.error('Error uploading post:', err);
            let errorMessage = 'Failed to upload post. Please try again.';
            if (err.code && err.message) {
                errorMessage = `Error (${err.code}): ${err.message}`;
            } else if (err.message) {
                errorMessage = err.message;
            }
            setError(errorMessage);
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto">
            <Card className="shadow-lg bg-sidebar">
                <CardHeader className="text-center pb-6">
                    <h1 className="text-2xl font-bold">Create New Post</h1>
                </CardHeader>

                <CardContent className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                            id="description"
                            placeholder="Describe your post..."
                            value={description}
                            onChange={handleDescriptionChange}
                            disabled={isUploading}
                            className="min-h-[100px] resize-none"
                        />
                    </div>

                    {/* Post Type Select */}
                    <div className="space-y-2">
                        <Label htmlFor="post-type">Post Type</Label>
                        <Select value={type} onValueChange={handleTypeChange} disabled={isUploading}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select post type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="photo">Photo</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* File Upload Section */}
                    {type !== 'youtube' && (
                        <div className="space-y-4">
                            <div className="flex items-center gap-4">
                                <input
                                    accept={type === 'photo' ? 'image/*' : type === 'video' ? 'video/*' : '*/*'}
                                    className="hidden"
                                    id="file-upload"
                                    type="file"
                                    multiple
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
                                            Upload {type === 'photo' ? 'Image(s)' : 'File(s)'}
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
                                                {type === 'photo' && (
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
                                                {(type === 'document' || type === 'item') && (
                                                    <div className="w-full h-full flex items-center justify-center bg-muted text-2xl">
                                                        {type === 'document' ? '📄' : '📦'}
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

                    {/* YouTube Link Input */}
                    {type === 'youtube' && (
                        <div className="space-y-2">
                            <Label htmlFor="youtube-url">YouTube Video URL</Label>
                            <Input
                                id="youtube-url"
                                placeholder="e.g., https://www.youtube.com/watch?v=dQw4w9WgXcQ"
                                value={files[0] || ''}
                                onChange={(e) => setFiles([e.target.value])}
                                disabled={isUploading}
                            />
                        </div>
                    )}

                    {/* Location Section */}
                    <div className="space-y-3">
                        <div className="flex items-center gap-3">
                            <Button
                                variant="outline"
                                onClick={() => setIsMapModalOpen(true)}
                                disabled={isUploading}
                                className="flex-shrink-0"
                            >
                                <MapPin className="h-4 w-4 mr-2" />
                                {location ? 'Change' : 'Select'} Location
                            </Button>
                        </div>

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
                                <span className="text-xs text-muted-foreground">Location selected</span>
                            </div>
                        )}

                        {!location && (
                            <p className="text-sm text-muted-foreground">
                                Optional: Select where this post is about
                            </p>
                        )}
                    </div>

                    {/* Year Selection */}
                    <div className="space-y-2">
                        <Label htmlFor="year-select">Year (Optional)</Label>
                        <Select value={selectedYear} onValueChange={handleYearSelect} disabled={isUploading}>
                            <SelectTrigger>
                                <SelectValue placeholder={`Select year (1900 - ${new Date().getFullYear() - 5})`} />
                            </SelectTrigger>
                            <SelectContent className="max-h-60">
                                {yearOptions.map((year) => (
                                    <SelectItem key={year} value={year.toString()}>
                                        {year}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        {!selectedYear && (
                            <p className="text-sm text-muted-foreground">
                                Select the year when this photo was taken (optional)
                            </p>
                        )}

                        {selectedYear && (
                            <p className="text-sm text-primary font-medium">
                                Selected year: {selectedYear}
                            </p>
                        )}
                    </div>

                    {/* Error Message */}
                    {error && (
                        <Alert variant="destructive">
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}

                    {/* Upload Button */}
                    <Button
                        onClick={handleUploadPost}
                        disabled={isUploading || (!description.trim() && files.length === 0)}
                        className="w-full h-12 text-base font-semibold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-200"
                    >
                        {isUploading ? (
                            <>
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                Uploading...
                            </>
                        ) : (
                            <>
                                <Upload className="h-4 w-4 mr-2" />
                                Create Post
                            </>
                        )}
                    </Button>
                </CardContent>
            </Card>

            <LocationPickerModal
                open={isMapModalOpen}
                onClose={() => setIsMapModalOpen(false)}
                onSelectLocation={(coords) => setLocation(coords)}
                initialLocation={{ lat: 40.7128, lng: -74.0060 }}
            />
        </div>
    );
};

export default UploadPost;