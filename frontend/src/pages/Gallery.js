import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { GraduationCap, Upload, X, ArrowLeft, Image as ImageIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import axios from 'axios';
import { API } from '../App';

function Gallery() {
  const navigate = useNavigate();
  const [images, setImages] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initialize with default school images
  useEffect(() => {
    const defaultImages = [
      {
        id: 1,
        url: 'https://customer-assets.emergentagent.com/job_resultpro/artifacts/qbl6zirr_111.jpeg',
        title: 'Modern Classrooms',
        description: 'Well-equipped learning spaces'
      },
      {
        id: 2,
        url: 'https://customer-assets.emergentagent.com/job_resultpro/artifacts/fi2oomhz_222.jpeg',
        title: 'Campus View',
        description: 'Beautiful school campus'
      },
      {
        id: 3,
        url: 'https://customer-assets.emergentagent.com/job_resultpro/artifacts/2p9pfbrj_333.jpeg',
        title: 'School Building',
        description: 'Our main building'
      },
      {
        id: 4,
        url: 'https://customer-assets.emergentagent.com/job_resultpro/artifacts/6b0c6kok_444.jpeg',
        title: 'Learning Spaces',
        description: 'Interactive learning areas'
      }
    ];

    // Load saved images from localStorage
    const savedImages = localStorage.getItem('schoolGallery');
    if (savedImages) {
      setImages(JSON.parse(savedImages));
    } else {
      setImages(defaultImages);
      localStorage.setItem('schoolGallery', JSON.stringify(defaultImages));
    }
    setLoading(false);
  }, []);

  const handleFileSelect = async (event) => {
    const files = Array.from(event.target.files);
    if (files.length === 0) return;

    setUploading(true);

    try {
      const newImages = await Promise.all(
        files.map(async (file) => {
          // Create a local URL for the image
          const localUrl = URL.createObjectURL(file);
          
          return {
            id: Date.now() + Math.random(),
            url: localUrl,
            title: file.name.split('.')[0],
            description: 'Uploaded image',
            file: file
          };
        })
      );

      const updatedImages = [...images, ...newImages];
      setImages(updatedImages);
      localStorage.setItem('schoolGallery', JSON.stringify(updatedImages));
      
      toast.success(`${files.length} image(s) uploaded successfully!`);
    } catch (error) {
      toast.error('Failed to upload images');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = (imageId) => {
    const updatedImages = images.filter(img => img.id !== imageId);
    setImages(updatedImages);
    localStorage.setItem('schoolGallery', JSON.stringify(updatedImages));
    setSelectedImage(null);
    toast.success('Image deleted successfully');
  };

  const handleImageClick = (image) => {
    setSelectedImage(image);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Navigation */}
      <nav className="bg-white border-b border-[#E2E8F0] sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <Button variant="ghost" onClick={() => navigate('/')} className="gap-2">
                <ArrowLeft className="w-4 h-4" />
                Back to Home
              </Button>
              <div className="h-6 w-px bg-[#E2E8F0]"></div>
              <div className="flex items-center gap-2">
                <img 
                  src="https://customer-assets.emergentagent.com/job_resultpro/artifacts/seuytedw_WhatsApp%20Image%202026-02-23%20at%203.50.05%20PM.jpeg"
                  alt="VSNM School Logo"
                  className="w-8 h-8 object-contain"
                />
                <h1 className="font-outfit text-xl font-bold text-[#0F172A]">Gallery</h1>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <input
                type="file"
                id="image-upload"
                accept="image/*"
                multiple
                onChange={handleFileSelect}
                className="hidden"
              />
              <Button
                onClick={() => document.getElementById('image-upload').click()}
                disabled={uploading}
                className="bg-primary hover:bg-primary/90"
                data-testid="upload-image-btn"
              >
                <Upload className="w-4 h-4 mr-2" />
                {uploading ? 'Uploading...' : 'Upload Images'}
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Gallery Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="mb-12">
          <h1 className="font-outfit text-4xl font-bold text-[#0F172A] mb-4 tracking-tight">
            School Gallery
          </h1>
          <p className="text-lg text-[#64748B]">
            Explore our campus through photos - facilities, classrooms, activities, and events
          </p>
        </div>

        {images.length === 0 ? (
          <Card className="border-2 border-dashed border-[#E2E8F0]">
            <CardContent className="p-12 text-center">
              <ImageIcon className="w-16 h-16 text-[#CBD5E1] mx-auto mb-4" />
              <h3 className="font-outfit text-xl font-semibold text-[#0F172A] mb-2">
                No images yet
              </h3>
              <p className="text-[#64748B] mb-6">
                Start building your gallery by uploading images
              </p>
              <Button
                onClick={() => document.getElementById('image-upload').click()}
                className="bg-primary hover:bg-primary/90"
              >
                <Upload className="w-4 h-4 mr-2" />
                Upload Your First Image
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {images.map((image, idx) => (
              <motion.div
                key={image.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.05 }}
                data-testid={`gallery-image-${idx}`}
              >
                <Card className="group overflow-hidden border-0 shadow-[0_2px_8px_rgba(0,0,0,0.08)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.15)] transition-all duration-300">
                  <div className="relative aspect-square overflow-hidden bg-gray-100">
                    <img
                      src={image.url}
                      alt={image.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 cursor-pointer"
                      onClick={() => handleImageClick(image)}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="absolute bottom-0 left-0 right-0 p-4">
                        <h3 className="text-white font-outfit font-semibold mb-1">
                          {image.title}
                        </h3>
                        <p className="text-white/80 text-sm">{image.description}</p>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant="destructive"
                      className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(image.id);
                      }}
                      data-testid={`delete-image-${idx}`}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Image Preview Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative max-w-5xl w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <Button
              variant="ghost"
              size="sm"
              className="absolute -top-12 right-0 text-white hover:text-white hover:bg-white/20"
              onClick={() => setSelectedImage(null)}
            >
              <X className="w-6 h-6" />
            </Button>
            <img
              src={selectedImage.url}
              alt={selectedImage.title}
              className="w-full h-auto rounded-2xl shadow-2xl max-h-[80vh] object-contain"
            />
            <div className="mt-4 text-center">
              <h3 className="text-white font-outfit text-2xl font-bold mb-2">
                {selectedImage.title}
              </h3>
              <p className="text-white/80">{selectedImage.description}</p>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}

export default Gallery;
