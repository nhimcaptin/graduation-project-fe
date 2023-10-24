import { makeStyles } from '@mui/styles';
import { Box } from '@mui/system';
import clsx from 'clsx';
import React from 'react';
import SunEditor from 'suneditor-react';
import 'suneditor/dist/css/suneditor.min.css';
import vi from 'suneditor/src/lang/vi.js';
// import './sun-edit.style.scss';
import {
    align,
    font,
    fontColor,
    fontSize,
    formatBlock,
    hiliteColor,
    horizontalRule,
    image,
    lineHeight,
    link,
    list,
    paragraphStyle,
    table,
    template,
    textStyle,
    video
} from 'suneditor/src/plugins';

const useStyles = makeStyles({
    descriptionError: {
        '& .sun-editor': {
            borderRadius: '4px'
        },

        '& .se-container': {
            borderRadius: '4px',
            border: '1px solid #d32f2f',
            overflow: 'hidden'
        },

        '& .se-toolbar': {
            borderBottom: '1px solid #dadada'
        }
    },

    descriptionHeight: {
        minHeight: '452px',
        paddingBottom: '20px'
    },
    '& .sun-editor': {
        '& .se-resizing-bar': {
            display: 'none'
        }
    }
});

interface SunEditorModel {
    onChangeEditorState: (e?: React.ChangeEvent<any> | string) => void;
    handleChangeContent?: (parameters?: any) => void;
    setContents: string;
    minHeight?: string;
    maxHeight?: string;
    errorEditor?: boolean;
    disableSunEditor: boolean;
    hideToolbarSunEditor: boolean;
    defaultValue?: string;
    [key: string]: any;
    resizingBar?: boolean;
    linkTargetNewWindow?: boolean;
}

const defaultFonts = [
    'Arial',
    'Comic Sans MS',
    'Courier New',
    'Calibri',
    'Comic Sans',
    'Courier',
    'Impact',
    'Georgia',
    'Tahoma',
    'Trebuchet MS',
    'Verdana',
    'Garamond',
    'Lucida Console',
    'Palatino Linotype',
    'Segoe UI',
    'Tahoma',
    'Times New Roman',
    'Trebuchet MS'
];

const SunEditorShare = (props: SunEditorModel) => {
    const styles = useStyles();
    const {
        onChangeEditorState,
        setContents,
        errorEditor,
        minHeight,
        maxHeight,
        disableSunEditor,
        hideToolbarSunEditor,
        resizingBar,
        linkTargetNewWindow = false,
        ...rest
    } = props;

    const sortedFontOptions = [
        'Logical',
        'Salesforce Sans',
        'Sans-Serif',
        'Serif',
        'Helvetica',
        'Arial',
        'Calibri',
        'Comic Sans',
        'Courier',
        'Garamond',
        'Georgia',
        'Impact',
        'Lucida Console',
        'Palatino Linotype',
        'Segoe UI',
        'Tahoma',
        'Times New Roman',
        'Trebuchet MS',
        'Montserrat',
        'SF-ProDisplay',
        ...defaultFonts
    ].sort();


    return (
        <Box
            className={clsx({
                // eslint-disable-next-line no-useless-computed-key
                [styles.descriptionError]: errorEditor,
                // eslint-disable-next-line no-useless-computed-key
                [styles.descriptionHeight]: true
            })}
        >
            <SunEditor
                {...rest}
                lang={vi}
                autoFocus={false}
                hideToolbar={hideToolbarSunEditor}
                setDefaultStyle="height: auto;font-size:14px;font-family:SF-ProDisplay"
                disable={disableSunEditor}
                setContents={setContents}
                onChange={(e) => onChangeEditorState(e)}
                setOptions={{
                    plugins: [
                        align,
                        font,
                        fontColor,
                        fontSize,
                        formatBlock,
                        hiliteColor,
                        horizontalRule,
                        lineHeight,
                        list,
                        paragraphStyle,
                        table,
                        template,
                        textStyle,
                        image,
                        link,
                        video
                    ],
                    buttonList: [
                        ['undo', 'redo'],
                        ['font', 'fontSize'],
                        ['bold', 'underline', 'italic', 'strike'],
                        ['subscript', 'superscript'],
                        ['fontColor', 'hiliteColor'],
                        ['align', 'list', 'lineHeight'],
                        ['outdent', 'indent'],
                        ['preview', 'print'],
                        ['removeFormat'],
                        ['table', 'horizontalRule', 'link', 'image', 'video']
                    ],
                    formats: ['p', 'div', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'],
                    defaultTag: 'div',
                    minHeight: `${minHeight}`,
                    maxHeight: `${maxHeight}`,
                    showPathLabel: false,
                    font: sortedFontOptions,
                    resizingBar: resizingBar,
                    linkTargetNewWindow,
                    defaultStyle: 'font-family:"SF-ProDisplay"'
                }}
                // onBlur={(_e, valueDescription) => handleChangeContent(valueDescription)}
            />
        </Box>
    );
};

export default SunEditorShare;
