import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import ControlPointIcon from "@mui/icons-material/ControlPoint";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { Grid } from "@mui/material";
import { useRef, useState } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { ButtonAddFileMainSelect } from "../../../../components/ButtonAddFile/ButtonAddFile";
import CrudModal from "../../../../components/CrudModal";
import ErrorMessage from "../../../../components/ErrorMessage/ErrorMessage";
import FocusHiddenInput from "../../../../components/FocusHiddenInput";
import LabelCustom from "../../../../components/LabelCustom";
import ReactSelect from "../../../../components/ReactSelectView";
import SunEditorShare from "../../../../components/SunEditorStyled";
import TextFieldCustom from "../../../../components/TextFieldCustom";
import { MESSAGE_ERROR, MESSAGE_SUCCESS } from "../../../../consts/messages";
import { isCheckValue, stripHTML } from "../../../../utils";
import PriceInput from "../../../../components/PriceInput";
import { useSetToastInformationState } from "../../../../redux/store/ToastMessage";
import { useSetLoadingScreenState } from "../../../../redux/store/loadingScreen";
import { STATUS_TOAST } from "../../../../consts/statusCode";
import URL_PATHS from "../../../../services/url-path";
import apiService from "../../../../services/api-services";
import { handleErrorMessage } from "../../../../utils/errorMessage";
import { useUploadFileService } from "../../../../services/upload-file.service";
import { isEmpty } from "lodash";

interface PropsType {
  isOpen: boolean;
  dataDetail: any;
  title: string;
  onCancel: () => void;
  getData: (params: any) => void;
  isEdit: boolean;
}

interface VoucherItem {
  classify: string | null;
  discountAmount: string | null;
  allInPrice: string | null;
  origin: string | null;
  guarantee: string | null;
}

const voucherItem = [{ classify: "", discountAmount: "", allInPrice: "", origin: "", guarantee: "" }];
const listStatus = [
  {
    value: true,
    label: "Đang hoạt động",
  },
  {
    value: false,
    label: "Không hoạt động",
  },
];

