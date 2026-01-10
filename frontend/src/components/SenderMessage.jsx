const SenderMessage = ({ message, image, profile }) => {
  const imageUrl =
    image?.url || (image instanceof File ? URL.createObjectURL(image) : image);

  return (
    <div className="flex justify-end my-2 items-end gap-2">
      <div className="bg-blue-500 text-white p-2 rounded-lg max-w-xs">
        {image && <img src={imageUrl} alt="sent" className="mb-1 rounded max-h-60 object-cover" />}
        {message && <span>{message}</span>}
      </div>
      <img
        src={profile?.image || "/src/assets/dp.webp"}
        alt={profile?.name}
        className="w-6 h-6 rounded-full"
      />
    </div>
  );
};

export default SenderMessage;
