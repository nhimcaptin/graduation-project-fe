import { Fab, SxProps, Tooltip } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import RefreshIcon from '@mui/icons-material/Refresh';
import AddIcon from '@mui/icons-material/Add';
import ClearIcon from '@mui/icons-material/Clear';
import DeleteIcon from '@mui/icons-material/DeleteForever';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import MenuIcon from '@mui/icons-material/Menu';
import styles from './styles.module.scss';
import clsx from 'clsx';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import AutorenewIcon from '@mui/icons-material/Autorenew';

type ColorType =
    | 'white'
    | 'yellow'
    | 'blue'
    | 'red'
    | 'search'
    | 'darkgreen'
    | 'lightgreen'
    | 'orange'
    | 'grey'
    | 'darkred';
type IconType = 'search' | 'refresh' | 'add' | 'download' | 'list' | 'delete' | 'upload' | 'clear' | 'sync';

interface ButtonProps {
    isLoading?: boolean;
    isDisable?: boolean;
    isDisableEventButton?: boolean;
    onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
    onSpanClick?: (event: React.MouseEvent<HTMLSpanElement>) => void;
    className?: string;
    btnClassName?: string;
    tooltipTitle: string;
    type: IconType;
    sx?: SxProps;
    color: ColorType;
    id?: string;
}

const icons: any = {
    search: <SearchIcon />,
    refresh: <RefreshIcon />,
    add: <AddIcon />,
    download: <CloudDownloadIcon />,
    list: <MenuIcon />,
    delete: <DeleteIcon />,
    upload: <CloudUploadIcon />,
    clear: <ClearIcon />,
    sync: <AutorenewIcon />
};

export const ButtonIconCustom = (props: ButtonProps) => {
    const {
        isLoading,
        isDisable,
        onClick,
        className,
        sx,
        color,
        tooltipTitle,
        type,
        onSpanClick,
        btnClassName,
        ...restProps
    } = props;
    const btnColor = styles[color || ''] || '';
    const spanColor = styles['span' + color || ''] || '';
    const icon = icons[type || ''] || <></>;
    return (
        <Tooltip title={tooltipTitle || 'Nút'} disableInteractive={isDisable} disableHoverListener={isDisable}>
            <span
                className={clsx(className, { [spanColor]: !isLoading }, { disabled: isDisable })}
                onClick={isLoading ? undefined : onSpanClick}
            >
                <Fab
                    {...restProps}
                    onClick={onSpanClick ? undefined : onClick}
                    className={clsx(styles.buttonIcon, btnColor, { [btnClassName || '']: !!btnClassName })}
                    size="small"
                    disabled={isLoading || isDisable}
                    sx={{ ...sx, pointerEvents: !!onSpanClick ? 'none' : 'all' }}
                >
                    {icon}
                </Fab>
            </span>
        </Tooltip>
    );
};
