import { FaArrowRight } from "react-icons/fa";

const Goicon = ({ onClick }: { onClick: () => void }) => {
  return (
    <div
      className="rounded-full p-3 bg-(--color-primary) cursor-pointer transform transition-transform duration-600 ease-in-out hover:scale-110 hover:-rotate-360"
      onClick={onClick}
    >
      <FaArrowRight size={20} className="text-(--color-sidebar)" />
    </div>
  );
};

export default Goicon;
