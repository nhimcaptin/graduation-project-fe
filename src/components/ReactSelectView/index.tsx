import React from 'react';
import clsx from 'clsx';
import { AsyncPaginate, wrapMenuList } from 'react-select-async-paginate';
import { components, MenuPlacement, MenuPosition } from 'react-select';

//--- Material Control
import makeStyles from '@mui/styles/makeStyles';
import { defaultAdditional, loadOptions } from './utils';
import OptionView from './OptionView';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import ClearIcon from '@mui/icons-material/Clear';
import { get } from 'lodash';
import TextFieldCustom from '../TextFieldCustom';
import ErrorMessage from '../ErrorMessage/ErrorMessage';
import COLORS from '../../consts/colors';

const useStyles = makeStyles(() => ({
    error: {
        '& .react-select__control': {
            borderColor: `${COLORS.BORDER_ERROR_TEXTFIELD} !important`
        },
        '& .react-select__control--is-focused': {
            boxShadow: '0 0 0 1px #ffffff',
            borderWidth: '2px'
        }
    },
    errors: {
        fontSize: '0.7rem'
    },
    textFiledCustom: {
        position: 'absolute',
        top: 0,
        zIndex: -1
    },
    iconReactSelect: {
        cursor: 'pointer',
        color: '#757575'
    }
}));

const customStyles = {
    menu: (provided: any) => ({
        ...provided,
        zIndex: 998
    }),
    indicatorSeparator: () => ({
        display: 'none'
    }),
    loadingIndicator: () => ({
        display: 'none'
    }),
    control: (styles: any, { isDisabled, isFocused }: any) => ({
        ...styles,
        // '.react-select__indicator.react-select__clear-indicator': {
        //   cursor: 'pointer'
        // },
        cursor: 'text',
        '&:hover': {
            borderColor: 'black'
        },
        '& .clear-icon': {
            opacity: 1
        },
        fontSize: '14px',
        '& > div.div:nth-of-type(2)': {
            color: 'black'
        },
        '& div': {
            color: `${COLORS.TEXT} !important`,
            fontSize: '14px',
            lineHeight: '20px'
        },
        // '&.react-select__control--is-disabled': {
        //   borderColor: '#b3b3b3 !important'
        // },
        borderColor: isDisabled ? COLORS.DISABLED_BORDER_AUTOCOMPLETE : COLORS.BORDER_AUTOCOMPLETE,
        backgroundColor: isDisabled ? COLORS.DISABLED_BACKGROUND_AUTOCOMPLETE : '',
        minHeight: '37.13px',
        '&.css-ptukto-control:hover': { borderColor: 'rgba(0, 0, 0, 0.87)' }
    }),
    placeholder: (styles: any) => ({
        ...styles,
        whiteSpace: 'nowrap',
        textOverflow: 'ellipsis',
        overflow: 'hidden',
        width: 'calc(100% - 12px)',
        opacity: 0.5
    }),
    option: (styles: any, { isFocused, isSelected }: any) => {
        return {
            ...styles,
            cursor: 'pointer',
            backgroundColor: isFocused
                ? COLORS.HOVER_BACKGROUND_AUTOCOMPLETE
                : isSelected
                ? COLORS.HOVER_BACKGROUND_AUTOCOMPLETE
                : null,
            color: COLORS.TEXT,
            fontSize: '14px'
        };
    },
    multiValue: (styles: any, { isDisabled }: any) => {
        return {
            ...styles,
            borderRadius: '20px',
            fontWeight: 500,
            backgroundColor: 'rgba(0, 0, 0, 0.08)'
        };
    },

    multiValueRemove: (styles: any, { isDisabled }: any) => {
        return {
            ...styles,
            display: isDisabled ? 'none' : 'flex',
            borderRadius: '10px',
            cursor: 'pointer',
            '&:hover': {
                backgroundColor: 'unset'
            }
        };
    },

    menuPortal: (styles: any) => {
        return {
            ...styles,
            zIndex: 10000
        };
    },

    indicatorsContainer: (styles: any, { isDisabled }: any) => {
        return {
            ...styles,
            display: isDisabled ? 'none' : 'flex',
            marginRight: '6px',
            fontSize: '1.25rem',
            '& div': {
                padding: '2px',
                borderRadius: '50%',
                cursor: 'pointer',
                '&:hover': {
                    backgroundColor: COLORS.HOVER_BACKGROUND_AUTOCOMPLETE
                }
            }
        };
    },
    singleValue: (styles: any) => {
        return {
            ...styles,
            lineHeight: '21px !important'
        };
    }
};

