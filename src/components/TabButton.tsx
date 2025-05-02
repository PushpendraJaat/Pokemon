// Reusable Tab Button
export const TabButton = ({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) => (
  <button
    onClick={onClick}
    className={`px-4 py-3 text-center flex-1 font-medium ${
      active ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600 hover:text-gray-800'
    }`}
  >
    {label}
  </button>
);
