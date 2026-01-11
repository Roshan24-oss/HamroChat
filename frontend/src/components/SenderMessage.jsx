import { useEffect, useState } from "react";
import dp from "../assets/dp.webp";

const SenderMessage = ({ message, image, profile }) => {
  const [imageUrl, setImageUrl] = useState(null);

  useEffect(() => {
    if (!image) {
      setImageUrl(null);
      return;
    }

    if (image instanceof File) {
      const url = URL.createObjectURL(image);
      setImageUrl(url);
      return () => URL.revokeObjectURL(url);
    }

    if (image.url) {
      setImageUrl(image.url);
    } else {
      setImageUrl(image);
    }
  }, [image]);

  return (
    <div className="flex justify-end my-2 items-end gap-2">
      <div className="bg-blue-500 text-white p-2 rounded-lg max-w-xs break-words">
        {imageUrl && (
          <img
            src={imageUrl}
            alt="sent"
            className="mb-1 rounded max-h-60 object-cover"
          />
        )}
        {message && <span>{message}</span>}
      </div>
      <img
        src={profile?.image || dp}
        alt={profile?.name || "Sender"}
        className="w-6 h-6 rounded-full"
      />
    </div>
  );
};

export default SenderMessage;
