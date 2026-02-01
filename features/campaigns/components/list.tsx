"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import AppPagination from "@/components/pagination";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Link from "next/link";
import {
  Plus,
  MoreHorizontal,
  Calendar,
  Users,
  Mail,
  MessageSquare,
  Bell,
  TrendingUp,
  Send,
  Edit,
  Trash2,
  Copy,
  Archive,
  Search,
  Filter,
  Clock,
  Loader2,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { CampaignStatus } from "@prisma/client";

interface Campaign {
  id: string;
  title: string;
  type: string;
  recipientCount: number;
  createdAt: string;
  scheduledAt?: string;
  sendAt?: string;
  status: CampaignStatus;
}

type StatusFilter = "ALL" | CampaignStatus;

const CampaignList = () => {
  const router = useRouter();
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [stats, setStats] = useState({
    ALL: 0,
    PENDING: 0,
    SENT: 0,
    ARCHIVED: 0,
  });
  const [limit, setLimit] = useState(10);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("ALL");
  const [typeFilter, setTypeFilter] = useState("all");

  // Alert dialog states
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [showArchiveAlert, setShowArchiveAlert] = useState(false);
  const [selectedCampaignId, setSelectedCampaignId] = useState<string>("");
  const [selectedCampaignTitle, setSelectedCampaignTitle] =
    useState<string>("");
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [archiveLoading, setArchiveLoading] = useState(false);

  // Static campaign data
  const staticCampaigns: Campaign[] = [
    {
      id: "1",
      title: "Welcome Email Campaign",
      type: "email",
      recipientCount: 1500,
      createdAt: new Date().toISOString(),
      status: "SENT",
      sendAt: new Date(Date.now() - 86400000).toISOString(), // Yesterday
    },
    {
      id: "2",
      title: "New Feature Announcement",
      type: "app",
      recipientCount: 3000,
      createdAt: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
      scheduledAt: new Date(Date.now() + 86400000).toISOString(), // Tomorrow
      status: "PENDING",
    },
    {
      id: "3",
      title: "Holiday Special",
      type: "email",
      recipientCount: 2500,
      createdAt: new Date(Date.now() - 259200000).toISOString(), // 3 days ago
      status: "ARCHIVED",
      sendAt: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
    },
  ];

  useEffect(() => {
    // Filter campaigns based on search term and status
    const filteredCampaigns = staticCampaigns.filter((campaign) => {
      const matchesSearch = campaign.title
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesStatus =
        statusFilter === "ALL" || campaign.status === statusFilter;
      const matchesType = typeFilter === "all" || campaign.type === typeFilter;

      return matchesSearch && matchesStatus && matchesType;
    });

    // Update stats
    const stats = {
      ALL: staticCampaigns.length,
      PENDING: staticCampaigns.filter((c) => c.status === "PENDING").length,
      SENT: staticCampaigns.filter((c) => c.status === "SENT").length,
      ARCHIVED: staticCampaigns.filter((c) => c.status === "ARCHIVED").length,
    };

    // Pagination
    const startIndex = (page - 1) * limit;
    const paginatedCampaigns = filteredCampaigns.slice(
      startIndex,
      startIndex + limit
    );

    setCampaigns(paginatedCampaigns);
    setTotal(filteredCampaigns.length);
    setTotalPages(Math.ceil(filteredCampaigns.length / limit));
    setStats(stats);
    setLoading(false);
  }, [page, limit, searchTerm, statusFilter, typeFilter]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getTypeIcon = (type: string) => {
    const iconProps = { size: 18, className: "text-white" };
    switch (type.toLowerCase()) {
      case "email":
        return <Mail {...iconProps} />;
      case "sms":
        return <MessageSquare {...iconProps} />;
      case "app":
        return <Bell {...iconProps} />;
      default:
        return <Send {...iconProps} />;
    }
  };

  const getStatusBadge = (status: Campaign["status"]) => {
    const baseClasses =
      "inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium border";

    switch (status) {
      case "PENDING":
        return (
          <span
            className={`${baseClasses} bg-yellow-900/30 text-yellow-400 border-yellow-700/50`}
          >
            <Clock size={10} />
            Pending
          </span>
        );
      case "SENT":
        return (
          <span
            className={`${baseClasses} bg-green-900/30 text-green-400 border-green-700/50`}
          >
            <Send size={10} />
            Sent
          </span>
        );
      case "ARCHIVED":
        return (
          <span
            className={`${baseClasses} bg-gray-700/30 text-gray-400 border-gray-600/50`}
          >
            <Archive size={10} />
            Archived
          </span>
        );
    }
  };

  const handleEdit = (campaignId: string) => {
    router.push(`/campaigns/${campaignId}/edit`);
  };

  const handleDeleteClick = (campaignId: string, campaignTitle: string) => {
    setSelectedCampaignId(campaignId);
    setSelectedCampaignTitle(campaignTitle);
    setShowDeleteAlert(true);
  };

  const handleArchiveClick = (campaignId: string, campaignTitle: string) => {
    setSelectedCampaignId(campaignId);
    setSelectedCampaignTitle(campaignTitle);
    setShowArchiveAlert(true);
  };

  const handleDeleteConfirm = () => {
    setDeleteLoading(true);

    // In a real app, you would call your API here
    console.log(`Deleting campaign: ${selectedCampaignId}`);

    // For demo, just remove from the list
    const updatedCampaigns = campaigns.filter(
      (campaign) => campaign.id !== selectedCampaignId
    );
    setCampaigns(updatedCampaigns);

    // Update stats
    setStats((prevStats) => ({
      ...prevStats,
      ALL: prevStats.ALL - 1,
      PENDING: prevStats.PENDING - 1, // Assuming only pending campaigns can be deleted
    }));

    setShowDeleteAlert(false);
    setDeleteLoading(false);
    setSelectedCampaignId("");
    setSelectedCampaignTitle("");
  };

  const handleArchiveConfirm = () => {
    setArchiveLoading(true);

    // In a real app, you would call your API here
    console.log(`Archiving campaign: ${selectedCampaignId}`);

    // For demo, just update the status
    const updatedCampaigns = campaigns.map((campaign) =>
      campaign.id === selectedCampaignId
        ? { ...campaign, status: "ARCHIVED" as CampaignStatus }
        : campaign
    );

    setCampaigns(updatedCampaigns);

    // Update stats
    setStats((prevStats) => ({
      ...prevStats,
      SENT: prevStats.SENT - 1,
      ARCHIVED: prevStats.ARCHIVED + 1,
    }));

    setShowArchiveAlert(false);
    setArchiveLoading(false);
    setSelectedCampaignId("");
    setSelectedCampaignTitle("");
  };

  const handleDuplicate = (campaignId: string) => {
    // In a real app, this would navigate to create page with the campaign ID
    console.log(`Duplicating campaign: ${campaignId}`);
    // For demo, we'll just show an alert
    alert(`Would navigate to create page with campaign ID: ${campaignId}`);
  };

  return (
    <div className="min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        {/* Header */}

        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-zinc-800 border border-zinc-700 rounded-lg flex items-center justify-center">
                <Send size={20} className="text-white" />
              </div>
              <div>
                <p className="text-xl font-bold text-white">{stats.ALL}</p>
                <p className="text-gray-400 text-sm">Total</p>
              </div>
            </div>
          </div>
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-yellow-900/20 border border-yellow-700 rounded-lg flex items-center justify-center">
                <Clock size={20} className="text-yellow-400" />
              </div>
              <div>
                <p className="text-xl font-bold text-yellow-400">
                  {stats.PENDING}
                </p>
                <p className="text-gray-400 text-sm">Pending</p>
              </div>
            </div>
          </div>
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-900/20 border border-green-700 rounded-lg flex items-center justify-center">
                <Send size={20} className="text-green-400" />
              </div>
              <div>
                <p className="text-xl font-bold text-green-400">{stats.SENT}</p>
                <p className="text-gray-400 text-sm">Sent</p>
              </div>
            </div>
          </div>
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-700/20 border border-gray-600 rounded-lg flex items-center justify-center">
                <Archive size={20} className="text-gray-400" />
              </div>
              <div>
                <p className="text-xl font-bold text-gray-400">
                  {stats.ARCHIVED}
                </p>
                <p className="text-gray-400 text-sm">Archived</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search
              size={18}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            />
            <Input
              placeholder="Search campaigns..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-zinc-900 border-zinc-800 text-white placeholder:text-gray-400 focus:border-zinc-600 h-10"
            />
          </div>
          <Select
            value={typeFilter}
            onValueChange={(value: string) => setTypeFilter(value)}
          >
            <SelectTrigger className="w-full sm:w-48 bg-zinc-900 border-zinc-800 text-white h-10">
              <div className="flex items-center gap-2">
                <Filter size={16} />
                <SelectValue placeholder="Filter by type" />
              </div>
            </SelectTrigger>
            <SelectContent className="bg-zinc-900 border-zinc-800">
              <SelectItem value="all" className="text-white hover:bg-zinc-800">
                All Type
              </SelectItem>
              <SelectItem
                value="email"
                className="text-white hover:bg-zinc-800"
              >
                Email
              </SelectItem>
              <SelectItem value="sms" className="text-white hover:bg-zinc-800">
                SMS
              </SelectItem>
              <SelectItem value="app" className="text-white hover:bg-zinc-800">
                App
              </SelectItem>
            </SelectContent>
          </Select>
          <Select
            value={statusFilter}
            onValueChange={(value: StatusFilter) => setStatusFilter(value)}
          >
            <SelectTrigger className="w-full sm:w-48 bg-zinc-900 border-zinc-800 text-white h-10">
              <div className="flex items-center gap-2">
                <Filter size={16} />
                <SelectValue placeholder="Filter by status" />
              </div>
            </SelectTrigger>
            <SelectContent className="bg-zinc-900 border-zinc-800">
              <SelectItem value="ALL" className="text-white hover:bg-zinc-800">
                All Status
              </SelectItem>
              <SelectItem
                value="PENDING"
                className="text-yellow-400 hover:bg-zinc-800"
              >
                Pending
              </SelectItem>
              <SelectItem
                value="SENT"
                className="text-green-400 hover:bg-zinc-800"
              >
                Sent
              </SelectItem>
              <SelectItem
                value="ARCHIVED"
                className="text-gray-400 hover:bg-zinc-800"
              >
                Archived
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="flex flex-col items-center gap-4">
              <div className="w-8 h-8 border-2 border-zinc-700 border-t-white rounded-full animate-spin"></div>
              <p className="text-gray-400">Loading campaigns...</p>
            </div>
          </div>
        ) : campaigns.length > 0 ? (
          <>
            {/* Campaign Cards */}
            <div className="space-y-4 mb-8">
              {campaigns.map((campaign) => (
                <div
                  key={campaign.id}
                  className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 hover:bg-zinc-800 hover:border-zinc-700 transition-all duration-300 group"
                >
                  {/* Header Row */}
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      <div className="w-10 h-10 bg-zinc-800 border border-zinc-700 rounded-lg flex items-center justify-center flex-shrink-0">
                        {getTypeIcon(campaign.type)}
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="font-semibold text-lg text-white mb-2 group-hover:text-gray-300 transition-colors truncate">
                          {campaign.title}
                        </h3>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 flex-wrap">
                      {getStatusBadge(campaign.status)}
                      <span className="px-2 py-1 rounded-md text-xs font-medium bg-zinc-800 text-gray-300 border border-zinc-700 capitalize">
                        {campaign.type}
                      </span>

                      {/* Actions Dropdown */}
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 w-8 p-0 text-gray-400 hover:text-white hover:bg-zinc-800 transition-all flex-shrink-0 rounded-lg"
                          >
                            <MoreHorizontal size={16} />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                          className="w-48 bg-zinc-900 border-zinc-800"
                          align="end"
                        >
                          {campaign.status === "PENDING" && (
                            <>
                              <DropdownMenuItem
                                onClick={() => handleEdit(campaign.id)}
                                className="text-white hover:bg-zinc-800 cursor-pointer"
                              >
                                <Edit size={14} className="mr-2" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuSeparator className="bg-zinc-800" />
                              <DropdownMenuItem
                                onClick={() =>
                                  handleDeleteClick(campaign.id, campaign.title)
                                }
                                className="text-red-400 hover:bg-zinc-800 cursor-pointer"
                              >
                                <Trash2 size={14} className="mr-2" />
                                Delete
                              </DropdownMenuItem>
                            </>
                          )}
                          {campaign.status === "SENT" && (
                            <>
                              <DropdownMenuItem
                                onClick={() => handleDuplicate(campaign.id)}
                                className="text-white hover:bg-zinc-800 cursor-pointer"
                              >
                                <Copy size={14} className="mr-2" />
                                Create Copy
                              </DropdownMenuItem>
                              <DropdownMenuSeparator className="bg-zinc-800" />
                              <DropdownMenuItem
                                onClick={() =>
                                  handleArchiveClick(
                                    campaign.id,
                                    campaign.title
                                  )
                                }
                                className="text-gray-400 hover:bg-zinc-800 cursor-pointer"
                              >
                                <Archive size={14} className="mr-2" />
                                Archive
                              </DropdownMenuItem>
                            </>
                          )}
                          {campaign.status === "ARCHIVED" && (
                            <DropdownMenuItem
                              onClick={() => handleDuplicate(campaign.id)}
                              className="text-white hover:bg-zinc-800 cursor-pointer"
                            >
                              <Copy size={14} className="mr-2" />
                              Create Copy
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    <div className="flex items-center gap-2 p-2 bg-zinc-800 rounded-lg border border-zinc-700">
                      <Users size={16} className="text-gray-400 mx-2" />
                      <div>
                        <p className="text-xs text-gray-500">Recipients</p>
                        <p className="font-medium text-white text-sm">
                          {campaign.recipientCount.toLocaleString()}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 p-2 bg-zinc-800 rounded-lg border border-zinc-700">
                      <Calendar size={16} className="text-gray-400 mx-2" />
                      <div>
                        <p className="text-xs text-gray-500">Created</p>
                        <p className="font-medium text-white text-xs">
                          {formatDate(campaign.createdAt)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 p-2 bg-zinc-800 rounded-lg border border-zinc-700">
                      {campaign.sendAt ? (
                        <>
                          <Send size={16} className="text-green-400 mx-2" />
                          <div>
                            <p className="text-xs text-gray-500">Sent</p>
                            <p className="font-medium text-green-400 text-xs">
                              {formatDate(campaign.sendAt)}
                            </p>
                          </div>
                        </>
                      ) : campaign.scheduledAt ? (
                        <>
                          <Clock size={16} className="text-yellow-400 mx-2" />
                          <div>
                            <p className="text-xs text-gray-500">Scheduled</p>
                            <p className="font-medium text-yellow-400 text-xs">
                              {formatDate(campaign.scheduledAt)}
                            </p>
                          </div>
                        </>
                      ) : (
                        <>
                          <TrendingUp
                            size={16}
                            className="text-gray-400 mx-2"
                          />
                          <div>
                            <p className="text-xs text-gray-500">Status</p>
                            <p className="font-medium text-white text-xs">
                              {campaign.status}
                            </p>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            <div className="flex justify-center">
              <AppPagination
                page={page}
                totalPages={totalPages}
                limit={limit}
                total={total}
                onPageChange={(newPage) => setPage(newPage)}
              />
            </div>
          </>
        ) : (
          /* Empty State */
          <div className="py-16 text-center">
            <div className="max-w-md mx-auto">
              <div className="w-20 h-20 mx-auto bg-zinc-900 border border-zinc-800 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                {searchTerm || statusFilter !== "ALL" ? (
                  <Search size={32} className="text-gray-400" />
                ) : (
                  <Send size={32} className="text-white" />
                )}
              </div>
              <h3 className="text-2xl font-bold mb-3 text-white">
                {searchTerm || statusFilter !== "ALL"
                  ? "No Results Found"
                  : "No Campaigns Yet"}
              </h3>
              <p className="text-gray-400 mb-8 leading-relaxed">
                {searchTerm || statusFilter !== "ALL"
                  ? "Try adjusting your search or filter criteria to find what you're looking for."
                  : "Start engaging your audience by creating your first marketing campaign. Reach customers through email, SMS, or push notifications."}
              </p>
              {!searchTerm && statusFilter === "ALL" && (
                <Link href="/campaigns/create">
                  <Button className="bg-white text-black hover:bg-gray-100 transition-all duration-200 shadow-lg px-6 py-2">
                    <Plus size={18} className="mr-2" />
                    Create Your First Campaign
                  </Button>
                </Link>
              )}
            </div>
          </div>
        )}

        {/* Delete Alert Dialog */}
        <AlertDialog open={showDeleteAlert} onOpenChange={setShowDeleteAlert}>
          <AlertDialogContent className="bg-zinc-900 border-zinc-800">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-white">
                Delete Campaign
              </AlertDialogTitle>
              <AlertDialogDescription className="text-gray-400">
                Are you sure you want to delete "
                <span className="font-medium text-white">
                  {selectedCampaignTitle}
                </span>
                "? This action cannot be undone and will permanently remove the
                campaign and all its data.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel
                className="bg-zinc-800 text-white border-zinc-700 hover:bg-zinc-700"
                disabled={deleteLoading}
              >
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDeleteConfirm}
                disabled={deleteLoading}
                className="bg-red-600 text-white hover:bg-red-700 disabled:opacity-50"
              >
                {deleteLoading ? (
                  <>
                    <Loader2 size={16} className="mr-2 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 size={16} className="mr-2" />
                    Delete
                  </>
                )}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Archive Alert Dialog */}
        <AlertDialog open={showArchiveAlert} onOpenChange={setShowArchiveAlert}>
          <AlertDialogContent className="bg-zinc-900 border-zinc-800">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-white">
                Archive Campaign
              </AlertDialogTitle>
              <AlertDialogDescription className="text-gray-400">
                Are you sure you want to archive "
                <span className="font-medium text-white">
                  {selectedCampaignTitle}
                </span>
                "? Archived campaigns will be moved to the archived section and
                won't appear in the main campaign list.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel
                className="bg-zinc-800 text-white border-zinc-700 hover:bg-zinc-700"
                disabled={archiveLoading}
              >
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={handleArchiveConfirm}
                disabled={archiveLoading}
                className="bg-gray-600 text-white hover:bg-gray-700 disabled:opacity-50"
              >
                {archiveLoading ? (
                  <>
                    <Loader2 size={16} className="mr-2 animate-spin" />
                    Archiving...
                  </>
                ) : (
                  <>
                    <Archive size={16} className="mr-2" />
                    Archive
                  </>
                )}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
};

export default CampaignList;
