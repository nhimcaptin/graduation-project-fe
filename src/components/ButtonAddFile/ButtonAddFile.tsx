import { Box, Button, FormControlLabel, Grid, Radio, Typography } from "@mui/material";
import clsx from "clsx";
import { useRef, useState } from "react";
import { Controller } from "react-hook-form";
import FallbackNewsImage from "../../assets/images/default-product.png";
import { MESSAGE_ERROR } from "../../consts/messages";
import { STATUS_TOAST } from "../../consts/statusCode";
import { useSetToastInformationState } from "../../redux/store/ToastMessage";
import { handleErrorImage, uid } from "../../utils";
import { ButtonIconCustom } from "../ButtonIconCustom";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import styles from "./styles.module.scss";
interface ButtonAddFileType {
  refForm: any;
  formProps: any;
  icon: React.ReactNode;
  title: string;
  isViewMode?: boolean;
  initialUrls?: string[];
  onChange?: (files: File[]) => void;
  error?: any;
}

const ButtonAddFile = (props: ButtonAddFileType) => {
  const { refForm, icon, title, formProps, isViewMode, onChange, initialUrls, error } = props;
  const { control } = formProps;
  const ref = refForm;
  const [previewImages, setPreviewImages] = useState<string[]>(initialUrls || []);

  const previewImageURL = (files: File[]) => {
    const URLImages: string[] = [];
    onChange && onChange(files);
    const filesList = Object.entries(files);
    // eslint-disable-next-line array-callback-return
    filesList.map((file: any) => {
      URLImages.push(URL.createObjectURL(file[1]));
    });

    setPreviewImages(URLImages);
  };

  return (
    <>
      <div className={styles.boxImage}>
        <Button
          onClick={() => {
            ref.current.click();
          }}
          variant="outlined"
          className={clsx({ [styles.button]: true, [styles.buttonError]: !!error })}
          disabled={!!isViewMode}
        >
          {icon}
          <Typography className={styles.title}>{title}</Typography>
        </Button>
        <Controller
          control={control}
          name="image"
          render={({ field: { onChange, value } }) => (
            <input
              accept="image/*"
              ref={ref}
              name="image"
              type="file"
              onChange={(e: any) => {
                previewImageURL(e.target.files);
              }}
              // files={value}
              style={{ display: "none" }}
              multiple
            />
          )}
        />
        <Grid container spacing={1}>
          {previewImages &&
            previewImages.map((previewImage: string, index: number) => (
              <Grid item xs={2} key={index}>
                <img
                  className={styles.image}
                  src={previewImage}
                  alt={`imag-e${index}`}
                  key={index}
                  onError={(e) => {
                    handleErrorImage(e, FallbackNewsImage);
                  }}
                  loading="lazy"
                />
              </Grid>
            ))}
        </Grid>
      </div>
      {error && <ErrorMessage>{error}</ErrorMessage>}
    </>
  );
};

export default ButtonAddFile;

interface ButtonAddFileProp {
  refForm?: any;
  formProps?: any;
  icon: React.ReactNode;
  title: string;
  isViewMode?: boolean | any;
  initialUrls?: string[];
  onChange?: (prop: IOnChangeProp) => void;
  error?: any;
  multiple?: boolean;
  sizeLimit?: number;
  imgPerRows?: number;
  dimensionLimit?: IImageDimension;
  amountLimit?: number;
}

interface IFileWithPreview {
  file?: File;
  previewUrl?: string;
  id: string;
  isMain?: boolean;
}

export interface IOnChangeProp {
  previousImage: string[];
  newImages: File[];
}

const allowedFileTypes = ["jpg", "jpeg", "png", "gif"];

