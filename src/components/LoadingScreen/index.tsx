import { Backdrop } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';
import { useSelector } from 'react-redux';
import COLORS from '../../consts/colors';

const LoadingScreen = () => {
    const isLoadingScreen = useSelector((state: any) => state.loadingScreen.isLoading);

    return (
        <Backdrop
            transitionDuration={0}
            sx={{
                color: '#ffffff',
                zIndex: (theme) => theme.zIndex.drawer + 10000,
                backgroundColor: COLORS.BACKGROUND_LOADING
            }}
            open={isLoadingScreen}
        >
            <CircularProgress color="inherit" />
        </Backdrop>
    );
};

export default LoadingScreen;
