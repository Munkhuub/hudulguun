import { useState } from "react";

interface AddressTogglerProps {
  address?: string;
  maxLength?: number;
  isLoading?: boolean;
}

const AddressToggler: React.FC<AddressTogglerProps> = ({
  address,
  maxLength = 30,
  isLoading = false,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const getShortenedAddress = (text?: string): string => {
    if (!text) return "";
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  const toggleExpand = (): void => {
    setIsExpanded(!isExpanded);
  };

  if (isLoading) {
    return (
      <div className="h-5 bg-gray-200 animate-pulse rounded w-full max-w-md"></div>
    );
  }

  return (
    <div
      className="cursor-pointer hover:text-gray-700 transition-colors"
      onClick={toggleExpand}
    >
      {isExpanded ? address : getShortenedAddress(address)}
    </div>
  );
};

export default AddressToggler;
