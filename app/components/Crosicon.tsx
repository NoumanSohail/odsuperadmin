import { MdClose } from "react-icons/md";

const Crosicon = ({ onClick }: { onClick: () => void }) => {
  return (
    <div
      className="
        flex p-0.5 text-xl font-bold
        bg-gray-300 text-gray-400
        rounded-full cursor-pointer shadow-sm
        transform
        transition-transform
        duration-500
        ease-in-out
        hover:scale-110
        hover:-rotate-180
        hover:text-(--color-primary)
        hover:bg-(--color-secondary)
        hover:shadow-2xl
    "
      onClick={onClick}
    >
      <MdClose size={28} />
    </div>
  );
};

export default Crosicon;
