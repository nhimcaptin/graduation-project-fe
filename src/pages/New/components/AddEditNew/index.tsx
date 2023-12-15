import { Grid } from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import CrudModal from "../../../../components/CrudModal";
import ErrorMessage from "../../../../components/ErrorMessage/ErrorMessage";
import FocusHiddenInput from "../../../../components/FocusHiddenInput";
import LabelCustom from "../../../../components/LabelCustom";
import SunEditorShare from "../../../../components/SunEditorStyled";
import TextFieldCustom from "../../../../components/TextFieldCustom";
import { MESSAGE_ERROR, MESSAGE_SUCCESS } from "../../../../consts/messages";
import { stripHTML } from "../../../../utils";
import { useSetLoadingScreenState } from "../../../../redux/store/loadingScreen";
import moment from "moment";
import URL_PATHS from "../../../../services/url-path";
import { useSetToastInformationState } from "../../../../redux/store/ToastMessage";
import apiService from "../../../../services/api-services";
import { STATUS_TOAST } from "../../../../consts/statusCode";
import { handleErrorMessage } from "../../../../utils/errorMessage";
import { useUploadFileService } from "../../../../services/upload-file.service";
import { useRef, useState } from "react";
import { isEmpty } from "lodash";
import { ButtonAddFileMainSelect } from "../../../../components/ButtonAddFile/ButtonAddFile";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
interface PropsType {
  isOpen: boolean;
  dataDetail: any;
  title: string;
  onCancel: () => void;
  getData: (params: any) => void;
  isEdit: boolean;
}

const AddMainService = (props: PropsType) => {
  const { isOpen, title, isEdit, onCancel, getData, dataDetail } = props;
  const { setLoadingScreen } = useSetLoadingScreenState();
  const { setToastInformation } = useSetToastInformationState();
  const uploadFileService = useUploadFileService();
  const {
    handleSubmit,
    control,
    setValue,
    trigger,
    formState: { errors },
  } = useForm({
    defaultValues: {
      description: dataDetail ? dataDetail?.description : "",
      name: dataDetail ? dataDetail?.name : "",
      image:dataDetail?dataDetail?.image:""
    },
  });

  const getEditorNewValue = (newValue: string) => {
    const stripedValue = stripHTML(newValue).trim();
    if (stripedValue.length === 1 && stripedValue.charCodeAt(0) === 8203)
      return "";
    return stripedValue === "" ? "" : newValue;
  };

  const refProps = useRef<any>(null);
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

  const uploadImage = async (image: File) => {
    const bodyFormData = new FormData();
    bodyFormData.append("files", image);
    const resUpload = await uploadFileService.uploadFileResources(bodyFormData);
    return resUpload;
  };
  const onSubmit = async (data: any) => {
  const _data = {
      ...data,
      image:previewImages
    };
    setLoadingScreen(true);
  
    try {
      // if (dataDetail) {
      //   await apiService.put(
      //     URL_PATHS.UPDATE_NEW + "/" + dataDetail?._id,
      //     data
      //   );
      // } else {
      //   await apiService.post(URL_PATHS.CREATE_NEW, data);
      // }
      // setToastInformation({
      //   status: STATUS_TOAST.SUCCESS,
      //   message: dataDetail
      //     ? MESSAGE_SUCCESS.EDIT_NEWS
      //     : MESSAGE_SUCCESS.CREATE_NEWS,
      // });
      // onCancel && onCancel();
      // getData && getData({ highlightId: dataDetail?._id });
      let imageUrl;
      if (data?.image && data?.image[0] && data?.image[0]?.file) {
        const uploadImageRes = (await uploadImage(data?.image[0].file as File)) as any;
        imageUrl = uploadImageRes.downloadURL?.length > 0 ? uploadImageRes.downloadURL : "";
      } else {
        imageUrl = isEmpty(data?.image) ? "" : data?.image;
      }
      _data.image = imageUrl;
      if (dataDetail) {
        await apiService.put(URL_PATHS.UPDATE_NEW + "/" + dataDetail?._id, _data);
      } else {
        await apiService.post(URL_PATHS.CREATE_NEW, _data);
      }
      setToastInformation({
        status: STATUS_TOAST.SUCCESS,
        message: dataDetail ? MESSAGE_SUCCESS.EDIT_SUB_SERVICE : MESSAGE_SUCCESS.CREATE_SUB_SERVICE,
      });
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
      <Grid container>
        <Grid item xs={12} mt={2}>
          <LabelCustom title="Tên tin tức" isRequired />
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
                placeholder="Nhập tiêu đề tin tức"
                type="text"
                errorMessage={errors?.name?.message}
              />
            )}
          />
        </Grid>
        <Grid item xs={12} mt={1}>
          <LabelCustom title="Mô tả chi tiết" isRequired />
          <Controller
            control={control}
            name="description"
            rules={{
              required: MESSAGE_ERROR.fieldRequired,
            }}
            render={({ field: { value, onChange, onBlur, ref } }) => (
              <>
                <FocusHiddenInput ref={ref}></FocusHiddenInput>
                <SunEditorShare
                  hideToolbarSunEditor={!isEdit}
                  disableSunEditor={!isEdit}
                  onChangeEditorState={(newValue: any) =>
                    onChange(getEditorNewValue(newValue))
                  }
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
            <ErrorMessage style={{ marginTop: "-10px" }}>
              {errors?.description?.message}
            </ErrorMessage>
          )}
        </Grid>
      </Grid>
    </CrudModal>
  );
};

export default AddMainService;
