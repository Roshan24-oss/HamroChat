const ReceiverMessage = ({ message, image }) => {
  return (
    <div className="flex justify-start my-2">
      <div className="bg-gray-300 text-black p-2 rounded-lg max-w-xs">
        {image && <img src={image} alt="" className="mb-1 rounded" />}
        <p>{message}</p>
      </div>
    </div>
  );
};

export default ReceiverMessage;
