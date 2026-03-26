const PageLoader = () => {
  return (
    // This wrapper centers the spinner perfectly on the screen
    <div className="flex items-center justify-center min-h-screen dark:bg-black">
      
      {/* The actual spinner element */}
      <div className="w-12 h-12 border-4 border-neutral-300 border-t-cyan-500 rounded-full animate-spin"></div>
      
      {/* Screen reader text for accessibility (optional but recommended) */}
      <span className="sr-only">Loading...</span>
    </div>
  );
};

export default PageLoader;