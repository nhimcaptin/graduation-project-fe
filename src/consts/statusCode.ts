export const STATUS_CODE = {
  SUCCESS: 200
};

export const STATUS_TOAST = {
  SUCCESS: 'success',
  ERROR: 'error'
};

export const STATUS_CHIP = {
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE',
  SUCCESS: 'SUCCESS',
  FAILURE: 'FAILURE',
  WARNING: 'WARNING',
  DRAFT: 'DRAFT'
};
export interface IStatusType {
  label: string;
  value: string;
  chipType: string;
}

export const statusOptions: IStatusType[] = [
  {
    label: 'Chờ xác nhận',
    value: "Waiting",
    chipType: STATUS_CHIP.INACTIVE
  },
  {
    label: 'Chờ khám',
    value: "Approved",
    chipType: STATUS_CHIP.ACTIVE
  }
];

