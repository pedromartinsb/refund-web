export function NotFound() {
  return (
    <div className="w-screen h-screen bg-gray-400 flex justify-center items-center">
      <div className="flex flex-col items-center">
        <h1 className="text-gray-100 font-semibold text-2xl mb-10">
          404 - Page Not Found
        </h1>
        <p>The page you are looking for does not exist.</p>

        <a
          href="/"
          className="font-semibold text-center text-green-100 hover:text-green-200 transition ease-linear"
        >
          Back to Home
        </a>
      </div>
    </div>
  );
}
