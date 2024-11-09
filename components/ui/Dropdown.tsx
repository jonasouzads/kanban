// components/EditLeadModal.tsx
import Dropdown from "@/components/ui/Dropdown";

const EditLeadModal = () => {
  return (
    <Dropdown
      trigger={
        <button className="bg-gray-200 px-4 py-2 rounded-md">
          Open Dropdown
        </button>
      }
    >
      <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900" role="menuitem">
        Option 1
      </a>
      <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900" role="menuitem">
        Option 2
      </a>
      <div className="border-t border-gray-100"></div>
      <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900" role="menuitem">
        Option 3
      </a>
    </Dropdown>
  );
};

export default EditLeadModal;