export default function LoadingBar() {
  return (
    <div className="w-full max-w-md h-4 bg-gray-800 overflow-hidden">
      <div className="h-full w-[75%] bg-green-500 animate-loading" />
    </div>
  );
}