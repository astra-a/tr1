import { useState } from "react";
import Card from "@/app/dashboard/_components/Card";
import Field from "@/app/dashboard/_components/Field";
import Button from "@/app/dashboard/_components/Button";
import { useMutation } from "@tanstack/react-query";
import axiosInstance from "@/app/dashboard/_helpers/axios";
import { ROUTES } from "@/app/dashboard/_contstants/routes";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const Password = ({}) => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

  const router = useRouter();

  // --- mutation:
  const changePasswordMutation = useMutation({
    mutationFn: async (
      data: any,
    ): Promise<{ ok: boolean; message: string; data: { id: string } }> => {
      return axiosInstance.post(ROUTES.settings_change_password, data);
    },
  });

  const onSubmit = async (data: {
    oldPassword: string;
    newPassword: string;
    confirmNewPassword: string;
  }) => {
    console.log("onSubmit.data", data);
    try {
      const resp = await changePasswordMutation.mutateAsync(data);
      console.log("resp", resp);
      toast.success(resp.message);
      router.push(ROUTES.login);
    } catch (e: any) {
      toast.error(e?.toString());
    }
  };

  return (
    <Card title="Password">
      <div className="flex flex-col gap-8 p-5 pt-0 max-lg:px-3 max-md:gap-4">
        <Field
          innerLabel="Password"
          placeholder="Enter password"
          type="password"
          value={oldPassword}
          onChange={(e) => setOldPassword(e.target.value)}
          required
          handleForgotPassword={() => {}}
        />
        <div className="flex gap-4 max-md:flex-col">
          <Field
            className="flex-1"
            innerLabel="New password"
            placeholder="Enter new password"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
          <Field
            className="flex-1"
            innerLabel="Confirm new password"
            placeholder="Confirm new password"
            type="password"
            value={confirmNewPassword}
            onChange={(e) => setConfirmNewPassword(e.target.value)}
            required
            errorMessage={
              newPassword === confirmNewPassword ? "" : "Passwords do not match"
            }
          />
        </div>
        <Button
          className="self-start"
          isBlack
          onClick={() =>
            onSubmit({ oldPassword, newPassword, confirmNewPassword })
          }
        >
          Update password
        </Button>
      </div>
    </Card>
  );
};

export default Password;
