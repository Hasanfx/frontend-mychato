export default function NotFound() {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-gray-100">
        <h1 className="text-6xl font-bold text-red-600">404</h1>
        <h2 className="text-2xl font-semibold text-gray-800 mt-2">Post Not Found</h2>
        <p className="text-gray-600 mt-2">The post you're looking for doesn't exist.</p>
      </div>
    );
  }
  