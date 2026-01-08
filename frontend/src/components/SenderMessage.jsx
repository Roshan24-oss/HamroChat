const SenderMessage = ({ message, image }) => {
  const imageUrl = image?.url || (image instanceof File ? URL.createObjectURL(image) : image);

  return (
    <div className="flex justify-end my-2">
      <div className="bg-blue-500 text-white p-2 rounded-lg max-w-xs">
        {image && (
          <img
            src={imageUrl}
            alt="sent"
            className="mb-1 rounded max-h-60 object-cover"
          />
        )}
        {message && <span>{message}</span>}
      </div>
    </div>
  );
};

export default SenderMessage;