const AddVoucher = (props: PropsType) => {
  const { isOpen, title, isEdit, onCancel, getData, dataDetail } = props;

  const { setToastInformation } = useSetToastInformationState();
  const { setLoadingScreen } = useSetLoadingScreenState();
  const uploadFileService = useUploadFileService();

  const refProps = useRef<any>(null);

  const {
    handleSubmit,
    setValue,
    control,
    trigger,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      image: dataDetail ? dataDetail?.image : "",
      description: dataDetail ? dataDetail?.description : "",
      voucherItem: dataDetail ? (dataDetail?.items as VoucherItem[]) : voucherItem,
      name: dataDetail ? dataDetail?.name : "",
      status: dataDetail ? listStatus.find((x) => x?.value === dataDetail?.status) : "",
    },
  });

  const { fields, append, remove, replace } = useFieldArray({
    control,
    name: "voucherItem",
  });

  const isCheckImage = (data: any) => {
    const image = data ? [{ imageUrl: data }] : [];
    return image;
  };

  const [previewImages, setPreviewImages] = useState<any>(dataDetail ? isCheckImage(dataDetail?.image) : []);

  const handleChangeImage = (newFileList: any) => {
    if (newFileList) setValue("image", newFileList);
    setPreviewImages([]);
    trigger("image");
  };

  const getEditorNewValue = (newValue: string) => {
    const stripedValue = stripHTML(newValue).trim();
    if (stripedValue.length === 1 && stripedValue.charCodeAt(0) === 8203) return "";
    return stripedValue === "" ? "" : newValue;
  };

  const handleAddArrayForm = () => {
    append(voucherItem);
  };

  const handleRemoveArrayForm = (index: number) => {
    if (fields.length > 1) {
      remove(index);
    } else {
      replace(voucherItem);
    }
  };

  const uploadImage = async (image: File) => {
    const bodyFormData = new FormData();
    bodyFormData.append("files", image);
    const resUpload = await uploadFileService.uploadFileResources(bodyFormData);
    return resUpload;
  };

  const onSubmit = async (data: any) => {
    const item = {
      ...data,
      items: data?.voucherItem,
      status: data?.status?.value,
    };
    setLoadingScreen(true);
    try {
      let imageUrl;
      if (data?.image && data?.image[0] && data?.image[0]?.file) {
        const uploadImageRes = (await uploadImage(data?.image[0].file as File)) as any;
        imageUrl = uploadImageRes.downloadURL;
      } else {
        imageUrl = isEmpty(data?.image) ? "" : data?.image;
      }
      item.image = imageUrl;
      if (!!dataDetail) {
        await apiService.put(`${URL_PATHS.UPDATE_VOUCHER}/${dataDetail?._id}`, item);
        setToastInformation({
          status: STATUS_TOAST.SUCCESS,
          message: MESSAGE_SUCCESS.EDIT_VOUCHER,
        });
      } else {
        await apiService.post(URL_PATHS.CREATE_VOUCHER, item);
        setToastInformation({
          status: STATUS_TOAST.SUCCESS,
          message: MESSAGE_SUCCESS.CREATE_VOUCHER,
        });
      }
      onCancel && onCancel();
      getData && getData({ highlightId: dataDetail?._id });
    } catch (error: any) {
      setToastInformation({
        status: STATUS_TOAST.ERROR,
        message: handleErrorMessage(error),
      });
    } finally {
      setLoadingScreen(false);
    }
  };

  return (
    <CrudModal
      isOpen={isOpen}
      formTitle={title}
      handleSave={isEdit ? handleSubmit(onSubmit) : undefined}
      handleClose={onCancel}
      cancelBtnLabel="Hủy"
      saveBtnLabel="Lưu"
      dialogProps={{
        fullWidth: true,
        maxWidth: "md",
      }}
    >
      <Grid container>
        <Grid item xs={12} mt={1}>
          <LabelCustom title="Ảnh" />
          <Controller
            name="image"
            control={control}
            render={({ field: { ref } }) => {
              return (
                <>
                  <FocusHiddenInput ref={ref}></FocusHiddenInput>
                  <ButtonAddFileMainSelect
                    onChange={(files) => {
                      handleChangeImage(files);
                    }}
                    isViewMode={!isEdit}
                    refForm={refProps}
                    icon={<AddPhotoAlternateIcon sx={{ fontSize: "20px", color: "#614C4C" }} />}
                    title="Chọn ảnh"
                    formProps={{ control }}
                    initialUrls={previewImages}
                    multiple={false}
                    error={!!errors.image && errors.image.message}
                    sizeLimit={2}
                  />
                </>
              );
            }}
          />
        </Grid>
        <Grid item xs={12} mt={1}>
          <LabelCustom title="Mô tả chi tiết" />
          <Controller
            control={control}
            name="description"
            render={({ field: { value, onChange, onBlur, ref } }) => (
              <>
                <FocusHiddenInput ref={ref}></FocusHiddenInput>
                <SunEditorShare
                  hideToolbarSunEditor={!isEdit}
                  disableSunEditor={!isEdit}
                  onChangeEditorState={(newValue: any) => onChange(getEditorNewValue(newValue))}
                  setContents={value || ""}
                  minHeight="400px"
                  errorEditor={!!errors?.description?.message}
                  onBlur={(e: any, content: any) => {
                    onBlur();
                    onChange((content || "").trim());
                  }}
                />
              </>
            )}
          />
          {errors?.description && (
            <ErrorMessage style={{ marginTop: "-10px" }}>{errors?.description?.message}</ErrorMessage>
          )}
        </Grid>
        <Grid container item xs={12} mt={2}>
          <Grid item xs={5}>
            <LabelCustom title="Tên ưu đãi" isRequired />
            <Controller
              control={control}
              name="name"
              rules={{
                required: MESSAGE_ERROR.fieldRequired,
              }}
              render={({ field: { onChange, onBlur, value, ref, name } }) => (
                <TextFieldCustom
                  name={name}
                  ref={ref}
                  value={value}
                  onChange={onChange}
                  disabled={!isEdit}
                  placeholder="Nhập họ và tên"
                  type="text"
                  errorMessage={errors?.name?.message}
                />
              )}
            />
          </Grid>
          <Grid item xs={2}></Grid>
          <Grid item xs={5}>
            <LabelCustom title="Trạng thái" isRequired />
            <Controller
              control={control}
              name="status"
              rules={{
                required: MESSAGE_ERROR.fieldRequired,
              }}
              render={({ field: { onChange, onBlur, value, ref, name } }) => (
                <ReactSelect
                  isClearable
                  options={listStatus}
                  getOptionLabel={(option: any) => option.label}
                  getOptionValue={(option: any) => option.value}
                  value={value}
                  onChange={(value: any) => {
                    onChange(value);
                  }}
                  fieldName={name}
                  maxMenuHeight={200}
                  placeholder="Chọn trạng thái"
                  inputRef={ref}
                  isDisabled={!isEdit}
                  isValidationFailed
                  errorMessage={errors?.status?.message as string}
                  menuPlacement="top"
                />
              )}
            />
          </Grid>
        </Grid>
        {fields.map((_item: any, index: number) => {
          return (
            <Grid container key={_item.id} mt={1}>
              <Grid container sx={{ background: "#F8F8F8", borderRadius: "4px", padding: "5px" }} mt={1}>
                <Grid container xs={12} sx={{ display: "flex", justifyContent: "end", padding: "5px" }}>
                  {((fields.length !== 1 && isEdit) || isCheckValue(watch("voucherItem"), [], isEdit)) && (
                    <DeleteOutlineIcon
                      sx={{ color: "red", cursor: "pointer" }}
                      onClick={() => handleRemoveArrayForm(index)}
                    />
                  )}
                  {index === fields.length - 1 && isEdit && (
                    <ControlPointIcon
                      sx={{
                        color: "darkgreen",
                        cursor: "pointer",
                        marginLeft: fields.length === 1 ? "3px" : "0",
                      }}
                      onClick={() => handleAddArrayForm()}
                    />
                  )}
                </Grid>
                <Grid container xs={12}>
                  <Grid item xs={5}>
                    <LabelCustom title="Phân loại" isRequired />
                    <Controller
                      control={control}
                      name={`voucherItem.${index}.classify`}
                      rules={{
                        required: MESSAGE_ERROR.fieldRequired,
                      }}
                      render={({ field: { onChange, onBlur, value, ref, name } }) => (
                        <TextFieldCustom
                          name={name}
                          ref={ref}
                          value={value}
                          onChange={onChange}
                          disabled={!isEdit}
                          placeholder="Nhập phân loại"
                          type="text"
                          errorMessage={errors?.voucherItem && errors?.voucherItem[index]?.classify?.message}
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={2}></Grid>
                  <Grid item xs={5}>
                    <LabelCustom title="Xuất xứ" isRequired />
                    <Controller
                      control={control}
                      name={`voucherItem.${index}.origin`}
                      rules={{
                        required: MESSAGE_ERROR.fieldRequired,
                      }}
                      render={({ field: { onChange, onBlur, value, ref, name } }) => (
                        <TextFieldCustom
                          name={name}
                          ref={ref}
                          value={value}
                          onChange={onChange}
                          disabled={!isEdit}
                          placeholder="Nhập xuất xứ"
                          type="text"
                          errorMessage={errors?.voucherItem && errors?.voucherItem[index]?.origin?.message}
                        />
                      )}
                    />
                  </Grid>
                </Grid>
                <Grid container xs={12} mt={2}>
                  <Grid item xs={5}>
                    <LabelCustom title="Giá trọn bộ" isRequired />
                    <Controller
                      control={control}
                      name={`voucherItem.${index}.allInPrice`}
                      rules={{
                        required: MESSAGE_ERROR.fieldRequired,
                      }}
                      render={({ field: { onChange, onBlur, value, ref, name } }) => (
                        <PriceInput
                          placeholder="Nhập giá trọn bộ"
                          disabled={!isEdit}
                          value={value}
                          handleChange={onChange}
                          onChange={onChange}
                          errorMessage={errors?.voucherItem && errors?.voucherItem[index]?.allInPrice?.message}
                          inputProps={{ maxLength: 15 }}
                          isVND
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={2}></Grid>
                  <Grid item xs={5}>
                    <LabelCustom title="Tiết kiệm" isRequired />
                    <Controller
                      control={control}
                      name={`voucherItem.${index}.discountAmount`}
                      rules={{
                        required: MESSAGE_ERROR.fieldRequired,
                      }}
                      render={({ field: { onChange, onBlur, value, ref, name } }) => (
                        <PriceInput
                          placeholder="Nhập tiết kiệm"
                          disabled={!isEdit}
                          value={value}
                          handleChange={onChange}
                          onChange={onChange}
                          errorMessage={errors?.voucherItem && errors?.voucherItem[index]?.discountAmount?.message}
                          inputProps={{ maxLength: 15 }}
                          isVND
                        />
                      )}
                    />
                  </Grid>
                </Grid>
                <Grid container xs={12} mt={2}>
                  <Grid item xs={5}>
                    <LabelCustom title="Thời gian bảo hành" isRequired />
                    <Controller
                      control={control}
                      name={`voucherItem.${index}.guarantee`}
                      rules={{
                        required: MESSAGE_ERROR.fieldRequired,
                      }}
                      render={({ field: { onChange, onBlur, value, ref, name } }) => (
                        <PriceInput
                          placeholder="Nhập thời gian bảo hành"
                          disabled={!isEdit}
                          value={value}
                          handleChange={onChange}
                          onChange={onChange}
                          errorMessage={errors?.voucherItem && errors?.voucherItem[index]?.guarantee?.message}
                          inputProps={{ maxLength: 15 }}
                          isMonth
                        />
                      )}
                    />
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          );
        })}
      </Grid>
    </CrudModal>
  );
};

export default AddVoucher;
