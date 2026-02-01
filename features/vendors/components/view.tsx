"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  MapPin,
  Globe,
  Phone,
  Utensils,
  Coffee,
  Wifi,
  ParkingCircle,
  CreditCard,
  Clock,
  Calendar,
  CheckCircle2,
  XCircle,
  AlertCircle,
  ArrowLeft,
  ExternalLink,
  Pencil,
  Gift,
} from "lucide-react";
import { Vendor } from "../model";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import vendorService from "../api.service";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import Image from "next/image";
import { Separator } from "@/components/ui/separator";
import EditVendorHours from "./edit-hours";
import EditVendor from "./edit";
import { useModal } from "@/hooks/use-modal";

const formatTime = (time24: string) => {
  if (!time24) return "Closed";
  const [hours, minutes] = time24.split(":");
  const hour = parseInt(hours);
  const hour12 = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
  const ampm = hour >= 12 ? "PM" : "AM";
  return `${hour12}:${minutes} ${ampm}`;
};

const getStatusConfig = (status: string) => {
  switch (status) {
    case "APPROVED":
      return {
        icon: CheckCircle2,
        color: "text-green-600 dark:text-green-400",
        bg: "bg-green-100 dark:bg-green-950",
        badge: "default",
      };
    case "PENDING":
      return {
        icon: AlertCircle,
        color: "text-yellow-600 dark:text-yellow-400",
        bg: "bg-yellow-100 dark:bg-yellow-950",
        badge: "outline",
      };
    default:
      return {
        icon: XCircle,
        color: "text-red-600 dark:text-red-400",
        bg: "bg-red-100 dark:bg-red-950",
        badge: "destructive",
      };
  }
};

