"use client";

import Button from "@/app/dashboard/_components/Button";
import { Pool } from "@/payload-types";
import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";
import axiosInstance from "@/app/dashboard/_helpers/axios";
import { ROUTES } from "@/app/dashboard/_contstants/routes";

const HiddenControl = ({
  pool,
  action,
  buttonText,
  buttonClassName,
  onSuccess,
}: {
  pool: Pool;
  action: "hide" | "show";
  buttonText: string;
  buttonClassName: string;
  onSuccess?: () => void;
}) => {
  const operatePostMutation = useMutation({
    mutationFn: async (
      operate: "hide" | "show",
    ): Promise<{
      ok: boolean;
      message: string;
      data: { id: string };
    }> => {
      return axiosInstance.post(ROUTES.pools_operate_action(pool.id, operate));
    },
  });
  const handleOperate = async (operate: "hide" | "show") => {
    try {
      const resp = await operatePostMutation.mutateAsync(operate);
      console.log(`handle.${operate}.resp`, resp);
      toast.success(resp.message);
      onSuccess?.();
    } catch (e: any) {
      toast.error(e?.toString());
    }
  };

  return (
    <Button
      type="button"
      isStroke
      className={`${buttonClassName} disabled:!border-transparent gap-2`}
      onClick={() => handleOperate(action)}
    >
      {buttonText}
    </Button>
  );
};

export default HiddenControl;
