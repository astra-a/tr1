"use client";

import Layout from "@/app/dashboard/_components/Layout";
import { Media } from "@/payload-types";
import Button from "@/app/dashboard/_components/Button";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Card from "@/app/dashboard/_components/Card";
import InputField from "@/app/dashboard/_components/Fields/Input";
import UploadImage from "@/app/dashboard/_components/Fields/UploadImage";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/app/dashboard/_contstants/routes";
import { useMutation } from "@tanstack/react-query";
import axiosInstance from "@/app/dashboard/_helpers/axios";

const MediaForm = ({
  media,
  pageTitle,
}: {
  media: Media;
  pageTitle?: string;
}) => {
  const router = useRouter();

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
  const updateMediaMutation = useMutation({
    mutationFn: async (
      data: FormData,
    ): Promise<{ ok: boolean; message: string; data: Media }> => {
      return axiosInstance.post(ROUTES.media_edit_action(media.id), data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
    },
  });

  // --- form validate

  const schema = z.object({
    alt: z.string().min(1, { message: "Alt can't be empty" }),
    file: media.id
      ? z
          .file()
          .mime(["image/jpeg", "image/png", "image/gif", "image/webp"])
          .nullish()
      : z
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
    defaultValues: { alt: media.alt },
  });
  const onSubmit = async (data: { alt: string; file?: File | null }) => {
    console.log("onSubmit.data", data);
    const formData = new FormData();
    formData.append("alt", data.alt);
    if (!media.id && data.file) {
      formData.append("file", data.file);
    }
    try {
      const resp = await (
        media.id ? updateMediaMutation : createMediaMutation
      ).mutateAsync(formData);
      console.log("resp", resp);
      toast.success(resp.message);
      router.push(ROUTES.media_edit(resp.data.id));
    } catch (e: any) {
      toast.error(e?.toString());
    }
  };

  return (
    <Layout title={pageTitle} customHeaderActions={<></>}>
      <form
        id="media-form"
        encType="multipart/form-data"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="flex max-lg:block">
          <div className="w-[calc(100%-33.75rem)] pr-3 max-4xl:w-[calc(100%-27.5rem)] max-2xl:w-[calc(100%-23rem)] max-lg:w-full max-lg:pr-0">
            <Card title="Media Details">
              <div className="flex flex-col gap-8 px-5 pb-5 max-lg:px-3 max-lg:pb-3">
                <UploadImage
                  label="Image"
                  errorIcon={false}
                  initialImage={media.url}
                  onChange={(file) => {
                    if (file) {
                      setValue("file", file);
                    } else {
                      reset({ alt: getValues("alt") });
                    }
                    trigger?.("file");
                  }}
                  errorMessage={errors?.file?.message}
                  showRemove={!media.id}
                />
                <InputField
                  label="Alt"
                  tooltip="Maximum 100 characters. No HTML or emoji allowed"
                  placeholder="ie. Bento Cards: User Interface"
                  {...register("alt")}
                  errorMessage={errors?.alt?.message}
                />
              </div>
            </Card>
            <Button
              className="max-md:w-[calc(50%-0.75rem)] max-md:mx-1.5 mb-2 w-full"
              isWhite
              type="submit"
            >
              Save
            </Button>
          </div>
          <div className="w-[33.75rem] max-4xl:w-[27.5rem] max-2xl:w-[23rem] max-lg:w-full max-lg:mt-3" />
        </div>
      </form>
    </Layout>
  );
};

export default MediaForm;
