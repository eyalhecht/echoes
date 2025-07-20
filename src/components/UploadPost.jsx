import React, { useState, useRef } from 'react';
import {
    Box,
    Button,
    TextField,
    Typography,
    Paper,
    IconButton,
    CircularProgress,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Chip,
} from '@mui/material';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import CloseIcon from '@mui/icons-material/Close';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import LocationOnIcon from '@mui/icons-material/LocationOn'; // Import location icon
import {getDownloadURL, ref, uploadBytes} from "firebase/storage";
import {storage, auth, functions} from "../firebaseConfig.js";
import {httpsCallable} from "firebase/functions";
import {GeoPoint} from "firebase/firestore";
import LocationPickerModal from './LocationPickerModal'; // Import the new modal component

const UploadPost = () => {
    const [description, setDescription] = useState('');
    const [type, setType] = useState('photo'); // Default to 'photo'
    const [files, setFiles] = useState([]); // Array to store multiple files
    const [filePreviews, setFilePreviews] = useState([]); // Array for file previews
    const [location, setLocation] = useState(null); // This will now display coordinates
    const [years, setYears] = useState([]); // Array for years
    const [currentYearInput, setCurrentYearInput] = useState(''); // For year input field
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState(null);
    const [isMapModalOpen, setIsMapModalOpen] = useState(false); // State for map modal

    const fileInputRef = useRef(null);
    const handleDescriptionChange = (event) => {
        setDescription(event.target.value);
    };
    const handleTypeChange = (event) => {
        setType(event.target.value);
        setFiles([]);
        setFilePreviews([]);
    };
    const handleYearInputChange = (event) => {
        setCurrentYearInput(event.target.value);
    };
    const handleAddYear = () => {
        const yearValue = parseInt(currentYearInput, 10);
        if (!isNaN(yearValue) && yearValue > 0 && !years.includes(yearValue)) {
            setYears((prevYears) => [...prevYears, yearValue].sort((a, b) => a - b));
            setCurrentYearInput('');
            setError(null);
        } else if (currentYearInput.trim() !== '') {
            setError('Please enter a valid, non-duplicate year.');
        }
    };
    const handleDeleteYear = (yearToDelete) => {
        setYears((prevYears) => prevYears.filter((year) => year !== yearToDelete));
    };
    const handleFileChange = (event) => {
        const newFiles = Array.from(event.target.files);
        if (newFiles.length > 0) {
            // Create new preview URLs and add to existing files
            const newFilePreviews = newFiles.map(file => URL.createObjectURL(file));
            setFiles((prevFiles) => [...prevFiles, ...newFiles]);
            setFilePreviews((prevPreviews) => [...prevPreviews, ...newFilePreviews]);
            setError(null); // Clear any previous errors
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

            // --- Step 1: Handle File Uploads to Firebase Storage ---
            // This applies to 'photo', 'video', 'document', 'item' types
            if (type !== 'youtube' && files.length > 0) {
                const uploadPromises = files.map(async (file) => {
                    // Generate a unique path for each file in Storage
                    const storageRef = ref(storage, `post_media/${auth.currentUser?.uid || 'anonymous'}/${Date.now()}_${file.name}`);
                    const uploadTaskSnapshot = await uploadBytes(storageRef, file);
                    return await getDownloadURL(uploadTaskSnapshot.ref);
                });
                fileUrls = await Promise.all(uploadPromises);
                console.log('Files uploaded to Storage:', fileUrls);
            } else if (type === 'youtube' && files.length > 0) {
                // For 'youtube' type, the 'files' state contains the URL string directly
                fileUrls = files; // Pass the YouTube URL(s) as is
            }

            // --- Step 2: Call the Backendd Cloud Function to create the post ---
            // The payload for the backend function
            const payload = {
                action: 'createPost', // Specify the action for your apiGateway
                payload: {
                    description: description.trim(),
                    type: type,
                    fileUrls: fileUrls, // Array of download URLs from Storage or YouTube URL(s)
                    location: location ? new GeoPoint(location.lat, location.lng) : null,
                    year: years, // Array of years (numbers)
                    // Backend will handle userId, likesCount, commentsCount, bookmarksCount, createdAt, updatedAt
                }
            };

            const response = await  httpsCallable(functions, 'apiGateway')(payload); // Call the backend function

            console.log('Post creation response from backend:', response.data);

            // --- Step 3: Reset Form on Success ---
            setDescription('');
            setType('photo'); // Reset to default type
            setFiles([]);
            setFilePreviews([]);
            setLocation(null);
            setYears([]);
            setCurrentYearInput('');
            // You might want to display a success message to the user, e.g., using a Snackbar
            alert(response.data.message || 'Post uploaded successfully!');

        } catch (err) {
            console.error('Error uploading post:', err);
            // Firebase Cloud Functions HttpsError objects have a 'code' and 'message' property
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
        <Paper
            elevation={3}
            sx={{
                p: 3,
                mb: 3,
                borderRadius: 2,
                maxWidth: 700,
                mx: 'auto', // Center the component
            }}
        >
            <Typography variant="h5" gutterBottom align="center" sx={{ mb: 3 }}>
                Create New Post
            </Typography>

            {/* Description Input */}
            <TextField
                label="Description"
                multiline
                rows={4}
                fullWidth
                variant="outlined"
                value={description}
                onChange={handleDescriptionChange}
                sx={{ mb: 3 }}
                disabled={isUploading}
                placeholder="What would you like to share?"
            />

            <FormControl fullWidth variant="outlined" sx={{ mb: 3 }} disabled={isUploading}>
                <InputLabel id="post-type-label">Post Type</InputLabel>
                <Select
                    labelId="post-type-label"
                    id="post-type-select"
                    value={type}
                    onChange={handleTypeChange}
                    label="Post Type"
                >
                    <MenuItem value="photo">Photo</MenuItem>
                    {/*<MenuItem value="video">Video</MenuItem>*/}
                    {/*<MenuItem value="document">Document</MenuItem>*/}
                    {/*<MenuItem value="item">Item</MenuItem>*/}
                    {/*<MenuItem value="youtube">YouTube Link</MenuItem>*/}
                </Select>
            </FormControl>

            {/* File Upload Section */}
            {type !== 'youtube' && ( // Only show file upload for relevant types
                <Box sx={{ mb: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1, gap: 1 }}>
                        <input
                            // Use appropriate accept attribute based on selected type
                            accept={type === 'photo' ? 'image/*' : type === 'video' ? 'video/*' : '*/*'}
                            style={{ display: 'none' }}
                            id="file-upload-button"
                            type="file"
                            multiple // Allow multiple file selection
                            onChange={handleFileChange}
                            disabled={isUploading}
                            ref={fileInputRef} // Assign the ref
                        />
                        <label htmlFor="file-upload-button">
                            <Button
                                variant="outlined"
                                component="span"
                                startIcon={<PhotoCameraIcon />}
                                disabled={isUploading}
                            >
                                Upload {type === 'photo' ? 'Image(s)' : type === 'video' ? 'Video(s)' : 'File(s)'}
                            </Button>
                        </label>
                        {files.length > 0 && (
                            <Typography variant="body2" color="text.secondary">
                                {files.length} file(s) selected
                            </Typography>
                        )}
                    </Box>
                    {/* File Previews */}
                    {filePreviews.length > 0 && (
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1, border: '1px dashed #ccc', p: 1, borderRadius: 1 }}>
                            {filePreviews.map((previewUrl, index) => (
                                <Box key={index} sx={{ position: 'relative', width: 80, height: 80, overflow: 'hidden', borderRadius: 1 }}>
                                    {type === 'photo' && (
                                        <img
                                            src={previewUrl}
                                            alt={`Preview ${index}`}
                                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                        />
                                    )}
                                    {type === 'video' && (
                                        <video
                                            src={previewUrl}
                                            controls={false} // Don't show controls on small preview
                                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                        />
                                    )}
                                    {/* For document/item, just show an icon or placeholder */}
                                    {(type === 'document' || type === 'item') && (
                                        <Box sx={{
                                            width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            backgroundColor: '#f0f0f0', color: 'text.secondary', fontSize: '1.5rem'
                                        }}>
                                            {type === 'document' ? '📄' : '📦'}
                                        </Box>
                                    )}
                                    <IconButton
                                        onClick={() => handleRemoveFile(index)}
                                        size="small"
                                        sx={{
                                            position: 'absolute',
                                            top: 0,
                                            right: 0,
                                            backgroundColor: 'rgba(255,255,255,0.7)',
                                            '&:hover': { backgroundColor: 'rgba(255,255,255,0.9)' },
                                        }}
                                        disabled={isUploading}
                                    >
                                        <CloseIcon fontSize="small" />
                                    </IconButton>
                                </Box>
                            ))}
                        </Box>
                    )}
                </Box>
            )}

            {/* YouTube Link Input */}
            {type === 'youtube' && (
                <TextField
                    label="YouTube Video URL"
                    fullWidth
                    variant="outlined"
                    value={files[0] || ''} // Assuming one YouTube link
                    onChange={(e) => setFiles([e.target.value])} // Store link in files array
                    sx={{ mb: 3 }}
                    disabled={isUploading}
                    placeholder="e.g., https://www.youtube.com/watch?v=dQw4w9WgXcQ"
                />
            )}

            <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                <IconButton
                    color="primary"
                    onClick={() => {
                        setIsMapModalOpen(true);
                    }}
                    disabled={isUploading}
                    aria-label="select location on map"
                >
                    <LocationOnIcon />
                </IconButton>
            </Box>
            {location && (
                <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                    📍 {location.lat.toFixed(6)}, {location.lng.toFixed(6)}
                </Typography>
            )}

            {/* Year(s) Input and Display */}
            <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle1" gutterBottom>
                    Year(s)
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <TextField
                        label="Add Year"
                        type="number"
                        value={currentYearInput}
                        onChange={handleYearInputChange}
                        onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                                handleAddYear();
                            }
                        }}
                        sx={{ flexGrow: 1 }}
                        disabled={isUploading}
                        placeholder="e.g., 2023"
                    />
                    <IconButton onClick={handleAddYear} color="primary" disabled={isUploading}>
                        <AddCircleOutlineIcon />
                    </IconButton>
                </Box>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {years.map((year, index) => (
                        <Chip
                            key={index}
                            label={year}
                            onDelete={() => handleDeleteYear(year)}
                            disabled={isUploading}
                        />
                    ))}
                </Box>
            </Box>

            {/* Error Message */}
            {error && (
                <Typography color="error" variant="body2" sx={{ mb: 2, textAlign: 'center' }}>
                    {error}
                </Typography>
            )}

            {/* Upload Button */}
            <Button
                variant="contained"
                color="primary"
                fullWidth
                onClick={handleUploadPost}
                disabled={isUploading || (!description.trim() && files.length === 0)}
                sx={{ height: 50, mt: 2 }}
            >
                {isUploading ? <CircularProgress size={24} color="inherit" /> : 'Create Post'}
            </Button>
            <LocationPickerModal
                open={isMapModalOpen}
                onClose={() => {
                    setIsMapModalOpen(false);
                }}
                onSelectLocation={(coords) => {
                    setLocation(coords);
                }}
                initialLocation={{ lat: 40.7128, lng: -74.0060 }} // Pass current selected coordinates to center the map
            />
        </Paper>
    );
};

export default UploadPost;