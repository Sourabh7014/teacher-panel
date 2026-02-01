import { LoaderIcon, MapPinIcon, XIcon } from "lucide-react";
import React, { useState, useRef, useEffect, useCallback } from "react";
import { setOptions, importLibrary } from "@googlemaps/js-api-loader";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";

// Types
declare global {
  interface Window {
    google: typeof google;
  }
}

export interface FormattedAddress {
  place_id?: string | null;
  address_line_1?: string | null;
  address_line_2?: string | null;
  city?: string | null;
  state?: string | null;
  postal_code?: string | null;
  country?: string | null;
  address: string;
  latitude: number;
  longitude: number;
}

interface AddressAutocompleteProps {
  onAddressSelect: (address: FormattedAddress | null) => void;
  defaultValue?: string;
  placeholder?: string;
  className?: string;
}

export const AddressAutocomplete: React.FC<AddressAutocompleteProps> = ({
  onAddressSelect,
  defaultValue = "",
  placeholder = "Enter an address...",
  className = "",
}) => {
  const [suggestions, setSuggestions] = useState<
    google.maps.places.AutocompletePrediction[]
  >([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState(defaultValue);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [hasSearched, setHasSearched] = useState(false);
  const [isAddressSelected, setIsAddressSelected] = useState(false);

  const autocompleteService =
    useRef<google.maps.places.AutocompleteService | null>(null);
  const placesService = useRef<google.maps.places.PlacesService | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const attributionRef = useRef<HTMLDivElement>(null);
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);
  const suggestionRefs = useRef<(HTMLButtonElement | null)[]>([]);

  // Initialize Google Maps services
  const initGoogleServices = useCallback(async () => {
    if (isInitialized) return;

    try {
      setIsLoading(true);
      setError(null);

      const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

      if (!apiKey) {
        throw new Error(
          "Google Maps API key is not configured. Please add NEXT_PUBLIC_GOOGLE_MAPS_API_KEY to your .env.local file"
        );
      }

      setOptions({
        key: apiKey,
      });

      await importLibrary("places");

      if (attributionRef.current && window.google) {
        autocompleteService.current =
          new window.google.maps.places.AutocompleteService();
        placesService.current = new window.google.maps.places.PlacesService(
          attributionRef.current
        );
        setIsInitialized(true);
      }
    } catch (error) {
      console.error("Error initializing Google Maps:", error);
      setError(
        "Failed to load address autocomplete. Please check your API key and ensure Places API is enabled."
      );
    } finally {
      setIsLoading(false);
    }
  }, [isInitialized]);

  useEffect(() => {
    initGoogleServices();
  }, [initGoogleServices]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
        setSelectedIndex(-1);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Scroll selected item into view
  useEffect(() => {
    if (selectedIndex >= 0 && suggestionRefs.current[selectedIndex]) {
      suggestionRefs.current[selectedIndex]?.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    }
  }, [selectedIndex]);

  // Add this useEffect after your existing useEffect hooks
  useEffect(() => {
    // Maintain focus on input after suggestions update
    if (
      hasSearched &&
      inputRef.current &&
      document.activeElement !== inputRef.current
    ) {
      inputRef.current.focus();
    }
  }, [suggestions, hasSearched]);

  const fetchSuggestions = useCallback(async (input: string) => {
    if (!autocompleteService.current || input.length < 2) {
      setSuggestions([]);
      setIsDropdownOpen(false);
      setHasSearched(false);
      return;
    }

    setIsLoading(true);
    setError(null);
    setHasSearched(true);

    try {
      const request: google.maps.places.AutocompletionRequest = {
        input,
      };

      autocompleteService.current.getPlacePredictions(
        request,
        (predictions, status) => {
          if (
            status === window.google.maps.places.PlacesServiceStatus.OK &&
            predictions
          ) {
            setSuggestions(predictions);
            setIsDropdownOpen(true);
          } else if (
            status ===
            window.google.maps.places.PlacesServiceStatus.ZERO_RESULTS
          ) {
            setSuggestions([]);
            setIsDropdownOpen(true); // Keep dropdown open to show "No results"
          } else {
            if (
              status ===
              window.google.maps.places.PlacesServiceStatus.REQUEST_DENIED
            ) {
              setError(
                "Places API access denied. Please check your API key and enabled APIs."
              );
            } else {
              setError("Failed to fetch suggestions. Please try again.");
            }
            setSuggestions([]);
            setIsDropdownOpen(false);
          }
          setIsLoading(false);
        }
      );
    } catch (error) {
      console.error("Error fetching address suggestions:", error);
      setError("Failed to fetch address suggestions. Please try again.");
      setSuggestions([]);
      setIsDropdownOpen(false);
      setIsLoading(false);
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    setIsAddressSelected(false); // Reset address selected flag
    setSelectedIndex(-1); // Reset keyboard selection

    if (!isInitialized) {
      return;
    }

    onAddressSelect(null);

    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    debounceTimer.current = setTimeout(() => {
      fetchSuggestions(value);
    }, 800);
  };

  const handleClear = () => {
    setInputValue("");
    setSuggestions([]);
    setIsDropdownOpen(false);
    setHasSearched(false);
    setIsAddressSelected(false);
    setSelectedIndex(-1);
    onAddressSelect(null);
    inputRef.current?.focus();
  };

  const handleSuggestionClick = useCallback(
    (placeId: string, description: string) => {
      if (!placesService.current) return;

      setIsLoading(true);
      setInputValue(description);
      setSuggestions([]);
      setIsDropdownOpen(false);
      setIsAddressSelected(true);
      setSelectedIndex(-1);

      try {
        const request: google.maps.places.PlaceDetailsRequest = {
          placeId,
          fields: [
            "address_components",
            "formatted_address",
            "geometry.location",
            "place_id",
          ],
        };

        placesService.current.getDetails(request, (place, status) => {
          if (
            status === window.google.maps.places.PlacesServiceStatus.OK &&
            place
          ) {
            const finalAddress = place.formatted_address || description;
            setInputValue(finalAddress);

            if (place.address_components) {
              onAddressSelect(formatAddress(place, finalAddress));
            } else {
              onAddressSelect({
                place_id: place.place_id || "",
                address_line_1: "",
                address_line_2: "",
                city: "",
                state: "",
                postal_code: "",
                country: "",
                address: finalAddress,
                latitude: place.geometry?.location?.lat() || 0,
                longitude: place.geometry?.location?.lng() || 0,
              });
            }
          } else {
            console.error("Place details error:", status);
            setError("Failed to load address details. Please try again.");
          }
          setIsLoading(false);
        });
      } catch (error) {
        console.error("Error fetching place details:", error);
        setError("Failed to load address details. Please try again.");
        setIsLoading(false);
      }
    },
    [onAddressSelect]
  );

  const formatAddress = (
    place: google.maps.places.PlaceResult,
    fullAddress: string
  ): FormattedAddress => {
    const components = place.address_components || [];
    const getComponent = (type: string) =>
      components.find((c) => c.types.includes(type))?.long_name || null;

    console.log(components);

    const streetNumber = getComponent("premise");
    const route = getComponent("route");
    const neighborhood = getComponent("neighborhood");

    return {
      address_line_1: `${streetNumber ?? ""} ${route ?? ""} ${
        neighborhood ?? ""
      }`.trim(),
      address_line_2:
        getComponent("sublocality") || getComponent("sublocality_level_1"),
      city: getComponent("locality") || getComponent("postal_town"),
      state: getComponent("administrative_area_level_1"),
      postal_code: getComponent("postal_code"),
      country: getComponent("country"),
      address: fullAddress,
      place_id: place.place_id || null,
      latitude: place.geometry?.location?.lat() || 0,
      longitude: place.geometry?.location?.lng() || 0,
    };
  };

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isDropdownOpen || suggestions.length === 0) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev < suggestions.length - 1 ? prev + 1 : 0
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev > 0 ? prev - 1 : suggestions.length - 1
        );
        break;
      case "Enter":
        e.preventDefault();
        if (selectedIndex >= 0 && suggestions[selectedIndex]) {
          handleSuggestionClick(
            suggestions[selectedIndex].place_id,
            suggestions[selectedIndex].description
          );
        }
        break;
      case "Escape":
        e.preventDefault();
        setIsDropdownOpen(false);
        setSelectedIndex(-1);
        break;
    }
  };

  useEffect(() => {
    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, []);

  const shouldShowDropdown =
    isDropdownOpen &&
    hasSearched &&
    inputValue.length >= 2 &&
    !isAddressSelected;

  return (
    <div className={cn("relative w-full", className)}>
      {/* Input Container */}
      <div className={cn("relative flex items-center")}>
        <Input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => {
            if (inputValue.length >= 2 && !isAddressSelected && hasSearched) {
              setIsDropdownOpen(true);
            }
          }}
          placeholder={placeholder}
          disabled={!isInitialized || isLoading}
          autoComplete="off"
          role="combobox"
          aria-expanded={shouldShowDropdown}
          aria-controls="address-suggestions"
          aria-activedescendant={
            selectedIndex >= 0 ? `suggestion-${selectedIndex}` : undefined
          }
        />

        <div className="absolute right-3 flex items-center gap-2">
          {inputValue && !isLoading && (
            <button
              type="button"
              onClick={handleClear}
              className="text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Clear input"
              tabIndex={-1}
            >
              <XIcon className="h-4 w-4" />
            </button>
          )}
          {isLoading && (
            <LoaderIcon className="h-5 w-5 text-muted-foreground animate-spin" />
          )}
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <p className="mt-2 text-sm text-destructive" role="alert">
          {error}
        </p>
      )}

      {/* Initializing Message */}
      {!isInitialized && !error && (
        <p className="mt-2 text-sm text-muted-foreground">
          Initializing address service...
        </p>
      )}

      {/* Dropdown */}
      {shouldShowDropdown && (
        <div
          ref={dropdownRef}
          id="address-suggestions"
          role="listbox"
          className="absolute z-50 w-full mt-2 rounded-lg border bg-popover shadow-lg overflow-hidden animate-in fade-in-0 zoom-in-95"
        >
          <div className="max-h-[300px] overflow-y-auto py-1">
            {suggestions.length > 0 ? (
              suggestions.map((suggestion, index) => (
                <button
                  key={suggestion.place_id}
                  id={`suggestion-${index}`}
                  ref={(el) => {
                    if (el) {
                      suggestionRefs.current[index] = el;
                    }
                  }}
                  type="button"
                  role="option"
                  aria-selected={selectedIndex === index}
                  onClick={() =>
                    handleSuggestionClick(
                      suggestion.place_id,
                      suggestion.description
                    )
                  }
                  onMouseEnter={() => setSelectedIndex(index)}
                  className={cn(
                    "flex items-start gap-3 w-full px-4 py-3 text-left text-sm",
                    "hover:bg-accent transition-colors",
                    "focus:bg-accent focus:outline-none",
                    selectedIndex === index && "bg-accent",
                    index !== suggestions.length - 1 && "border-b"
                  )}
                >
                  <MapPinIcon className="h-4 w-4 mt-0.5 text-muted-foreground flex-shrink-0" />
                  <span className="text-foreground">
                    {suggestion.description}
                  </span>
                </button>
              ))
            ) : (
              <div
                className="px-4 py-3 text-sm text-muted-foreground text-center"
                role="status"
              >
                No results found
              </div>
            )}
          </div>
        </div>
      )}

      {/* Hidden element for Google Maps attribution */}
      <div ref={attributionRef} className="hidden" aria-hidden="true" />
    </div>
  );
};
