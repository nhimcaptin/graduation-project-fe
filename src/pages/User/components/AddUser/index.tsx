import React from "react";
import CrudModal from "../../../../components/CrudModal";

interface PropsType {
  isOpen: boolean;
  dataDetail: any;
  title: string;
  onCancel: (parameter: any) => void;
  isEdit: boolean;
}

const AddUser = (props: PropsType) => {
  const { isOpen, title, isEdit, onCancel, dataDetail } = props;
  return (
    <CrudModal
      isOpen={isOpen}
      formTitle={title}
      handleSave={isEdit ? () => {} : undefined}
      handleClose={onCancel}
      cancelBtnLabel="Hủy"
      saveBtnLabel="Lưu"
      dialogProps={{
        fullWidth: true,
        maxWidth: "md",
      }}
    >
      <div>123123</div>
    </CrudModal>
  );
};

export default AddUser;
