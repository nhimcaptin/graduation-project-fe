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
  value: boolean;
  chipType: string;
}

export const statusOptions: IStatusType[] = [
  {
    label: 'Đang hoạt động',
    value: true,
    chipType: STATUS_CHIP.ACTIVE
  },
  {
    label: 'Không hoạt động',
    value: false,
    chipType: STATUS_CHIP.INACTIVE
  }
];

