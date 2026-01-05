const SenderMessage = ({ message, image }) => {
  return (
    <div className="flex justify-end my-2">
      <div className="bg-blue-500 text-white p-2 rounded-lg max-w-xs">
        {image && <img src={image} alt="" className="mb-1 rounded" />}
        <p>{message}</p>
      </div>
    </div>
  );
};

export default SenderMessage;
