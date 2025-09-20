"use client";

import { Media } from "@/payload-types";
import Button from "@/app/dashboard/_components/Button";
import UploadImage from "@/app/dashboard/_components/Fields/UploadImage";
import InputField from "@/app/dashboard/_components/Fields/Input";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";
import axiosInstance from "@/app/dashboard/_helpers/axios";
import { ROUTES } from "@/app/dashboard/_contstants/routes";

export default function CreateMediaDialog({
  onClose,
  onUpload,
  showChooseButton,
  switchToChoose,
}: {
  onClose: () => void;
  onUpload: (media: Media) => void;
  showChooseButton?: boolean;
  switchToChoose?: () => void;
}) {
  // --- mutation:
  const createMediaMutation = useMutation({
    mutationFn: async (
      data: FormData,
    ): Promise<{ ok: boolean; message: string; data: Media }> => {
      return axiosInstance.post(ROUTES.media_new_action, data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
    },
  });

  // --- form validate
  const schema = z.object({
    alt: z.string().min(1, { message: "Alt can't be empty" }),
    file: z
      .file({ message: "No Image" })
      .mime(["image/jpeg", "image/png", "image/gif", "image/webp"]),
  });
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    getValues,
    reset,
    trigger,
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { alt: "" },
  });
  const onSubmit = async (data: { alt: string; file?: File | null }) => {
    console.log("onSubmit.data", data);
    const formData = new FormData();
    formData.append("alt", data.alt);
    if (data.file) {
      formData.append("file", data.file);
    }
    try {
      const resp = await createMediaMutation.mutateAsync(formData);
      console.log("resp", resp);
      toast.success(resp.message);
      onUpload(resp.data as Media);
    } catch (e: any) {
      toast.error(e?.toString());
    }
  };

  return (
    <div
      className="fixed inset-0 z-100 bg-black/36"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="absolute left-[20vw] top-[10vh] w-[60vw] min-h-[25vh] bg-white rounded-xl p-6">
        <div className="flex justify-between">
          <h2 className="text-3xl font-semibold text-black">
            Creating new Media
          </h2>
          <div className="flex items-center gap-4">
            {showChooseButton && (
              <Button
                type="button"
                icon="chain"
                isStroke
                onClick={switchToChoose}
              >
                <span className="ml-2">Choose</span>
              </Button>
            )}
            <Button
              type="button"
              icon="close"
              isGray
              isCircle
              onClick={onClose}
            />
          </div>
        </div>
        <div className="mt-4 max-h-[60vh] overflow-auto">
          <form
            id="media-form"
            encType="multipart/form-data"
            onSubmit={handleSubmit(onSubmit)}
          >
            <div className="flex max-lg:block">
              <div className="w-full">
                <div className="flex flex-col gap-8 px-5 max-lg:px-3">
                  <UploadImage
                    label="Image"
                    errorIcon={false}
                    onChange={(file) => {
                      if (file) {
                        setValue("file", file);
                      } else {
                        reset({ alt: getValues("alt") });
                      }
                      trigger?.("file");
                    }}
                    errorMessage={errors?.file?.message}
                  />
                  <InputField
                    label="Alt"
                    tooltip="Maximum 100 characters. No HTML or emoji allowed"
                    placeholder="ie. Bento Cards: User Interface"
                    {...register("alt")}
                    errorMessage={errors?.alt?.message}
                  />
                </div>
              </div>
            </div>
          </form>
        </div>
        <div className="flex justify-center mt-4">
          <Button
            className="max-md:w-[calc(50%-0.75rem)] max-md:mx-1.5 mb-2"
            isGray
            type="submit"
            form="media-form"
          >
            Save
          </Button>
        </div>
      </div>
    </div>
  );
}