interface ReactSelectProps {
    //--- Settings loading
    isLoading?: boolean;
    loadingWidth?: number;
    loadingHeight?: number;
    //--- Title field
    title?: string;
    titleClassName?: any;
    //--- Option control
    fieldName: string;
    className?: any;
    options?: any;
    value?: any;
    onChange?: any;
    customDropdown?: any;
    titleDropdown?: string;
    actionDropdown?: Function;
    optionsPerPage?: number;
    //--- Validate field
    isValidationFailed?: boolean;
    errors?: any;
    clearErrors?: any;
    inputRef?: any;
    defaultMenuIsOpen?: boolean;
    placeholder?: string;
    maxMenuHeight?: number;
    getOptionLabel?: any;
    getOptionValue?: any;
    isClearable?: boolean;
    Clearable?: boolean;
    defaultValue?: any;
    isDisabled?: boolean;
    onInputChange?: any;
    getOptions?: (
        searchText: string,
        page: number,
        optionsPerPage: number,
        prevOptions?: any,
        indexChildren?: number
    ) => Promise<{ options: any[]; hasMore: boolean }>;
    isMulti?: boolean;
    filterOption?: any;
    keyCache?: string;
    inputValue?: string;
    showIcon?: boolean;
    menuPosition?: MenuPosition;
    menuPlacement?: MenuPlacement;
    menuPortalTarget?: HTMLElement | null;
    clearValue?: any;
    menuShouldScrollIntoView?: boolean;
    menuShouldBlockScroll?: boolean;
    closeMenuOnScroll?: any;
    onBlur?: any;
    closeMenuOnSelect?: boolean;
    blurInputOnSelect?: boolean;
    autoFocus?: boolean;
    backspaceRemovesValue?: boolean;
    noOptionsMessage?: any;
    classNamePrefix?: string;
    components?: { [key: string]: any };
    defaultOptions?: any;
    errorMessage?: string;
    onFocus?: any;
    selectRef?: any;
    styles?: any;
    hideSelectedOptions?: any;
    [key: string]: any;
}

