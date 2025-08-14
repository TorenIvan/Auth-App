import { ChangeEvent, useState, useEffect } from "react";

function useImageChange(imageName: string | undefined) {
  const [image, setImage] = useState<string | null>(findPhoto(imageName));

  useEffect(() => {
    setImage(findPhoto(imageName));
  }, [imageName]);

  function handleImageChange(event: ChangeEvent<HTMLInputElement>) {
    event.stopPropagation();

    const files = event.currentTarget.files;
    if (!files || files.length === 0) {
      return;
    }
    const imageUrl = URL.createObjectURL(files[0]);
    setImage(imageUrl);
  }

  return [image, handleImageChange, setImage] as const;
}

export { useImageChange };

function findPhoto(image?: string) {
  return image ?? null;
}
