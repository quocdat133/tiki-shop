import { useMutation } from "@tanstack/react-query";

export const useMutationHook = (fnCallback) => {
  const mutation = useMutation({
    // useMutation dùng để thực hiện các phép toán thay đổi dữ liệu (mutation), chẳng hạn như thêm, cập nhật hoặc xóa dữ liệu
    mutationFn: fnCallback,
  });
  return mutation;
};
