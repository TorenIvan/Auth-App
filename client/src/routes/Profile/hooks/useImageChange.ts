import { ChangeEvent, useState, useEffect, useRef } from 'react';

function useImageChange(imageName: string | undefined) {
  const [image, setImage] = useState<string | null>(findPhoto(imageName));
  const hasPreviewRef = useRef(false); // Track if user uploaded a preview

  useEffect(() => {
    if (!hasPreviewRef.current) {
      setImage(findPhoto(imageName));
    }
  }, [imageName]);

  function handleImageChange(event: ChangeEvent<HTMLInputElement>) {
    event.stopPropagation();

    const files = event.currentTarget.files;
    if (!files || files.length === 0) {
      return;
    }

    const imageUrl = URL.createObjectURL(files[0]);
    setImage(imageUrl);
    hasPreviewRef.current = true;
  }

  function resetPreview() {
    hasPreviewRef.current = false;
  }

  return [image, handleImageChange, resetPreview] as const;
}

export { useImageChange };

function findPhoto(image?: string) {
  return image ?? null;
}
