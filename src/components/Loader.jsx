
function Loader() {
  return (
    <div className={`flex items-center space-x-1.5 `}>
      <div className="w-2 h-2 rounded-full bg-indigo-600 animate-bounce"></div>
      <div className="w-2 h-2 rounded-full bg-indigo-600 animate-bounce animation-delay-200ms"></div>
      <div className="w-2 h-2 rounded-full bg-indigo-600 animate-bounce animation-delay-400ms"></div>
    </div>
  );
}

export default Loader;