export const ButtonAddFileReFactor = (props: ButtonAddFileProp) => {
  const {
    icon,
    title,
    isViewMode,
    onChange,
    initialUrls,
    error,
    multiple,
    sizeLimit: sizeLimitProp,
    imgPerRows,
    amountLimit,
  } = props;
  const inputRef = useRef<HTMLInputElement>(null);
  const sizeLimit = sizeLimitProp ? Math.floor(sizeLimitProp * 1048576) : null;
  const { setToastInformation } = useSetToastInformationState();

  const setInitialFileList = (imageList: string[]) => {
    return imageList.map((image) => ({
      id: uid(),
      previewUrl: image,
      file: undefined,
    }));
  };

  const [fileList, setFileList] = useState<IFileWithPreview[]>(setInitialFileList(initialUrls || []));

  const getNewData = (data: IFileWithPreview[]) => ({
    previousImage: data.filter((i) => i.previewUrl && !i.file).map((i) => i.previewUrl || ""),
    newImages: data.filter((i): i is IFileWithPreview & { file: File } => !!i.file).map((i) => i.file),
  });

  const handleRemoveFile = (removeFile: IFileWithPreview) => {
    const fileIndex = fileList.findIndex((fileWithPreview) => fileWithPreview.id === removeFile.id);
    if (fileIndex >= 0) {
      let newFileList = [...fileList];
      newFileList.splice(fileIndex, 1);
      setFileList(newFileList);
      onChange && onChange(getNewData(newFileList));
    }
  };

  const isValidSize = (file: File) => {
    if (!sizeLimit) return true;
    else if (file.size > sizeLimit) return false;
    else return true;
  };

  const isValidType = (file: File) => {
    const fileExtension = file.name.slice(file.name.lastIndexOf(".") + 1);
    if (allowedFileTypes.indexOf(fileExtension) > -1) return true;
    return false;
  };

  const isValidImage = (file: File) => {
    const _isValidSize = isValidSize(file);
    const _isValidType = isValidType(file);
    if (!_isValidSize) {
      setToastInformation({
        status: STATUS_TOAST.ERROR,
        message: MESSAGE_ERROR.MaxFileSizeExceed,
      });
    }
    if (!_isValidType) {
      setToastInformation({
        status: MESSAGE_ERROR.FileTypeNotValid,
        message: MESSAGE_ERROR.MaxFileSizeExceed,
      });
    }
    return _isValidSize && _isValidType;
  };

  const handleChangeFile = (files: File[]) => {
    if (files && Object.keys(files).length > 0) {
      //files is object not array but still keep it type as FIle[] to not make break change
      const newFileList = Object.entries(files).reduce((prev, current) => {
        const [key, value] = current;
        const _isValidImage = isValidImage(value);
        if (!_isValidImage) return prev;
        else {
          prev[+key] = { file: value, id: uid(), previewUrl: URL.createObjectURL(value) };
          return prev;
        }
      }, [] as IFileWithPreview[]);

      const updateData = multiple ? [...fileList, ...newFileList] : newFileList;
      onChange && onChange(getNewData(updateData));
      setFileList(updateData);
    }
  };

  return (
    <>
      <div className={styles.boxImage}>
        <input
          accept="image/*"
          ref={inputRef}
          name="image"
          type="file"
          onChange={(e: any) => {
            handleChangeFile(e.target.files);
          }}
          // files={value}
          style={{ display: "none" }}
          multiple={multiple}
        />
        <Button
          onClick={() => {
            if (inputRef.current) {
              inputRef.current.click();
            }
          }}
          variant="outlined"
          className={clsx({ [styles.button]: true, [styles.buttonError]: !!error })}
          disabled={!!isViewMode}
        >
          {icon}
          <Typography className={styles.title}>{title}</Typography>
        </Button>
        <Grid container spacing={1}>
          {fileList &&
            fileList.length > 0 &&
            fileList.map((file, index: number) => (
              <Grid item xs={imgPerRows || 2} key={index}>
                <Box sx={{ position: "relative" }} className={styles.imageDiv}>
                  <img className={styles.image} src={file.previewUrl} alt={`imag-e${index}`} key={index} />
                  <ButtonIconCustom
                    isDisable={isViewMode}
                    className={`mg-l-10 ${styles.deleteBtn}`}
                    tooltipTitle="Xóa"
                    type="clear"
                    color="grey"
                    onClick={() => {
                      handleRemoveFile(file);
                    }}
                    sx={{
                      fontSize: "16px",
                      minHeight: "26px",
                      width: "26px",
                      height: "26px",
                    }}
                  />
                </Box>
              </Grid>
            ))}
        </Grid>
      </div>
      {error && <ErrorMessage>{error}</ErrorMessage>}
    </>
  );
};

