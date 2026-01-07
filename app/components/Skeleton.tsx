const Skeleton = () => {
  return (
    <div className="h-screen flex animate-pulse w-full">
      {/* Sidebar */}
      <div className="xl:w-[18%] lg:w-[25%] md:w-[33%] bg-gray-300 hidden md:flex" />

      {/* Header */}
      <div className="flex flex-col w-full p-5 h-screen">
        <div className="flex items-center gap-4 mb-5">
          <div className="h-12 w-12 rounded-full bg-gray-300" />
          <div className="h-4 w-40 rounded bg-gray-300" />
        </div>

        {/* Main content */}
        <div className="h-[30vh] rounded-xl bg-gray-300 mb-5" />
        <div className="h-[30vh] rounded-xl bg-gray-300 mb-5" />
        <div className="h-[30vh] rounded-xl bg-gray-300 mb-5" />

        {/* Footer lines */}
        <div className="flex flex-col gap-5">
          <div className="h-4 w-full rounded bg-gray-300" />
          <div className="h-4 w-5/6 rounded bg-gray-300" />
          <div className="h-4 w-3/6 rounded bg-gray-300" />
        </div>
      </div>
    </div>
  );
};

export default Skeleton;
