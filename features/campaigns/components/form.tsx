"use client";

import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";

import userService from "../../users/api.service";
import {
  X,
  ArrowLeft,
  Save,
  ChevronDown,
  Search,
  Trash2,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Switch } from "@/components/ui/switch";
import { DateTimePicker } from "@/components/ui/date-time-picker";
// import { DEFAULT_DISPLAY_DATE_TIME_FORMAT } from "@/utils/constants";
import { format } from "date-fns";

interface Campaign {
  id: string;
  title: string;
  content: string;
  type: string;
  recipients: any[];
  scheduledAt?: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

interface CampaignFormProps {
  type?: string;
  campaign?: Campaign | null;
  isEdit?: boolean;
  onBack: () => void;
}

const CampaignForm = ({
  type = "email",
  campaign,
  isEdit,
  onBack,
}: CampaignFormProps) => {
  const router = useRouter();
  const [users, setUsers] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [pageCount, setPageCount] = useState(0);
  const [queryParams, setQueryParams] = useState({
    page: 1,
    per_page: 10,
  });

  const [formData, setFormData] = useState({
    type: type,
    recipients: campaign?.recipients || [],
    title: campaign?.title || "",
    content: campaign?.content || "",
    scheduledAt: campaign?.scheduledAt
      ? new Date(campaign.scheduledAt)
      : (undefined as Date | undefined),
    isScheduled: campaign?.scheduledAt ? true : false,
  });

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [errors, setErrors] = useState<{
    title?: string;
    content?: string;
    recipients?: string;
    scheduledAt?: string;
  }>({});
  const [submitLoading, setSubmitLoading] = useState(false);

  const searchParams = useSearchParams();
  const [eventId, setEventId] = useState<string | null>(null);

  useEffect(() => {
    const eventId = searchParams.get("eventId");
    if (eventId) {
      setEventId(eventId as string);
    } else {
      setEventId(null);
    }

    const eventName = searchParams.get("eventName");
    if (eventName) {
      setFormData((prev: any) => ({
        ...prev,
        title: "Campaign for " + eventName,
      }));
    }
  }, [searchParams]);

  // Initialize form data when campaign prop changes
  useEffect(() => {
    if (campaign) {
      setFormData({
        type: campaign.type,
        recipients: campaign.recipients || [],
        title: campaign.title || "",
        content: campaign.content || "",
        scheduledAt: campaign.scheduledAt
          ? new Date(campaign.scheduledAt)
          : undefined,
        isScheduled: campaign.scheduledAt ? true : false,
      });
    }
  }, [campaign]);

  // Fetch users when queryParams change
  useEffect(() => {
    let isMounted = true;

    const fetchUsers = async () => {
      try {
        setIsLoading(true);
        const response = await userService.list(queryParams);
        if (isMounted) {
          setUsers(response?.users ?? []);
          if (response?.meta) {
            setPageCount(response.meta.total_pages);
          }
        }
      } catch (error) {
        console.error("Failed to fetch users:", error);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchUsers();

    return () => {
      isMounted = false;
    };
  }, [queryParams]);

  // Handle event users
  useEffect(() => {
    if (eventId && type) {
      // If there's an eventId, fetch users for that event
      setQueryParams((prev) => ({
        ...prev,
        event_id: eventId,
        type: type,
      }));
    }
  }, [eventId, type]);

  // Filter users based on search query
  const filteredUsers = (Array.isArray(users) ? users : []).filter((user) => {
    if (!user) return false;
    const searchLower = searchQuery.toLowerCase();
    const nameMatch =
      user.first_name?.toLowerCase().includes(searchLower) ||
      user.last_name?.toLowerCase().includes(searchLower);
    const emailMatch = user.email?.toLowerCase().includes(searchLower);
    const mobileMatch = user.mobile?.toLowerCase().includes(searchLower);

    return nameMatch || emailMatch || mobileMatch;
  });

  const toggleRecipient = (user: any) => {
    setFormData((prev: any) => {
      const isAlreadySelected = prev.recipients.find(
        (r: any) => r.id === user.id
      );

      if (isAlreadySelected) {
        // Remove user
        return {
          ...prev,
          recipients: prev.recipients.filter((r: any) => r.id !== user.id),
        };
      } else {
        // Add user
        return {
          ...prev,
          recipients: [...prev.recipients, user],
        };
      }
    });
    setErrors((prev) => ({ ...prev, recipients: undefined }));
  };

  const toggleSelectAll = () => {
    setFormData((prev: any) => {
      const allFilteredSelected = filteredUsers.every((user) =>
        prev.recipients.some((r: any) => r.id === user.id)
      );

      if (allFilteredSelected) {
        // Deselect all filtered users
        return {
          ...prev,
          recipients: prev.recipients.filter(
            (r: any) => !filteredUsers.some((user) => user.id === r.id)
          ),
        };
      } else {
        // Select all filtered users
        const newRecipients = [...prev.recipients];
        filteredUsers.forEach((user) => {
          if (!newRecipients.some((r: any) => r.id === user.id)) {
            newRecipients.push(user);
          }
        });
        return {
          ...prev,
          recipients: newRecipients,
        };
      }
    });

    setErrors((prev) => ({ ...prev, recipients: undefined }));
  };

  const removeRecipient = (userId: string) => {
    setFormData((prev: any) => ({
      ...prev,
      recipients: prev.recipients.filter((r: any) => r.id !== userId),
    }));
    setErrors((prev) => ({ ...prev, recipients: undefined }));
  };

  const clearAllRecipients = () => {
    setFormData((prev: any) => ({
      ...prev,
      recipients: [],
    }));
    setErrors((prev) => ({
      ...prev,
      recipients: "Please select at least one recipient",
    }));
  };

  const isUserSelected = (userId: string) => {
    return formData.recipients.some((r: any) => r.id === userId);
  };

  const handleSubmit = async () => {
    // Validation logic
    const newErrors: {
      title?: string;
      content?: string;
      recipients?: string;
      scheduledAt?: string;
    } = {};

    // Title validation
    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    } else if (formData.title.length > 80) {
      newErrors.title = "Title cannot exceed 80 characters";
    }

    // Content validation
    if (!formData.content.trim()) {
      newErrors.content = "Content is required";
    } else {
      if (type === "sms" || type === "app") {
        if (formData.content.length > 160) {
          newErrors.content =
            "Content cannot exceed 160 characters for SMS/App";
        }
      } else if (type === "email") {
        if (formData.content.length > 5000) {
          newErrors.content = "Content cannot exceed 5000 characters for Email";
        }
      }
    }

    // Recipients validation
    if (!formData.recipients || formData.recipients.length < 1) {
      newErrors.recipients = "Please select at least one recipient";
    }

    // Scheduled At validation
    if (formData.isScheduled) {
      if (!formData.scheduledAt) {
        newErrors.scheduledAt = "Please select a date";
      }
    }

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
      return;
    }

    try {
      setSubmitLoading(true);

      // Prepare form data for submission
      const submitData = {
        ...formData,
        scheduledAt: formData.scheduledAt
          ? format(new Date(formData.scheduledAt), "yyyy-MM-dd'T'HH:mm:ssxxx")
          : null,
      };

      const url =
        isEdit && campaign ? `${CAMPAIGNS_API}/${campaign.id}` : CAMPAIGNS_API;

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(submitData),
      });
      const responseData = await response.json();

      if (response.ok) {
        clearAllRecipients();
        setFormData({
          type,
          recipients: [],
          title: "",
          content: "",
          scheduledAt: undefined,
          isScheduled: false,
        });
        setErrors({});

        router.push("/campaigns");
      }
    } catch (error) {
      console.error("Error creating campaign:", error);
    } finally {
      setSubmitLoading(false);
    }
  };

  const allFilteredUsersSelected =
    filteredUsers.length > 0 &&
    filteredUsers.every((user) =>
      formData.recipients.some((r: any) => r.id === user.id)
    );

  return (
    <Card className="max-w-4xl mx-auto bg-transparent">
      <CardHeader className="border-b border-gray-800 pb-6">
        <CardTitle className="text-2xl font-bold text-white">
          {isEdit ? "Edit" : "Create"}{" "}
          {type === "sms"
            ? "SMS"
            : type.charAt(0).toUpperCase() + type.slice(1)}{" "}
          Campaign
        </CardTitle>
        <CardDescription className="text-gray-400">
          Fill in the details below to create a new campaign.
        </CardDescription>
      </CardHeader>

      <CardContent className="pt-6">
        <div className="space-y-6">
          {/* Recipients Selection */}
          <div className="space-y-3">
            <Label className="text-gray-200">Select Users</Label>
            <div className="relative">
              <div
                className="bg-zinc-900 border border-zinc-800 text-white rounded-md px-3 py-2 cursor-pointer flex items-center justify-between min-h-10"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              >
                <span className="text-sm">
                  {formData.recipients.length === 0
                    ? "Choose users for campaign"
                    : `${formData.recipients.length} user${
                        formData.recipients.length > 1 ? "s" : ""
                      } selected`}
                </span>
                <ChevronDown
                  className={`h-4 w-4 transition-transform ${
                    isDropdownOpen ? "rotate-180" : ""
                  }`}
                />
              </div>

              {isDropdownOpen && (
                <div className="absolute z-10 w-full mt-1 bg-zinc-900 border border-zinc-800 rounded-md shadow-lg max-h-64 overflow-hidden">
                  {/* Search Box */}
                  <div className="p-3 border-b border-zinc-800">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        placeholder="Search users..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 bg-zinc-800 border-zinc-700 text-white placeholder:text-gray-400 h-9"
                        onClick={(e) => e.stopPropagation()}
                        disabled={isLoading}
                      />
                    </div>
                  </div>

                  <div className="max-h-48 overflow-y-auto">
                    {/* Loading State */}
                    {isLoading ? (
                      <div className="px-3 py-8 text-center">
                        <Loader2 className="h-6 w-6 animate-spin mx-auto text-gray-400 mb-2" />
                        <span className="text-gray-400">Loading users...</span>
                      </div>
                    ) : (
                      <>
                        {/* Select All Option */}
                        {filteredUsers.length > 0 && (
                          <div
                            className="px-3 py-2 hover:bg-gray-700 border-b border-zinc-800"
                            onClick={toggleSelectAll}
                          >
                            <div className="flex items-center space-x-3">
                              <Checkbox
                                checked={allFilteredUsersSelected}
                                onCheckedChange={toggleSelectAll}
                                className="border-gray-400"
                              />
                              <span className="text-white font-medium">
                                Select All ({filteredUsers.length} users)
                              </span>
                            </div>
                          </div>
                        )}

                        {/* Individual Users */}
                        {filteredUsers.length > 0 ? (
                          filteredUsers.map((user: any) => (
                            <div
                              key={user.id}
                              className="px-3 py-2 hover:bg-gray-700 cursor-pointer"
                              onClick={() => toggleRecipient(user)}
                            >
                              <div className="flex items-center space-x-3">
                                <Checkbox
                                  checked={isUserSelected(user.id)}
                                  onChange={() => {}} // Controlled by parent click
                                  className="border-gray-400"
                                />
                                <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium text-white border border-gray-600 overflow-hidden">
                                  {user.avatar ? (
                                    <img
                                      src={user.avatar}
                                      alt={`${user.first_name} ${user.last_name}`}
                                      className="w-full h-full object-cover"
                                    />
                                  ) : (
                                    <div
                                      className={`w-full h-full bg-black flex items-center justify-center`}
                                    >
                                      {`${user.first_name
                                        ?.charAt(0)
                                        ?.toUpperCase()}${user.last_name
                                        ?.charAt(0)
                                        ?.toUpperCase()}`}
                                    </div>
                                  )}
                                </div>
                                <div className="flex flex-col flex-1 min-w-0">
                                  <span className="font-medium text-white truncate">
                                    {`${user.first_name} ${user.last_name}`}
                                  </span>
                                  <div className="flex items-center gap-2 text-xs text-gray-400">
                                    {type === "sms" ? (
                                      <span className="truncate">
                                        {user.mobile}
                                      </span>
                                    ) : (
                                      <span className="truncate">
                                        {user.email}
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="px-3 py-4 text-center text-gray-400">
                            {searchQuery
                              ? "No users found matching your search"
                              : "No users available"}
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>
            {errors.recipients && (
              <div className="text-red-400 text-xs mt-1">
                {errors.recipients}
              </div>
            )}
          </div>

          {/* Click outside to close dropdown */}
          {isDropdownOpen && (
            <div
              className="fixed inset-0 z-0"
              onClick={() => {
                setIsDropdownOpen(false);
                setSearchQuery(""); // Clear search when closing
              }}
            />
          )}

          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title" className="text-gray-200">
              Campaign Title
            </Label>
            <Input
              id="title"
              placeholder="Enter a compelling campaign title..."
              value={formData.title}
              onChange={(e) => {
                setFormData((prev) => ({ ...prev, title: e.target.value }));
                setErrors((prev) => ({ ...prev, title: undefined }));
              }}
              className="bg-gray-700 border-gray-600 text-white placeholder:text-gray-400"
            />
            {errors.title && (
              <div className="text-red-400 text-xs mt-1">{errors.title}</div>
            )}
          </div>

          {/* Content */}
          {type !== "email" ? (
            <div className="space-y-2">
              <Label
                htmlFor="content"
                className="text-gray-200 flex items-center gap-2"
              >
                Content
                {type === "sms" && (
                  <span className="text-xs text-gray-400">
                    (Max 160 characters)
                  </span>
                )}
              </Label>
              <Textarea
                id="content"
                placeholder={
                  type === "sms"
                    ? "Enter your message text (160 characters recommended)..."
                    : "Enter your content. Supports **bold**, *italic*, [links](url), etc."
                }
                value={formData.content}
                onChange={(e) => {
                  setFormData((prev) => ({
                    ...prev,
                    content: e.target.value,
                  }));
                  setErrors((prev) => ({ ...prev, content: undefined }));
                }}
                className="bg-gray-700 border-gray-600 text-white placeholder:text-gray-400 min-h-32"
              />
              {errors.content && (
                <div className="text-red-400 text-xs mt-1">
                  {errors.content}
                </div>
              )}
              <div className="flex justify-between text-xs text-gray-400">
                <span>{formData.content.length} characters</span>
                {type === "sms" && (
                  <span
                    className={
                      formData.content.length > 160
                        ? "text-orange-400"
                        : "text-green-400"
                    }
                  >
                    {formData.content.length > 160
                      ? "Over SMS limit"
                      : "Within SMS limit"}
                  </span>
                )}
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <Label
                htmlFor="content"
                className="text-gray-200 flex items-center gap-2"
              >
                Content
              </Label>
              <Textarea
                id="content"
                placeholder="Enter your email content..."
                value={formData.content}
                onChange={(e) => {
                  setFormData((prev) => ({ ...prev, content: e.target.value }));
                  setErrors((prev) => ({ ...prev, content: undefined }));
                }}
                className="bg-gray-700 border-gray-600 text-white placeholder:text-gray-400 min-h-32"
              />
            </div>
          )}

          <div className="space-y-4 p-4 border border-gray-700 rounded-lg">
            <div className="flex items-center space-x-2">
              <Switch
                id="additional-options"
                checked={formData.isScheduled}
                onCheckedChange={(checked) => {
                  setFormData((prev) => ({ ...prev, isScheduled: checked }));
                  if (!checked) {
                    setFormData((prev) => ({
                      ...prev,
                      scheduledAt: undefined,
                    }));
                  }
                }}
              />
              <Label>Schedule Campaign</Label>
            </div>

            {formData.isScheduled && (
              <div className="grid grid-cols-1 gap-3">
                <DateTimePicker
                  granularity="minute"
                  value={
                    formData.scheduledAt
                      ? new Date(formData.scheduledAt)
                      : undefined
                  }
                  placeholder="Select Date and Time"
                  hourCycle={12}
                  onChange={(value: Date | undefined) => {
                    setFormData((prev) => ({ ...prev, scheduledAt: value }));
                    setErrors((prev) => ({
                      ...prev,
                      scheduledAt: undefined,
                    }));
                  }}
                  displayFormat={{
                    hour24: "yyyy-MM-dd HH:mm:ss",
                  }}
                />
                {errors.scheduledAt && (
                  <div className="text-red-400 text-xs mt-1">
                    {errors.scheduledAt}
                  </div>
                )}
                <div className="text-xs text-gray-400">
                  {formData.scheduledAt &&
                    `Campaign will be sent on ${formData.scheduledAt.toLocaleString()}`}
                </div>
              </div>
            )}
          </div>

          {/* Selected Recipients */}
          {formData.recipients.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-gray-200">
                  Selected Recipients ({formData.recipients.length})
                </Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={clearAllRecipients}
                  className="text-red-400 border-red-400 hover:bg-red-400 hover:text-white transition-colors h-8"
                >
                  <Trash2 className="w-3 h-3 mr-1" />
                  Clear All
                </Button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 p-3 bg-gray-800 rounded-lg max-h-64 overflow-y-auto">
                {formData.recipients.map((user: any) => (
                  <div
                    key={user.id}
                    className="bg-black border border-gray-700 rounded-lg p-2 flex items-center gap-3 hover:border-gray-600 transition-colors group"
                  >
                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium text-white border border-gray-600 overflow-hidden">
                      {user.avatar ? (
                        <img
                          src={user.avatar}
                          alt={`${user.first_name} ${user.last_name}`}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div
                          className={`w-full h-full bg-black flex items-center justify-center`}
                        >
                          {`${user.first_name
                            ?.charAt(0)
                            ?.toUpperCase()}${user.last_name
                            ?.charAt(0)
                            ?.toUpperCase()}`}
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-white text-sm font-medium truncate">
                        {`${user.first_name} ${user.last_name}`}
                      </div>
                      {type === "sms" ? (
                        <div className="text-gray-400 text-xs truncate">
                          {user.mobile}
                        </div>
                      ) : (
                        <div className="text-gray-400 text-xs truncate">
                          {user.email}
                        </div>
                      )}
                    </div>
                    <button
                      onClick={() => removeRecipient(user.id)}
                      className="w-6 h-6 rounded-full bg-gray-700 hover:bg-red-600 flex items-center justify-center transition-colors opacity-0 group-hover:opacity-100 flex-shrink-0"
                      type="button"
                    >
                      <X className="w-3 h-3 text-white" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="border-t border-gray-800 pb-0 flex flex-col-reverse sm:flex-row sm:justify-between gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={onBack}
          className="w-full sm:w-auto flex items-center justify-center bg-transparent border border-gray-700 text-white hover:bg-gray-800 hover:border-gray-600 transition-colors h-12"
        >
          <ArrowLeft size={16} className="mr-2" /> Cancel
        </Button>
        <Button
          type="button"
          onClick={handleSubmit}
          disabled={submitLoading}
          className="w-full sm:w-auto flex items-center justify-center bg-gradient-to-r from-blue-600 to-cyan-500 text-white hover:opacity-90 transition-colors h-12"
        >
          {submitLoading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Save size={16} className="mr-2" />
          )}
          {submitLoading
            ? "Processing..."
            : formData.isScheduled
            ? "Schedule Campaign"
            : "Create Campaign"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default CampaignForm;
