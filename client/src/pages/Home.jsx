import { useState, useEffect, useRef, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import SaveToBoardModal from '../components/SaveToBoardModal';

export default function Home() {
  const { user } = useAuth();
  const [images, setImages] = useState([]);
  const [page, setPage] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const loader = useRef(null);
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const searchQuery = searchParams.get('q');

  const loadMoreImages = useCallback((reset = false) => {
    const heights = [300, 400, 500, 250, 350, 450, 600];
    const keywords = ['architecture', 'nature', 'design', 'fashion', 'food', 'travel', 'art', 'minimalism'];
    
    setImages(prevImages => {
      const startIndex = reset ? 0 : prevImages.length;
      const newImages = Array.from({ length: 15 }).map((_, i) => {
        const index = startIndex + i;
        const height = heights[index % heights.length];
        
        let url;
        if (searchQuery) {
          // loremflickr requires comma-separated keywords and fails with spaces/encoded spaces
          const formattedQuery = searchQuery.trim().replace(/\s+/g, ',');
          url = `https://loremflickr.com/400/${height}/${encodeURIComponent(formattedQuery)}?lock=${index}`;
        } else {
          // Use picsum for the default random feed
          url = `https://picsum.photos/seed/${index + 100}/400/${height}`;
        }
        
        return {
          id: index,
          url,
          alt: searchQuery ? `${searchQuery} inspiration` : `${keywords[index % keywords.length]} inspiration`,
          height
        };
      });
      return reset ? newImages : [...prevImages, ...newImages];
    });
  }, [searchQuery]);

  // Reset images and page when search query changes
  useEffect(() => {
    setPage(0);
    loadMoreImages(true);
  }, [searchQuery, loadMoreImages]);

  useEffect(() => {
    const handleObserver = (entities) => {
      const target = entities[0];
      if (target.isIntersecting) {
        setPage((prev) => prev + 1);
      }
    };
    const observer = new IntersectionObserver(handleObserver, {
      root: null,
      rootMargin: '200px',
      threshold: 0,
    });
    if (loader.current) observer.observe(loader.current);
    
    return () => {
      if (loader.current) observer.disconnect();
    };
  }, []);

  useEffect(() => {
    // Only load more if not a reset (handled by search effect)
    if (page > 0) {
      loadMoreImages();
    }
  }, [page, loadMoreImages]);

  const openSaveModal = (image) => {
    if (!user) {
      alert("Please log in to save pins.");
      return;
    }
    setSelectedImage(image);
    setModalOpen(true);
  };

  const downloadImage = async (url, name) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = `${name || 'download'}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error('Download failed', error);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] p-4 sm:p-8">
      {!user ? (
        <div className="mb-12 text-center max-w-3xl mx-auto py-12">
           <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight mb-6">
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#e60023] to-purple-600">
              Get your next
            </span>
            <span className="block text-zinc-900 dark:text-white mt-2">
              great idea
            </span>
          </h1>
          <p className="text-xl text-zinc-600 dark:text-zinc-400">
            Log in to save ideas and create your own boards.
          </p>
        </div>
      ) : (
        <div className="mb-8 mt-4 text-center">
          <h2 className="text-3xl font-bold text-zinc-900 dark:text-white">
            {searchQuery ? `Results for "${searchQuery}"` : 'For You'}
          </h2>
        </div>
      )}

      {/* Masonry Grid (CSS Columns approach) */}
      <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 xl:columns-5 gap-4 max-w-[2000px] mx-auto space-y-4">
        {images.map((image) => (
          <div 
            key={image.id} 
            className="break-inside-avoid rounded-2xl overflow-hidden relative group cursor-zoom-in"
          >
            {/* We use a specific placeholder service for reliability if unsplash fails, but unsplash is preferred */}
            <img
              src={image.url}
              alt={image.alt}
              className="w-full object-cover rounded-2xl"
              loading="lazy"
            />
            
            {/* Hover overlay */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300 rounded-2xl flex flex-col justify-between p-4 opacity-0 group-hover:opacity-100">
              <div className="flex justify-end">
                <button 
                  onClick={() => openSaveModal(image)}
                  className="bg-[#e60023] hover:bg-[#ad081b] text-white px-4 py-2 rounded-full font-semibold opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all shadow-md flex items-center gap-1"
                >
                  <span className="text-lg leading-none">+</span> Save
                </button>
              </div>
              <div className="flex justify-end gap-2">
                <button 
                  onClick={() => downloadImage(image.url, `pin-${image.id}`)}
                  className="bg-white/90 hover:bg-white text-zinc-900 w-8 h-8 rounded-full flex items-center justify-center font-bold opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all"
                  title="Download image"
                >
                  ⬇
                </button>
                <button className="bg-white/90 hover:bg-white text-zinc-900 w-8 h-8 rounded-full flex items-center justify-center font-bold opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all">
                  ⋯
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Loader for infinite scroll */}
      <div ref={loader} className="h-20 w-full flex items-center justify-center mt-8">
        <div className="w-8 h-8 border-4 border-[#e60023] border-t-transparent rounded-full animate-spin"></div>
      </div>

      <SaveToBoardModal 
        isOpen={modalOpen} 
        onClose={() => setModalOpen(false)} 
        image={selectedImage} 
      />
    </div>
  );
}
