import { createGlobalStyle } from "styled-components";
import reset from "styled-reset";

const GlobalStyle = createGlobalStyle`
${reset}

:root {
    --color-red: #D00B00;
    --color-blue-100: #1d9bf0;
    --color-blue-200: #1A8CD8;
    --color-navy-100: #273340;
    --color-navy-200: #252E38;
    --color-navy-300: #1E2732;
    --color-navy-500: #15202B;
    --color-gray-100: #EFF3F4;
    --color-gray-300: #E7E7E8;
    --color-gray-500: #272C30;
}

* {
    box-sizing: border-box;
}

body {
    background-color: var(--color-navy-500);
    color: white;
}

a {
    color:inherit;
    text-decoration:none;

}

`;

export default GlobalStyle;
