import { ChangeEvent, useState } from "react";

function useImageChange(imageName: string | undefined) {
  const [image, setImage] = useState<string | null>(findPhoto(imageName));

  function handleImageChange(event: ChangeEvent<HTMLInputElement>) {
    event.stopPropagation();

    const files = event.currentTarget.files;
    if (files === null || files === undefined || files.length === 0) {
      return;
    }
    const imageUrl = URL.createObjectURL(files[0]);
    setImage(imageUrl);
  }

  return [image, handleImageChange] as const;
}

export { useImageChange };

function findPhoto(image?: string) {
  if (image === undefined) {
    return null;
  }
  return image;
}