export default function VendorView() {
  const params = useParams();
  const [vendor, setVendor] = useState<Vendor | null>(null);
  const [loading, setLoading] = useState(true);
  const { openModal } = useModal();

  useEffect(() => {
    const fetchVendor = async () => {
      try {
        const data = await vendorService.get(params.id as string);
        if (!data || !data.vendor) {
          return;
        }
        setVendor(data.vendor);
      } catch (error) {
        console.error("Failed to fetch vendor:", error);
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchVendor();
    }
  }, [params.id]);

  if (loading) {
    return (
      <div className="container mx-auto max-w-7xl px-4 py-8">
        <div className="space-y-8">
          <div className="flex items-center justify-between">
            <Skeleton className="h-10 w-32" />
            <Skeleton className="h-10 w-32" />
          </div>
          <Skeleton className="h-64 w-full rounded-xl" />
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-6">
              <Skeleton className="h-96" />
            </div>
            <div className="space-y-6">
              <Skeleton className="h-64" />
              <Skeleton className="h-48" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!vendor) {
    return (
      <div className="container mx-auto max-w-7xl px-4 py-16">
        <div className="flex h-[50vh] flex-col items-center justify-center space-y-6 text-center">
          <div className="rounded-full bg-muted p-6">
            <AlertCircle className="h-12 w-12 text-muted-foreground" />
          </div>
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tight">
              Vendor Not Found
            </h2>
            <p className="text-lg text-muted-foreground max-w-md">
              The vendor you&apos;re looking for doesn&apos;t exist or has been
              removed.
            </p>
          </div>
          <Button size="lg" asChild className="btn-primary-gradient">
            <Link href="/vendors">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Vendors
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  const {
    name,
    address,
    operation_hours,
    mobile,
    website,
    logo,
    banner,
    amenities,
    serves_breakfast,
  } = vendor;

  const statusConfig = getStatusConfig(vendor.status);
  const StatusIcon = statusConfig.icon;

  const handleEditVendor = async () => {
    openModal(
      EditVendor,
      { vendor },
      { size: "lg" },
      (result: Vendor | null) => {
        if (result) {
          setVendor(result);
        }
      }
    );
  };

  const handleEditHours = async () => {
    openModal(
      EditVendorHours,
      {
        vendorId: vendor.id,
        hours: operation_hours || [],
      },
      { size: "md" },
      (result: Vendor | null) => {
        if (result) {
          setVendor(result);
        }
      }
    );
  };

  return (
    <div className="container mx-auto max-w-7xl px-4 pb-8">
      {/* Header Navigation */}
      <div className="flex items-center justify-between mb-4">
        <Button
          variant="ghost"
          size="sm"
          asChild
          className="text-sm sm:text-base h-9 sm:h-10 px-3"
        >
          <Link href="/vendors" className="flex items-center">
            <ArrowLeft className="mr-1.5 h-4 w-4 flex-shrink-0" />
            <span>Back to Vendors</span>
          </Link>
        </Button>

        <div className="flex items-center gap-2">
          <Link href={`/vendors/${vendor.id}/vouchers`}>
            <Button className="btn-primary-gradient">
              <Gift className="h-4 w-4" />
              Vouchers Cards
            </Button>
          </Link>
        </div>
      </div>

      {/* Hero Banner Section */}
      <div className="relative mb-6 sm:mb-8 overflow-hidden rounded-xl sm:rounded-2xl bg-gradient-to-b from-secondary/10 via-primary/50 to-primary/5 shadow-lg">
        {banner ? (
          <div className="relative h-80 sm:h-60 md:h-72 w-full">
            <Image
              src={banner}
              alt={`${name} banner`}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/50 to-transparent" />
          </div>
        ) : (
          <div className="h-80 sm:h-60 md:h-72 w-full bg-gradient-to-t from-secondary/20 via-primary/50 to-primary/5" />
        )}

        {/* Vendor Header Info Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 md:p-8 bg-gradient-to-t from-background/90 via-background/70 to-transparent">
          <div className="flex flex-col gap-4 sm:gap-6 sm:flex-row sm:items-end sm:justify-between">
            <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4 sm:gap-6">
              <Avatar className="h-16 w-16 sm:h-20 sm:w-20 md:h-24 md:w-24 border-2 sm:border-4 border-background shadow-lg bg-background">
                {logo ? (
                  <AvatarImage src={logo} alt={name} className="object-cover" />
                ) : (
                  <div className="h-full w-full flex items-center justify-center bg-primary/10">
                    <span className="text-2xl font-bold text-primary">
                      {name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
              </Avatar>

              <div className="space-y-2 sm:space-y-3 w-full">
                <div className="pr-4">
                  <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-foreground break-words">
                    {name}
                  </h1>
                  {address && (
                    <p className="mt-1 sm:mt-2 flex items-center gap-1.5 text-muted-foreground text-sm sm:text-base">
                      <MapPin className="h-3.5 w-3.5 sm:h-4 sm:w-4 flex-shrink-0 mt-0.5" />
                      <span className="line-clamp-2">
                        {address.city}, {address.state}
                      </span>
                    </p>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                  <Badge
                    variant={statusConfig.badge as any}
                    className="gap-1 px-2 py-0.5 sm:px-3 sm:py-1 text-xs sm:text-sm"
                  >
                    <StatusIcon className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                    <span className="capitalize font-medium">
                      {vendor.status.toLowerCase()}
                    </span>
                  </Badge>
                  {serves_breakfast && (
                    <Badge
                      variant="secondary"
                      className="gap-1 px-2 py-0.5 sm:px-3 sm:py-1 text-xs sm:text-sm"
                    >
                      <Utensils className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                      <span className="hidden sm:inline">Serves</span> Breakfast
                    </Badge>
                  )}
                </div>
              </div>
            </div>

            <Button
              variant="default"
              size="sm"
              onClick={handleEditVendor}
              className="shadow-lg w-full sm:w-auto mt-4 sm:mt-0 h-10 sm:h-9 btn-primary-gradient"
            >
              <Pencil className="h-3.5 w-3.5 sm:h-4 sm:w-4 flex-shrink-0" />
              <span className="ml-1.5 whitespace-nowrap">Edit Vendor</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-4 sm:gap-6 lg:grid-cols-3">
        {/* Left Column - Main Information */}
        <div className="lg:col-span-2 space-y-6">
          {/* Contact & Location Card */}
          <Card className="shadow-sm gap-0">
            <CardHeader className="px-4 sm:px-6">
              <CardTitle className="flex items-center gap-2 text-base">
                <MapPin className="h-4 w-4 text-primary" />
                <span className="text-sm sm:text-base">Contact & Location</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 sm:space-y-6 p-4 sm:p-6">
              {/* Address Section */}
              {address && (
                <div className="space-y-3">
                  <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                    Address
                  </h3>
                  <div className="rounded-lg border bg-muted/30 p-3 sm:p-4">
                    <div className="space-y-1 text-sm leading-relaxed">
                      <p className="font-medium">{address.address_line_1}</p>
                      {address.address_line_2 && (
                        <p>{address.address_line_2}</p>
                      )}
                      <p className="text-muted-foreground">
                        {address.city}, {address.state} {address.postal_code}
                      </p>
                      <p className="text-muted-foreground">{address.country}</p>
                    </div>
                  </div>
                </div>
              )}

              <Separator />

              {/* Contact Methods */}
              <div className="space-y-3">
                <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                  Contact Information
                </h3>
                <div className="grid gap-3 sm:grid-cols-2">
                  {mobile && (
                    <a
                      href={`tel:${mobile}`}
                      className="flex items-center gap-3 rounded-lg border bg-muted/30 p-4 transition-colors hover:bg-muted/50"
                    >
                      <div className="rounded-full bg-primary/10 p-2">
                        <Phone className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Phone</p>
                        <p className="font-medium">{mobile}</p>
                      </div>
                    </a>
                  )}
                  {website && (
                    <a
                      href={
                        website.startsWith("http")
                          ? website
                          : `https://${website}`
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 rounded-lg border bg-muted/30 p-4 transition-colors hover:bg-muted/50"
                    >
                      <div className="rounded-full bg-primary/10 p-2">
                        <Globe className="h-4 w-4 text-primary" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs text-muted-foreground">Website</p>
                        <p className="truncate font-medium">
                          {website.replace(/^https?:\/\//, "")}
                        </p>
                      </div>
                      <ExternalLink className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                    </a>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Amenities Card */}
          {amenities && amenities.length > 0 && (
            <Card className="shadow-sm gap-0">
              <CardHeader className="pb-2 px-4 sm:px-6">
                <CardTitle className="flex items-center gap-2 text-base">
                  <Coffee className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                  <span className="text-sm sm:text-base">
                    Amenities & Features
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="px-4 sm:px-6">
                <div className="grid gap-2 sm:gap-3 grid-cols-2 sm:grid-cols-2 lg:grid-cols-3">
                  {amenities.map((amenity) => {
                    let Icon = Coffee;
                    if (amenity.name === "Wifi") Icon = Wifi;
                    if (amenity.name === "Parking") Icon = ParkingCircle;
                    if (amenity.name === "Card Payment") Icon = CreditCard;

                    return (
                      <div
                        key={amenity.id}
                        className="flex items-center gap-2 sm:gap-3 rounded-lg border bg-muted/30 p-2 sm:p-3 transition-colors hover:border-primary/50"
                      >
                        <div className="rounded-full bg-primary/10 p-1.5 sm:p-2">
                          <Icon className="h-3 w-3 sm:h-4 sm:w-4 text-primary" />
                        </div>
                        <span className="font-medium text-xs sm:text-sm truncate">
                          {amenity.name}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right Column - Operating Hours & Details */}
        <div className="space-y-6">
          {/* Operating Hours Card */}
          <Card className="shadow-sm gap-0">
            <CardHeader className="pb-2 px-4 sm:px-6">
              <div className="flex items-center justify-between gap-2">
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                  <span className="text-sm sm:text-base">Operating Hours</span>
                </CardTitle>
                <Button
                  variant="default"
                  className="gap-1.5 h-8 btn-primary-gradient"
                  onClick={handleEditHours}
                >
                  <Pencil className="h-3.5 w-3.5" />
                  <span className="text-xs">Edit</span>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {operation_hours && operation_hours.length > 0 ? (
                <div className="space-y-2">
                  {operation_hours.map((hour) => {
                    const isToday =
                      new Date()
                        .toLocaleDateString("en-US", { weekday: "long" })
                        .toUpperCase() === hour.day_of_week;
                    const isClosed = hour.close;

                    return (
                      <div
                        key={hour.day_of_week}
                        className={`flex items-center justify-between rounded-lg border p-2.5 sm:p-3 text-xs sm:text-sm transition-colors ${
                          isToday
                            ? "border-primary bg-primary/5 font-medium"
                            : "border-transparent bg-muted/30"
                        }`}
                      >
                        <span className="capitalize font-medium">
                          {hour.day_of_week.slice(0, 3).toLowerCase()}
                          {isToday && (
                            <span className="ml-1.5 text-[10px] sm:text-xs text-primary">
                              (Today)
                            </span>
                          )}
                        </span>
                        <span
                          className={`${
                            isClosed
                              ? "text-muted-foreground"
                              : "text-foreground"
                          }`}
                        >
                          {isClosed
                            ? "Closed"
                            : `${formatTime(hour.from || "")} - ${formatTime(
                                hour.to || ""
                              )}`}
                        </span>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-center text-sm text-muted-foreground py-4">
                  No operating hours available
                </p>
              )}
            </CardContent>
          </Card>

          {/* Status & Metadata Card */}
          <Card className="shadow-sm gap-0">
            <CardHeader className="pb-2 px-4 sm:px-6">
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                <span className="text-sm sm:text-base">Vendor Details</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 sm:space-y-4 px-4 sm:ps-6">
              <div className="space-y-2 sm:space-y-3">
                <div className="flex items-center justify-between rounded-lg border p-2.5 sm:p-3">
                  <span className="text-sm font-medium text-muted-foreground">
                    Status
                  </span>
                  <div className="flex items-center gap-2">
                    <div
                      className={`h-2 w-2 rounded-full ${
                        vendor.status === "APPROVED"
                          ? "bg-green-500"
                          : vendor.status === "PENDING"
                          ? "bg-yellow-500"
                          : "bg-red-500"
                      } animate-pulse`}
                    />
                    <span className="text-sm font-medium capitalize">
                      {vendor.status.toLowerCase()}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between rounded-lg border p-2.5 sm:p-3">
                  <span className="text-xs sm:text-sm font-medium text-muted-foreground">
                    Created
                  </span>
                  <span className="text-sm font-medium">
                    {new Date(vendor.created_at * 1000).toLocaleDateString(
                      "en-US",
                      {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      }
                    )}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
