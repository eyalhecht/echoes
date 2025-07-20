import React, { useState, useRef, useMemo } from 'react';
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
    Autocomplete,
    Chip,
} from '@mui/material';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import CloseIcon from '@mui/icons-material/Close';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import {getDownloadURL, ref, uploadBytes} from "firebase/storage";
import {storage, auth, functions} from "../firebaseConfig.js";
import {httpsCallable} from "firebase/functions";
import {GeoPoint} from "firebase/firestore";
import LocationPickerModal from './LocationPickerModal';

const UploadPost = () => {
    const [description, setDescription] = useState('');
    const [type, setType] = useState('photo'); // Default to 'photo'
    const [files, setFiles] = useState([]); // Array to store multiple files
    const [filePreviews, setFilePreviews] = useState([]); // Array for file previews
    const [location, setLocation] = useState(null); // This will now display coordinates
    const [selectedYear, setSelectedYear] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState(null);
    const [isMapModalOpen, setIsMapModalOpen] = useState(false); // State for map modal

    const fileInputRef = useRef(null);

    const yearOptions = useMemo(() => {
        const currentYear = new Date().getFullYear();
        const maxYear = currentYear - 5; // 5 years before current year
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
    const handleTypeChange = (event) => {
        setType(event.target.value);
        setFiles([]);
        setFilePreviews([]);
    };

    const handleYearSelect = (event, newValue) => {
        setSelectedYear(newValue);
        setError(null);
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
                    year: selectedYear ? [selectedYear] : [], // Convert single year to array for backend compatibility
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
            setSelectedYear(null);
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
            <Typography variant="h4" gutterBottom align="center" sx={{
                mb: 4,
                fontWeight: 600,
            }}>
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
                sx={{
                    mb: 3,
                    '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                        transition: 'all 0.2s ease-in-out',
                        '&:hover': {
                            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                        },
                        '&.Mui-focused': {
                            boxShadow: '0 4px 20px rgba(25,118,210,0.2)',
                        }
                    }
                }}
                disabled={isUploading}
                placeholder="Describe your post"
            />

            <FormControl fullWidth variant="outlined" sx={{
                mb: 3,
            }} disabled={isUploading}>
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
                                sx={{
                                    borderRadius: 2,
                                    textTransform: 'none',
                                    fontWeight: 500,
                                    px: 3,
                                    py: 1.5,
                                    border: '2px dashed',
                                    borderColor: 'primary.main',
                                    backgroundColor: 'rgba(25,118,210,0.04)',
                                    transition: 'all 0.2s ease-in-out',
                                    '&:hover': {
                                        borderColor: 'primary.dark',
                                        backgroundColor: 'rgba(25,118,210,0.08)',
                                        transform: 'translateY(-1px)',
                                        boxShadow: '0 4px 12px rgba(25,118,210,0.2)',
                                    }
                                }}
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
                        <Box sx={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            gap: 2,
                            mt: 2,
                            p: 2,
                            borderRadius: 2,
                            backgroundColor: 'rgba(0,0,0,0.02)',
                            border: '1px solid rgba(0,0,0,0.08)'
                        }}>
                            {filePreviews.map((previewUrl, index) => (
                                <Box key={index} sx={{
                                    position: 'relative',
                                    width: 90,
                                    height: 90,
                                    overflow: 'hidden',
                                    borderRadius: 2,
                                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                                    transition: 'all 0.2s ease-in-out',
                                    '&:hover': {
                                        transform: 'scale(1.05)',
                                        boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
                                    }
                                }}>
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

            {/* Location Section */}
            <Box sx={{ mb: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                    <Button
                        variant="outlined"
                        size="large"
                        startIcon={<LocationOnIcon />}
                        onClick={() => setIsMapModalOpen(true)}
                        disabled={isUploading}
                        sx={{
                            minWidth: 'auto',
                            borderRadius: 2,
                            textTransform: 'none',
                            fontWeight: 500,
                            '&:hover': {
                                transform: 'translateY(-1px)',
                                boxShadow: '0 4px 12px rgba(25,118,210,0.2)',
                            }
                        }}
                    >
                        {location ? 'Change' : 'Select'} Location
                    </Button>
                </Box>

                {location && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                        <Chip
                            icon={<LocationOnIcon />}
                            label={`${location.lat.toFixed(4)}, ${location.lng.toFixed(4)}`}
                            color="primary"
                            variant="filled"
                            size="small"
                            onDelete={() => setLocation(null)}
                            disabled={isUploading}
                            sx={{
                                borderRadius: 2,
                                fontWeight: 500,
                                '& .MuiChip-deleteIcon': {
                                    transition: 'all 0.2s ease-in-out',
                                    '&:hover': {
                                        transform: 'scale(1.2)',
                                    }
                                }
                            }}
                        />
                        <Typography variant="caption" color="text.secondary">
                            Location selected
                        </Typography>
                    </Box>
                )}

                {!location && (
                    <Typography variant="body2" color="text.secondary">
                        Optional: Select where this post is about
                    </Typography>
                )}
            </Box>

            <Box sx={{ mb: 3 }}>
                <Autocomplete
                    value={selectedYear}
                    onChange={handleYearSelect}
                    options={yearOptions}
                    getOptionLabel={(option) => option.toString()}
                    isOptionEqualToValue={(option, value) => option === value}
                    filterOptions={(options, { inputValue }) => {
                        return options.filter(option =>
                            option.toString().includes(inputValue)
                        );
                    }}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            label={`Year (1900 - ${new Date().getFullYear() - 5})`}
                            placeholder="Type to search or select a year..."
                            disabled={isUploading}
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: 2,
                                    transition: 'all 0.2s ease-in-out',
                                    '&:hover': {
                                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                                    },
                                    '&.Mui-focused': {
                                        boxShadow: '0 4px 20px rgba(25,118,210,0.2)',
                                    }
                                }
                            }}
                        />
                    )}
                    disabled={isUploading}
                    noOptionsText="No matching years"
                    clearOnEscape
                    selectOnFocus
                    handleHomeEndKeys
                    isClearable
                />

                {!selectedYear && (
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                        Select the year when this photo was taken (optional)
                    </Typography>
                )}

                {selectedYear && (
                    <Typography variant="body2" color="primary" sx={{ mt: 1 }}>
                        Selected year: {selectedYear}
                    </Typography>
                )}
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
                sx={{
                    height: 56,
                    mt: 3,
                    borderRadius: 2,
                    textTransform: 'none',
                    fontSize: '1.1rem',
                    fontWeight: 600,
                    background: 'linear-gradient(45deg, #1976d2 30%, #42a5f5 90%)',
                    boxShadow: '0 4px 16px rgba(25,118,210,0.3)',
                    transition: 'all 0.2s ease-in-out',
                    '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: '0 8px 24px rgba(25,118,210,0.4)',
                        background: 'linear-gradient(45deg, #1565c0 30%, #1e88e5 90%)',
                    },
                    '&:disabled': {
                        background: 'rgba(0,0,0,0.12)',
                        transform: 'none',
                        boxShadow: 'none',
                    }
                }}
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