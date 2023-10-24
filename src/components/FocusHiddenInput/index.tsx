import { forwardRef } from 'react';

const FocusHiddenInput = forwardRef<HTMLInputElement>((props, ref) => {
    return (
        <input
            style={{
                width: 0,
                height: 0,
                border: 'none',
                padding: 0,
                margin: 0,
                display: 'block'
            }}
            ref={ref}
        ></input>
    );
});

export default FocusHiddenInput;
