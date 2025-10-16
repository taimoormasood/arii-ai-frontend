import { useRef } from "react";

import type { CustomSearchFieldRef } from "@/components/ui/custom-searchfield";

export function useSearchField() {
  const searchFieldRef = useRef<CustomSearchFieldRef>(null);

  const clearSearch = () => {
    searchFieldRef.current?.clear();
  };

  const getSearchValue = () => {
    return searchFieldRef.current?.getValue() || "";
  };

  const setSearchValue = (value: string) => {
    searchFieldRef.current?.setValue(value);
  };

  return {
    searchFieldRef,
    clearSearch,
    getSearchValue,
    setSearchValue,
  };
}
