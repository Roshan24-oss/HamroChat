import { useEffect, useState } from "react";

const ReceiverMessage = ({ message, image }) => {
  const [imageUrl, setImageUrl] = useState(null);

  useEffect(() => {
    if (!image) return;

    if (image instanceof File) {
      const url = URL.createObjectURL(image);
      setImageUrl(url);
      return () => URL.revokeObjectURL(url);
    } else if (image.url) {
      setImageUrl(image.url);
    } else {
      setImageUrl(image);
    }
  }, [image]);

  return (
    <div className="flex justify-start my-2">
      <div className="bg-gray-300 text-black p-2 rounded-lg max-w-xs">
        {imageUrl && (
          <img
            src={imageUrl}
            alt="received"
            className="mb-1 rounded max-h-60 object-cover"
          />
        )}
        {message && <span>{message}</span>}
      </div>
    </div>
  );
};

export default ReceiverMessage;
