"use client";

import {
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Image as ImageIcon, Loader2, X } from "lucide-react";
import Image from "next/image";
import { useState, ChangeEvent, DragEvent, useEffect } from "react";
import mediaService from "../api.service";

interface ImageUploadProps {
  label?: string;
  value?: string | null;
  onChange: (url: string | null) => void;
  accept?: string;
}

export default function MediaUpload({
  label,
  value,
  onChange,
  accept = "image/*",
}: ImageUploadProps) {
  const [preview, setPreview] = useState<string | null>(
    typeof value === "string" ? value : null
  );
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    setPreview(value ?? null);
  }, [value]);

  const handleFile = async (file: File) => {
    setIsUploading(true);
    setPreview(URL.createObjectURL(file));

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = (await mediaService.upload(formData)) as any;
      if (res?.url) {
        setPreview(res.url);
        onChange(res.url);
      } else {
        setPreview(null);
        onChange(null);
      }
    } catch (error) {
      console.error("Image upload failed:", error);
      setPreview(null);
      onChange(null);
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFile(file);
    }
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFile(file);
    }
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleRemove = () => {
    setPreview(null);
    onChange(null);
  };

  return (
    <FormItem>
      {label && <FormLabel>{label}</FormLabel>}
      <FormControl>
        <div
          className={cn(
            "relative flex justify-center items-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer hover:border-primary transition-colors",
            isDragging && "border-primary bg-primary/10"
          )}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
        >
          {isUploading ? (
            <div className="flex flex-col items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="text-sm text-muted-foreground mt-2">Uploading...</p>
            </div>
          ) : preview ? (
            <>
              <Image
                src={preview}
                alt="Preview"
                layout="fill"
                objectFit="contain"
                className="rounded-lg"
              />
              <button
                type="button"
                onClick={handleRemove}
                className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1"
              >
                <X className="h-4 w-4" />
              </button>
            </>
          ) : (
            <label className="flex flex-col items-center justify-center w-full h-full cursor-pointer">
              <ImageIcon className="h-8 w-8 text-muted-foreground" />
              <p className="text-sm text-muted-foreground mt-2">
                Drag & drop or click to upload
              </p>
              <Input
                type="file"
                className="hidden"
                onChange={handleFileChange}
                accept={accept}
              />
            </label>
          )}
        </div>
      </FormControl>
      <FormMessage />
    </FormItem>
  );
}