const ReactSelect: React.FC<ReactSelectProps> = (props) => {
    const {
        //--- Settings loading
        isLoading,
        loadingWidth,
        loadingHeight,
        //--- Title field
        title,
        titleClassName,
        //--- Option control
        fieldName,
        className,
        options,
        value,
        onChange,
        customDropdown,
        titleDropdown,
        actionDropdown,
        optionsPerPage,
        //--- Validate field
        isValidationFailed,
        errors,
        errorMessage,
        clearErrors,
        inputRef,
        getOptions,
        keyCache,
        showIcon,
        clearValue,
        components: componentsProp,
        onFocus,
        selectRef,
        maxMenuHeight,
        indexChildren,
        ...rest
    } = props;

    const classes = useStyles();
    const KEY = `react_select_${fieldName || ''}_${(value && value.value) || ''}_${keyCache || ''}`;
    const CACHE_OPTION = (value && [value.value]) || (keyCache && [keyCache]) || [];
    const _options = options;

    const _loadPageOptions = async (q: any, prevOptions: any, page: any) => {
        const { options, hasMore } = await (getOptions
            ? getOptions(q, page.page, optionsPerPage || 10, prevOptions, indexChildren)
            : loadOptions(q, page.page, _options, optionsPerPage));

        return {
            options,
            hasMore,
            additional: {
                page: page.page + 1
            }
        };
    };

    const optionView = () => {
        if (customDropdown) {
            const OptionItem = customDropdown;
            return <OptionItem />;
        }

        return <OptionView title={titleDropdown} action={actionDropdown} showIcon={showIcon} />;
    };

    const CustomMenuList = (props: any) => {
        return (
            <>
                <components.MenuList {...props}>{props.children}</components.MenuList>
                {optionView()}
            </>
        );
    };

    const MenuList: any = wrapMenuList(CustomMenuList);

    const DropdownIndicator = (props: any) => {
        return (
            <components.DropdownIndicator {...props}>
                {!!props?.selectProps?.menuIsOpen ? (
                    <ArrowDropUpIcon className={classes.iconReactSelect} />
                ) : (
                    <ArrowDropDownIcon className={classes.iconReactSelect} />
                )}
            </components.DropdownIndicator>
        );
    };

    const ClearIndicator = (props: any) => {
        return (
            <components.ClearIndicator {...props}>
                <ClearIcon
                    sx={{ height: '0.8em', width: '0.8em', opacity: 0, color: 'rgba(0, 0, 0, 0.54)' }}
                    className="clear-icon"
                />
            </components.ClearIndicator>
        );
    };

    const handleChange = (newValue: any) => {
        onChange(newValue);
    };

    if (isValidationFailed) {
        return (
            <div style={{ position: 'relative' }}>
                <AsyncPaginate
                    // menuIsOpen={true}
                    classNamePrefix="react-select"
                    debounceTimeout={500}
                    key={KEY}
                    value={value}
                    onChange={handleChange}
                    cacheUniqs={CACHE_OPTION}
                    additional={defaultAdditional}
                    loadOptions={_loadPageOptions}
                    styles={customStyles}
                    selectRef={inputRef}
                    menuShouldBlockScroll
                    onFocus={onFocus}
                    isLoading={isLoading}
                    maxMenuHeight={maxMenuHeight}
                    // Add vao khi react-select nam o cuoi popup
                    // menuPosition={'absolute'}
                    // menuPlacement={'top'}
                    // menuPortalTarget={document.body}
                    components={{
                        DropdownIndicator,
                        MenuList,
                        ClearIndicator,
                        ...(componentsProp ? componentsProp : {})
                    }}
                    className={clsx({
                        [className]: true,
                        [classes.error]: Boolean(
                            (errors && get(errors, fieldName, null) && get(errors, fieldName, null)?.message) ||
                                !!errorMessage
                        )
                    })}
                    {...rest}
                    onMenuOpen={() => {
                        if (document.documentElement.scrollHeight > window.innerHeight) {
                            const headerEl = document.querySelector('header');
                            if (headerEl) headerEl.style.paddingRight = '8px';
                        }
                        rest.onMenuOpen && rest.onMenuOpen();
                    }}
                    onMenuClose={() => {
                        if (document.documentElement.scrollHeight > window.innerHeight) {
                            const headerEl = document.querySelector('header');
                            if (headerEl) headerEl.style.paddingRight = '0';
                        }
                        rest.onMenuClose && rest.onMenuClose();
                    }}
                />

                <TextFieldCustom
                    // style={{ display: 'none' }}
                    // styles input khi co loi validation
                    className={clsx(classes.textFiledCustom, 'd-none')}
                    id={fieldName}
                    name={fieldName}
                    value={value?.label || ''}
                    //ref={inputRef}
                    inputProps={{
                        autocomplete: 'off'
                    }}
                />
                {((errors && get(errors, fieldName, null) && get(errors, fieldName, null)?.message) ||
                    errorMessage) && (
                    <ErrorMessage>{get(errors, fieldName, null)?.message || errorMessage || ''}</ErrorMessage>
                )}
            </div>
        );
    }

    return (
        <>
            <AsyncPaginate
                key={KEY}
                value={value}
                onChange={onChange}
                cacheUniqs={CACHE_OPTION}
                additional={defaultAdditional}
                isLoading={isLoading}
                loadOptions={_loadPageOptions}
                components={{ DropdownIndicator, MenuList, ClearIndicator, ...(componentsProp ? componentsProp : {}) }}
                styles={customStyles}
                className={className}
                menuShouldBlockScroll
                selectRef={selectRef}
                onFocus={onFocus}
                debounceTimeout={500}
                maxMenuHeight={maxMenuHeight}
                {...rest}
                onMenuOpen={() => {
                    if (document.documentElement.scrollHeight > window.innerHeight) {
                        const headerEl = document.querySelector('header');
                        if (headerEl) headerEl.style.paddingRight = '8px';
                    }
                    rest.onMenuOpen && rest.onMenuOpen();
                }}
                onMenuClose={() => {
                    if (document.documentElement.scrollHeight > window.innerHeight) {
                        const headerEl = document.querySelector('header');
                        if (headerEl) headerEl.style.paddingRight = '0';
                    }
                    rest.onMenuClose && rest.onMenuClose();
                }}
            />
        </>
    );
};

ReactSelect.defaultProps = {
    //--- Settings loading
    isLoading: false,
    loadingWidth: 100,
    loadingHeight: 11,
    //--- Title field
    title: '',
    //--- Option control
    fieldName: `${new Date().getTime()}`,
    options: [],
    value: undefined,
    onChange: () => {},
    customDropdown: undefined,
    titleDropdown: '',
    errorMessage: '',
    actionDropdown: () => {},
    optionsPerPage: 10,
    //--- Validate field
    isValidationFailed: false,
    errors: undefined,
    clearErrors: () => {},
    inputRef: undefined,
    menuPosition: 'absolute',
    menuPlacement: 'auto',
    menuPortalTarget: null,
    noOptionsMessage: () => <>Không có lựa chọn nào</>,
    classNamePrefix: 'react-select',
    maxMenuHeight: 155
};

export default ReactSelect;
