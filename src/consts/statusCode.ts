export const STATUS_CODE = {
  SUCCESS: 200,
};

export const STATUS_TOAST = {
  SUCCESS: "success",
  ERROR: "error",
};

export const STATUS_CHIP = {
  ACTIVE: "ACTIVE",
  INACTIVE: "INACTIVE",
  SUCCESS: "SUCCESS",
  FAILURE: "FAILURE",
  WARNING: "WARNING",
  DRAFT: "DRAFT",
  DONE: "DONE",
  WaitingDone: "WaitingDone",
};
export interface IStatusType {
  label: string;
  value: string | boolean;
  chipType: string;
}

export const statusOptions: IStatusType[] = [
  {
    label: "Chờ xác nhận",
    value: "Waiting",
    chipType: STATUS_CHIP.WARNING,
  },
  {
    label: "Chờ khám",
    value: "Approved",
    chipType: STATUS_CHIP.ACTIVE,
  },
  {
    label: "Hủy",
    value: "Cancel",
    chipType: STATUS_CHIP.INACTIVE,
  },
  {
    label: "Đang Khám",
    value: "WaitingDone",
    chipType: STATUS_CHIP.WaitingDone,
  },
  {
    label: "Đã khám",
    value: "Done",
    chipType: STATUS_CHIP.DONE,
  },
  {
    label: "Đang hoạt động",
    value: true,
    chipType: STATUS_CHIP.ACTIVE,
  },
  {
    label: "Không hoạt động",
    value: false,
    chipType: STATUS_CHIP.INACTIVE,
  },
];
