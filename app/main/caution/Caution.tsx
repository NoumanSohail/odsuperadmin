import { FaExclamationTriangle } from "react-icons/fa";

const Caution = () => {
  return (
    <div className="flex pb-15 border-t pt-4 text-sm text-gray-600 w-full">
      <div className="flex flex-col gap-3 bg-yellow-50 border border-yellow-200 rounded-xl p-4">
        <div className="flex gap-3">
          <FaExclamationTriangle size={30} className="text-yellow-500" />
          <p className="flex font-semibold text-yellow-700 items-center justify-center">
            Super Admin Privilege Notice:{" "}
          </p>
        </div>
        <p>
          {"\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0"}
          You have full authority to <b>add, update, view, and delete admins</b>
          , control <b>admin plans and plan types</b>, and access
          <b> sensitive administrative information</b>. Please use these
          privileges responsibly, as actions taken here can directly affect
          system access, subscriptions, and data security.
        </p>
      </div>
    </div>
  );
};

export default Caution;
