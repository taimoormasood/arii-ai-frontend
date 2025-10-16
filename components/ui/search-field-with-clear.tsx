"use client";

import React, { forwardRef, useImperativeHandle } from "react";

import CustomSearchField from "@/components/ui/custom-searchfield";
import { useSearchField } from "@/hooks/use-search-field";

interface SearchFieldWithClearProps {
  placeholder?: string;
  disabled?: boolean;
  loading?: boolean;
  onChange?: (value: string) => void;
  className?: string;
}

export interface SearchFieldWithClearRef {
  clear: () => void;
  getValue: () => string;
  setValue: (value: string) => void;
}

const SearchFieldWithClear = forwardRef<
  SearchFieldWithClearRef,
  SearchFieldWithClearProps
>((props, ref) => {
  const { searchFieldRef, clearSearch, getSearchValue, setSearchValue } =
    useSearchField();

  useImperativeHandle(
    ref,
    () => ({
      clear: clearSearch,
      getValue: getSearchValue,
      setValue: setSearchValue,
    }),
    [clearSearch, getSearchValue, setSearchValue]
  );

  return <CustomSearchField ref={searchFieldRef} {...props} />;
});

SearchFieldWithClear.displayName = "SearchFieldWithClear";

export default SearchFieldWithClear;