interface IImageDimension {
  minWidth?: number;
  minHeight?: number;
  maxWidth?: number;
  maxHeight?: number;
  exactHeight?: number;
  exactWidth?: number;
  message?: string;
}
interface IButtonAddFileProp {
  refForm?: any;
  formProps?: any;
  icon: React.ReactNode;
  title: string;
  isViewMode?: boolean | any;
  initialUrls?: IInputImage[];
  onChange?: (newList: IProcessedImage[]) => void;
  error?: any;
  multiple?: boolean;
  sizeLimit?: number;
  imgPerRows?: number;
  imgPerRowsXs?: number;
  dimensionLimit?: IImageDimension;
  isMainSelect?: boolean;
  allowedType?: string[];
  maxNumberOfImages?: number;
  isDisabled?: boolean;
}
export interface IInputImage {
  imageUrl?: string;
  isMain?: boolean;
}

export interface IProcessedImage extends IInputImage {
  file?: File;
  id: string;
  previewUrl?: string;
}

export const ButtonAddFileMainSelect = (props: IButtonAddFileProp) => {
  const {
    icon,
    title,
    isViewMode,
    onChange,
    initialUrls,
    error,
    multiple,
    sizeLimit: sizeLimitProp,
    imgPerRows,
    imgPerRowsXs,
    dimensionLimit,
    isMainSelect = false,
    allowedType: allowedTypeProp,
    maxNumberOfImages,
    isDisabled,
  } = props;
  const inputRef = useRef<HTMLInputElement>(null);
  const sizeLimit = sizeLimitProp ? Math.floor(sizeLimitProp * 1048576) : null;
  const { setToastInformation } = useSetToastInformationState();
  const allowedTypes = allowedTypeProp ? allowedTypeProp : allowedFileTypes;

  const setInitialFileList = (imageList: IInputImage[]): IProcessedImage[] => {
    return imageList.map((image) => ({
      id: uid(),
      imageUrl: image.imageUrl,
      file: undefined,
      isMain: image.isMain ? image.isMain : false,
      previewUrl: image.imageUrl,
    }));
  };

  const [fileList, setFileList] = useState<IProcessedImage[]>(setInitialFileList(initialUrls || []));

  const handleRemoveFile = (removeFile: IProcessedImage) => {
    const fileIndex = fileList.findIndex((fileWithPreview) => fileWithPreview.id === removeFile.id);
    if (fileIndex >= 0) {
      let newFileList = [...fileList];
      newFileList.splice(fileIndex, 1);
      setFileList(newFileList);
      onChange && onChange(newFileList);
      resetFile();
    }
  };

  const isValidSize = (file: File) => {
    if (!sizeLimit) return true;
    else if (file.size > sizeLimit) return false;
    else return true;
  };

  const isValidType = (file: File) => {
    const fileExtension = file.name.slice(file.name.lastIndexOf(".") + 1);
    if (allowedTypes.indexOf(fileExtension) > -1) return true;
    return false;
  };

  const isValidMaxNumberOfFile = (currentListLength: number) => {
    const isValid = maxNumberOfImages ? currentListLength + 1 <= maxNumberOfImages : true;
    if (!isValid)
      setToastInformation({
        status: STATUS_TOAST.ERROR,
        message: `Chỉ được upload tối đa ${maxNumberOfImages} ảnh`,
      });
    return isValid;
  };

  const isValidImage = async (file: File) => {
    const _isValidSize = isValidSize(file);
    const _isValidType = isValidType(file);
    const _isValidDimension = (await isDimensionValid(file)) as any;

    if (!_isValidSize) {
      setToastInformation({
        status: STATUS_TOAST.ERROR,
        message: MESSAGE_ERROR.MaxFileSizeExceed,
      });
    }

    if (!_isValidType && !_isValidDimension.isValid) {
      if (_isValidDimension.errMessage)
        setToastInformation({
          status: STATUS_TOAST.ERROR,
          message: `File tải lên phải có định dạng ${allowedTypes.join(", ")} và ${_isValidDimension.errMessage}`,
        });
    } else {
      if (!_isValidType)
        setToastInformation({
          status: STATUS_TOAST.ERROR,
          message: `File tải lên phải có định dạng ${allowedTypes.join(", ")}`,
        });
      if (!_isValidDimension.isValid)
        setToastInformation({
          status: STATUS_TOAST.ERROR,
          message: dimensionLimit?.message
            ? dimensionLimit.message
            : `File tải lên phải có ${_isValidDimension.errMessage || ""}`,
        });
    }
    return _isValidSize && _isValidType && _isValidDimension.isValid;
  };

  const handleAddNewFile = (file: File): IProcessedImage => ({
    id: uid(),
    imageUrl: undefined,
    file: file,
    isMain: false,
    previewUrl: URL.createObjectURL(file),
  });

  const isDimensionValid = (file: File) => {
    return new Promise((resolve) => {
      const img = new Image();
      let isValid = true;
      img.addEventListener("load", () => {
        const imgWidth = img.width;
        const imgHeight = img.height;
        let errMessage = "";
        if (dimensionLimit) {
          if (dimensionLimit.minWidth && dimensionLimit.minHeight) {
            isValid = isValid && imgWidth >= dimensionLimit.minWidth && imgWidth >= dimensionLimit.minHeight;
            if (!isValid)
              errMessage = `có chiều rộng lớn hơn ${dimensionLimit.minWidth} và chiều cao lớn hơn ${dimensionLimit.minHeight}`;
          } else {
            if (dimensionLimit.minWidth) {
              isValid = isValid && imgWidth >= dimensionLimit.minWidth;
              errMessage = `có chiều rộng lớn hơn ${dimensionLimit.minWidth}`;
            }
            if (dimensionLimit.minHeight) {
              isValid = isValid && imgHeight >= dimensionLimit.minHeight;
              errMessage = `có chiều cao lớn hơn ${dimensionLimit.minHeight}`;
            }
          }
          if (dimensionLimit.maxWidth && dimensionLimit.maxHeight) {
            isValid = isValid && imgWidth <= dimensionLimit.maxWidth && imgWidth <= dimensionLimit.maxHeight;
            if (!isValid)
              errMessage = `có chiều rộng nhỏ hơn ${dimensionLimit.maxWidth} và chiều cao nhỏ hơn ${dimensionLimit.maxHeight}`;
          } else {
            if (dimensionLimit.maxWidth) {
              isValid = isValid && imgWidth <= dimensionLimit.maxWidth;
              errMessage = `có chiều rộng nhỏ hơn ${dimensionLimit.maxWidth}`;
            }
            if (dimensionLimit.maxHeight) {
              isValid = isValid && imgHeight <= dimensionLimit.maxHeight;
              errMessage = `có chiều cao nhỏ hơn ${dimensionLimit.maxHeight}`;
            }
          }
          if (dimensionLimit.exactWidth && dimensionLimit.exactHeight) {
            isValid = isValid && imgWidth === dimensionLimit.exactWidth && imgHeight === dimensionLimit.exactHeight;
            if (!isValid) errMessage = `có kích thước ${dimensionLimit.exactWidth}*${dimensionLimit.exactHeight}`;
          } else {
            if (dimensionLimit.exactWidth) {
              isValid = isValid && imgWidth === dimensionLimit.exactWidth;
              if (!isValid) errMessage = `có chiều rộng ${dimensionLimit.exactWidth}`;
            }
            if (dimensionLimit.exactHeight) {
              isValid = isValid && imgHeight === dimensionLimit.exactHeight;
              if (!isValid) errMessage = `có chiều cao ${dimensionLimit.exactHeight}`;
            }
          }
        }
        window.URL.revokeObjectURL(img.src);
        resolve({
          isValid,
          errMessage,
        });
      });
      img.src = window.URL.createObjectURL(file);
    });
  };

  const resetFile = () => {
    if (inputRef.current) inputRef.current.files = null;
  };

  const handleChangeFile = async (files: File[]) => {
    if (files && Object.keys(files).length > 0) {
      let currentListLength = fileList.length;
      //files is object not array but still keep it type as FIle[] to not make break change
      const newFileList = await Object.entries(files).reduce(async (prev, current) => {
        const _prev = await prev;
        const [key, value] = current;
        const _isValidImage = (await isValidImage(value)) && isValidMaxNumberOfFile(currentListLength);
        currentListLength++;
        if (_isValidImage) _prev.push(handleAddNewFile(value));
        return _prev;
      }, Promise.resolve([]) as Promise<IFileWithPreview[]>);

      const updateData = multiple ? [...fileList, ...newFileList] : newFileList;
      onChange && onChange(updateData);
      setFileList(updateData);
      resetFile();
    }
  };

  const onChangeMainImage = (id: string) => {
    const updatedFileIndex = fileList.findIndex((file) => file.id === id);
    let newFileList = fileList.map((file, index) => ({
      ...file,
      isMain: index === updatedFileIndex ? true : false,
    }));
    onChange && onChange(newFileList);
    setFileList(newFileList);
  };

  return (
    <>
      <div className={styles.boxImage}>
        <input
          accept="image/*"
          ref={inputRef}
          name="image"
          type="file"
          onChange={(e: any) => {
            handleChangeFile(e.target.files);
          }}
          disabled={isDisabled}
          style={{ display: "none" }}
          multiple={multiple}
        />
        <Button
          onClick={() => {
            if (inputRef.current) {
              inputRef.current.click();
            }
          }}
          variant="outlined"
          className={clsx({ [styles.button]: true, [styles.buttonError]: !!error })}
          disabled={!!isViewMode}
        >
          {icon}
          <Typography className={styles.title}>{title}</Typography>
        </Button>
        <Grid container spacing={2}>
          {fileList &&
            fileList.length > 0 &&
            fileList.map((file, index: number) => (
              <Grid item xs={imgPerRowsXs || 4} md={imgPerRows || 2} key={index}>
                <Box sx={{ position: "relative" }} className={styles.imageDiv}>
                  <img className={styles.image} src={file.previewUrl} alt={`imag-e${index}`} key={index} />
                  {multiple && (
                    <FormControlLabel
                      checked={file.isMain}
                      onChange={(e) => {
                        onChangeMainImage(file.id);
                      }}
                      control={<Radio color="warning" disabled={isDisabled} />}
                      label={<Typography sx={{ color: "#614C4C", fontSize: "12px" }}>Ảnh đại diện</Typography>}
                    />
                  )}
                  <ButtonIconCustom
                    isDisable={isViewMode}
                    className={`mg-l-10 ${styles.deleteBtn}`}
                    tooltipTitle="Xóa"
                    type="clear"
                    color="grey"
                    onClick={() => {
                      handleRemoveFile(file);
                    }}
                    sx={{
                      minHeight: "22px",
                      width: "22px",
                      height: "22px",
                      "& .MuiSvgIcon-root": {
                        fontSize: "1.25rem",
                      },
                    }}
                  />
                </Box>
              </Grid>
            ))}
        </Grid>
      </div>
      {error && <ErrorMessage>{error}</ErrorMessage>}
      {sizeLimitProp && (
        <Typography className={styles.imageSizeInfo} ml="5px" mt="5px">
          Vui lòng chọn hình ảnh có kích thước nhỏ hơn {sizeLimitProp} mb
        </Typography>
      )}
    </>
  );
};
