import { CONFIG } from '../constants/config';

export const getDoctorImageUrl = (filename) => {
  if (!filename) {
    return null;
  }
  
  // Remove any leading slashes from filename
  const cleanFilename = filename.replace(/^\/+/, '');
  
  // Construct the full image URL
  const imageUrl = `${CONFIG.BASE_URL}/uploads/doctors/${cleanFilename}`;
  
  return imageUrl;
};

export const getImageUrl = (path, type = 'general') => {
  if (!path) {
    return null;
  }
  
  // Remove any leading slashes from path
  const cleanPath = path.replace(/^\/+/, '');
  
  // If path already includes the base URL, return as is
  if (cleanPath.startsWith('http')) {
    return cleanPath;
  }
  
  // Construct the full image URL based on type
  let imageUrl;
  switch (type) {
    case 'doctor':
      imageUrl = `${CONFIG.BASE_URL}/uploads/doctors/${cleanPath}`;
      break;
    case 'profile':
      imageUrl = `${CONFIG.BASE_URL}/uploads/profiles/${cleanPath}`;
      break;
    default:
      imageUrl = `${CONFIG.BASE_URL}/uploads/${cleanPath}`;
  }
  
  return imageUrl;
};